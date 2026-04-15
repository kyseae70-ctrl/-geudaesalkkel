import type { ETFMeta } from '@/types';

interface Props {
  meta: ETFMeta;
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function ETFMetaCards({ meta }: Props) {
  const formatAum = (aum: number | null | undefined) => {
    if (aum == null) return '-';
    if (aum >= 100) return `$${Math.round(aum)}B`;
    if (aum >= 1)   return `$${aum.toFixed(1)}B`;
    return `$${(aum * 1000).toFixed(0)}M`;
  };

  const formatDate = (d: string | null | undefined) => {
    if (!d) return '-';
    const [y, m, day] = d.split('-');
    return `${y}.${m}.${day}`;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 divide-y divide-gray-100">
      {meta.index_name && (
        <MetaRow label="추종 지수" value={meta.index_name} />
      )}
      <MetaRow
        label="연간 수수료"
        value={meta.expense_ratio != null ? `${meta.expense_ratio}%` : '-'}
      />
      <MetaRow
        label="운용 자산(AUM)"
        value={formatAum(meta.aum_billion)}
      />
      <MetaRow
        label="상장일"
        value={formatDate(meta.inception_date)}
      />
      {meta.holdings_count != null && (
        <MetaRow
          label="구성 종목 수"
          value={`${meta.holdings_count.toLocaleString()}종목`}
        />
      )}
      <MetaRow label="카테고리" value={meta.category} />
    </div>
  );
}
