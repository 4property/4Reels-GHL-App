import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';
import { Toggle } from '../../../shared/Toggle.jsx';
import { TakeRow } from './TakeRow.jsx';

/** The Record sub-mode of the Voiceover panel — mic console, countdown, takes list. */
export function VoiceoverRecorder({ takes, setTakes, reelDuration }) {
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [micArmed, setMicArmed] = useState(true);
  const [playbackDuringRec, setPlaybackDuringRec] = useState(true);
  const [mutedMusic, setMutedMusic] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setRecTime((t) => t + 0.1), 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const startCountdown = () => {
    setCountdown(3);
    let n = 3;
    const iv = setInterval(() => {
      n -= 1;
      setCountdown(n);
      if (n <= 0) {
        clearInterval(iv);
        setCountdown(0);
        setRecording(true);
        setRecTime(0);
      }
    }, 700);
  };

  const stopRecording = () => {
    setRecording(false);
    const bars = Array.from({ length: 60 }, () => 0.2 + Math.random() * 0.8);
    const newTake = {
      id: `t${takes.length + 1}`,
      name: `Take ${takes.length + 1}`,
      duration: fmtTime(recTime),
      size: `${(recTime * 0.04).toFixed(1)} MB`,
      recorded: 'just now',
      active: false,
      waveform: bars,
    };
    setTakes([...takes.map((t) => ({ ...t, active: false })), { ...newTake, active: true }]);
    setRecTime(0);
  };

  const setActive = (id) => setTakes(takes.map((t) => ({ ...t, active: t.id === id })));
  const deleteTake = (id) => setTakes(takes.filter((t) => t.id !== id));
  const renameTake = (id, name) => setTakes(takes.map((t) => (t.id === id ? { ...t, name } : t)));

  return (
    <>
      <div className={`vo-console ${recording ? 'recording' : ''}`}>
        {recording && (
          <div className="vo-rec-label">
            <span className="vo-rec-dot" />
            REC
          </div>
        )}

        {countdown > 0 && <div className="vo-countdown">{countdown}</div>}

        <div className="vo-console-grid">
          <MicMeter recording={recording} micArmed={micArmed} />

          <div className="vo-center">
            <button
              className={`vo-record-btn ${recording ? 'recording' : ''}`}
              onClick={() => {
                if (recording) stopRecording();
                else if (countdown === 0) startCountdown();
              }}
            >
              {recording ? (
                <div className="vo-record-btn-stop" />
              ) : (
                <div className="vo-record-btn-idle" />
              )}
            </button>
            <div className={`mono vo-timer ${recording ? 'on-dark' : ''}`}>
              {fmtTime(recTime)}
            </div>
            <div className={`vo-timer-hint ${recording ? 'on-dark' : ''}`}>
              {recording ? 'Click to stop' : `Max ${reelDuration}`}
            </div>
          </div>

          <div className="vo-toggles">
            <Toggle on={playbackDuringRec} onChange={setPlaybackDuringRec} label="Play reel while recording" sub="Read subtitles as the scenes change" />
            <Toggle on={mutedMusic} onChange={setMutedMusic} label="Mute music during takes" sub="Avoids bleed into the mic" />
            <Toggle on={micArmed} onChange={setMicArmed} label="Mic armed" sub="Use spacebar to start/stop" />
          </div>
        </div>

        {!recording && (
          <div className="vo-teleprompter">
            <Icon name="type" size={13} />
            <span>Subtitles appear on the preview as a teleprompter while you record.</span>
            <button className="btn sm ghost" style={{ marginLeft: 'auto' }}>Edit script</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="vo-takes-head">
          <div className="vo-takes-label">Takes · {takes.length}</div>
          <div className="row gap-4">
            <button className="btn sm"><Icon name="upload" size={12} /> Upload audio</button>
          </div>
        </div>

        {takes.length === 0 ? (
          <div className="panel-empty-box">
            No takes yet. Hit record to capture your first narration.
          </div>
        ) : (
          <div className="stack gap-4">
            {takes.map((t) => (
              <TakeRow
                key={t.id}
                take={t}
                onSelect={() => setActive(t.id)}
                onDelete={() => deleteTake(t.id)}
                onRename={(n) => renameTake(t.id, n)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function MicMeter({ recording, micArmed }) {
  return (
    <div>
      <div className={`vo-meter-label ${recording ? 'on-dark' : ''}`}>Input level</div>
      <div className="vo-meter-bars">
        {Array.from({ length: 22 }).map((_, i) => {
          const active = recording && Math.random() * 22 > i * 0.85;
          const hue = i < 14 ? '#22c55e' : i < 18 ? '#eab308' : '#ef4444';
          return (
            <div
              key={i}
              className="vo-meter-bar"
              style={{
                height: `${8 + i * 1.6}px`,
                background: active ? hue : recording ? 'rgba(255,255,255,0.08)' : 'var(--border)',
              }}
            />
          );
        })}
      </div>
      <div className={`vo-meter-foot ${recording ? 'on-dark' : ''}`}>
        <Icon name="mic" size={12} />
        {micArmed ? 'MacBook Pro Microphone' : 'No input'}
        <button className="btn sm ghost" style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: 11, color: 'inherit' }}>Change</button>
      </div>
    </div>
  );
}
