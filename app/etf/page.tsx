import Link from 'next/link';
import { ETF_LIST, CATEGORY_COLORS, CATEGORY_EMOJI } from '@/lib/etf-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ETF 목록 | 그때살껄',
  description: '미국 ETF 50종목 목록. 나스닥/S&P, 배당, 섹터, 채권, 레버리지, 글로벌 ETF 정보 및 백테스트',
};

const CATEGORY_ORDER = ['나스닥/S&P', '배당/인컴', '섹터', '채권/안전자산', '글로벌', '레버리지'];

export default function ETFListPage() {
  // 카테고리별 그룹핑
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    etfs: ETF_LIST.filter((e) => e.category === cat),
  }));

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">ETF 목록</h1>
        <p className="text-sm text-gray-500">
          지원하는 미국 ETF {ETF_LIST.length}종목입니다. 클릭하면 상세 정보와 백테스트를 바로 시작할 수 있어요.
        </p>
      </div>

      {/* 카테고리별 목록 */}
      {grouped.map(({ category, etfs }) => (
        <section key={category} className="space-y-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <span>{CATEGORY_EMOJI[category]}</span>
            <span>{category}</span>
            <span className="text-xs font-normal text-gray-400">({etfs.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {etfs.map((etf) => (
              <Link
                key={etf.ticker}
                href={`/etf/${etf.ticker}`}
                className="flex items-center justify-between bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 rounded-xl px-4 py-3 transition-colors group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 text-sm shrink-0">{etf.ticker}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[etf.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {CATEGORY_EMOJI[etf.category]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5 truncate">{etf.name_ko}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  {etf.expense_ratio != null && (
                    <span className="text-xs text-gray-400">{etf.expense_ratio}%</span>
                  )}
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* 면책 고지 */}
      <p className="text-xs text-gray-400 border-t pt-4">
        수수료(Expense Ratio)는 운용사 공시 기준이며 변경될 수 있습니다. 본 목록은 투자 추천이 아닙니다.
      </p>
    </main>
  );
}
