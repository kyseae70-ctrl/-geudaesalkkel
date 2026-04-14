import Link from 'next/link';
import { PORTFOLIO_TEMPLATES } from '@/lib/etf-list';

export default function TemplateCards() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">추천 포트폴리오</h2>
        <p className="text-sm text-gray-500 text-center mb-8">클릭 한 번으로 바로 백테스트</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTFOLIO_TEMPLATES.map((template) => {
            const params = new URLSearchParams({
              holdings: JSON.stringify(template.holdings),
            });
            return (
              <Link
                key={template.id}
                href={`/calculator?${params.toString()}`}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{template.emoji}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">바로 계산</span>
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {template.holdings.map((h) => (
                    <span
                      key={h.ticker}
                      className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                    >
                      {h.ticker} {h.weight}%
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
