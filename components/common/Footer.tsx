import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-gray-700">그때살껄 (GeudaeSalkkel)</p>
          <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto">
            본 서비스는 과거 데이터 기반 시뮬레이션으로, 실제 투자 결과와 다를 수 있습니다.
            과거 수익률이 미래 수익을 보장하지 않으며, 투자 손실에 대한 책임은 투자자 본인에게 있습니다.
            본 서비스는 투자 자문이 아닙니다.
          </p>
          <p className="text-xs text-gray-400">데이터 출처: Yahoo Finance</p>
          <div className="flex items-center justify-center gap-4 pt-1">
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              이용약관
            </Link>
            <span className="text-gray-300 text-xs">|</span>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
