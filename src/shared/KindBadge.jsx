const MAP = {
  'for-sale': 'For sale',
  'sale-agreed': 'Sale agreed',
  sold: 'Sold',
  'to-let': 'To let',
  'let-agreed': 'Let agreed',
  let: 'Let',
};

export function KindBadge({ kind }) {
  return <span className="badge">{MAP[kind] || kind}</span>;
}
