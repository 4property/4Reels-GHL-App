import { useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';

export function TakeRow({ take, onSelect, onDelete, onRename }) {
  const [playing, setPlaying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(take.name);

  return (
    <div className={`take-row ${take.active ? 'active' : ''}`} onClick={onSelect}>
      <button
        className="icon-btn take-playbtn"
        onClick={(e) => { e.stopPropagation(); setPlaying(!playing); }}
      >
        <Icon name={playing ? 'pause' : 'play'} size={13} />
      </button>

      <div className="min-w-0">
        <div className="take-head">
          {editing ? (
            <input
              className="input take-rename-input"
              autoFocus
              value={name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => { onRename(name); setEditing(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { onRename(name); setEditing(false); }
              }}
            />
          ) : (
            <span
              className="take-name"
              onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
            >
              {take.name}
            </span>
          )}
          {take.active && <span className="badge take-badge-active">Active</span>}
          <span className="take-meta">
            · {take.duration} · {take.size} · {take.recorded}
          </span>
        </div>
        <div className="take-waveform">
          {take.waveform.map((h, i) => (
            <div
              key={i}
              className={`take-waveform-bar ${playing && i < take.waveform.length * 0.3 ? 'live' : ''}`}
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
      </div>

      <div className="row gap-2" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn" title="Rename" onClick={() => setEditing(true)}>
          <Icon name="edit" size={13} />
        </button>
        <button className="icon-btn" title="Download"><Icon name="download" size={13} /></button>
        <button className="icon-btn" title="Delete" onClick={onDelete}>
          <Icon name="trash" size={13} />
        </button>
      </div>
    </div>
  );
}
