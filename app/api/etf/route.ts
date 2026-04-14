import { NextRequest, NextResponse } from 'next/server';
import { ETF_LIST } from '@/lib/etf-list';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim().toUpperCase() ?? '';

  if (!q) {
    return NextResponse.json(ETF_LIST.slice(0, 10));
  }

  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('etf_list')
      .select('ticker, name_ko, name_en, category, expense_ratio')
      .or(`ticker.ilike.%${q}%,name_ko.ilike.%${q}%,name_en.ilike.%${q}%`)
      .limit(10);

    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }
  }

  // Supabase 없거나 결과 없으면 로컬 목록에서 검색
  const results = ETF_LIST.filter(
    (etf) =>
      etf.ticker.includes(q) ||
      etf.name_ko.toUpperCase().includes(q) ||
      etf.name_en.toUpperCase().includes(q)
  ).slice(0, 10);

  return NextResponse.json(results);
}
