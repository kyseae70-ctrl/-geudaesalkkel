'use client';

import { useRef, useState } from 'react';
import { BacktestResult, Holding, InvestmentSettings } from '@/types';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { encodeShareUrl } from '@/lib/share';

interface ShareCardProps {
  result: BacktestResult;
  holdings: Holding[];
  settings: InvestmentSettings;
}

export default function ShareCard({ result, holdings, settings }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { summary } = result;
  const portfolioDesc = holdings.map((h) => `${h.ticker} ${h.weight}%`).join(' + ');

  // 공유 URL 생성
  function getShareUrl(): string {
    const path = encodeShareUrl(holdings, settings);
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${path}`;
    }
    return path;
  }

  async function downloadImage() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = '그때살껄_결과.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  async function copyUrl() {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setTimeout(() => setCopying(false), 2000);
    } catch {
      setCopying(false);
    }
  }

  function shareNative() {
    const shareUrl = getShareUrl();
    const text = `${portfolioDesc} 적립했다면 ${formatPercent(summary.portfolioReturn)} 수익! 그때살껄...`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: '그때살껄 백테스트 결과', text, url: shareUrl });
    } else {
      // Web Share API 미지원 시 URL 복사
      navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사됐습니다. 카카오톡에 붙여넣기 하세요!');
    }
  }

  function shareX() {
    const text = encodeURIComponent(
      `${portfolioDesc} 적립했다면 ${formatPercent(summary.portfolioReturn)} 수익!\n그때살껄...\n${getShareUrl()}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }

  return (
    <div className="space-y-4">
      {/* 공유 카드 미리보기 */}
      <div
        ref={cardRef}
        className="bg-gray-900 text-white rounded-2xl p-6 max-w-sm mx-auto"
        style={{ fontFamily: 'sans-serif' }}
      >
        <div className="text-2xl mb-3">😱 그때살껄...</div>
        <div className="text-sm text-gray-300 mb-4">{portfolioDesc}</div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">투자 원금</span>
            <span className="font-semibold">{formatCurrency(summary.totalInvested)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">최종 평가액</span>
            <span className="font-bold text-red-400 text-lg">{formatCurrency(summary.portfolioValue)} 🚀</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">수익률</span>
            <span className="font-bold text-red-400">{formatPercent(summary.portfolioReturn)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">연평균 (CAGR)</span>
            <span className="font-semibold text-yellow-400">{formatPercent(summary.cagr)}</span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3 text-xs text-gray-400 flex justify-between">
          <span>S&P500이었다면 {formatCurrency(summary.benchmarkValue)}</span>
          <span className={summary.portfolioValue >= summary.benchmarkValue ? 'text-green-400' : 'text-orange-400'}>
            {summary.portfolioValue >= summary.benchmarkValue
              ? `+${formatCurrency(summary.portfolioValue - summary.benchmarkValue)} 더!`
              : `${formatCurrency(summary.benchmarkValue - summary.portfolioValue)} 손해`}
          </span>
        </div>

        <div className="mt-3 text-center text-xs text-gray-500">geudaesalkkel.com</div>
      </div>

      {/* 공유 버튼 */}
      <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
        <button
          onClick={downloadImage}
          disabled={downloading}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {downloading ? '저장 중...' : 'PNG 저장'}
        </button>
        <button
          onClick={copyUrl}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {copying ? '복사됨!' : 'URL 복사'}
        </button>
        <button
          onClick={shareNative}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-yellow-400 text-yellow-900 text-sm font-medium hover:bg-yellow-500 transition-colors"
        >
          카카오톡 공유
        </button>
        <button
          onClick={shareX}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          X (트위터) 공유
        </button>
      </div>
    </div>
  );
}
