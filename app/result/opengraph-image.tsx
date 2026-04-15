import { ImageResponse } from 'next/og';
import { decodeShareParams } from '@/lib/share';
import { runBacktest } from '@/lib/backtest';
import { fetchPricesFromSupabase } from '@/lib/prices';

export const runtime = 'edge';
export const alt = '백테스트 결과 — 그때살껄';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtPct(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function Image({ searchParams }: Props) {
  const params = await searchParams;
  const decoded = decodeShareParams(params);

  // 파라미터 없거나 잘못됨 → 기본 브랜딩 이미지
  if (!decoded) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ color: '#f9fafb', fontSize: '72px', fontWeight: 800 }}>그때살껄</div>
          <div style={{ color: '#fc8181', fontSize: '36px', fontWeight: 600, marginTop: '16px' }}>
            그때 샀다면 지금쯤...
          </div>
        </div>
      ),
      { ...size }
    );
  }

  const { holdings, settings } = decoded;

  let summary;
  try {
    const result = await runBacktest(holdings, settings, fetchPricesFromSupabase);
    summary = result.summary;
  } catch {
    summary = null;
  }

  const portfolioDesc =
    holdings.length === 1
      ? holdings[0].ticker
      : holdings.length === 2
      ? `${holdings[0].ticker} + ${holdings[1].ticker}`
      : `${holdings[0].ticker} 외 ${holdings.length - 1}종목`;

  const freqLabel =
    settings.frequency === 'monthly' ? '매달' : settings.frequency === 'weekly' ? '매주' : '매일';

  const startYear = settings.startDate.slice(0, 4);
  const endYear = settings.endDate.slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          fontFamily: 'sans-serif',
          padding: '64px 72px',
        }}
      >
        {/* Top: brand + portfolio info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#93c5fd', fontSize: '18px', fontWeight: 600 }}>그때살껄</span>
            <span style={{ color: '#374151', fontSize: '18px' }}>·</span>
            <span style={{ color: '#6b7280', fontSize: '18px' }}>미국 ETF 적립식 백테스트</span>
          </div>
          <div style={{ color: '#f9fafb', fontSize: '38px', fontWeight: 800, letterSpacing: '-1px' }}>
            {portfolioDesc}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '20px' }}>
            {startYear}~{endYear}년 {freqLabel} {fmt(settings.amount)} 적립
          </div>
        </div>

        {/* Middle: main result */}
        {summary ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
              <div
                style={{
                  color: '#9ca3af',
                  fontSize: '44px',
                  fontWeight: 700,
                  textDecoration: 'line-through',
                }}
              >
                {fmt(summary.totalInvested)}
              </div>
              <div style={{ color: '#6b7280', fontSize: '36px', marginBottom: '6px' }}>→</div>
              <div style={{ color: '#f87171', fontSize: '72px', fontWeight: 800, letterSpacing: '-2px' }}>
                {fmt(summary.portfolioValue)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                }}
              >
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>총 수익률</span>
                <span
                  style={{
                    color: summary.portfolioReturn >= 0 ? '#34d399' : '#f87171',
                    fontSize: '28px',
                    fontWeight: 800,
                  }}
                >
                  {fmtPct(summary.portfolioReturn)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                }}
              >
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>연평균 수익률 (CAGR)</span>
                <span
                  style={{
                    color: summary.cagr >= 0 ? '#34d399' : '#f87171',
                    fontSize: '28px',
                    fontWeight: 800,
                  }}
                >
                  {fmtPct(summary.cagr)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                }}
              >
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>원금 대비</span>
                <span style={{ color: '#facc15', fontSize: '28px', fontWeight: 800 }}>
                  {(summary.portfolioValue / summary.totalInvested).toFixed(1)}배
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#9ca3af', fontSize: '28px' }}>결과를 불러올 수 없습니다.</div>
        )}

        {/* Bottom: disclaimer */}
        <div style={{ color: '#4b5563', fontSize: '14px' }}>
          과거 수익률이 미래 수익을 보장하지 않습니다 · geudaesalkkel.com
        </div>
      </div>
    ),
    { ...size }
  );
}
