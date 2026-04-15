import { NextRequest, NextResponse } from 'next/server';
import { ETF_LIST } from '@/lib/etf-list';
import { getSupabaseClient } from '@/lib/supabase';
import type { ETFDetail, ETFMeta, ETFReturnMap, ETFHolding, ETFSector } from '@/types';

interface Props {
  params: Promise<{ ticker: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.toUpperCase();

  // etf_list 로컬 데이터에서 기본 정보 조회
  const localEtf = ETF_LIST.find((e) => e.ticker === ticker);
  if (!localEtf) {
    return NextResponse.json({ error: '존재하지 않는 ETF입니다.' }, { status: 404 });
  }

  const supabase = getSupabaseClient();

  // ── 기본값 ───────────────────────────────────────────────────────────────
  let meta: ETFMeta = { ...localEtf };
  let returns: ETFReturnMap = {};
  let holdings: ETFHolding[] = [];
  let sectors: ETFSector[] = [];

  if (!supabase) {
    const result: ETFDetail = { meta, returns, holdings, sectors };
    return NextResponse.json(result);
  }

  // ── 병렬 조회 ─────────────────────────────────────────────────────────────
  const [metaRes, returnsRes, holdingsRes, sectorsRes] = await Promise.all([
    supabase
      .from('etf_list')
      .select('ticker,name_ko,name_en,category,description,expense_ratio,inception_date,aum_billion,holdings_count,index_name')
      .eq('ticker', ticker)
      .single(),

    supabase
      .from('etf_returns')
      .select('period,return_pct')
      .eq('ticker', ticker),

    supabase
      .from('etf_holdings')
      .select('holding_ticker,name,weight,sector')
      .eq('etf_ticker', ticker)
      .order('weight', { ascending: false })
      .limit(15),

    supabase
      .from('etf_sector_weights')
      .select('sector,weight')
      .eq('etf_ticker', ticker)
      .order('weight', { ascending: false }),
  ]);

  // ── meta ─────────────────────────────────────────────────────────────────
  if (!metaRes.error && metaRes.data) {
    const d = metaRes.data;
    meta = {
      ticker:         d.ticker,
      name_ko:        d.name_ko,
      name_en:        d.name_en,
      category:       d.category,
      description:    d.description ?? localEtf.description,
      expense_ratio:  d.expense_ratio ?? localEtf.expense_ratio,
      inception_date: d.inception_date ?? null,
      aum_billion:    d.aum_billion ?? null,
      holdings_count: d.holdings_count ?? null,
      index_name:     d.index_name ?? null,
    };
  }

  // ── returns ───────────────────────────────────────────────────────────────
  if (!returnsRes.error && returnsRes.data) {
    for (const row of returnsRes.data) {
      (returns as Record<string, number>)[row.period] = row.return_pct;
    }
  }

  // ── holdings ──────────────────────────────────────────────────────────────
  if (!holdingsRes.error && holdingsRes.data) {
    holdings = holdingsRes.data.map((h) => ({
      holding_ticker: h.holding_ticker,
      name:           h.name ?? '',
      weight:         Number(h.weight ?? 0),
      sector:         h.sector ?? '',
    }));
  }

  // ── sectors ───────────────────────────────────────────────────────────────
  if (!sectorsRes.error && sectorsRes.data) {
    sectors = sectorsRes.data.map((s) => ({
      sector: s.sector,
      weight: Number(s.weight ?? 0),
    }));
  }

  const result: ETFDetail = { meta, returns, holdings, sectors };
  return NextResponse.json(result);
}
