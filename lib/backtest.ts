import { Holding, InvestmentSettings, BacktestResult, PriceRow } from '@/types';

type PriceMap = Record<string, Record<string, PriceRow>>; // ticker → date → PriceRow

/**
 * 해당 날짜가 주말인지 확인
 */
function isWeekend(date: Date): boolean {
  const d = date.getDay();
  return d === 0 || d === 6;
}

/**
 * 해당 날짜 또는 이후 가장 가까운 영업일 찾기
 * prices 맵에 실제 데이터가 있는 날짜 기준으로 판단
 */
function nextTradingDay(date: Date, availableDates: Set<string>): string | null {
  const d = new Date(date);
  for (let i = 0; i < 10; i++) {
    const str = d.toISOString().split('T')[0];
    if (availableDates.has(str)) return str;
    d.setDate(d.getDate() + 1);
  }
  return null;
}

/**
 * frequency에 따른 적립일 목록 생성
 */
function getInvestmentDates(
  startDate: string,
  endDate: string,
  frequency: InvestmentSettings['frequency'],
  availableDates: Set<string>
): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);

  if (frequency === 'monthly') {
    // 매월 1일 → 다음 영업일
    current.setDate(1);
    while (current <= end) {
      const tradingDay = nextTradingDay(current, availableDates);
      if (tradingDay && tradingDay <= endDate) dates.push(tradingDay);
      current.setMonth(current.getMonth() + 1);
      current.setDate(1);
    }
  } else if (frequency === 'weekly') {
    // 매주 월요일 → 다음 영업일
    // 시작일의 해당 주 월요일부터
    const dayOfWeek = current.getDay();
    const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
    current.setDate(current.getDate() + (daysToMonday === 7 ? 0 : daysToMonday));
    while (current <= end) {
      const tradingDay = nextTradingDay(current, availableDates);
      if (tradingDay && tradingDay <= endDate) dates.push(tradingDay);
      current.setDate(current.getDate() + 7);
    }
  } else {
    // daily: 모든 영업일
    while (current <= end) {
      const str = current.toISOString().split('T')[0];
      if (!isWeekend(current) && availableDates.has(str)) dates.push(str);
      current.setDate(current.getDate() + 1);
    }
  }

  return [...new Set(dates)].sort(); // 중복 제거 + 정렬
}

/**
 * 특정 날짜의 종가 조회 (없으면 직전 영업일 종가)
 */
function getPrice(ticker: string, dateStr: string, priceMap: PriceMap, sortedDates: Record<string, string[]>): PriceRow | null {
  const tickerPrices = priceMap[ticker];
  if (!tickerPrices) return null;

  if (tickerPrices[dateStr]) return tickerPrices[dateStr];

  // 직전 영업일 찾기
  const dates = sortedDates[ticker];
  if (!dates) return null;
  const idx = dates.findLastIndex((d) => d <= dateStr);
  if (idx >= 0) return tickerPrices[dates[idx]];
  return null;
}

/**
 * 단일 티커 DCA 시뮬레이션
 * returns: { dates, values, totalInvested, totalDividends, shares }
 */
function simulateSingleTicker(
  ticker: string,
  amount: number, // 회차당 투자금 (해당 티커 비중 반영된 금액)
  investDates: string[],
  settings: InvestmentSettings,
  priceMap: PriceMap,
  sortedDates: Record<string, string[]>
): {
  dailyValues: Record<string, number>;
  totalInvested: number;
  totalDividends: number;
  finalShares: number;
} {
  let shares = 0;
  let totalInvested = 0;
  let totalDividends = 0;
  const investDateSet = new Set(investDates);
  const dailyValues: Record<string, number> = {};

  const allDates = sortedDates[ticker] || [];

  for (const dateStr of allDates) {
    const row = priceMap[ticker][dateStr];
    if (!row) continue;

    // 적립일이면 매수
    if (investDateSet.has(dateStr)) {
      const bought = amount / row.close;
      shares += bought;
      totalInvested += amount;
    }

    // 배당금 재투자
    if (settings.reinvestDividends && row.dividend > 0 && shares > 0) {
      const divAmount = shares * row.dividend;
      const extraShares = divAmount / row.close;
      shares += extraShares;
      totalDividends += divAmount;
    }

    dailyValues[dateStr] = shares * row.close;
  }

  return { dailyValues, totalInvested, totalDividends, finalShares: shares };
}

/**
 * 월말 날짜 목록 생성 (차트 레이블용)
 */
function getMonthEndDates(startDate: string, endDate: string, availableDates: Set<string>): string[] {
  const result: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    // 해당 월 마지막 날 찾기
    const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    const target = lastDay > end ? end : lastDay;

    // target 이전 가장 가까운 영업일
    const t = new Date(target);
    for (let i = 0; i < 10; i++) {
      const str = t.toISOString().split('T')[0];
      if (availableDates.has(str)) {
        result.push(str);
        break;
      }
      t.setDate(t.getDate() - 1);
    }

    current.setMonth(current.getMonth() + 1);
  }

  return [...new Set(result)].sort();
}

