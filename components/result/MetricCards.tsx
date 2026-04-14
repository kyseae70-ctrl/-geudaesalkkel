import { BacktestSummary } from '@/types';
import { formatCurrency, formatPercent, formatYears } from '@/lib/formatters';

interface MetricCardsProps {
  summary: BacktestSummary;
}

export default function MetricCards({ summary }: MetricCardsProps) {
  const years = summary.dayCount / 365.25;

  const cards = [
    {
      label: '총 투자 원금',
      value: formatCurrency(summary.totalInvested),
      sub: `${summary.investmentCount}회 적립 · ${formatYears(years)}`,
      color: 'text-gray-700',
      bg: 'bg-gray-50',
    },
    {
      label: '최종 평가금액',
      value: formatCurrency(summary.portfolioValue),
      sub: `원금 대비 ${formatCurrency(summary.portfolioValue - summary.totalInvested)}`,
      color: summary.portfolioReturn >= 0 ? 'text-red-600' : 'text-blue-600',
      bg: summary.portfolioReturn >= 0 ? 'bg-red-50' : 'bg-blue-50',
    },
    {
      label: '총 수익률',
      value: formatPercent(summary.portfolioReturn),
      sub: `CAGR ${formatPercent(summary.cagr)}`,
      color: summary.portfolioReturn >= 0 ? 'text-red-600' : 'text-blue-600',
      bg: summary.portfolioReturn >= 0 ? 'bg-red-50' : 'bg-blue-50',
    },
    {
      label: 'S&P500 대비 초과 수익',
      value: formatPercent(summary.excessReturn),
      sub: `S&P500: ${formatPercent(summary.benchmarkReturn)} (CAGR ${formatPercent(summary.benchmarkCagr)})`,
      color: summary.excessReturn >= 0 ? 'text-green-600' : 'text-orange-600',
      bg: summary.excessReturn >= 0 ? 'bg-green-50' : 'bg-orange-50',
    },
    {
      label: '총 배당 수령액',
      value: formatCurrency(summary.totalDividends),
      sub: summary.totalDividends > 0 ? '배당 재투자 포함' : '배당 없음 / 미적용',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'S&P500 최종 평가액',
      value: formatCurrency(summary.benchmarkValue),
      sub: `CAGR ${formatPercent(summary.benchmarkCagr)}`,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
          <p className="text-xs text-gray-500 mb-1">{card.label}</p>
          <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
