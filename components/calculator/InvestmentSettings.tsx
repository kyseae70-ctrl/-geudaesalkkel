'use client';

import { InvestmentSettings } from '@/types';

interface InvestmentSettingsProps {
  settings: InvestmentSettings;
  onChange: (settings: InvestmentSettings) => void;
}

const QUICK_PERIODS = [
  { label: '1년', years: 1 },
  { label: '3년', years: 3 },
  { label: '5년', years: 5 },
  { label: '10년', years: 10 },
];

const FREQUENCY_OPTIONS: { value: InvestmentSettings['frequency']; label: string }[] = [
  { value: 'monthly', label: '매월' },
  { value: 'weekly', label: '매주' },
  { value: 'daily', label: '매일' },
];

export default function InvestmentSettingsForm({ settings, onChange }: InvestmentSettingsProps) {
  function update(partial: Partial<InvestmentSettings>) {
    onChange({ ...settings, ...partial });
  }

  function applyQuickPeriod(years: number) {
    const end = new Date();
    end.setDate(end.getDate() - 1); // 어제까지
    const start = new Date(end);
    start.setFullYear(start.getFullYear() - years);
    update({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    });
  }

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-700">투자 조건 설정</h3>

      {/* 적립 주기 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">적립 주기</label>
        <div className="flex gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ frequency: opt.value })}
              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                settings.frequency === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1회 적립 금액 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">1회 적립 금액</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
          <input
            type="number"
            min={1}
            max={100000}
            value={settings.amount}
            onChange={(e) => update({ amount: Math.max(1, Number(e.target.value)) })}
            className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 mt-2">
          {[100, 500, 1000, 5000].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => update({ amount: v })}
              className={`flex-1 py-1 text-xs rounded border transition-colors ${
                settings.amount === v
                  ? 'bg-blue-50 text-blue-600 border-blue-400'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              ${v}
            </button>
          ))}
        </div>
      </div>

      {/* 투자 기간 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-gray-500">투자 기간</label>
          <div className="flex gap-1">
            {QUICK_PERIODS.map((p) => (
              <button
                key={p.years}
                type="button"
                onClick={() => applyQuickPeriod(p.years)}
                className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={settings.startDate}
            max={settings.endDate}
            onChange={(e) => update({ startDate: e.target.value })}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400 text-sm shrink-0">~</span>
          <input
            type="date"
            value={settings.endDate}
            min={settings.startDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => update({ endDate: e.target.value })}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 배당금 재투자 */}
      <div className="flex items-center justify-between py-3 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-700">배당금 재투자</p>
          <p className="text-xs text-gray-400">배당금을 해당 ETF에 즉시 재투자</p>
        </div>
        <button
          type="button"
          onClick={() => update({ reinvestDividends: !settings.reinvestDividends })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.reinvestDividends ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              settings.reinvestDividends ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
