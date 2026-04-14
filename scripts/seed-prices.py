"""
그때살껄 — ETF 주가 데이터 초기 수집 스크립트
Yahoo Finance에서 50종목 × 2015-01-01 ~ 현재 일별 종가+배당 수집 후 Supabase INSERT

실행 방법:
  cd C:/geudaesalkkel
  python scripts/seed-prices.py

소요 시간: 약 5~15분 (종목 수 및 네트워크 속도에 따라 다름)
"""

import os
import time
import yfinance as yf
from supabase import create_client
from datetime import datetime, date

# ── 환경변수에서 Supabase 연결 정보 읽기 ──────────────────────────────────────
def load_env(path=".env.local"):
    env = {}
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip()
    except FileNotFoundError:
        pass
    return env

env = load_env()
SUPABASE_URL = env.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit("❌ .env.local에 NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── 수집 대상 ETF 50종목 ──────────────────────────────────────────────────────
TICKERS = [
    # 나스닥/S&P 핵심
    "QQQ", "QLD", "TQQQ", "SPY", "VOO", "IVV", "VTI", "DIA", "IWM", "ONEQ",
    # 배당/인컴
    "SCHD", "JEPI", "JEPQ", "VIG", "VYM", "DGRO", "SPHD", "QYLD", "XYLD", "HDV",
    # 섹터
    "XLK", "SMH", "SOXX", "XLE", "XLF", "XLV", "XLI", "XLRE", "XLY", "XLC",
    # 채권/안전자산
    "TLT", "AGG", "BND", "SHY", "LQD", "HYG", "GLD", "IAU",
    # 레버리지/인버스
    "UPRO", "SPXL", "SOXL", "TECL", "SQQQ", "SH", "SPXS",
    # 글로벌
    "EEM", "EFA", "VEA", "VWO", "IEFA",
]

START_DATE = "2015-01-01"
END_DATE   = date.today().isoformat()
BATCH_SIZE = 500  # Supabase 한 번에 upsert할 행 수

# ── 배당 데이터 날짜 인덱스 만들기 ───────────────────────────────────────────
def get_dividends_map(ticker_obj):
    """날짜(str) → 배당금(float) 딕셔너리 반환"""
    try:
        divs = ticker_obj.dividends
        if divs.empty:
            return {}
        result = {}
        for ts, amount in divs.items():
            d = ts.date() if hasattr(ts, 'date') else ts
            result[str(d)] = float(amount)
        return result
    except Exception:
        return {}

# ── 단일 티커 수집 및 upsert ─────────────────────────────────────────────────
def process_ticker(ticker: str) -> int:
    """해당 티커의 주가 데이터를 수집해 Supabase에 upsert. 삽입된 행 수 반환."""
    print(f"  [{ticker}] 데이터 수집 중...", end="", flush=True)

    try:
        tk = yf.Ticker(ticker)
        hist = tk.history(start=START_DATE, end=END_DATE, auto_adjust=True)

        if hist.empty:
            print(f" ⚠️  데이터 없음 (상장일 이후 데이터가 없거나 ticker 오류)")
            return 0

        div_map = get_dividends_map(tk)

        rows = []
        for ts, row in hist.iterrows():
            d = str(ts.date()) if hasattr(ts, 'date') else str(ts)[:10]
            close_price = float(row["Close"])
            if close_price <= 0:
                continue
            dividend = div_map.get(d, 0.0)
            rows.append({
                "ticker":   ticker,
                "date":     d,
                "close":    round(close_price, 4),
                "dividend": round(dividend, 6),
            })

        if not rows:
            print(" ⚠️  유효한 행 없음")
            return 0

        # 배치로 upsert
        total = 0
        for i in range(0, len(rows), BATCH_SIZE):
            batch = rows[i:i + BATCH_SIZE]
            supabase.table("etf_prices").upsert(batch, on_conflict="ticker,date").execute()
            total += len(batch)

        print(f" ✅  {total:,}행 완료")
        return total

    except Exception as e:
        print(f" ❌  오류: {e}")
        return 0

# ── 메인 ─────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("그때살껄 — ETF 주가 데이터 수집 시작")
    print(f"기간: {START_DATE} ~ {END_DATE}")
    print(f"종목 수: {len(TICKERS)}개")
    print("=" * 60)

    total_rows = 0
    failed = []

    for i, ticker in enumerate(TICKERS, 1):
        print(f"[{i:02d}/{len(TICKERS)}]", end=" ")
        count = process_ticker(ticker)
        total_rows += count
        if count == 0:
            failed.append(ticker)
        # Yahoo Finance 요청 간격 (너무 빠르면 차단될 수 있음)
        time.sleep(0.5)

    print()
    print("=" * 60)
    print(f"✅ 완료! 총 {total_rows:,}행 삽입")
    if failed:
        print(f"⚠️  실패/빈 데이터 종목: {', '.join(failed)}")
        print("   → 상장일이 2015년 이후이거나 ticker가 변경된 경우입니다.")
    print("=" * 60)
    print()
    print("다음 단계: 브라우저에서 계산기를 실행하면 실제 데이터로 동작합니다.")

if __name__ == "__main__":
    main()
