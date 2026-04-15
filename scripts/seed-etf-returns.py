# -*- coding: utf-8 -*-
"""
그때살껄 - ETF 기간별 수익률 사전 계산 스크립트
etf_prices 데이터로 1M/3M/6M/YTD/1Y/3Y/5Y/MAX 수익률 계산 후 etf_returns 테이블에 저장

실행 방법:
  cd C:/geudaesalkkel
  pip install python-dateutil
  python scripts/seed-etf-returns.py
"""

import os
import sys
from datetime import date
from supabase import create_client

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def load_env(path=".env.local"):
    env = {}
    try:
        with open(path, encoding="utf-8") as f:
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
    raise SystemExit("ERROR: .env.local에 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY가 필요합니다.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

TICKERS = [
    "QQQ", "QLD", "TQQQ", "SPY", "VOO", "IVV", "VTI", "DIA", "IWM", "ONEQ",
    "SCHD", "JEPI", "JEPQ", "VIG", "VYM", "DGRO", "SPHD", "QYLD", "XYLD", "HDV",
    "XLK", "SMH", "SOXX", "XLE", "XLF", "XLV", "XLI", "XLRE", "XLY", "XLC",
    "TLT", "AGG", "BND", "SHY", "LQD", "HYG", "GLD", "IAU",
    "UPRO", "SPXL", "SOXL", "TECL", "SQQQ", "SH", "SPXS",
    "EEM", "EFA", "VEA", "VWO", "IEFA",
]

TODAY = date.today()

def get_period_start(period):
    from dateutil.relativedelta import relativedelta
    if period == "1m":  return TODAY - relativedelta(months=1)
    if period == "3m":  return TODAY - relativedelta(months=3)
    if period == "6m":  return TODAY - relativedelta(months=6)
    if period == "ytd": return date(TODAY.year, 1, 1)
    if period == "1y":  return TODAY - relativedelta(years=1)
    if period == "3y":  return TODAY - relativedelta(years=3)
    if period == "5y":  return TODAY - relativedelta(years=5)
    return date(2000, 1, 1)

PERIODS = ["1m", "3m", "6m", "ytd", "1y", "3y", "5y", "max"]

def fetch_prices(ticker):
    all_rows = []
    PAGE = 1000
    from_idx = 0
    while True:
        res = supabase.table("etf_prices") \
            .select("date,close") \
            .eq("ticker", ticker) \
            .order("date", desc=False) \
            .range(from_idx, from_idx + PAGE - 1) \
            .execute()
        if not res.data:
            break
        all_rows.extend(res.data)
        if len(res.data) < PAGE:
            break
        from_idx += PAGE
    return all_rows

def calc_return(prices, start_date):
    start_str = start_date.isoformat()
    from_row  = next((p for p in prices if p["date"] >= start_str), None)
    if not from_row:
        return None
    to_row = prices[-1]
    if from_row["date"] == to_row["date"]:
        return None
    start_close = float(from_row["close"])
    end_close   = float(to_row["close"])
    if start_close <= 0:
        return None
    return round((end_close - start_close) / start_close * 100, 2)

def process_ticker(ticker):
    prices = fetch_prices(ticker)
    if not prices:
        print("no price data")
        return False

    today_str = TODAY.isoformat()
    rows = []
    for period in PERIODS:
        start = get_period_start(period)
        ret   = calc_return(prices, start)
        if ret is None:
            continue
        rows.append({
            "ticker":     ticker,
            "period":     period,
            "return_pct": ret,
            "updated_at": today_str,
        })

    if not rows:
        print("cannot calculate")
        return False

    supabase.table("etf_returns") \
        .upsert(rows, on_conflict="ticker,period") \
        .execute()

    summary = {r["period"]: r["return_pct"] for r in rows}
    print(f"OK  1M={summary.get('1m','?')}%, 1Y={summary.get('1y','?')}%, MAX={summary.get('max','?')}%")
    return True

def main():
    try:
        from dateutil.relativedelta import relativedelta
    except ImportError:
        raise SystemExit("ERROR: python-dateutil이 필요합니다: pip install python-dateutil")

    print("=" * 60)
    print("ETF returns seed")
    print(f"base date: {TODAY} | periods: {', '.join(PERIODS)}")
    print("=" * 60)

    ok, fail = 0, []
    for i, ticker in enumerate(TICKERS, 1):
        print(f"[{i:02d}/{len(TICKERS)}] [{ticker}] ", end="", flush=True)
        if process_ticker(ticker):
            ok += 1
        else:
            fail.append(ticker)

    print()
    print("=" * 60)
    print(f"done: {ok}/{len(TICKERS)} ok")
    if fail:
        print(f"failed: {', '.join(fail)}")
    print("=" * 60)

if __name__ == "__main__":
    main()
