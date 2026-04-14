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
