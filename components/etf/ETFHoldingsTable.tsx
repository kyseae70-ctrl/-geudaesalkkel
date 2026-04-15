import type { ETFHolding } from '@/types';

interface Props {
  holdings: ETFHolding[];
}

export default function ETFHoldingsTable({ holdings }: Props) {
  if (holdings.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-400">
        구성종목 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">종목</th>
            <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden sm:table-cell">섹터</th>
            <th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium">비중</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h, idx) => (
            <tr key={h.holding_ticker} className="border-t border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-5 shrink-0">{idx + 1}</span>
                  <div>
                    <p className="font-mono font-semibold text-blue-700 text-xs">{h.holding_ticker}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[140px]">{h.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{h.sector || '-'}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(h.weight * 3, 100)}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 tabular-nums">
                    {h.weight.toFixed(2)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
