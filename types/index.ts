export interface Holding {
  ticker: string;
  weight: number;
}

export interface InvestmentSettings {
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  reinvestDividends: boolean;
}

export interface BacktestRequest {
  holdings: Holding[];
  settings: InvestmentSettings;
}

export interface BacktestSummary {
  totalInvested: number;
  portfolioValue: number;
  portfolioReturn: number;
  cagr: number;
  benchmarkValue: number;
  benchmarkReturn: number;
  benchmarkCagr: number;
  excessReturn: number;
  totalDividends: number;
  investmentCount: number;
  dayCount: number;
}

export interface BacktestResult {
  summary: BacktestSummary;
  chartData: {
    labels: string[];
    portfolio: number[];
    benchmark: number[];
    cash: number[];
  };
  heatmap: Record<string, Record<string, number>>;
  holdings: HoldingResult[];
  startDateAdjusted?: {
    original: string;
    adjusted: string;
    reason: string;
  };
}

export interface HoldingResult extends Holding {
  contribution: number;
  individualReturn: number;
  individualCagr: number;
}

export interface ETFInfo {
  ticker: string;
  name_ko: string;
  name_en: string;
  category: string;
  description?: string;
  expense_ratio?: number;
}

export interface PriceRow {
  date: string;
  close: number;
  dividend: number;
}

// ETF 상세 페이지 전용 타입
export interface ETFMeta extends ETFInfo {
  inception_date?: string | null;   // "1999-03-10"
  aum_billion?: number | null;      // 운용자산 (십억 달러)
  holdings_count?: number | null;   // 구성종목 수
  index_name?: string | null;       // 추종 지수명
}

export interface ETFReturnMap {
  '1m'?: number | null;
  '3m'?: number | null;
  '6m'?: number | null;
  'ytd'?: number | null;
  '1y'?: number | null;
  '3y'?: number | null;
  '5y'?: number | null;
  'max'?: number | null;
}

export interface ETFHolding {
  holding_ticker: string;
  name: string;
  weight: number;   // %
  sector: string;
}

export interface ETFSector {
  sector: string;
  weight: number;   // %
}

export interface ETFDetail {
  meta: ETFMeta;
  returns: ETFReturnMap;
  holdings: ETFHolding[];
  sectors: ETFSector[];
}
