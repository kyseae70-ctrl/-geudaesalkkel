'use client';

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { PriceRow } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

type Period = '1M' | '3M' | '6M' | 'YTD' | '1Y' | '3Y' | 'MAX';

const PERIODS: { label: Period; months?: number; ytd?: boolean }[] = [
  { label: '1M',  months: 1 },
  { label: '3M',  months: 3 },
  { label: '6M',  months: 6 },
  { label: 'YTD', ytd: true },
  { label: '1Y',  months: 12 },
  { label: '3Y',  months: 36 },
  { label: 'MAX' },
];

function getPeriodStart(period: Period): string {
  const today = new Date();
  if (period === 'MAX') return '2000-01-01';
  if (period === 'YTD') return `${today.getFullYear()}-01-01`;
  const months = PERIODS.find((p) => p.label === period)?.months ?? 12;
  const d = new Date(today);
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
}

interface Props {
  prices: PriceRow[];
}

export default function ETFPriceChart({ prices }: Props) {
  const [period, setPeriod] = useState<Period>('1Y');

  const filtered = useMemo(() => {
    const startDate = getPeriodStart(period);
    return prices.filter((p) => p.date >= startDate);
  }, [prices, period]);

  // 주별 샘플링 (데이터가 많을 때 차트 성능 개선)
  const sampled = useMemo(() => {
    if (filtered.length <= 300) return filtered;
    const step = Math.ceil(filtered.length / 300);
    return filtered.filter((_, i) => i % step === 0 || i === filtered.length - 1);
  }, [filtered]);

  const latestPrice  = prices.length > 0 ? prices[prices.length - 1].close : null;
  const periodStart  = filtered.length > 0 ? filtered[0].close : null;
  const periodReturn = latestPrice && periodStart
    ? ((latestPrice - periodStart) / periodStart) * 100
    : null;

  const isPositive = (periodReturn ?? 0) >= 0;

  const labels = sampled.map((p) => p.date);
  const data   = sampled.map((p) => p.close);

  const lineColor = isPositive ? '#16a34a' : '#dc2626';
  const fillColor = isPositive ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)';

  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor:     lineColor,
        backgroundColor: fillColor,
        borderWidth:     1.5,
        pointRadius:     0,
        fill:            true,
        tension:         0.1,
      },
    ],
  };

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) =>
            `$${(ctx.parsed.y ?? 0).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 6,
          font: { size: 11 },
          color: '#9ca3af',
          maxRotation: 0,
        },
        grid: { display: false },
      },
      y: {
        position: 'right' as const,
        ticks: {
          font: { size: 11 },
          color: '#9ca3af',
          callback: (v: string | number) => `$${Number(v).toFixed(0)}`,
        },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  };

  return (
    <div className="space-y-3">
      {/* 현재가 + 등락률 */}
      <div className="flex items-end gap-3">
        {latestPrice && (
          <span className="text-2xl font-bold text-gray-900">
            ${latestPrice.toFixed(2)}
          </span>
        )}
        {periodReturn !== null && (
          <span className={`text-sm font-semibold mb-0.5 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{periodReturn.toFixed(2)}%
            <span className="text-gray-400 font-normal ml-1">({period})</span>
          </span>
        )}
      </div>

      {/* 차트 */}
      <div className="h-52">
        {sampled.length > 1 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            차트 데이터가 없습니다
          </div>
        )}
      </div>

      {/* 기간 선택 버튼 */}
      <div className="flex gap-1">
        {PERIODS.map(({ label }) => (
          <button
            key={label}
            onClick={() => setPeriod(label)}
            className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
              period === label
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
