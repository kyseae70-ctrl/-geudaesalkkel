# CLAUDE.md — 그때살껄 (GeudaeSalkkel) 개발 가이드

> Claude Code가 새 세션을 시작할 때 이 파일을 반드시 먼저 읽고 시작할 것.
> 모든 개발 결정은 이 문서를 기준으로 한다.

---

## 1. 프로젝트 개요

**서비스명**: 그때살껄 (GeudaeSalkkel)
**슬로건**: "그때 샀다면 지금쯤..."
**한 줄 정의**: 미국 ETF 포트폴리오를 과거 특정 시점부터 적립식으로 매수했다면 현재 얼마가 됐을지 계산해주는 백테스트 웹 서비스
**도메인**: geudaesalkkel.com (예정)
**타겟**: 미국 ETF에 관심 있는 한국 4050 투자자

---

## 2. 기술 스택

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Chart**: Chart.js + react-chartjs-2
- **배포**: Vercel

### 백엔드 / 데이터
- **DB**: Supabase (PostgreSQL)
- **인증**: Supabase Auth (2단계~)
- **계산 엔진**: Next.js API Route (서버사이드)
- **데이터 업데이트**: n8n 스케줄러 (매일 장 마감 후 자동)

### 환경변수 (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=여기에_입력
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_입력
SUPABASE_SERVICE_ROLE_KEY=여기에_입력
```

> Supabase 프로젝트 생성 후 위 값을 채울 것. 생성 전까지 mock 데이터로 개발 진행.

---

## 3. 폴더 구조

```
geudaesalkkel/
├── CLAUDE.md                   ← 이 파일 (항상 먼저 읽기)
├── .env.local                  ← 환경변수 (git 제외)
├── .env.example                ← 환경변수 예시 (git 포함)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
│
├── app/
│   ├── layout.tsx              ← 루트 레이아웃 (폰트, 메타태그)
│   ├── page.tsx                ← 랜딩 페이지 /
│   ├── calculator/
│   │   └── page.tsx            ← 계산기 페이지 /calculator
│   ├── result/
│   │   └── page.tsx            ← 공유용 결과 페이지 /result
│   ├── etf/
│   │   └── [ticker]/
│   │       └── page.tsx        ← ETF 정보 페이지 (2단계)
│   ├── popular/
│   │   └── page.tsx            ← 인기 포트폴리오 (2단계)
│   └── api/
│       ├── backtest/
│       │   └── route.ts        ← DCA 계산 엔진 API (핵심)
│       ├── etf/
│       │   └── route.ts        ← ETF 목록 검색 API
│       └── prices/
│           └── route.ts        ← 주가 데이터 조회 API
│
├── components/
│   ├── calculator/
│   │   ├── PortfolioBuilder.tsx   ← ETF 추가 + 비중 설정
│   │   ├── InvestmentSettings.tsx ← 금액/기간/주기 설정
│   │   └── ETFSearch.tsx          ← ETF 검색 자동완성
│   ├── result/
│   │   ├── MetricCards.tsx        ← 핵심 지표 카드
│   │   ├── LineChart.tsx          ← 누적 평가금액 비교 차트
│   │   ├── HeatmapChart.tsx       ← 월별 수익률 히트맵
│   │   ├── DonutChart.tsx         ← 종목별 기여도 도넛
│   │   ├── HoldingsTable.tsx      ← 종목별 수익률 테이블
│   │   └── ShareCard.tsx          ← 공유 카드 + 버튼
│   ├── landing/
│   │   ├── Hero.tsx               ← 히어로 섹션
│   │   ├── TemplateCards.tsx      ← 추천 포트폴리오 템플릿
│   │   └── HowItWorks.tsx         ← 사용 방법 3단계
│   └── common/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── LoadingSpinner.tsx
│
├── lib/
│   ├── supabase.ts             ← Supabase 클라이언트
│   ├── backtest.ts             ← DCA 계산 핵심 로직
│   ├── formatters.ts           ← 숫자/날짜 포맷 유틸
│   ├── mock-data.ts            ← Supabase 준비 전 mock 주가 데이터
│   └── etf-list.ts             ← 지원 ETF 50종목 상수
│
├── types/
│   └── index.ts                ← 공통 타입 정의
│
└── scripts/
    └── seed-prices.py          ← 주가 데이터 초기 수집 스크립트