/**
 * 히트맵 데이터 생성
 * 월별 수익률 = (월말 평가금액 - 전월말 평가금액 - 해당월 투자금) / 전월말 평가금액 × 100
 */
function buildHeatmap(
  monthlyValues: { date: string; value: number; invested: number }[]
): Record<string, Record<string, number>> {
  const heatmap: Record<string, Record<string, number>> = {};

  for (let i = 1; i < monthlyValues.length; i++) {
    const prev = monthlyValues[i - 1];
    const curr = monthlyValues[i];
    if (prev.value === 0) continue;

    const year = curr.date.slice(0, 4);
    const month = String(parseInt(curr.date.slice(5, 7))).toString();

    const monthReturn = ((curr.value - prev.value - curr.invested) / prev.value) * 100;

    if (!heatmap[year]) heatmap[year] = {};
    heatmap[year][month] = parseFloat(monthReturn.toFixed(2));
  }

  return heatmap;
}

/**
 * 메인 백테스트 함수
 */
export async function runBacktest(
  holdings: Holding[],
  settings: InvestmentSettings,
  fetchPrices: (ticker: string, startDate: string, endDate: string) => Promise<PriceRow[]>
): Promise<BacktestResult> {
  const { amount, frequency, startDate, endDate, reinvestDividends } = settings;

  // 벤치마크(SPY) 포함 전체 티커 목록
  const tickers = [...new Set([...holdings.map((h) => h.ticker), 'SPY'])];

  // 모든 티커의 주가 데이터 로드
  const priceMap: PriceMap = {};
  const sortedDates: Record<string, string[]> = {};

  await Promise.all(
    tickers.map(async (ticker) => {
      const rows = await fetchPrices(ticker, startDate, endDate);
      priceMap[ticker] = {};
      for (const row of rows) {
        priceMap[ticker][row.date] = row;
      }
      sortedDates[ticker] = Object.keys(priceMap[ticker]).sort();
    })
  );

  // 포트폴리오 holdings 중 가장 늦은 상장일 기준으로 시작일 조정
  let effectiveStartDate = startDate;
  let startDateAdjusted: BacktestResult['startDateAdjusted'] = undefined;

  for (const h of holdings) {
    const dates = sortedDates[h.ticker];
    if (!dates || dates.length === 0) continue;
    const tickerFirstDate = dates[0];
    if (tickerFirstDate > effectiveStartDate) {
      effectiveStartDate = tickerFirstDate;
      startDateAdjusted = {
        original: startDate,
        adjusted: tickerFirstDate,
        reason: `${h.ticker} 상장일(${tickerFirstDate}) 기준으로 시작일을 조정했습니다.`,
      };
    }
  }

  // 포트폴리오 기준 영업일 집합 (SPY 기준)
  const availableDates = new Set<string>(sortedDates['SPY'] || []);

  // 적립일 목록 (조정된 시작일 기준)
  const investDates = getInvestmentDates(effectiveStartDate, endDate, frequency, availableDates);

  // 각 홀딩 시뮬레이션
  let totalPortfolioInvested = 0;
  let totalPortfolioDividends = 0;
  const holdingResults: Array<{
    ticker: string;
    weight: number;
    dailyValues: Record<string, number>;
    totalInvested: number;
    totalDividends: number;
  }> = [];

  for (const h of holdings) {
    const tickerAmount = amount * (h.weight / 100);
    const tickerAvailable = new Set<string>(sortedDates[h.ticker] || []);
    // 모든 티커 동일한 effectiveStartDate 기준으로 투자일 계산
    const tickerInvestDates = getInvestmentDates(effectiveStartDate, endDate, frequency, tickerAvailable);

    const result = simulateSingleTicker(
      h.ticker,
      tickerAmount,
      tickerInvestDates,
      { ...settings, reinvestDividends },
      priceMap,
      sortedDates
    );

    holdingResults.push({
      ticker: h.ticker,
      weight: h.weight,
      dailyValues: result.dailyValues,
      totalInvested: result.totalInvested,
      totalDividends: result.totalDividends,
    });

    totalPortfolioInvested += result.totalInvested;
    totalPortfolioDividends += result.totalDividends;
  }

  // 벤치마크(SPY 100%) 시뮬레이션 (조정된 시작일 기준)
  const spyInvestDates = getInvestmentDates(effectiveStartDate, endDate, frequency, availableDates);
  const spyResult = simulateSingleTicker('SPY', amount, spyInvestDates, settings, priceMap, sortedDates);

  // 월별 차트 데이터 생성
  const monthEndDates = getMonthEndDates(startDate, endDate, availableDates);

  const chartLabels: string[] = [];
  const portfolioValues: number[] = [];
  const benchmarkValues: number[] = [];
  const cashValues: number[] = [];

  // 월별 투자금 누계 추적
  const investDateSet = new Set(spyInvestDates);
  let cumulativeCash = 0;
  const cumulativeCashByDate: Record<string, number> = {};
  let cashRunning = 0;

  // 전체 영업일 순서대로 현금 누계 계산
  const allSpyDates = sortedDates['SPY'] || [];
  for (const d of allSpyDates) {
    if (investDateSet.has(d)) cashRunning += amount;
    cumulativeCashByDate[d] = cashRunning;
  }

  // 포트폴리오 월별 투자금 추적
  const portfolioInvestedByDate: Record<string, number> = {};
  let portfolioRunning = 0;
  for (const d of allSpyDates) {
    if (investDateSet.has(d)) portfolioRunning += amount;
    portfolioInvestedByDate[d] = portfolioRunning;
  }

  for (const date of monthEndDates) {
    chartLabels.push(date.slice(0, 7));

    // 포트폴리오 합산
    let portValue = 0;
    for (const hr of holdingResults) {
      const v = hr.dailyValues[date];
      if (v !== undefined) {
        portValue += v;
      } else {
        // 해당 날짜 데이터 없으면 직전 값 사용
        const dates = Object.keys(hr.dailyValues).filter((d) => d <= date).sort();
        if (dates.length > 0) portValue += hr.dailyValues[dates[dates.length - 1]];
      }
    }
    portfolioValues.push(parseFloat(portValue.toFixed(2)));

    // 벤치마크
    const spyV = spyResult.dailyValues[date] ?? 0;
    benchmarkValues.push(parseFloat(spyV.toFixed(2)));

    // 현금
    cashValues.push(parseFloat((cumulativeCashByDate[date] ?? cumulativeCash).toFixed(2)));
  }

  // 최종 포트폴리오 가치
  const finalPortfolioValue = portfolioValues[portfolioValues.length - 1] ?? 0;
  const finalBenchmarkValue = benchmarkValues[benchmarkValues.length - 1] ?? 0;

  // 수익률 계산
  const portfolioReturn = totalPortfolioInvested > 0
    ? ((finalPortfolioValue - totalPortfolioInvested) / totalPortfolioInvested) * 100
    : 0;
  const benchmarkReturn = spyResult.totalInvested > 0
    ? ((finalBenchmarkValue - spyResult.totalInvested) / spyResult.totalInvested) * 100
    : 0;

  // CAGR 계산 (실제 투자 기간 기준)
  const dayCount = Math.round(
    (new Date(endDate).getTime() - new Date(effectiveStartDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const years = dayCount / 365.25;
  const cagr = years > 0 && totalPortfolioInvested > 0
    ? (Math.pow(finalPortfolioValue / totalPortfolioInvested, 1 / years) - 1) * 100
    : 0;
  const benchmarkCagr = years > 0 && spyResult.totalInvested > 0
    ? (Math.pow(finalBenchmarkValue / spyResult.totalInvested, 1 / years) - 1) * 100
    : 0;

  // 종목별 개별 수익률
  const holdingResultsOutput = holdingResults.map((hr) => {
    const dates = Object.keys(hr.dailyValues).sort();
    const finalValue = dates.length > 0 ? hr.dailyValues[dates[dates.length - 1]] : 0;
    const indReturn = hr.totalInvested > 0
      ? ((finalValue - hr.totalInvested) / hr.totalInvested) * 100
      : 0;
    const indCagr = years > 0 && hr.totalInvested > 0
      ? (Math.pow(finalValue / hr.totalInvested, 1 / years) - 1) * 100
      : 0;
    const contribution = finalPortfolioValue > 0
      ? (finalValue / finalPortfolioValue) * 100
      : 0;

    return {
      ticker: hr.ticker,
      weight: hr.weight,
      contribution: parseFloat(contribution.toFixed(1)),
      individualReturn: parseFloat(indReturn.toFixed(1)),
      individualCagr: parseFloat(indCagr.toFixed(1)),
    };
  });

  // 히트맵 데이터
  const monthlyForHeatmap = monthEndDates.map((date, i) => ({
    date,
    value: portfolioValues[i] ?? 0,
    invested: i === 0 ? portfolioInvestedByDate[date] ?? 0 : (portfolioInvestedByDate[date] ?? 0) - (portfolioInvestedByDate[monthEndDates[i - 1]] ?? 0),
  }));

  const heatmap = buildHeatmap(monthlyForHeatmap);

  return {
    summary: {
      totalInvested: parseFloat(totalPortfolioInvested.toFixed(2)),
      portfolioValue: parseFloat(finalPortfolioValue.toFixed(2)),
      portfolioReturn: parseFloat(portfolioReturn.toFixed(1)),
      cagr: parseFloat(cagr.toFixed(1)),
      benchmarkValue: parseFloat(finalBenchmarkValue.toFixed(2)),
      benchmarkReturn: parseFloat(benchmarkReturn.toFixed(1)),
      benchmarkCagr: parseFloat(benchmarkCagr.toFixed(1)),
      excessReturn: parseFloat((portfolioReturn - benchmarkReturn).toFixed(1)),
      totalDividends: parseFloat(totalPortfolioDividends.toFixed(2)),
      investmentCount: investDates.length,
      dayCount,
    },
    chartData: {
      labels: chartLabels,
      portfolio: portfolioValues,
      benchmark: benchmarkValues,
      cash: cashValues,
    },
    heatmap,
    holdings: holdingResultsOutput,
    startDateAdjusted,
  };
}
