import { PriceRow } from '@/types';

/**
 * 실제 ETF 수익률과 유사한 mock 주가 데이터 생성기
 * Supabase 연동 전 개발/테스트 용도
 */

// 각 티커별 시작가와 연평균 성장률(CAGR) 설정 (실제 수치 기반 근사값)
const TICKER_CONFIG: Record<string, { startPrice: number; annualReturn: number; volatility: number; dividendYield: number }> = {
  QQQ:  { startPrice: 100,  annualReturn: 0.185, volatility: 0.18, dividendYield: 0.006 },
  SPY:  { startPrice: 200,  annualReturn: 0.135, volatility: 0.14, dividendYield: 0.018 },
  VOO:  { startPrice: 195,  annualReturn: 0.135, volatility: 0.14, dividendYield: 0.018 },
  VTI:  { startPrice: 105,  annualReturn: 0.130, volatility: 0.14, dividendYield: 0.017 },
  IVV:  { startPrice: 200,  annualReturn: 0.135, volatility: 0.14, dividendYield: 0.018 },
  SCHD: { startPrice: 27,   annualReturn: 0.120, volatility: 0.13, dividendYield: 0.035 },
  JEPI: { startPrice: 54,   annualReturn: 0.070, volatility: 0.08, dividendYield: 0.085 },
  JEPQ: { startPrice: 50,   annualReturn: 0.090, volatility: 0.11, dividendYield: 0.090 },
  VIG:  { startPrice: 75,   annualReturn: 0.115, volatility: 0.12, dividendYield: 0.020 },
  VYM:  { startPrice: 65,   annualReturn: 0.105, volatility: 0.13, dividendYield: 0.030 },
  DGRO: { startPrice: 25,   annualReturn: 0.115, volatility: 0.13, dividendYield: 0.023 },
  QYLD: { startPrice: 23,   annualReturn: 0.020, volatility: 0.12, dividendYield: 0.110 },
  XYLD: { startPrice: 44,   annualReturn: 0.030, volatility: 0.11, dividendYield: 0.095 },
  HDV:  { startPrice: 70,   annualReturn: 0.090, volatility: 0.12, dividendYield: 0.038 },
  QLD:  { startPrice: 65,   annualReturn: 0.320, volatility: 0.36, dividendYield: 0.005 },
  TQQQ: { startPrice: 30,   annualReturn: 0.450, volatility: 0.55, dividendYield: 0.005 },
  TLT:  { startPrice: 120,  annualReturn: -0.020, volatility: 0.15, dividendYield: 0.030 },
  AGG:  { startPrice: 110,  annualReturn: 0.010, volatility: 0.05, dividendYield: 0.025 },
  BND:  { startPrice: 82,   annualReturn: 0.015, volatility: 0.05, dividendYield: 0.025 },
  SHY:  { startPrice: 84,   annualReturn: 0.015, volatility: 0.02, dividendYield: 0.020 },
  LQD:  { startPrice: 120,  annualReturn: 0.025, volatility: 0.08, dividendYield: 0.035 },
  HYG:  { startPrice: 88,   annualReturn: 0.040, volatility: 0.10, dividendYield: 0.055 },
  GLD:  { startPrice: 115,  annualReturn: 0.085, volatility: 0.13, dividendYield: 0.0 },
  IAU:  { startPrice: 11,   annualReturn: 0.085, volatility: 0.13, dividendYield: 0.0 },
  XLK:  { startPrice: 40,   annualReturn: 0.200, volatility: 0.18, dividendYield: 0.010 },
  SMH:  { startPrice: 55,   annualReturn: 0.220, volatility: 0.22, dividendYield: 0.008 },
  SOXX: { startPrice: 90,   annualReturn: 0.210, volatility: 0.22, dividendYield: 0.008 },
  XLE:  { startPrice: 75,   annualReturn: 0.080, volatility: 0.25, dividendYield: 0.040 },
  XLF:  { startPrice: 22,   annualReturn: 0.120, volatility: 0.18, dividendYield: 0.020 },
  XLV:  { startPrice: 65,   annualReturn: 0.110, volatility: 0.13, dividendYield: 0.015 },
  XLI:  { startPrice: 50,   annualReturn: 0.115, volatility: 0.15, dividendYield: 0.018 },
  XLRE: { startPrice: 29,   annualReturn: 0.080, volatility: 0.17, dividendYield: 0.030 },
  XLY:  { startPrice: 68,   annualReturn: 0.130, volatility: 0.18, dividendYield: 0.012 },
  XLC:  { startPrice: 45,   annualReturn: 0.120, volatility: 0.17, dividendYield: 0.012 },
  UPRO: { startPrice: 50,   annualReturn: 0.350, volatility: 0.43, dividendYield: 0.005 },
  SPXL: { startPrice: 20,   annualReturn: 0.350, volatility: 0.43, dividendYield: 0.005 },
  SOXL: { startPrice: 8,    annualReturn: 0.400, volatility: 0.65, dividendYield: 0.005 },
  TECL: { startPrice: 5,    annualReturn: 0.500, volatility: 0.55, dividendYield: 0.005 },
  SQQQ: { startPrice: 50,   annualReturn: -0.400, volatility: 0.55, dividendYield: 0.0 },
  SH:   { startPrice: 35,   annualReturn: -0.130, volatility: 0.14, dividendYield: 0.0 },
  SPXS: { startPrice: 30,   annualReturn: -0.380, volatility: 0.43, dividendYield: 0.0 },
  DIA:  { startPrice: 175,  annualReturn: 0.115, volatility: 0.13, dividendYield: 0.020 },
  IWM:  { startPrice: 120,  annualReturn: 0.095, volatility: 0.18, dividendYield: 0.015 },
  ONEQ: { startPrice: 40,   annualReturn: 0.165, volatility: 0.17, dividendYield: 0.007 },
  SPHD: { startPrice: 35,   annualReturn: 0.080, volatility: 0.14, dividendYield: 0.040 },
  EEM:  { startPrice: 38,   annualReturn: 0.045, volatility: 0.20, dividendYield: 0.022 },
  EFA:  { startPrice: 60,   annualReturn: 0.060, volatility: 0.16, dividendYield: 0.025 },
  VEA:  { startPrice: 37,   annualReturn: 0.060, volatility: 0.16, dividendYield: 0.025 },
  VWO:  { startPrice: 40,   annualReturn: 0.045, volatility: 0.20, dividendYield: 0.022 },
  IEFA: { startPrice: 55,   annualReturn: 0.062, volatility: 0.16, dividendYield: 0.025 },
};

