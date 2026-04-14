export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'ETF 선택',
      desc: 'QQQ, SCHD, SPY 등 원하는 ETF를 검색하고 비중을 설정하세요.',
      icon: '🔍',
    },
    {
      num: '02',
      title: '투자 조건 설정',
      desc: '적립 금액과 기간, 주기(매월/매주/매일)를 입력하세요.',
      icon: '⚙️',
    },
    {
      num: '03',
      title: '결과 확인',
      desc: '수익률, 차트, 히트맵으로 과거 성과를 한눈에 확인하세요.',
      icon: '📊',
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">사용 방법</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center space-y-3">
              <div className="text-4xl">{step.icon}</div>
              <div className="text-xs font-bold text-blue-600 tracking-widest">{step.num}</div>
              <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
