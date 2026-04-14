'use client';

import Link from 'next/link';
import { Holding, ETFInfo } from '@/types';
import ETFSearch from './ETFSearch';

interface PortfolioBuilderProps {
  holdings: Holding[];
  onChange: (holdings: Holding[]) => void;
}

export default function PortfolioBuilder({ holdings, onChange }: PortfolioBuilderProps) {
  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0);
  const remaining = 100 - totalWeight;

  function addHolding(etf: ETFInfo) {
    if (holdings.find((h) => h.ticker === etf.ticker)) return;
    if (holdings.length >= 10) return;

    // 새 종목에 남은 비중 자동 배분
    const newWeight = Math.max(0, remaining);
    onChange([...holdings, { ticker: etf.ticker, weight: newWeight }]);
  }

  function removeHolding(ticker: string) {
    onChange(holdings.filter((h) => h.ticker !== ticker));
  }

  function updateWeight(ticker: string, weight: number) {
    onChange(holdings.map((h) => (h.ticker === ticker ? { ...h, weight } : h)));
  }

  function distributeEvenly() {
    const count = holdings.length;
    if (count === 0) return;
    const base = Math.floor(100 / count);
    const remainder = 100 - base * count;
    onChange(
      holdings.map((h, i) => ({ ...h, weight: i === 0 ? base + remainder : base }))
    );
  }

  const isValid = Math.abs(totalWeight - 100) < 0.1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">ETF 포트폴리오 구성</h3>
        {holdings.length > 1 && (
          <button
            type="button"
            onClick={distributeEvenly}
            className="text-xs text-blue-600 hover:text-blue-700 underline"
          >
            균등 배분
          </button>
        )}
      </div>

      <ETFSearch
        onSelect={addHolding}
        excludeTickers={holdings.map((h) => h.ticker)}
      />

      {holdings.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          ETF를 검색해서 추가해보세요
        </div>
      ) : (
        <div className="space-y-2">
          {holdings.map((h) => (
            <div key={h.ticker} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
              <Link
                href={`/etf/${h.ticker}`}
                target="_blank"
                className="font-mono font-bold text-blue-700 text-sm w-14 shrink-0 hover:underline"
                title={`${h.ticker} ETF 정보 보기`}
              >
                {h.ticker}
              </Link>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={h.weight}
                  onChange={(e) => updateWeight(h.ticker, Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <div className="relative w-16">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={h.weight}
                    onChange={(e) => {
                      const v = Math.min(100, Math.max(1, Number(e.target.value)));
                      updateWeight(h.ticker, v);
                    }}
                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm text-right pr-5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeHolding(h.ticker)}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                aria-label={`${h.ticker} 삭제`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 비중 합계 표시 */}
      {holdings.length > 0 && (
        <div className={`flex items-center justify-between text-sm px-1 ${isValid ? 'text-green-600' : 'text-red-500'}`}>
          <span>비중 합계</span>
          <span className="font-semibold">
            {totalWeight}%
            {!isValid && (
              <span className="ml-1 font-normal">
                ({remaining > 0 ? `${remaining}% 남음` : `${-remaining}% 초과`})
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
