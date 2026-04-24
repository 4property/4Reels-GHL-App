import { Icon } from '../../shared/Icon.jsx';
import { Toggle } from '../../shared/Toggle.jsx';
import { useSocials } from '../../app/providers/TenantProvider.jsx';

const HOLD_OPTIONS = [
  { v: 0.5, l: '30 min' }, { v: 1, l: '1 h' }, { v: 2, l: '2 h' },
  { v: 4, l: '4 h' }, { v: 8, l: '8 h' }, { v: 24, l: '24 h' },
];

export function AutoPublishDetails({
  reviewWindow, setReviewWindow,
  reviewWindowHours, setReviewWindowHours,
  quietHours, setQuietHours,
  skipWeekends, setSkipWeekends,
  autoIncludeNetworks, toggleNet,
}) {
  const socials = useSocials();

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title auto-title-with-icon">
            <span className="auto-title-chip">
              <Icon name="zap" size={12} />
            </span>
            Auto-publish details
          </div>
          <div className="card-subtitle">Settings that apply when automatic publishing is on.</div>
        </div>
      </div>

      <div className="card-body stack" style={{ gap: 18 }}>
        <div>
          <Toggle
            on={reviewWindow}
            onChange={setReviewWindow}
            label="Hold each reel before posting"
            sub="Safety net — you can cancel or tweak from the dashboard during this window."
          />
          {reviewWindow && <HoldPicker hours={reviewWindowHours} setHours={setReviewWindowHours} />}
        </div>

        <hr className="sep" style={{ margin: 0 }} />
        <Toggle
          on={quietHours}
          onChange={setQuietHours}
          label="Respect quiet hours (22:00 → 07:00)"
          sub="Reels that finish rendering at night will be queued for 07:00 the next morning."
        />

        <hr className="sep" style={{ margin: 0 }} />
        <Toggle
          on={skipWeekends}
          onChange={setSkipWeekends}
          label="Don't publish on weekends"
          sub="Reels finishing on Saturday or Sunday wait until Monday morning."
        />

        <hr className="sep" style={{ margin: 0 }} />
        <div>
          <div className="label" style={{ marginBottom: 8 }}>Publish to these networks by default</div>
          <div className="row gap-4 row-wrap">
            {socials.map((s) => {
              const on = autoIncludeNetworks.includes(s.id);
              return (
                <button
                  key={s.id}
                  className="net-chip"
                  onClick={() => toggleNet(s.id)}
                  disabled={!s.connected}
                  style={{
                    borderColor: on ? s.color : undefined,
                    background: on ? `${s.color}14` : undefined,
                    color: on ? s.color : undefined,
                  }}
                >
                  <Icon name={s.icon} size={12} />
                  {s.name}
                  {on && <Icon name="check" size={12} />}
                  {!s.connected && <span style={{ fontSize: 10 }}>not connected</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function HoldPicker({ hours, setHours }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div className="label" style={{ marginBottom: 6 }}>Hold for</div>
      <div className="row gap-3 row-wrap">
        {HOLD_OPTIONS.map((o) => (
          <button
            key={o.v}
            className={`hold-chip ${hours === o.v ? 'on' : ''}`}
            onClick={() => setHours(o.v)}
          >
            {o.l}
          </button>
        ))}
        <div className="input-group hold-number">
          <input
            className="input"
            type="number"
            min="0"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
          />
          <span className="input-group-icon" style={{ fontSize: 12 }}>hours</span>
        </div>
      </div>
    </div>
  );
}
