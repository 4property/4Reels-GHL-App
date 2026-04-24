import { Icon } from '../../../shared/Icon.jsx';

/** Subtitles tab — inline-editable list of timed lines. */
export function SubtitlesPanel({ subtitles, setSubtitles, currentScene, setCurrentScene }) {
  const update = (id, changes) =>
    setSubtitles(subtitles.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  const del = (id) => setSubtitles(subtitles.filter((s) => s.id !== id));

  return (
    <div>
      <div className="panel-head">
        <div>
          <div className="panel-title">Subtitles</div>
          <div className="panel-sub">AI-generated. Edit text and timing, or regenerate.</div>
        </div>
        <div className="row gap-4">
          <button className="btn sm"><Icon name="zap" size={12} /> Regenerate</button>
          <button className="btn sm"><Icon name="plus" size={12} /> Add line</button>
        </div>
      </div>

      <div className="stack gap-4">
        {subtitles.map((s, i) => (
          <div
            key={s.id}
            className={`subtitle-row ${currentScene === i ? 'active' : ''}`}
            onClick={() => setCurrentScene(i)}
          >
            <span className="subtitle-index">#{i + 1}</span>
            <div className="row gap-2">
              <input
                className="input mono subtitle-time"
                value={s.start}
                onChange={(e) => update(s.id, { start: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="subtle">→</span>
              <input
                className="input mono subtitle-time"
                value={s.end}
                onChange={(e) => update(s.id, { end: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <input
              className="input subtitle-text"
              value={s.text}
              onChange={(e) => update(s.id, { text: e.target.value })}
              onClick={(e) => e.stopPropagation()}
            />
            <button className="icon-btn" onClick={(e) => { e.stopPropagation(); del(s.id); }}>
              <Icon name="trash" size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="panel-hint">
        <Icon name="type" size={14} />
        Subtitle style inherits from your brand font. Change it in{' '}
        <span className="t-accent t-medium">Brand</span>.
      </div>
    </div>
  );
}
