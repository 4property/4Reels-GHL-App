/** Shorten a number for compact display: 1842 → "1.8k", 24180 → "24k". */
export function fmtNum(n) {
  if (n == null) return '';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
  return String(n);
}

/** "2-bed apt · Cranford Court" → "2b" initials for avatars, etc. */
export function initials(name, max = 2) {
  return name
    .split(' ')
    .map((x) => x[0])
    .slice(0, max)
    .join('')
    .toUpperCase();
}

/** CTR → color token matching the dashboard's traffic-light thresholds. */
export function ctrColor(ctr) {
  if (ctr >= 1.5) return 'var(--success)';
  if (ctr >= 1) return 'var(--warning)';
  return 'var(--text-muted)';
}
