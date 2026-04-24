import { Icon } from '../../../shared/Icon.jsx';

const ROWS = [
  { t: '2 min ago', text: 'Reel published · 12 Sandymount Rd · Instagram + Facebook', kind: 'publish' },
  { t: '14 min ago', text: 'New property synced from WordPress · 45b Rathgar Ave', kind: 'sync' },
  { t: '1 hr ago', text: "GHL opportunity moved to stage 'Listed' · 28 Ranelagh Sq", kind: 'sync' },
  { t: 'Yesterday', text: 'Seat added · darragh@ckpestateagents.ie', kind: 'admin' },
  { t: '3 days ago', text: 'Plan upgraded: Growth → Scale', kind: 'admin' },
];

const META = {
  publish: { icon: 'send', color: 'var(--accent)' },
  sync: { icon: 'refresh', color: 'var(--info)' },
  admin: { icon: 'shield', color: 'var(--text-muted)' },
};

export function ActivityTab() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="t-base t-semibold" style={{ marginBottom: 14 }}>Recent activity</div>
      <div className="stack gap-5">
        {ROWS.map((r, i) => (
          <div key={i} className={`activity-row ${i === ROWS.length - 1 ? 'last' : ''}`}>
            <div className="activity-icon" style={{ color: META[r.kind].color }}>
              <Icon name={META[r.kind].icon} size={12} />
            </div>
            <div className="grow min-w-0">
              <div className="activity-text">{r.text}</div>
              <div className="activity-time">{r.t}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
