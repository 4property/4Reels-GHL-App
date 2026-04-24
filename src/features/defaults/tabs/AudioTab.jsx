import { Toggle } from '../../../shared/Toggle.jsx';

export function AudioTab({ state, set }) {
  const { musicVolume, fadeIn, fadeOut, voiceover, duckOnVoice } = state;
  return (
    <div className="card">
      <div className="card-header"><div><div className="card-title">Mix</div></div></div>
      <div className="card-body stack" style={{ gap: 14 }}>
        <div className="field">
          <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Music volume <span className="mono">{musicVolume}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={musicVolume}
            onChange={(e) => set({ musicVolume: +e.target.value })}
            style={{ width: '100%' }}
          />
        </div>
        <Toggle on={fadeIn} onChange={(v) => set({ fadeIn: v })} label="Fade music in" sub="1.5 second fade at the start." />
        <Toggle on={fadeOut} onChange={(v) => set({ fadeOut: v })} label="Fade music out" sub="2 second fade at the end." />
        <Toggle on={voiceover} onChange={(v) => set({ voiceover: v })} label="AI voiceover" sub="Read the script aloud over the music (beta)." />
        <Toggle on={duckOnVoice} onChange={(v) => set({ duckOnVoice: v })} label="Duck music under voiceover" sub="Lower music volume when narration is active." />
      </div>
    </div>
  );
}
