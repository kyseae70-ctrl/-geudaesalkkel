import type { ETFSector } from '@/types';

interface Props {
  sectors: ETFSector[];
}

const SECTOR_COLORS: Record<string, string> = {
  'Technology':             '#3b82f6',
  'Information Technology': '#3b82f6',
  'IT':                     '#3b82f6',
  'Financials':             '#8b5cf6',
  'Finance':                '#8b5cf6',
  'Communication Services': '#f59e0b',
  'Telecommunication':      '#f59e0b',
  'Consumer Discretionary': '#ec4899',
  'Industrials':            '#ef4444',
  'Health Care':            '#22c55e',
  'Healthcare':             '#22c55e',
  'Consumer Staples':       '#06b6d4',
  'Energy':                 '#f97316',
  'Materials':              '#84cc16',
  'Real Estate':            '#a855f7',
  'Utilities':              '#64748b',
  'Basic Materials':        '#84cc16',
};

function getColor(sector: string, idx: number): string {
  return SECTOR_COLORS[sector] ?? [
    '#6366f1','#14b8a6','#f43f5e','#0ea5e9','#d946ef','#fb923c',
  ][idx % 6];
}

export default function ETFSectorChart({ sectors }: Props) {
  if (sectors.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-400">
        섹터 데이터가 없습니다.
      </div>
    );
  }

  const sorted = [...sectors].sort((a, b) => b.weight - a.weight);

  return (
    <div className="space-y-2.5">
      {sorted.map((s, idx) => (
        <div key={s.sector} className="flex items-center gap-3">
          <span className="text-xs text-gray-600 w-36 shrink-0 truncate">{s.sector}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(s.weight, 100)}%`,
                backgroundColor: getColor(s.sector, idx),
              }}
            />
          </div>
          <span className="text-xs font-medium text-gray-900 w-12 text-right tabular-nums">
            {s.weight.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
