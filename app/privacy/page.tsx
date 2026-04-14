import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 그때살껄',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">개인정보처리방침</h1>
        <p className="text-sm text-gray-400">최종 수정일: 2026년 4월 14일</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 leading-relaxed">
          그때살껄은 회원가입이 없는 서비스로, 이용자의 개인정보를 수집·저장하지 않습니다. 입력한 포트폴리오 설정값은 브라우저 내에서만 처리되며 서버에 저장되지 않습니다.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">1. 수집하는 정보</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          서비스는 다음과 같은 최소한의 정보만을 처리합니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-3 py-2 border border-gray-200 font-medium text-gray-700">항목</th>
                <th className="text-left px-3 py-2 border border-gray-200 font-medium text-gray-700">목적</th>
                <th className="text-left px-3 py-2 border border-gray-200 font-medium text-gray-700">보관</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-gray-200 text-gray-600">서버 접속 로그 (IP, 접속 시간)</td>
                <td className="px-3 py-2 border border-gray-200 text-gray-600">서비스 안정성 유지</td>
                <td className="px-3 py-2 border border-gray-200 text-gray-600">Vercel 인프라 자동 처리</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-3 py-2 border border-gray-200 text-gray-600">백테스트 API 요청 파라미터</td>
                <td className="px-3 py-2 border border-gray-200 text-gray-600">계산 결과 제공</td>
                <td className="px-3 py-2 border border-gray-200 text-gray-600">저장하지 않음</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">2. 수집하지 않는 정보</h2>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside leading-relaxed">
          <li>이름, 이메일, 전화번호 등 식별 가능한 개인정보</li>
          <li>금융 계좌 정보</li>
          <li>결제 정보</li>
          <li>위치 정보</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">3. 쿠키 및 로컬 스토리지</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          서비스는 별도의 쿠키를 발급하지 않습니다. 공유 URL 파라미터는 URL 쿼리스트링으로만 전달되며 브라우저에 저장되지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">4. 제3자 서비스</h2>
        <p className="text-sm text-gray-600 leading-relaxed">서비스는 다음 제3자 서비스를 이용합니다.</p>
        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside leading-relaxed">
          <li><span className="font-medium">Vercel</span> — 호스팅 및 서버 인프라. 접속 로그가 Vercel 정책에 따라 처리됩니다.</li>
          <li><span className="font-medium">Supabase</span> — 주가 데이터 저장소. 이용자 데이터는 저장하지 않습니다.</li>
          <li><span className="font-medium">Yahoo Finance</span> — 주가 데이터 원천. 이용자 정보는 전달되지 않습니다.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">5. 방침 변경</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          개인정보처리방침이 변경될 경우 본 페이지에 수정일을 업데이트하여 고지합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">6. 문의</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          개인정보 관련 문의사항은 서비스 내 피드백 채널을 통해 연락해주시기 바랍니다.
        </p>
      </section>
    </main>
  );
}
