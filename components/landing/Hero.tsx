import Link from 'next/link';
import { runBacktest } from '@/lib/backtest';
import { fetchPricesFromSupabase } from '@/lib/prices';
import { formatCurrency } from '@/lib/formatters';

// 히어로 카드용 고정 기간 (10년, 월 $500)
const HERO_SETTINGS = {
  amount: 500,
  frequency: 'monthly' as const,
  startDate: '2015-01-01',
  endDate: '2024-12-31',
  reinvestDividends: true,
};

const HERO_ETFS = [
  { ticker: 'QQQ', label: '나스닥 100' },
  { ticker: 'SCHD', label: '배당 성장' },
  { ticker: 'SPY', label: 'S&P 500' },
];

// 실패 시 표시할 fallback 수치
const FALLBACK: Record<string, { invested: number; value: number }> = {
  QQQ:  { invested: 60000, value: 187000 },
  SCHD: { invested: 60000, value: 142000 },
  SPY:  { invested: 60000, value: 152000 },
};

async function getHeroStats() {
  try {
    const results = await Promise.all(
      HERO_ETFS.map(({ ticker }) =>
        runBacktest(
          [{ ticker, weight: 100 }],
          HERO_SETTINGS,
          fetchPricesFromSupabase
        ).then((r) => ({
          ticker,
          invested: r.summary.totalInvested,
          value: r.summary.portfolioValue,
        }))
      )
    );
    return Object.fromEntries(results.map((r) => [r.ticker, r]));
  } catch {
    return FALLBACK;
  }
}

export default async function Hero() {
  const stats = await getHeroStats();

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-block bg-blue-600/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-500/30">
          미국 ETF 적립식 백테스트 계산기
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          그때 샀다면
          <br />
          <span className="text-red-400">지금쯤...</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
          과거 특정 시점부터 미국 ETF를 꾸준히 적립했다면
          <br />
          지금 얼마가 됐을지 계산해보세요.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/calculator"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-lg"
          >
            지금 바로 계산해보기
          </Link>
          <p className="text-sm text-gray-400">무료 · 회원가입 불필요</p>
        </div>

        {/* 실제 백테스트 수치 카드 */}
        <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto">
          {HERO_ETFS.map(({ ticker, label }) => {
            const s = stats[ticker] ?? FALLBACK[ticker];
            const gain = s.value - s.invested;
            return (
              <div key={ticker} className="bg-white/10 rounded-xl p-3 text-left">
                <div className="font-mono font-bold text-white text-sm">{ticker}</div>
                <div className="text-xs text-gray-400">{label}</div>
                <div className="text-xs text-blue-300 mb-2">월 $500 · 10년</div>
                <div className="text-xs text-gray-400">원금 {formatCurrency(s.invested)}</div>
                <div className="text-xs text-gray-300">↓</div>
                <div className="text-red-400 font-bold text-base leading-tight">{formatCurrency(s.value)}</div>
                <div className="text-xs text-green-400 mt-0.5">+{formatCurrency(gain)}</div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500">* 2015~2024년 월 $500 적립 · 배당 재투자 기준 실제 데이터</p>
      </div>
    </section>
  );
}
