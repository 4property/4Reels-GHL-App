import { Icon } from '../../shared/Icon.jsx';
import { Toggle } from '../../shared/Toggle.jsx';

const PROPERTY_TYPES = [
  { id: 'luxury', label: 'Luxury', desc: 'High-end listings, architect pieces' },
  { id: 'family', label: 'Family', desc: 'Suburban homes, multi-bedroom' },
  { id: 'rental', label: 'Rental', desc: 'Studios, urban apartments to let' },
];

const STATUSES = [
  { id: 'for-sale', label: 'For sale', color: 'var(--accent)' },
  { id: 'sale-agreed', label: 'Sale agreed', color: 'var(--warning)' },
  { id: 'sold', label: 'Sold', color: 'var(--success)' },
  { id: 'to-let', label: 'To let', color: 'var(--info)' },
  { id: 'let-agreed', label: 'Let agreed', color: 'var(--warning)' },
  { id: 'let', label: 'Let', color: 'var(--success)' },
];

export function MusicRules({ tracks }) {
  return (
    <div className="stack gap-8">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Rules by property type</div>
            <div className="card-subtitle">Restrict which favorites are picked based on the property kind.</div>
          </div>
        </div>
        <div>
          {PROPERTY_TYPES.map((p) => (
            <div key={p.id} className="music-rule-row">
              <div>
                <div className="music-rule-label-primary">{p.label}</div>
                <div className="music-rule-label-sub">{p.desc}</div>
              </div>
              <div className="row gap-3 row-wrap">
                {tracks
                  .filter((t) => t.propertyTypes.includes(p.id) && t.favorite)
                  .map((t) => <Chip key={t.id} title={t.title} />)}
                <button className="btn sm ghost">
                  <Icon name="plus" size={12} /> Add track
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Rules by property status</div>
            <div className="card-subtitle">Match the tone to the moment — e.g. celebratory for "Sold", calm for "For sale".</div>
          </div>
        </div>
        <div>
          {STATUSES.map((s) => (
            <div key={s.id} className="music-rule-row">
              <div className="row gap-4">
                <span className="music-status-dot" style={{ background: s.color }} />
                <div className="music-rule-label-primary">{s.label}</div>
              </div>
              <div className="row gap-3 row-wrap">
                {tracks
                  .filter((t) => t.statuses?.includes(s.id) && t.favorite)
                  .map((t) => <Chip key={t.id} title={t.title} />)}
                <button className="btn sm ghost">
                  <Icon name="plus" size={12} /> Add track
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <Toggle
            on={true}
            onChange={() => {}}
            label="Fall back to full favorites pool if no rule matches"
            sub="When no rule produces tracks for a given property, pick randomly from all ⭐ favorites instead of failing the render."
          />
        </div>
      </div>
    </div>
  );
}

function Chip({ title }) {
  return (
    <span className="music-chip">
      <Icon name="music" size={10} /> {title}
    </span>
  );
}
