import { Holding, InvestmentSettings } from '@/types';

/**
 * holdings + settings → /result?... URL 생성
 */
export function encodeShareUrl(holdings: Holding[], settings: InvestmentSettings): string {
  const params = new URLSearchParams();
  params.set('h', holdings.map((h) => `${h.ticker}:${h.weight}`).join(','));
  params.set('a', String(settings.amount));
  params.set('f', settings.frequency);
  params.set('sd', settings.startDate);
  params.set('ed', settings.endDate);
  params.set('div', settings.reinvestDividends ? '1' : '0');
  return `/result?${params.toString()}`;
}

/**
 * URL searchParams → holdings + settings 디코딩
 * 유효하지 않으면 null 반환
 */
export function decodeShareParams(
  searchParams: URLSearchParams | Record<string, string>
): { holdings: Holding[]; settings: InvestmentSettings } | null {
  const get = (key: string) =>
    searchParams instanceof URLSearchParams
      ? searchParams.get(key)
      : searchParams[key] ?? null;

  const h = get('h');
  const a = get('a');
  const f = get('f');
  const sd = get('sd');
  const ed = get('ed');
  const div = get('div');

  if (!h || !a || !f || !sd || !ed) return null;

  const holdings: Holding[] = h.split(',').map((s) => {
    const [ticker, weight] = s.split(':');
    return { ticker: ticker.toUpperCase(), weight: Number(weight) };
  });

  if (holdings.some((item) => !item.ticker || isNaN(item.weight))) return null;
  if (!['daily', 'weekly', 'monthly'].includes(f)) return null;

  return {
    holdings,
    settings: {
      amount: Number(a),
      frequency: f as 'daily' | 'weekly' | 'monthly',
      startDate: sd,
      endDate: ed,
      reinvestDividends: div === '1',
    },
  };
}
