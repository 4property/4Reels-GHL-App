import { Icon } from '../../../shared/Icon.jsx';
import { AI_VOICES } from './aiVoices.js';

/** The AI sub-mode of the Voiceover panel — voice picker + script textarea. */
export function VoiceoverAI({ aiVoice, setAiVoice, aiScript, setAiScript }) {
  return (
    <div className="stack gap-8">
      <div className="card" style={{ padding: 16 }}>
        <div className="label" style={{ marginBottom: 10 }}>AI voice</div>
        <div className="vo-ai-voice-grid">
          {AI_VOICES.map((v) => (
            <button
              key={v.id}
              className={`stack vo-ai-voice ${aiVoice === v.id ? 'active' : ''}`}
              onClick={() => setAiVoice(v.id)}
            >
              <div className="vo-ai-voice-head">
                <span className="vo-ai-voice-name">{v.name}</span>
                <span className="badge">{v.gender}</span>
              </div>
              <div className="vo-ai-voice-sub">{v.accent} · {v.tone}</div>
              <button
                className="btn sm ghost vo-ai-voice-preview"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon name="play" size={10} /> Preview
              </button>
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div className="vo-ai-script-head">
          <div className="label">Script</div>
          <div className="row gap-4">
            <button className="btn sm"><Icon name="copy" size={12} /> Copy from subtitles</button>
            <button className="btn sm"><Icon name="zap" size={12} /> Rewrite with AI</button>
          </div>
        </div>
        <textarea
          className="textarea vo-ai-script-area"
          value={aiScript}
          onChange={(e) => setAiScript(e.target.value)}
        />
        <div className="vo-ai-script-foot">
          <span>~{Math.max(1, Math.round(aiScript.split(/\s+/).length / 2.5))}s at normal pace</span>
          <span className="mono">{aiScript.length} chars</span>
        </div>
      </div>

      <div className="vo-actions">
        <button className="btn"><Icon name="play" size={13} /> Preview voice</button>
        <button className="btn primary"><Icon name="zap" size={13} /> Generate voiceover</button>
      </div>
    </div>
  );
}
