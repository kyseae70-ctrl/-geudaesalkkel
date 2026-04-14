import { NextRequest, NextResponse } from 'next/server';
import { runBacktest } from '@/lib/backtest';
import { fetchPricesFromSupabase } from '@/lib/prices';
import { isMockMode } from '@/lib/supabase';
import { BacktestRequest } from '@/types';

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
