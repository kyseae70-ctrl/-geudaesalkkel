import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | 그때살껄',
};

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">이용약관</h1>
        <p className="text-sm text-gray-400">최종 수정일: 2026년 4월 14일</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">제1조 (목적)</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          본 약관은 그때살껄(이하 "서비스")이 제공하는 미국 ETF 적립식 백테스트 계산 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무 관계를 규정함을 목적으로 합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">제2조 (서비스 내용)</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          서비스는 과거 주가 데이터를 기반으로 미국 ETF 적립식 투자(Dollar-Cost Averaging)의 가상 수익률을 계산하여 제공합니다. 모든 계산 결과는 시뮬레이션이며 실제 투자 성과와 다를 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">제3조 (투자 비자문 고지)</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-yellow-800 font-medium">⚠️ 중요 고지사항</p>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside leading-relaxed">
            <li>본 서비스는 투자 자문, 투자 권유, 금융 상품 판매 서비스가 아닙니다.</li>
            <li>과거 수익률은 미래의 수익을 보장하지 않습니다.</li>
            <li>모든 투자 결정과 그에 따른 손익은 이용자 본인에게 귀속됩니다.</li>
            <li>투자 전 해당 금융 상품의 투자설명서를 반드시 확인하시기 바랍니다.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">제4조 (금지 행위)</h2>
        <p className="text-sm text-gray-600 leading-relaxed">이용자는 다음 행위를 해서는 안 됩니다.</p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside leading-relaxed">
          <li>서비스의 계산 결과를 사실인 것처럼 제3자에게 투자를 권유하는 행위</li>
          <li>서비스를 상업적 목적으로 무단 이용하는 행위</li>
          <li>서비스의 정상적인 운영을 방해하는 행위</li>
          <li>기타 관계 법령을 위반하는 행위</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">제5조 (데이터 출처 및 정확성)</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          주가 데이터는 Yahoo Finance에서 제공받으며, 데이터의 정확성·완전성·적시성을 보장하지 않습니다. 배당금 처리, 주식 분할 등의 이유로 실제 수익률과 차이가 있을 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">제6조 (서비스 변경 및 중단)</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          서비스는 사전 고지 없이 서비스의 내용을 변경하거나 중단할 수 있습니다. 서비스 중단으로 인해 발생하는 손해에 대해 별도의 보상을 하지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">제7조 (면책)</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          서비스는 이용자가 본 서비스의 계산 결과를 기반으로 내린 투자 결정으로 인해 발생한 손실에 대해 어떠한 법적 책임도 지지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">제8조 (준거법)</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          본 약관은 대한민국 법령에 따라 해석되고 적용됩니다.
        </p>
      </section>
    </main>
  );
}
