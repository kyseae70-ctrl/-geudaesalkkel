import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { getSupabaseClient } from '@/lib/supabase';
import { ETF_LIST } from '@/lib/etf-list';

// v3: 인스턴스 생성 필요
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const yahooFinance = new (YahooFinance as any)({ suppressNotices: ['ripHistorical'] });

const TICKERS = ETF_LIST.map((e) => e.ticker);

/**
 * 어제 날짜 문자열 반환 (미국 장 마감 기준)
 * 월요일 실행 시 금요일 날짜 반환
 */
function getLastTradingDate(): string {
  const now = new Date();
  // KST 기준 오전 7시 실행 → 미국은 전날 장 마감
  now.setDate(now.getDate() - 1);
  // 일요일(0)이면 금요일(-2), 토요일(6)이면 금요일(-1)
  const day = now.getDay();
  if (day === 0) now.setDate(now.getDate() - 2);
  else if (day === 6) now.setDate(now.getDate() - 1);
  return now.toISOString().split('T')[0];
}

export async function GET(req: NextRequest) {
  // CRON_SECRET으로 무단 호출 방지
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase 미연결' }, { status: 500 });
  }

  const targetDate = getLastTradingDate();
  const results: { ticker: string; status: 'ok' | 'skip' | 'error'; close?: number }[] = [];

  for (const ticker of TICKERS) {
    try {
      // 전날 하루치 데이터 조회
      const startDate = new Date(targetDate);
      const endDate = new Date(targetDate);
      endDate.setDate(endDate.getDate() + 1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = await yahooFinance.historical(ticker, {
        period1: startDate,
        period2: endDate,
        interval: '1d' as const,
      }) as any;

      if (!data || data.length === 0) {
        results.push({ ticker, status: 'skip' });
        continue;
      }

      const row = data[0];
      const close = row.adjClose ?? row.close;
      if (!close || close <= 0) {
        results.push({ ticker, status: 'skip' });
        continue;
      }

      // 배당 데이터 조회
      let dividend = 0;
      try {
        const divData: any[] = await yahooFinance.historical(ticker, {
          period1: startDate,
          period2: endDate,
          interval: '1d' as const,
          events: 'dividends' as const,
        }) as any;
        if (divData && divData.length > 0) {
          dividend = divData[0].dividends ?? 0;
        }
      } catch {
        // 배당 데이터 없으면 0으로 처리
      }

      await supabase.from('etf_prices').upsert(
        {
          ticker,
          date: targetDate,
          close: parseFloat(close.toFixed(4)),
          dividend: parseFloat(dividend.toFixed(6)),
        },
        { onConflict: 'ticker,date' }
      );

      results.push({ ticker, status: 'ok', close });
    } catch (err) {
      console.error(`[${ticker}] 업데이트 실패:`, err);
      results.push({ ticker, status: 'error' });
    }
  }

  const ok = results.filter((r) => r.status === 'ok').length;
  const skip = results.filter((r) => r.status === 'skip').length;
  const error = results.filter((r) => r.status === 'error').length;

  return NextResponse.json({
    date: targetDate,
    summary: { ok, skip, error },
    results,
  });
}
