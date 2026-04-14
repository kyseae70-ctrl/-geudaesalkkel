import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-block bg-blue-600/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-500/30">
          미국 ETF 적립식 백테스트 계산기
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          그때 샀다면
          <br />
          <span className="text-red-400">지금쯤...</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
          과거 특정 시점부터 미국 ETF를 꾸준히 적립했다면
          <br />
          지금 얼마가 됐을지 계산해보세요.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/calculator"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-lg"
          >
            지금 바로 계산해보기
          </Link>
          <p className="text-sm text-gray-400">무료 · 회원가입 불필요</p>
        </div>

        {/* 실제 백테스트 예시 수치 카드 (2015~2025 월 $1,000 DCA 기준) */}
        <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto">
          {[
            { ticker: 'QQQ', period: '10년', return: '+35.3%' },
            { ticker: 'SCHD', period: '10년', return: '+32.4%' },
            { ticker: 'SPY', period: '10년', return: '+27.7%' },
          ].map((item) => (
            <div key={item.ticker} className="bg-white/10 rounded-xl p-3">
              <div className="font-mono font-bold text-white">{item.ticker}</div>
              <div className="text-xs text-gray-400">{item.period} 적립</div>
              <div className="text-red-400 font-bold text-lg">{item.return}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">* 2015~2025년 월 $1,000 적립 기준 실제 데이터</p>
      </div>
    </section>
  );
}