// 결정론적 난수 생성 (시드 기반) — 같은 입력이면 항상 같은 결과
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/**
 * 특정 티커의 날짜 범위 내 일별 주가 데이터 생성
 * 실제 시장과 유사한 변동성과 트렌드를 가진 mock 데이터
 */
export function getMockPrices(ticker: string, startDate: string, endDate: string): PriceRow[] {
  const config = TICKER_CONFIG[ticker];
  if (!config) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const rows: PriceRow[] = [];

  // 2015-01-01 기준 시작가에서 startDate까지 성장한 가격 계산
  const baseDate = new Date('2015-01-01');
  const yearsFromBase = (start.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  let price = config.startPrice * Math.pow(1 + config.annualReturn, yearsFromBase);

  // 주요 시장 이벤트 반영 (대략적 가격 충격)
  const MARKET_EVENTS: { date: string; impact: number }[] = [
    { date: '2018-10-01', impact: -0.15 }, // 2018 하락장
    { date: '2018-12-26', impact: 0.10 },  // 반등
    { date: '2020-02-20', impact: -0.35 }, // 코로나 폭락
    { date: '2020-04-01', impact: 0.30 },  // 코로나 반등
    { date: '2022-01-01', impact: -0.05 }, // 금리인상 시작
    { date: '2022-06-16', impact: -0.15 }, // 금리인상 가속
    { date: '2023-01-01', impact: 0.15 },  // AI 버블 시작
    { date: '2024-01-01', impact: 0.10 },  // 지속 상승
  ];

  let eventIndex = 0;
  let dayIndex = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    // 주말 제외 (영업일만)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateStr = current.toISOString().split('T')[0];

      // 시장 이벤트 충격 적용
      while (eventIndex < MARKET_EVENTS.length && MARKET_EVENTS[eventIndex].date <= dateStr) {
        if (MARKET_EVENTS[eventIndex].date >= startDate) {
          price *= (1 + MARKET_EVENTS[eventIndex].impact);
        }
        eventIndex++;
      }

      // 일별 랜덤 변동 (연간 변동성 → 일별 변동성)
      const dailyVol = config.volatility / Math.sqrt(252);
      const dailyReturn = config.annualReturn / 252;
      const randomFactor = (seededRandom(dayIndex + ticker.charCodeAt(0) * 1000) - 0.5) * 2;
      price *= (1 + dailyReturn + randomFactor * dailyVol);
      price = Math.max(price, 0.01); // 0 이하 방지

      // 배당금: 분기별 지급 (3, 6, 9, 12월 첫 영업일)
      const month = current.getMonth() + 1;
      const isQuarterlyDiv = [3, 6, 9, 12].includes(month) && current.getDate() <= 7;
      const dividend = isQuarterlyDiv && config.dividendYield > 0
        ? parseFloat((price * config.dividendYield / 4).toFixed(4))
        : 0;

      rows.push({
        date: dateStr,
        close: parseFloat(price.toFixed(2)),
        dividend,
      });

      dayIndex++;
    }
    current.setDate(current.getDate() + 1);
  }

  return rows;
}
