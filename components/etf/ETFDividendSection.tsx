'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { PriceRow } from '@/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface Props {
  prices: PriceRow[];
  ticker: string;
}

export default function ETFDividendSection({ prices, ticker }: Props) {
  // 배당 내역만 추출 (dividend > 0)
  const dividendRows = useMemo(
    () => prices.filter((p) => p.dividend > 0).reverse(),
    [prices]
  );

  // 연도별 배당금 합산
  const yearlyDivs = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of dividendRows) {
      const year = row.date.slice(0, 4);
      map[year] = (map[year] ?? 0) + row.dividend;
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, total]) => ({ year, total: Math.round(total * 100) / 100 }));
  }, [dividendRows]);

  // 최신 종가 (배당수익률 계산용)
  const latestClose = prices.length > 0 ? prices[prices.length - 1].close : null;

  // TTM 배당수익률 (최근 1년 배당금 합계 / 현재가)
  const ttmYield = useMemo(() => {
    if (!latestClose) return null;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const cutoff = oneYearAgo.toISOString().slice(0, 10);
    const ttmDivs = dividendRows.filter((p) => p.date >= cutoff);
    const total = ttmDivs.reduce((sum, p) => sum + p.dividend, 0);
    if (total === 0) return null;
    return (total / latestClose) * 100;
  }, [dividendRows, latestClose]);

  if (dividendRows.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-400">
        {ticker}는 배당 데이터가 없거나 무배당 ETF입니다.
      </div>
    );
  }

  const latestDiv = dividendRows[0];

  const barData = {
    labels:   yearlyDivs.map((d) => d.year),
    datasets: [
      {
        data:            yearlyDivs.map((d) => d.total),
        backgroundColor: '#fbbf24',
        borderRadius:    4,
      },
    ],
  };

  const barOptions = {
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => `$${(ctx.parsed.y ?? 0).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          font: { size: 11 },
          color: '#9ca3af',
          callback: (v: string | number) => `$${Number(v).toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3">
        {ttmYield !== null && (
          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">배당수익률 (TTM)</p>
            <p className="text-xl font-bold text-yellow-700">{ttmYield.toFixed(2)}%</p>
          </div>
        )}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">최근 배당락일</p>
          <p className="text-sm font-bold text-gray-900">{latestDiv.date}</p>
          <p className="text-xs text-gray-500 mt-0.5">${latestDiv.dividend.toFixed(4)}/주</p>
        </div>
      </div>

      {/* 연도별 배당 바차트 */}
      {yearlyDivs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">연도별 배당금 합계 (주당, USD)</h3>
          <div className="h-48">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      )}

      {/* 최근 배당 내역 테이블 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">최근 배당 내역</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">배당락일</th>
                <th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium">주당 배당금</th>
                {latestClose && (
                  <th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium">배당률</th>
                )}
              </tr>
            </thead>
            <tbody>
              {dividendRows.slice(0, 12).map((row) => (
                <tr key={row.date} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">{row.date}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">
                    ${row.dividend.toFixed(4)}
                  </td>
                  {latestClose && (
                    <td className="px-4 py-2.5 text-right text-gray-500">
                      {((row.dividend / latestClose) * 100).toFixed(3)}%
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
