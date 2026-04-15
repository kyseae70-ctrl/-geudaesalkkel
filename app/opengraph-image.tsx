import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '그때살껄 — 미국 ETF 적립식 백테스트';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          padding: '80px',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(59,130,246,0.2)',
            border: '1px solid rgba(59,130,246,0.4)',
            borderRadius: '9999px',
            padding: '8px 24px',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: '#93c5fd', fontSize: '18px', fontWeight: 600 }}>
            미국 ETF 적립식 백테스트 계산기
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '40px',
          }}
        >
          <div style={{ color: '#f9fafb', fontSize: '72px', fontWeight: 800, letterSpacing: '-2px' }}>
            그때살껄
          </div>
          <div style={{ color: '#fc8181', fontSize: '40px', fontWeight: 700 }}>
            그때 샀다면 지금쯤...
          </div>
        </div>

        {/* Example stats row */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '48px' }}>
          {[
            { ticker: 'QQQ', label: '나스닥 100', value: '$177,693' },
            { ticker: 'SCHD', label: '배당 성장', value: '$98,441' },
            { ticker: 'SPY', label: 'S&P 500', value: '$120,578' },
          ].map((item) => (
            <div
              key={item.ticker}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '20px 28px',
                alignItems: 'flex-start',
                minWidth: '180px',
              }}
            >
              <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, fontFamily: 'monospace' }}>
                {item.ticker}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ color: '#9ca3af', fontSize: '13px' }}>원금 $60,000 →</div>
              <div style={{ color: '#f87171', fontSize: '28px', fontWeight: 800 }}>{item.value}</div>
              <div style={{ color: '#86efac', fontSize: '12px', marginTop: '4px' }}>월 $500 · 10년</div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div style={{ color: '#6b7280', fontSize: '18px' }}>
          geudaesalkkel.com · 무료 · 회원가입 불필요
        </div>
      </div>
    ),
    { ...size }
  );
}
