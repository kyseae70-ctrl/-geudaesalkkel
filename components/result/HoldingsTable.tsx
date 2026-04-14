import { HoldingResult } from '@/types';
import { formatPercent } from '@/lib/formatters';

interface HoldingsTableProps {
  holdings: HoldingResult[];
}

export default function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 pr-4 text-gray-500 font-medium">티커</th>
            <th className="text-right py-2 px-4 text-gray-500 font-medium">비중</th>
            <th className="text-right py-2 px-4 text-gray-500 font-medium">기여도</th>
            <th className="text-right py-2 px-4 text-gray-500 font-medium">개별 수익률</th>
            <th className="text-right py-2 pl-4 text-gray-500 font-medium">개별 CAGR</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.ticker} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 pr-4">
                <span className="font-mono font-bold text-blue-700">{h.ticker}</span>
              </td>
              <td className="py-3 px-4 text-right text-gray-600">{h.weight}%</td>
              <td className="py-3 px-4 text-right">
                <span className="text-gray-800 font-medium">{h.contribution.toFixed(1)}%</span>
              </td>
              <td className="py-3 px-4 text-right">
                <span className={`font-semibold ${h.individualReturn >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatPercent(h.individualReturn)}
                </span>
              </td>
              <td className="py-3 pl-4 text-right">
                <span className={`font-medium ${h.individualCagr >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatPercent(h.individualCagr)}/년
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
