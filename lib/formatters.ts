/** $1,234,567.89 형식 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** +12.3% 또는 -5.1% 형식 */
export function formatPercent(value: number, digits = 1): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

/** 2015-01-01 → "2015년 1월" */
export function formatDateKo(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

/** 2015-01-01 → "2015-01" (차트 레이블용) */
export function formatDateLabel(dateStr: string): string {
  return dateStr.slice(0, 7);
}

/** 1234567 → "1,234,567" (단위 없이) */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/** 투자 기간 년수 텍스트 */
export function formatYears(years: number): string {
  let y = Math.floor(years);
  let m = Math.round((years - y) * 12);
  if (m === 12) { y += 1; m = 0; } // 4년 12개월 → 5년
  if (m === 0) return `${y}년`;
  if (y === 0) return `${m}개월`;
  return `${y}년 ${m}개월`;
}
