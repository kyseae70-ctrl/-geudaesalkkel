import type { ETFReturnMap } from '@/types';

interface Props {
  returns: ETFReturnMap;
}

const PERIOD_LABELS: { key: keyof ETFReturnMap; label: string }[] = [
  { key: '1m',  label: '1개월' },
  { key: '3m',  label: '3개월' },
  { key: '6m',  label: '6개월' },
  { key: 'ytd', label: 'YTD'   },
  { key: '1y',  label: '1년'   },
  { key: '3y',  label: '3년'   },
  { key: '5y',  label: '5년'   },
  { key: 'max', label: '전체'  },
];

export default function ETFReturnGrid({ returns }: Props) {
  const hasData = PERIOD_LABELS.some(({ key }) => returns[key] != null);

  if (!hasData) {
    return (
      <div className="text-center py-10 text-sm text-gray-400">
        수익률 데이터를 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {PERIOD_LABELS.map(({ key, label }) => {
        const value = returns[key];
        if (value == null) return null;
        const isPositive = value >= 0;
        return (
          <div
            key={key}
            className={`rounded-xl p-4 ${
              isPositive ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p
              className={`text-xl font-bold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '+' : ''}{value.toFixed(2)}%
            </p>
          </div>
        );
      })}
    </div>
  );
}
