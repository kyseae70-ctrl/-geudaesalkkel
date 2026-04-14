import { PriceRow } from '@/types';
import { getMockPrices } from '@/lib/mock-data';
import { getSupabaseClient } from '@/lib/supabase';

/**
 * Supabase에서 주가 데이터 조회 (페이지네이션 적용)
 * Supabase 미연결 또는 데이터 없을 시 mock 데이터 반환
 */
export async function fetchPricesFromSupabase(
  ticker: string,
  startDate: string,
  endDate: string
): Promise<PriceRow[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return getMockPrices(ticker, startDate, endDate);

  const allRows: PriceRow[] = [];
  const PAGE_SIZE = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('etf_prices')
      .select('date, close, dividend')
      .eq('ticker', ticker)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error || !data) break;

    for (const row of data) {
      allRows.push({
        date: row.date,
        close: Number(row.close),
        dividend: Number(row.dividend ?? 0),
      });
    }

    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return allRows.length > 0 ? allRows : getMockPrices(ticker, startDate, endDate);
}
