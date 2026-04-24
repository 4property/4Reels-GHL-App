const CURRENCY_SYMBOLS = { EUR: '€', USD: '$', GBP: '£', CAD: 'CA$', AUD: 'A$' };

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatPriceSample({ currency, currencyPosition, thousandsSep }) {
  const parts = '685000'
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)
    .join(thousandsSep)
    .split('')
    .reverse()
    .join('');
  const sym = CURRENCY_SYMBOLS[currency] || '';
  return currencyPosition === 'prefix' ? `${sym}${parts}` : `${parts} ${sym}`;
}

export function formatDateSample(dateFormat) {
  const d = new Date(2026, 3, 22);
  const pad = (n) => String(n).padStart(2, '0');
  return dateFormat
    .replace('DD', pad(d.getDate()))
    .replace('MMM', MONTHS_SHORT[d.getMonth()])
    .replace('MM', pad(d.getMonth() + 1))
    .replace('YYYY', d.getFullYear());
}
