-- ============================================================
-- 그때살껄 — ETF 상세 페이지 DB 스키마 확장
-- Supabase 대시보드 > SQL Editor 에서 실행
-- ============================================================

-- 1. etf_list 테이블 컬럼 추가
ALTER TABLE etf_list
  ADD COLUMN IF NOT EXISTS inception_date  DATE,
  ADD COLUMN IF NOT EXISTS aum_billion     NUMERIC,   -- 운용자산 (십억 달러, e.g. 230.5)
  ADD COLUMN IF NOT EXISTS holdings_count  INTEGER,   -- 구성종목 수
  ADD COLUMN IF NOT EXISTS index_name      TEXT;      -- 추종 지수명 (e.g. "Nasdaq-100 Index")

-- 2. etf_holdings 테이블 (구성종목 TOP 15)
CREATE TABLE IF NOT EXISTS etf_holdings (
  etf_ticker      TEXT    NOT NULL,
  holding_ticker  TEXT    NOT NULL,
  name            TEXT,
  weight          NUMERIC,           -- 비중 (%)
  sector          TEXT,
  updated_at      DATE    NOT NULL,
  PRIMARY KEY (etf_ticker, holding_ticker)
);

CREATE INDEX IF NOT EXISTS idx_etf_holdings_etf ON etf_holdings(etf_ticker);

-- 3. etf_sector_weights 테이블 (섹터별 비중)
CREATE TABLE IF NOT EXISTS etf_sector_weights (
  etf_ticker  TEXT    NOT NULL,
  sector      TEXT    NOT NULL,
  weight      NUMERIC,               -- 비중 (%)
  updated_at  DATE    NOT NULL,
  PRIMARY KEY (etf_ticker, sector)
);

CREATE INDEX IF NOT EXISTS idx_etf_sector_weights_etf ON etf_sector_weights(etf_ticker);

-- 4. etf_returns 테이블 (기간별 수익률 캐시)
CREATE TABLE IF NOT EXISTS etf_returns (
  ticker      TEXT    NOT NULL,
  period      TEXT    NOT NULL,      -- '1m','3m','6m','ytd','1y','3y','5y','max'
  return_pct  NUMERIC,
  updated_at  DATE    NOT NULL,
  PRIMARY KEY (ticker, period)
);

CREATE INDEX IF NOT EXISTS idx_etf_returns_ticker ON etf_returns(ticker);
