'use client';

import { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { HoldingResult } from '@/types';
import { formatPercent } from '@/lib/formatters';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1',
];

interface DonutChartProps {
  holdings: HoldingResult[];
}

export default function DonutChart({ holdings }: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || holdings.length === 0) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: holdings.map((h) => h.ticker),
        datasets: [
          {
            data: holdings.map((h) => h.contribution),
            backgroundColor: COLORS.slice(0, holdings.length),
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '60%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const h = holdings[ctx.dataIndex];
                return [
                  ` 기여도: ${h.contribution.toFixed(1)}%`,
                  ` 개별 수익률: ${formatPercent(h.individualReturn)}`,
                ];
              },
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [holdings]);

  return (
    <div className="flex items-center gap-6">
      <div className="w-40 shrink-0">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex-1 space-y-2">
        {holdings.map((h, i) => (
          <div key={h.ticker} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span className="font-mono font-semibold text-sm text-gray-800 w-14">{h.ticker}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${h.contribution}%`, backgroundColor: COLORS[i] }}
              />
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">{h.contribution.toFixed(1)}%</span>
            <span className={`text-xs w-16 text-right ${h.individualReturn >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
              {formatPercent(h.individualReturn)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
