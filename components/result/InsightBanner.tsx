'use client';

import { BacktestResult, Holding, InvestmentSettings } from '@/types';
import { formatCurrency, formatPercent, formatYears } from '@/lib/formatters';

interface InsightBannerProps {
  result: BacktestResult;
  holdings: Holding[];
  settings: InvestmentSettings;
}

/** DCA 기준 은행 예금(연 2%) 미래가치 계산 */
function calcBankSavings(amount: number, frequency: string, dayCount: number): number {
  const years = dayCount / 365.25;
  const rAnnual = 0.02;

  if (frequency === 'monthly') {
    const n = Math.floor(years * 12);
    const r = rAnnual / 12;
    return n > 0 ? amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : 0;
  } else if (frequency === 'weekly') {
    const n = Math.floor(years * 52);
    const r = rAnnual / 52;
    return n > 0 ? amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : 0;
  } else {
    const n = Math.floor(years * 252);
    const r = rAnnual / 252;
    return n > 0 ? amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : 0;
  }
}

export default function InsightBanner({ result, holdings, settings }: InsightBannerProps) {
  const { summary } = result;
  const years = summary.dayCount / 365.25;

  // 포트폴리오 설명
  const portfolioDesc =
    holdings.length === 1
      ? holdings[0].ticker
      : holdings.length === 2
      ? `${holdings[0].ticker} + ${holdings[1].ticker}`
      : `${holdings[0].ticker} 등 ${holdings.length}종목`;

  // 기간 텍스트
  const periodText = formatYears(years);

  // 빈도 텍스트
  const freqText = settings.frequency === 'monthly' ? '매달' : settings.frequency === 'weekly' ? '매주' : '매일';

  // 일일 환산 금액
  const dailyAmount =
    settings.frequency === 'monthly'
      ? settings.amount / 30.4
      : settings.frequency === 'weekly'
      ? settings.amount / 7
      : settings.amount;

  // 커피 잔 수 ($6 기준)
  const coffeeCount = dailyAmount / 6;

  // 배수
  const multiplier = summary.portfolioValue / summary.totalInvested;

  // 은행 예금 비교
  const bankValue = calcBankSavings(settings.amount, settings.frequency, summary.dayCount);
  const vsBank = summary.portfolioValue - bankValue;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white space-y-5">
      {/* 메인 헤드라인 */}
      <div className="space-y-1">
        <p className="text-sm text-gray-400">
          {periodText} 전부터 {freqText} {formatCurrency(settings.amount)}씩 {portfolioDesc}에 넣었다면...
        </p>
        <div className="flex items-end gap-3 flex-wrap">
          <span className="text-2xl font-bold text-gray-400 line-through decoration-gray-500">
            {formatCurrency(summary.totalInvested)}
          </span>
          <span className="text-gray-400 text-xl">→</span>
          <span className="text-4xl font-bold text-red-400">
            {formatCurrency(summary.portfolioValue)}
          </span>
        </div>
        <p className="text-sm text-gray-300">
          원금의 <span className="text-yellow-400 font-bold">{multiplier.toFixed(1)}배</span>
          {' · '}연 <span className="text-yellow-400 font-bold">{formatPercent(summary.cagr)} 복리</span>
        </p>
      </div>

      {/* 인사이트 카드 2개 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 일상 비유 */}
        <div className="bg-white/10 rounded-xl p-3 space-y-1">
          <p className="text-xs text-gray-400">하루 환산</p>
          <p className="text-base font-bold text-white">{formatCurrency(dailyAmount)}</p>
          <p className="text-xs text-blue-300">
            커피 {coffeeCount < 1 ? '한 잔보다 적게' : `${coffeeCount.toFixed(1)}잔`}
          </p>
        </div>

        {/* 은행 예금 비교 */}
        <div className="bg-white/10 rounded-xl p-3 space-y-1">
          <p className="text-xs text-gray-400">은행 예금(연 2%)보다</p>
          <p className={`text-base font-bold ${vsBank >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
            {vsBank >= 0 ? '+' : ''}{formatCurrency(vsBank)}
          </p>
          <p className="text-xs text-gray-400">
            예금이면 {formatCurrency(bankValue)}
          </p>
        </div>
      </div>
    </div>
  );
}