```

---

## 4. Supabase DB 스키마

### 테이블 1: `etf_list`
```sql
CREATE TABLE etf_list (
  ticker        TEXT PRIMARY KEY,
  name_ko       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  category      TEXT NOT NULL,
  description   TEXT,
  expense_ratio NUMERIC,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 테이블 2: `etf_prices` (핵심 — 선탑재 데이터)
```sql
CREATE TABLE etf_prices (
  ticker    TEXT NOT NULL,
  date      DATE NOT NULL,
  close     NUMERIC NOT NULL,
  dividend  NUMERIC DEFAULT 0,
  PRIMARY KEY (ticker, date),
  FOREIGN KEY (ticker) REFERENCES etf_list(ticker)
);

CREATE INDEX idx_etf_prices_ticker_date ON etf_prices(ticker, date);
```

### 테이블 3: `portfolios` (2단계)
```sql
CREATE TABLE portfolios (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id),
  name       TEXT NOT NULL,
  holdings   JSONB NOT NULL,
  settings   JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 테이블 4: `backtest_logs` (인기 포트폴리오 집계용 — 2단계)
```sql
CREATE TABLE backtest_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holdings   JSONB NOT NULL,
  settings   JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. API Route 명세

### POST `/api/backtest` (핵심)

**Request**:
```json
{
  "holdings": [
    { "ticker": "QQQ", "weight": 50 },
    { "ticker": "SCHD", "weight": 50 }
  ],
  "amount": 1000,
  "frequency": "monthly",
  "startDate": "2015-01-01",
  "endDate": "2025-04-09",
  "reinvestDividends": true
}
```

**Response**:
```json
{
  "summary": {
    "totalInvested": 123000,
    "portfolioValue": 487230,
    "portfolioReturn": 296.1,
    "cagr": 15.2,
    "benchmarkValue": 298000,
    "benchmarkReturn": 142.3,
    "benchmarkCagr": 9.8,
    "excessReturn": 153.8,
    "totalDividends": 23400,
    "investmentCount": 123,
    "dayCount": 3752
  },
  "chartData": {
    "labels": ["2015-01", "2015-02"],
    "portfolio": [1000, 1980],
    "benchmark": [1000, 1850]
  },
  "heatmap": {
    "2015": { "1": 2.3, "2": -1.1 }
  },
  "holdings": [
    {
      "ticker": "QQQ",
      "weight": 50,
      "contribution": 62.3,
      "individualReturn": 412.5,
      "individualCagr": 18.1
    }
  ]
}
```

### GET `/api/etf?q=검색어`
- Supabase `etf_list`에서 ticker / name_ko 기준 검색
- 최대 10개 반환

---

## 6. 핵심 타입 정의 (`types/index.ts`)

```typescript
export interface Holding {
  ticker: string;
  weight: number;
}

export interface InvestmentSettings {
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  reinvestDividends: boolean;
}

export interface BacktestRequest {
  holdings: Holding[];
  settings: InvestmentSettings;
}

export interface BacktestSummary {
  totalInvested: number;
  portfolioValue: number;
  portfolioReturn: number;
  cagr: number;
  benchmarkValue: number;
  benchmarkReturn: number;
  benchmarkCagr: number;
  excessReturn: number;
  totalDividends: number;
  investmentCount: number;
  dayCount: number;
}

export interface BacktestResult {
  summary: BacktestSummary;
  chartData: {
    labels: string[];
    portfolio: number[];
    benchmark: number[];
  };
  heatmap: Record<string, Record<string, number>>;
  holdings: HoldingResult[];
}

export interface HoldingResult extends Holding {
  contribution: number;
  individualReturn: number;
  individualCagr: number;
}

export interface ETFInfo {
  ticker: string;
  name_ko: string;
  name_en: string;
  category: string;
  description?: string;
  expense_ratio?: number;
}
```

---

## 7. 주요 계산 규칙 (`lib/backtest.ts` 구현 기준)

```
1. 적립일 결정
   - monthly: 매월 1일 (주말/공휴일이면 다음 영업일)
   - weekly: 매주 월요일 (공휴일이면 다음 영업일)
   - daily: 모든 영업일 (주말 제외)

2. 매수 수량
   - 소수점 주식 허용 (fractional shares)
   - 매수 수량 = 투자금액 / 당일 종가

3. 배당금 처리 (reinvestDividends: true 시)
   - dividend > 0인 날: 보유 수량 × 배당금 → 해당 ETF 추가 매수

4. 월별 평가금액
   - 매월 말일 기준 (보유 수량 × 해당일 종가)

5. 벤치마크 (SPY 고정)
   - 동일 amount, frequency, 기간으로 SPY 단독 백테스트
   - holdings에 SPY 포함 여부 무관하게 벤치마크는 항상 SPY 100%

6. 수익률 계산
   - 총 수익률 = (최종 평가금액 - 총 투자원금) / 총 투자원금 × 100
   - CAGR = (최종 평가금액 / 총 투자원금) ^ (1 / 투자년수) - 1

7. 히트맵 데이터
   - 월별 수익률 = (월말 평가금액 - 전월말 평가금액 - 해당월 투자금) / 전월말 평가금액 × 100
```

---

## 8. 추천 포트폴리오 템플릿 (`lib/etf-list.ts`)

```typescript
export const PORTFOLIO_TEMPLATES = [
  {
    id: 'balanced',
    name: '황금 비율형',
    description: '성장과 배당의 균형',
    emoji: '⚖️',
    holdings: [{ ticker: 'QQQ', weight: 50 }, { ticker: 'SCHD', weight: 50 }],
  },
  {
    id: 'dividend',
    name: '배당 인컴형',
    description: '매달 배당금 받기',
    emoji: '💰',
    holdings: [{ ticker: 'SCHD', weight: 50 }, { ticker: 'JEPI', weight: 50 }],
  },
  {
    id: 'growth',
    name: '나스닥 집중형',
    description: '공격적 성장 추구',
    emoji: '🚀',
    holdings: [{ ticker: 'QQQ', weight: 70 }, { ticker: 'QLD', weight: 30 }],
  },
  {
    id: 'stable',
    name: '안정 성장형',
    description: '리스크 최소화',
    emoji: '🛡️',
    holdings: [{ ticker: 'SPY', weight: 60 }, { ticker: 'BND', weight: 40 }],
  },
  {
    id: 'allweather',
    name: '올웨더형',
    description: '시장 중립 포트폴리오',
    emoji: '🌤️',
    holdings: [
      { ticker: 'SPY', weight: 40 },
      { ticker: 'GLD', weight: 20 },
      { ticker: 'TLT', weight: 40 },
    ],
  },
];
```

---

## 9. Phase 1 개발 체크리스트 (MVP)

Claude Code는 아래 순서대로 진행할 것. 완료한 항목은 체크.

### Step 1 — 프로젝트 초기화
- [x] `npx create-next-app@latest geudaesalkkel --typescript --tailwind --app`
- [x] 패키지 설치: `@supabase/supabase-js`, `chart.js`, `react-chartjs-2`, `html2canvas`
- [ ] `.env.local` 및 `.env.example` 생성
- [ ] 폴더 구조 생성 (위 3번 기준)
- [ ] `types/index.ts` 타입 정의 작성
- [ ] `lib/etf-list.ts` ETF 목록 + 템플릿 작성
- [ ] `lib/formatters.ts` 숫자/날짜 포맷 유틸 작성

### Step 2 — DB & 데이터 세팅
- [ ] Supabase 클라이언트 (`lib/supabase.ts`) 작성
- [ ] `lib/mock-data.ts` mock 주가 데이터 작성 (Supabase 준비 전)
- [ ] Supabase에 `etf_list`, `etf_prices` 테이블 생성 SQL 작성
- [ ] `scripts/seed-prices.py` 작성 (Yahoo Finance → Supabase INSERT)
- [ ] ETF 목록 시드 데이터 INSERT SQL 작성

### Step 3 — 계산 엔진
- [ ] `lib/backtest.ts` DCA 계산 로직 구현 (7번 계산 규칙 기준)
- [ ] `app/api/backtest/route.ts` API Route 구현
- [ ] `app/api/etf/route.ts` ETF 검색 API 구현
- [ ] 단위 테스트: SPY 3년 월적립 $1,000 결과 수동 검증

### Step 4 — UI (계산기)
- [ ] `components/common/Header.tsx`
- [ ] `components/common/Footer.tsx` (면책 고지 포함)
- [ ] `components/calculator/ETFSearch.tsx` (자동완성)
- [ ] `components/calculator/PortfolioBuilder.tsx`
- [ ] `components/calculator/InvestmentSettings.tsx`
- [ ] `app/calculator/page.tsx` 조립

### Step 5 — UI (결과)
- [ ] `components/result/MetricCards.tsx`
- [ ] `components/result/LineChart.tsx` (주요 사건 마커 포함)
- [ ] `components/result/HeatmapChart.tsx`
- [ ] `components/result/DonutChart.tsx`
- [ ] `components/result/HoldingsTable.tsx`
- [ ] `components/result/ShareCard.tsx` (공유 이미지 생성)

### Step 6 — 랜딩 페이지
- [ ] `components/landing/Hero.tsx`
- [ ] `components/landing/TemplateCards.tsx`
- [ ] `components/landing/HowItWorks.tsx`
- [ ] `app/page.tsx` 조립

### Step 7 — 공유 기능
- [ ] URL 공유 (쿼리스트링 인코딩)
- [ ] 카카오톡 공유
- [ ] PNG 저장 (`html2canvas`)
- [ ] OG 메타태그 동적 생성 (`app/result/page.tsx`)

### Step 8 — 출시 준비
- [ ] 이용약관 페이지 (`app/terms/page.tsx`)
- [ ] 개인정보처리방침 페이지 (`app/privacy/page.tsx`)
- [ ] 모바일 반응형 최종 확인
- [ ] Vercel 프로덕션 배포

---

## 10. 면책 고지 문구 (모든 결과 페이지 필수 포함)

```
본 서비스는 과거 데이터 기반 시뮬레이션으로, 실제 투자 결과와 다를 수 있습니다.
과거 수익률이 미래 수익을 보장하지 않으며, 투자 손실에 대한 책임은 투자자 본인에게 있습니다.
본 서비스는 투자 자문이 아닙니다. 데이터 출처: Yahoo Finance
```

---

## 11. 코딩 컨벤션

- 모든 컴포넌트: 함수형 + TypeScript
- 서버 컴포넌트 기본, 클라이언트 필요 시 `'use client'` 명시
- 에러 메시지: 한국어로 작성
- 숫자 포맷: `lib/formatters.ts` 유틸 함수 사용 (직접 `.toFixed()` 남발 금지)
- 주석: 복잡한 계산 로직에만 한국어로 작성
- 커밋 메시지: 한국어 허용

---

> 문서 버전: v1.0
> 작성일: 2026년 4월
> 서비스명: 그때살껄
> 관련 문서: 그때살껄_기획안_v1.3.md
