import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export const metadata: Metadata = {
  title: '백테스트 결과 — 그때살껄',
  description: '미국 ETF 적립식 백테스트 결과를 확인하세요.',
};

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="text-5xl">🔗</div>
        <h1 className="text-2xl font-bold text-gray-800">공유된 결과 페이지</h1>
        <p className="text-gray-500 text-sm">
          URL 파라미터 기반 결과 공유 기능은 준비 중입니다.
          <br />
          계산기에서 직접 결과를 확인해보세요.
        </p>
        <Link
          href="/calculator"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          계산기로 이동
        </Link>
      </div>
    </Suspense>
  );
}
