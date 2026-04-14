'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

// 주요 시장 이벤트 마커
const MARKET_EVENTS = [
  { date: '2018-10', label: '2018 하락' },
  { date: '2020-03', label: '코로나 폭락' },
  { date: '2022-03', label: '금리 인상' },
  { date: '2023-01', label: 'AI 버블' },
];

interface LineChartProps {
  labels: string[];
  portfolio: number[];
  benchmark: number[];
  cash: number[];
}

export default function LineChart({ labels, portfolio, benchmark, cash }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // 주요 이벤트가 labels에 포함되는지 확인하여 annotation용 인덱스 찾기
    const eventAnnotations = MARKET_EVENTS.filter((e) => labels.some((l) => l >= e.date)).map((e) => {
      const idx = labels.findIndex((l) => l >= e.date);
      return { idx, label: e.label };
    });

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '내 포트폴리오',
            data: portfolio,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.05)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: false,
            tension: 0.3,
          },
          {
            label: 'S&P 500 (SPY)',
            data: benchmark,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.05)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: false,
            tension: 0.3,
          },
          {
            label: '현금 보유',
            data: cash,
            borderColor: '#9ca3af',
            backgroundColor: 'rgba(156,163,175,0.05)',
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: false,
            tension: 0,
            borderDash: [4, 4],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.2,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'line',
              font: { size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = ctx.parsed.y ?? 0;
                return ` ${ctx.dataset.label}: $${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11 },
              maxTicksLimit: 12,
              callback: (_, i) => {
                const label = labels[i];
                if (!label) return '';
                // 매년 1월만 표시
                return label.endsWith('-01') ? label.slice(0, 4) : '';
              },
            },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              font: { size: 11 },
              callback: (v) => `$${Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [labels, portfolio, benchmark, cash]);

  // 차트 아래 이벤트 마커 표시
  const visibleEvents = MARKET_EVENTS.filter((e) => labels.some((l) => l >= e.date && l <= e.date.slice(0, 4) + '-12'));

  return (
    <div>
      <canvas ref={canvasRef} />
      {visibleEvents.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {visibleEvents.map((e) => (
            <span key={e.date} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              📌 {e.date} {e.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
