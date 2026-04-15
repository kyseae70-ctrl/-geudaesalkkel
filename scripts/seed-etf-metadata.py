# -*- coding: utf-8 -*-
"""
그때살껄 - ETF 메타데이터 수집 스크립트 (yfinance)
상장일, 운용자산(AUM), 구성종목 수를 수집해 etf_list 테이블 업데이트

실행 방법:
  cd C:/geudaesalkkel
  python scripts/seed-etf-metadata.py
"""

import os
import sys
import time
from datetime import datetime
import yfinance as yf
from supabase import create_client

# Windows 터미널 UTF-8 출력
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

def unix_to_date(ts):
    try:
        return datetime.utcfromtimestamp(int(ts)).strftime("%Y-%m-%d")
    except Exception:
        return None

def process_ticker(ticker):
    print(f"  [{ticker}]", end=" ", flush=True)
    try:
        t    = yf.Ticker(ticker)
        info = t.info

        inception_date = unix_to_date(info.get("fundInceptionDate"))
        total_assets   = info.get("totalAssets")
        aum_billion    = round(float(total_assets) / 1e9, 2) if total_assets else None

        holdings_count = None
        try:
            fd  = t.funds_data
            top = fd.top_holdings
            if top is not None and not top.empty:
                holdings_count = len(top)
        except Exception:
            pass

        if not any([inception_date, aum_billion, holdings_count]):
            print("no data")
            return False

        update_data = {}
        if inception_date:  update_data["inception_date"]  = inception_date
        if aum_billion:     update_data["aum_billion"]     = aum_billion
        if holdings_count:  update_data["holdings_count"]  = holdings_count

        supabase.table("etf_list").update(update_data).eq("ticker", ticker).execute()
        print(f"OK  inception={inception_date}, AUM={aum_billion}B, count={holdings_count}")
        return True

    except Exception as e:
        print(f"ERROR: {e}")
        return False

def main():
    print("=" * 60)
    print("ETF metadata seed (yfinance)")
    print(f"tickers: {len(TICKERS)}")
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
        print(f"failed: {', '.join(fail)}")
    print("=" * 60)

if __name__ == "__main__":
    main()
