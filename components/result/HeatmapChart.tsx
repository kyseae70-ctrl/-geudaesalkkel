'use client';

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

interface HeatmapChartProps {
  heatmap: Record<string, Record<string, number>>;
}

function getColor(value: number): string {
  if (value >= 10) return 'bg-green-700 text-white';
  if (value >= 5) return 'bg-green-500 text-white';
  if (value >= 2) return 'bg-green-300 text-green-900';
  if (value >= 0) return 'bg-green-100 text-green-800';
  if (value >= -2) return 'bg-red-100 text-red-800';
  if (value >= -5) return 'bg-red-300 text-red-900';
  if (value >= -10) return 'bg-red-500 text-white';
  return 'bg-red-700 text-white';
}

export default function HeatmapChart({ heatmap }: HeatmapChartProps) {
  const years = Object.keys(heatmap).sort();

  if (years.length === 0) {
    return <div className="text-sm text-gray-400 text-center py-4">데이터가 없습니다.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="text-left text-gray-500 font-medium py-1 pr-3 w-12">연도</th>
            {MONTHS.map((m) => (
              <th key={m} className="text-center text-gray-500 font-medium py-1 px-0.5 min-w-[36px]">
                {m.replace('월', '')}
              </th>
            ))}
            <th className="text-center text-gray-500 font-medium py-1 px-1 w-14">연간</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year) => {
            const monthData = heatmap[year];
            const monthValues = Object.values(monthData).filter((v) => v !== undefined);
            const yearAvg = monthValues.length > 0
              ? monthValues.reduce((a, b) => a + b, 0)
              : 0;

            return (
              <tr key={year}>
                <td className="text-gray-600 font-medium py-0.5 pr-3">{year}</td>
                {Array.from({ length: 12 }, (_, i) => {
                  const val = monthData[String(i + 1)];
                  return (
                    <td key={i} className="py-0.5 px-0.5">
                      {val !== undefined ? (
                        <div
                          className={`rounded text-center py-1 px-0.5 ${getColor(val)}`}
                          title={`${year}년 ${i + 1}월: ${val >= 0 ? '+' : ''}${val.toFixed(1)}%`}
                        >
                          {val >= 0 ? '+' : ''}{val.toFixed(1)}
                        </div>
                      ) : (
                        <div className="rounded bg-gray-100 py-1 px-0.5 text-center text-gray-300">-</div>
                      )}
                    </td>
                  );
                })}
                <td className="py-0.5 px-1">
                  <div className={`rounded text-center py-1 px-1 font-semibold ${getColor(yearAvg)}`}>
                    {yearAvg >= 0 ? '+' : ''}{yearAvg.toFixed(0)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs text-gray-400">수익률:</span>
        {[
          { label: '+10%↑', cls: 'bg-green-700' },
          { label: '+5%', cls: 'bg-green-500' },
          { label: '+2%', cls: 'bg-green-300' },
          { label: '0%↑', cls: 'bg-green-100' },
          { label: '0%↓', cls: 'bg-red-100' },
          { label: '-2%', cls: 'bg-red-300' },
          { label: '-5%', cls: 'bg-red-500' },
          { label: '-10%↓', cls: 'bg-red-700' },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1 text-xs text-gray-500">
            <span className={`inline-block w-3 h-3 rounded ${item.cls}`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
