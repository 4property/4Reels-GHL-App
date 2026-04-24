import { Segmented } from '../../../shared/Segmented.jsx';
import { Toggle } from '../../../shared/Toggle.jsx';

export function CaptionsTab({ state, set }) {
  const { captionLang, captionCase, emojiInCaptions } = state;
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">AI caption generation</div>
          <div className="card-subtitle">How the AI writes the subtitles on the video.</div>
        </div>
      </div>
      <div className="card-body stack" style={{ gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <div className="label">Caption language</div>
            <select className="select" value={captionLang} onChange={(e) => set({ captionLang: e.target.value })}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>
          <div className="field">
            <div className="label">Case style</div>
            <Segmented
              options={[
                { value: 'sentence', label: 'Sentence' },
                { value: 'title', label: 'Title Case' },
                { value: 'upper', label: 'UPPER' },
              ]}
              value={captionCase}
              onChange={(v) => set({ captionCase: v })}
            />
          </div>
        </div>
        <Toggle
          on={emojiInCaptions}
          onChange={(v) => set({ emojiInCaptions: v })}
          label="Include emoji"
          sub="AI may add relevant emoji (🏡 💰 📍) in subtitle text."
        />
      </div>
    </div>
  );
}
