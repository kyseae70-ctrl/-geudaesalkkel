'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Holding, InvestmentSettings, BacktestResult } from '@/types';
import PortfolioBuilder from '@/components/calculator/PortfolioBuilder';
import InvestmentSettingsForm from '@/components/calculator/InvestmentSettings';
import MetricCards from '@/components/result/MetricCards';
import LineChart from '@/components/result/LineChart';
import HeatmapChart from '@/components/result/HeatmapChart';
import DonutChart from '@/components/result/DonutChart';
import HoldingsTable from '@/components/result/HoldingsTable';
import ShareCard from '@/components/result/ShareCard';
import InsightBanner from '@/components/result/InsightBanner';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function getDefaultSettings(): InvestmentSettings {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 5);
  return {
    amount: 500,
    frequency: 'monthly',
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    reinvestDividends: true,
  };
}

function CalculatorContent() {
  const searchParams = useSearchParams();
  const [holdings, setHoldings] = useState<Holding[]>([
    { ticker: 'QQQ', weight: 50 },
    { ticker: 'SCHD', weight: 50 },
  ]);
  const [settings, setSettings] = useState<InvestmentSettings>(getDefaultSettings());
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // URL 파라미터에서 포트폴리오 불러오기
  useEffect(() => {
    // ?holdings=[{"ticker":"QQQ","weight":100}] 형식
    const holdingsParam = searchParams.get('holdings');
    if (holdingsParam) {
      try {
        const parsed = JSON.parse(holdingsParam);
        if (Array.isArray(parsed)) {
          setHoldings(parsed);
          return;
        }
      } catch {
        // 파싱 실패 시 tickers 파라미터 확인
      }
    }
    // ?tickers=QQQ 또는 ?tickers=QQQ,SCHD 형식
    const tickersParam = searchParams.get('tickers');
    if (tickersParam) {
      const tickers = tickersParam.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean);
      if (tickers.length > 0) {
        const weight = Math.floor(100 / tickers.length);
        const remainder = 100 - weight * tickers.length;
        setHoldings(
          tickers.map((ticker, i) => ({
            ticker,
            weight: i === 0 ? weight + remainder : weight,
          }))
        );
      }
    }
  }, [searchParams]);

  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);
  const isWeightValid = Math.abs(totalWeight - 100) < 0.1;

  const handleCalculate = useCallback(async () => {
    if (!isWeightValid || holdings.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holdings, settings }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '오류가 발생했습니다.');
        return;
      }
      setResult(data);
      setIsMockData(data.isMockData ?? false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [holdings, settings, isWeightValid]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        {/* 입력 패널 */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
            <PortfolioBuilder holdings={holdings} onChange={setHoldings} />
            <div className="border-t border-gray-100 pt-5">
              <InvestmentSettingsForm settings={settings} onChange={setSettings} />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={!isWeightValid || holdings.length === 0 || isLoading}
            className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '계산 중...' : '백테스트 계산하기'}
          </button>

          {!isWeightValid && holdings.length > 0 && (
            <p className="text-sm text-red-500 text-center">비중 합계가 100%가 되어야 합니다. (현재 {totalWeight}%)</p>
          )}
        </aside>

        {/* 결과 패널 */}
        <div className="space-y-6" ref={resultRef}>
          {isLoading && <LoadingSpinner message="과거 데이터 기반으로 계산 중입니다..." />}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!result && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400 space-y-3">
              <div className="text-5xl">📊</div>
              <p className="text-lg font-medium text-gray-500">ETF를 선택하고 계산해보세요</p>
              <p className="text-sm">좌측에서 포트폴리오를 구성하고<br />백테스트 계산 버튼을 눌러보세요.</p>
            </div>
          )}

          {result && !isLoading && (
            <>
              {isMockData && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-xs text-yellow-700">
                  현재 mock 데이터로 계산된 결과입니다. Supabase 연동 후 실제 데이터로 교체됩니다.
                </div>
              )}

              {result.startDateAdjusted && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-xs text-blue-700">
                  ℹ️ {result.startDateAdjusted.reason} (설정 시작일: {result.startDateAdjusted.original})
                </div>
              )}

              {/* 임팩트 헤드라인 */}
              <InsightBanner result={result} holdings={holdings} settings={settings} />

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <MetricCards summary={result.summary} />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">누적 평가금액 비교</h3>
                <LineChart
                  labels={result.chartData.labels}
                  portfolio={result.chartData.portfolio}
                  benchmark={result.chartData.benchmark}
                  cash={result.chartData.cash}
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">월별 수익률 히트맵</h3>
                <HeatmapChart heatmap={result.heatmap} />
              </div>

              {result.holdings.length > 1 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">종목별 기여도</h3>
                  <DonutChart holdings={result.holdings} />
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">종목별 수익률</h3>
                <HoldingsTable holdings={result.holdings} />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">결과 공유</h3>
                <ShareCard result={result} holdings={holdings} settings={settings} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CalculatorContent />
    </Suspense>
  );
}
