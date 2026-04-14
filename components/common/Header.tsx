import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">그때살껄</span>
          <span className="text-xs text-gray-400 hidden sm:block">미국 ETF 백테스트</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/etf"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            ETF 목록
          </Link>
          <Link
            href="/calculator"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            계산기
          </Link>
          <Link
            href="/calculator"
            className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
          >
            지금 계산하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
