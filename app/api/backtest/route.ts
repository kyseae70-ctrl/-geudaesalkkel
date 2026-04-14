import { NextRequest, NextResponse } from 'next/server';
import { runBacktest } from '@/lib/backtest';
import { getMockPrices } from '@/lib/mock-data';
import { getSupabaseClient, isMockMode } from '@/lib/supabase';
import { BacktestRequest, PriceRow } from '@/types';

async function fetchPricesFromSupabase(
  ticker: string,
  startDate: string,
  endDate: string
): Promise<PriceRow[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return getMockPrices(ticker, startDate, endDate);

  // Supabase 기본 limit이 1000행 — 일별 10년치(~2520행)를 모두 가져오기 위해 페이지네이션
  const allRows: PriceRow[] = [];
  const PAGE_SIZE = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('etf_prices')
      .select('date, close, dividend')
      .eq('ticker', ticker)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error || !data) break;

    for (const row of data) {
      allRows.push({
        date: row.date,
        close: Number(row.close),
        dividend: Number(row.dividend ?? 0),
      });
    }

    if (data.length < PAGE_SIZE) break; // 마지막 페이지
    from += PAGE_SIZE;
  }

  if (allRows.length === 0) {
    // Supabase에 데이터 없으면 mock으로 폴백
    return getMockPrices(ticker, startDate, endDate);
  }

  return allRows;
}

export async function POST(req: NextRequest) {
  try {
    const body: BacktestRequest = await req.json();
    const { holdings, settings } = body;

    // 유효성 검사
    if (!holdings || holdings.length === 0) {
      return NextResponse.json({ error: 'ETF를 최소 1개 이상 선택해주세요.' }, { status: 400 });
    }

    const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.1) {
      return NextResponse.json({ error: '비중 합계가 100%가 되어야 합니다.' }, { status: 400 });
    }

    if (!settings.startDate || !settings.endDate) {
      return NextResponse.json({ error: '시작일과 종료일을 입력해주세요.' }, { status: 400 });
    }

    if (settings.startDate >= settings.endDate) {
      return NextResponse.json({ error: '시작일이 종료일보다 이전이어야 합니다.' }, { status: 400 });
    }

    if (settings.amount <= 0) {
      return NextResponse.json({ error: '적립 금액은 0보다 커야 합니다.' }, { status: 400 });
    }

    const result = await runBacktest(holdings, settings, fetchPricesFromSupabase);

    return NextResponse.json({ ...result, isMockData: isMockMode });
  } catch (err) {
    console.error('백테스트 오류:', err);
    return NextResponse.json({ error: '계산 중 오류가 발생했습니다. 다시 시도해주세요.' }, { status: 500 });
  }
}
