import { Icon } from '../../../shared/Icon.jsx';
import { Slider } from './Slider.jsx';
import { VoiceoverAI } from './VoiceoverAI.jsx';
import { VoiceoverRecorder } from './VoiceoverRecorder.jsx';

/**
 * Voiceover tab — mode switch (record vs AI) + global mix controls.
 * The two mode bodies live in their own files.
 */
export function VoiceoverPanel({
  takes, setTakes,
  mode, setMode,
  ducking, setDucking,
  musicVol, setMusicVol,
  voiceVol, setVoiceVol,
  aiVoice, setAiVoice,
  aiScript, setAiScript,
  reelDuration,
}) {
  const activeTake = takes.find((t) => t.active);

  return (
    <div>
      <div className="panel-head">
        <div>
          <div className="panel-title">Voiceover</div>
          <div className="panel-sub">Record yourself narrating, or let AI read the script.</div>
        </div>
        <div className="vo-mode-switch">
          <button
            className={`btn sm ${mode === 'record' ? 'primary' : 'ghost'}`}
            onClick={() => setMode('record')}
          >
            <Icon name="mic" size={13} /> Record
          </button>
          <button
            className={`btn sm ${mode === 'ai' ? 'primary' : 'ghost'}`}
            onClick={() => setMode('ai')}
          >
            <Icon name="zap" size={13} /> AI voice
          </button>
        </div>
      </div>

      {mode === 'record' ? (
        <VoiceoverRecorder takes={takes} setTakes={setTakes} reelDuration={reelDuration} />
      ) : (
        <VoiceoverAI
          aiVoice={aiVoice}
          setAiVoice={setAiVoice}
          aiScript={aiScript}
          setAiScript={setAiScript}
        />
      )}

      <div className="card" style={{ marginTop: 20, padding: 16 }}>
        <div className="vo-mix-head">
          <Icon name="headphones" size={14} />
          <div className="t-base t-semibold">Audio mix</div>
          {activeTake && mode === 'record' && (
            <span className="vo-mix-active">
              Using <span className="vo-mix-active-name">{activeTake.name}</span>
            </span>
          )}
        </div>
        <div className="stack gap-7">
          <Slider label="Voice volume" value={voiceVol} onChange={setVoiceVol} unit="%" icon="mic" />
          <Slider label="Music volume" value={musicVol} onChange={setMusicVol} unit="%" icon="music" />
          <Slider
            label="Music ducking"
            value={ducking}
            onChange={setDucking}
            unit="%"
            icon="volume"
            hint="Lowers music by this amount whenever the voice is speaking."
          />
        </div>
      </div>
    </div>
  );
}
