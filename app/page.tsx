import Hero from '@/components/landing/Hero';
import TemplateCards from '@/components/landing/TemplateCards';
import HowItWorks from '@/components/landing/HowItWorks';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <TemplateCards />

      {/* CTA 섹션 */}
      <section className="py-16 px-4 bg-gray-900 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">후회는 계산 이후에</h2>
        <p className="text-gray-400 mb-6 text-sm">내가 버텼다면 얼마였을까? 지금 확인해보세요.</p>
        <Link
          href="/calculator"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
        >
          계산기 시작하기
        </Link>
      </section>
    </main>
  );
}
