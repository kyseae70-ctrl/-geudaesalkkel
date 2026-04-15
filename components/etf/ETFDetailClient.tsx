'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORY_COLORS, CATEGORY_EMOJI } from '@/lib/etf-list';
import type { ETFDetail, PriceRow } from '@/types';
import ETFPriceChart from './ETFPriceChart';
import ETFMetaCards from './ETFMetaCards';
import ETFReturnGrid from './ETFReturnGrid';
import ETFDividendSection from './ETFDividendSection';
import ETFHoldingsTable from './ETFHoldingsTable';
import ETFSectorChart from './ETFSectorChart';

type Tab = '기본정보' | '수익률' | '배당' | '구성종목';
const TABS: Tab[] = ['기본정보', '수익률', '배당', '구성종목'];

interface Props {
  detail: ETFDetail;
  prices: PriceRow[];
}

export default function ETFDetailClient({ detail, prices }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('기본정보');
  const { meta, returns, holdings, sectors } = detail;

  const categoryColor = CATEGORY_COLORS[meta.category] ?? 'bg-gray-100 text-gray-700';
  const categoryEmoji = CATEGORY_EMOJI[meta.category] ?? '📊';
  const isLeverage    = meta.category === '레버리지';

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* 뒤로가기 */}
      <Link
        href="/etf"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        ETF 목록으로
      </Link>

      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
            {categoryEmoji} {meta.category}
          </span>
          {isLeverage && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
              ⚠️ 고위험 상품
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold font-mono text-gray-900">{meta.ticker}</h1>
        <p className="text-base font-medium text-gray-700">{meta.name_ko}</p>
        <p className="text-sm text-gray-400">{meta.name_en}</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === '기본정보' && (
        <div className="space-y-6">
          {/* 가격 차트 */}
          <ETFPriceChart prices={prices} />

          {/* ETF 개요 메타 */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">ETF 개요</h2>
            <ETFMetaCards meta={meta} />
          </div>

          {/* 투자전략 */}
          {meta.description && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-700">투자전략</h2>
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-600 leading-relaxed">{meta.description}</p>
              </div>
            </div>
          )}

          {/* 레버리지 경고 */}
          {isLeverage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
              <p className="text-sm font-semibold text-red-700">레버리지/인버스 ETF 주의사항</p>
              <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                <li>매일 리셋되는 구조로 장기 보유 시 지수 수익률과 크게 달라질 수 있습니다</li>
                <li>변동성이 높을수록 변동성 손실(volatility decay)이 발생합니다</li>
                <li>단기 전술적 투자 목적으로 설계된 상품입니다</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === '수익률' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            * 기준: 최신 종가 기준 기간별 단순 가격 수익률 (배당 미포함)
          </p>
          <ETFReturnGrid returns={returns} />
        </div>
      )}

      {activeTab === '배당' && (
        <ETFDividendSection prices={prices} ticker={meta.ticker} />
      )}

      {activeTab === '구성종목' && (
        <div className="space-y-6">
          {holdings.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-700">
                구성종목 TOP {holdings.length}
              </h2>
              <ETFHoldingsTable holdings={holdings} />
            </div>
          )}
          {sectors.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">섹터 비중</h2>
              <ETFSectorChart sectors={sectors} />
            </div>
          )}
          {holdings.length === 0 && sectors.length === 0 && (
            <div className="text-center py-10 text-sm text-gray-400">
              구성종목 데이터가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white space-y-3">
        <p className="font-semibold">그때 {meta.ticker}를 샀다면?</p>
        <p className="text-sm text-blue-100">
          과거 어느 시점부터 매달 투자했다면 지금 얼마가 됐는지 확인해보세요.
        </p>
        <Link
          href={`/calculator?tickers=${meta.ticker}`}
          className="inline-block bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors"
        >
          {meta.ticker} 백테스트 시작하기
        </Link>
      </div>

      {/* 면책 고지 */}
      <p className="text-xs text-gray-400 leading-relaxed border-t pt-4">
        본 페이지의 ETF 정보는 투자 자문이 아니며 참고용으로만 활용하시기 바랍니다.
        수익률은 과거 데이터 기준이며 미래 수익을 보장하지 않습니다.
        투자 결정 전 운용사 공식 자료를 반드시 확인하세요.
      </p>
    </main>
  );
}
