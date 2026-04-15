# -*- coding: utf-8 -*-
"""
그때살껄 - ETF 구성종목 + 섹터비중 수집 스크립트 (yfinance)
etf_holdings (TOP 15), etf_sector_weights 테이블에 upsert

실행 방법:
  cd C:/geudaesalkkel
  python scripts/seed-etf-holdings.py
"""

import os
import sys
import time
from datetime import date
import yfinance as yf
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

TODAY = date.today().isoformat()
TOP_N = 15

SECTOR_NAME_MAP = {
    "technology":             "기술",
    "financial_services":     "금융",
    "communication_services": "통신서비스",
    "consumer_cyclical":      "경기소비재",
    "industrials":            "산업재",
    "healthcare":             "헬스케어",
    "consumer_defensive":     "필수소비재",
    "energy":                 "에너지",
    "basic_materials":        "소재",
    "utilities":              "유틸리티",
    "realestate":             "부동산",
}

def process_ticker(ticker):
    print(f"  [{ticker}]", end=" ", flush=True)
    try:
        fd = yf.Ticker(ticker).funds_data

        holdings_ok = False
        sectors_ok  = False
        h_count     = 0
        s_count     = 0

        # 구성종목
        try:
            top = fd.top_holdings
            if top is not None and not top.empty:
                rows = []
                for symbol, row in top.head(TOP_N).iterrows():
                    weight = float(row.get("Holding Percent", 0)) * 100
                    rows.append({
                        "etf_ticker":     ticker,
                        "holding_ticker": str(symbol),
                        "name":           str(row.get("Name", "")),
                        "weight":         round(weight, 4),
                        "sector":         "",
                        "updated_at":     TODAY,
                    })
                if rows:
                    supabase.table("etf_holdings") \
                        .upsert(rows, on_conflict="etf_ticker,holding_ticker") \
                        .execute()
                    holdings_ok = True
                    h_count = len(rows)
        except Exception:
            pass

        # 섹터비중
        try:
            sw = fd.sector_weightings
            if sw:
                rows = []
                for sector_key, weight in sw.items():
                    rows.append({
                        "etf_ticker": ticker,
                        "sector":     SECTOR_NAME_MAP.get(sector_key, sector_key),
                        "weight":     round(float(weight) * 100, 4),
                        "updated_at": TODAY,
                    })
                if rows:
                    supabase.table("etf_sector_weights") \
                        .upsert(rows, on_conflict="etf_ticker,sector") \
                        .execute()
                    sectors_ok = True
                    s_count = len(rows)
        except Exception:
            pass

        if holdings_ok or sectors_ok:
            print(f"OK  holdings={h_count}, sectors={s_count}")
        else:
            print("no data (bond/gold ETF is normal)")

        return holdings_ok or sectors_ok

    except Exception as e:
        print(f"ERROR: {e}")
        return False

def main():
    print("=" * 60)
    print("ETF holdings seed (yfinance)")
    print(f"tickers: {len(TICKERS)}, top {TOP_N} holdings")
    print("=" * 60)

    ok, fail = 0, []
    for i, ticker in enumerate(TICKERS, 1):
        print(f"[{i:02d}/{len(TICKERS)}]", end=" ")
        if process_ticker(ticker):
            ok += 1
        else:
            fail.append(ticker)
        time.sleep(0.5)

    print()
    print("=" * 60)
    print(f"done: {ok}/{len(TICKERS)} ok")
    if fail:
        print(f"no data: {', '.join(fail)}")
        print("  -> TLT/GLD/BND etc. bond/commodity ETF is expected")
    print("=" * 60)

if __name__ == "__main__":
    main()
