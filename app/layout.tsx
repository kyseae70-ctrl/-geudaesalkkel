import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '그때살껄 — 미국 ETF 적립식 백테스트',
  description: '그때 샀다면 지금쯤... 과거 특정 시점부터 미국 ETF를 꾸준히 적립했다면 지금 얼마가 됐을지 계산해보세요.',
  openGraph: {
    title: '그때살껄 — 미국 ETF 적립식 백테스트',
    description: '그때 샀다면 지금쯤... QQQ, SCHD, SPY 등 미국 ETF 백테스트 계산기',
    siteName: '그때살껄',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
