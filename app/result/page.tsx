import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { decodeShareParams } from '@/lib/share';
import { runBacktest } from '@/lib/backtest';
import { fetchPricesFromSupabase } from '@/lib/prices';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import MetricCards from '@/components/result/MetricCards';
import LineChart from '@/components/result/LineChart';
import HeatmapChart from '@/components/result/HeatmapChart';
import DonutChart from '@/components/result/DonutChart';
import HoldingsTable from '@/components/result/HoldingsTable';
import ShareCard from '@/components/result/ShareCard';
import InsightBanner from '@/components/result/InsightBanner';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Props {
  searchParams: Promise<Record<string, string>>;
}


export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const decoded = decodeShareParams(params);
  if (!decoded) {
    return {
      title: '백테스트 결과 — 그때살껄',
      description: '미국 ETF 적립식 백테스트 결과를 확인하세요.',
    };
  }

  const { holdings, settings } = decoded;
  const portfolioDesc = holdings.map((h) => `${h.ticker} ${h.weight}%`).join(' + ');

  try {
    const result = await runBacktest(holdings, settings, fetchPricesFromSupabase);
    const { summary } = result;
    const title = `${portfolioDesc} → ${formatPercent(summary.portfolioReturn)} 수익 | 그때살껄`;
    const description = `${settings.startDate.slice(0, 7)}부터 매${settings.frequency === 'monthly' ? '월' : settings.frequency === 'weekly' ? '주' : '일'} ${formatCurrency(settings.amount)} 적립 시 원금 ${formatCurrency(summary.totalInvested)} → ${formatCurrency(summary.portfolioValue)} (CAGR ${formatPercent(summary.cagr)})`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: '그때살껄',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch {
    return {
      title: `${portfolioDesc} 백테스트 결과 | 그때살껄`,
      description: '미국 ETF 적립식 백테스트 결과를 확인하세요.',
    };
  }
}

async function ResultContent({ searchParams }: Props) {
  const params = await searchParams;
  const decoded = decodeShareParams(params);

  // 파라미터 없거나 유효하지 않음
  if (!decoded) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">🔗</div>
        <h1 className="text-xl font-bold text-gray-800">잘못된 링크입니다</h1>
        <p className="text-gray-500 text-sm">
          공유된 링크가 만료됐거나 올바르지 않아요.
          <br />
          계산기에서 직접 계산해보세요.
        </p>
        <Link
          href="/calculator"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          계산기로 이동
        </Link>
      </div>
    );
  }

  const { holdings, settings } = decoded;

  let result;
  try {
    result = await runBacktest(holdings, settings, fetchPricesFromSupabase);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '알 수 없는 오류';
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h1 className="text-xl font-bold text-gray-800">계산 중 오류가 발생했어요</h1>
        <p className="text-gray-500 text-sm">{msg}</p>
        <Link href="/calculator" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
          계산기로 이동
        </Link>
      </div>
    );
  }

  const portfolioDesc = holdings.map((h) => `${h.ticker} ${h.weight}%`).join(' + ');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">공유된 백테스트 결과</p>
          <h1 className="text-xl font-bold text-gray-900">{portfolioDesc}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {settings.startDate} ~ {settings.endDate} · 매{settings.frequency === 'monthly' ? '월' : settings.frequency === 'weekly' ? '주' : '일'} {formatCurrency(settings.amount)} 적립
          </p>
        </div>
        <Link
          href={`/calculator?holdings=${encodeURIComponent(JSON.stringify(holdings))}`}
          className="shrink-0 text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          이 포트폴리오로 계산해보기
        </Link>
      </div>

      {/* 임팩트 헤드라인 */}
      <InsightBanner result={result} holdings={holdings} settings={settings} />

      {result.startDateAdjusted && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-xs text-blue-700">
          ℹ️ {result.startDateAdjusted.reason} (설정 시작일: {result.startDateAdjusted.original})
        </div>
      )}

      {/* 지표 카드 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <MetricCards summary={result.summary} />
      </div>

      {/* 차트 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">누적 평가금액 비교</h2>
        <LineChart
          labels={result.chartData.labels}
          portfolio={result.chartData.portfolio}
          benchmark={result.chartData.benchmark}
          cash={result.chartData.cash}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">월별 수익률 히트맵</h2>
        <HeatmapChart heatmap={result.heatmap} />
      </div>

      {result.holdings.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">종목별 기여도</h2>
          <DonutChart holdings={result.holdings} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">종목별 수익률</h2>
        <HoldingsTable holdings={result.holdings} />
      </div>

      {/* 공유 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">결과 공유</h2>
        <ShareCard result={result} holdings={holdings} settings={settings} />
      </div>

      {/* 면책 고지 */}
      <p className="text-xs text-gray-400 leading-relaxed text-center pb-4">
        본 서비스는 과거 데이터 기반 시뮬레이션으로, 실제 투자 결과와 다를 수 있습니다.
        과거 수익률이 미래 수익을 보장하지 않으며, 투자 손실에 대한 책임은 투자자 본인에게 있습니다.
        데이터 출처: Yahoo Finance
      </p>
    </div>
  );
}

export default function ResultPage(props: Props) {
  return (
    <Suspense fallback={<LoadingSpinner message="결과를 불러오는 중..." />}>
      <ResultContent {...props} />
    </Suspense>
  );
}
