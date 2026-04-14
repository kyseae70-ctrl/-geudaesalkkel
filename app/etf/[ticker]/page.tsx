import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ETF_LIST, CATEGORY_COLORS, CATEGORY_EMOJI } from '@/lib/etf-list';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ ticker: string }>;
}

export async function generateStaticParams() {
  return ETF_LIST.map((etf) => ({ ticker: etf.ticker }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const etf = ETF_LIST.find((e) => e.ticker === ticker.toUpperCase());
  if (!etf) return {};
  return {
    title: `${etf.ticker} - ${etf.name_ko} | 그때살껄`,
    description: etf.description ?? `${etf.name_ko}(${etf.ticker}) ETF 정보와 백테스트`,
  };
}


export default async function ETFDetailPage({ params }: Props) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.toUpperCase();
  const etf = ETF_LIST.find((e) => e.ticker === ticker);

  if (!etf) notFound();

  // 같은 카테고리 ETF (본인 제외, 최대 5개)
  const relatedETFs = ETF_LIST.filter(
    (e) => e.category === etf.category && e.ticker !== etf.ticker
  ).slice(0, 5);

  const categoryColor = CATEGORY_COLORS[etf.category] ?? 'bg-gray-100 text-gray-700';
  const categoryEmoji = CATEGORY_EMOJI[etf.category] ?? '📊';

  // 레버리지/인버스 경고 여부
  const isLeverage = etf.category === '레버리지';

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* 뒤로가기 */}
      <Link href="/calculator" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        계산기로 돌아가기
      </Link>

      {/* 헤더 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
            {categoryEmoji} {etf.category}
          </span>
          {isLeverage && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
              ⚠️ 고위험 상품
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          <span className="font-mono">{etf.ticker}</span>
        </h1>
        <p className="text-lg text-gray-700 font-medium">{etf.name_ko}</p>
        <p className="text-sm text-gray-500">{etf.name_en}</p>
      </div>

      {/* 주요 정보 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">연간 수수료(Expense Ratio)</p>
          <p className="text-xl font-bold text-gray-900">
            {etf.expense_ratio != null ? `${etf.expense_ratio}%` : '-'}
          </p>
          <p className="text-xs text-gray-400 mt-1">$10,000 투자 시 연 ${etf.expense_ratio != null ? (10000 * etf.expense_ratio / 100).toFixed(0) : '-'}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">카테고리</p>
          <p className="text-xl font-bold text-gray-900">{categoryEmoji}</p>
          <p className="text-xs text-gray-600 mt-1">{etf.category}</p>
        </div>
      </div>

      {/* 설명 */}
      {etf.description && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">ETF 소개</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{etf.description}</p>
        </div>
      )}

      {/* 레버리지 경고 */}
      {isLeverage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
          <p className="text-sm font-semibold text-red-700">레버리지/인버스 ETF 주의사항</p>
          <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
            <li>매일 리셋되는 구조로 장기 보유 시 지수 수익률과 크게 달라질 수 있습니다</li>
            <li>변동성이 높을수록 변동성 손실(volatility decay)이 발생합니다</li>
            <li>단기 전술적 투자 목적으로 설계된 상품입니다</li>
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white space-y-3">
        <p className="font-semibold">그때 {etf.ticker}를 샀다면?</p>
        <p className="text-sm text-blue-100">
          과거 어느 시점부터 매달 투자했다면 지금 얼마가 됐는지 바로 확인해보세요.
        </p>
        <Link
          href={`/calculator?tickers=${etf.ticker}`}
          className="inline-block bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors"
        >
          {etf.ticker} 백테스트 시작하기
        </Link>
      </div>

      {/* 관련 ETF */}
      {relatedETFs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">같은 카테고리 ETF</h2>
          <div className="grid grid-cols-1 gap-2">
            {relatedETFs.map((related) => (
              <Link
                key={related.ticker}
                href={`/etf/${related.ticker}`}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors group"
              >
                <div>
                  <span className="font-mono font-bold text-blue-700 text-sm">{related.ticker}</span>
                  <span className="ml-2 text-sm text-gray-600">{related.name_ko}</span>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 면책 고지 */}
      <p className="text-xs text-gray-400 leading-relaxed border-t pt-4">
        본 페이지의 ETF 정보는 투자 자문이 아니며 참고용으로만 활용하시기 바랍니다.
        투자 결정 전 운용사 공식 자료를 반드시 확인하세요.
      </p>
    </main>
  );
}
