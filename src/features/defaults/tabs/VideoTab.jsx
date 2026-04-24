import { Segmented } from '../../../shared/Segmented.jsx';
import { Toggle } from '../../../shared/Toggle.jsx';

const TRANSITIONS = [
  { id: 'hard-cut', label: 'Hard cut' },
  { id: 'crossfade', label: 'Crossfade' },
  { id: 'slide', label: 'Slide' },
  { id: 'zoom', label: 'Zoom' },
];

export function VideoTab({ state, set }) {
  const {
    aspect, resolution, fps, duration, minDuration, maxDuration,
    transition, kenBurns, introCard, outroCard,
  } = state;

  return (
    <>
      <div className="card">
        <div className="card-header"><div><div className="card-title">Canvas</div></div></div>
        <div className="card-body stack" style={{ gap: 14 }}>
          <div className="field">
            <div className="label">Aspect ratio</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {['9:16', '3:4', '1:1', '4:5'].map((a) => (
                <button
                  key={a}
                  onClick={() => set({ aspect: a })}
                  className={`btn sm ${aspect === a ? 'primary' : ''}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <div className="label">Resolution</div>
              <select className="select" value={resolution} onChange={(e) => set({ resolution: e.target.value })}>
                <option>720p</option><option>1080p</option><option>1440p</option><option>4K</option>
              </select>
            </div>
            <div className="field">
              <div className="label">Frame rate</div>
              <Segmented
                options={[{ value: '24', label: '24' }, { value: '30', label: '30' }, { value: '60', label: '60' }]}
                value={fps}
                onChange={(v) => set({ fps: v })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Duration</div>
            <div className="card-subtitle">How long the AI targets when building the reel.</div>
          </div>
        </div>
        <div className="card-body stack" style={{ gap: 14 }}>
          <div className="field">
            <div className="label">Strategy</div>
            <Segmented
              options={[
                { value: 'auto', label: 'Auto (by photo count)' },
                { value: 'fixed', label: 'Fixed range' },
              ]}
              value={duration}
              onChange={(v) => set({ duration: v })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Min duration <span className="mono">{minDuration}s</span>
              </div>
              <input
                type="range" min="10" max="60" value={minDuration}
                onChange={(e) => set({ minDuration: +e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div className="field">
              <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Max duration <span className="mono">{maxDuration}s</span>
              </div>
              <input
                type="range" min="20" max="90" value={maxDuration}
                onChange={(e) => set({ maxDuration: +e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><div className="card-title">Motion & transitions</div></div></div>
        <div className="card-body stack" style={{ gap: 14 }}>
          <div className="field">
            <div className="label">Transition between scenes</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {TRANSITIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => set({ transition: o.id })}
                  className={`btn sm ${transition === o.id ? 'primary' : ''}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <Toggle on={kenBurns} onChange={(v) => set({ kenBurns: v })} label="Ken Burns effect" sub="Gentle pan & zoom on every photo." />
          <Toggle on={introCard} onChange={(v) => set({ introCard: v })} label="Show intro card" sub="Brief branded frame at the start." />
          <Toggle on={outroCard} onChange={(v) => set({ outroCard: v })} label="Show outro card" sub="CTA frame at the end (configured in Brand)." />
        </div>
      </div>
    </>
  );
}
