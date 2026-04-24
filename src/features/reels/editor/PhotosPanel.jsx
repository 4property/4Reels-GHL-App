import { useState } from 'react';
import { Cover } from '../../../shared/Cover.jsx';
import { Icon } from '../../../shared/Icon.jsx';

/** Photos tab — grid with AI scores, drag-to-reorder, click-to-toggle. */
export function PhotosPanel({ photos, setPhotos }) {
  const [dragIdx, setDragIdx] = useState(null);

  const toggle = (id) => setPhotos(photos.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));

  const move = (from, to) => {
    const next = [...photos];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setPhotos(next);
  };

  return (
    <div>
      <div className="panel-head">
        <div>
          <div className="panel-title">Property photos</div>
          <div className="panel-sub">AI pre-selected the top 8. Drag to reorder, click to include/exclude.</div>
        </div>
        <div className="row gap-4">
          <button className="btn sm"><Icon name="zap" size={12} /> Re-run AI selection</button>
          <button className="btn sm"><Icon name="upload" size={12} /> Upload</button>
        </div>
      </div>

      <div className="photos-grid">
        {photos.map((p, i) => (
          <div
            key={p.id}
            className={`photo-tile ${p.selected ? 'selected' : 'unselected'}`}
            draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragIdx !== null && dragIdx !== i) {
                move(dragIdx, i);
                setDragIdx(i);
              }
            }}
            onDragEnd={() => setDragIdx(null)}
            onClick={() => toggle(p.id)}
          >
            <Cover kind={p.kind} ratio="3/4" label={p.label} />
            <div className={`photo-badge-index ${p.selected ? 'on' : 'off'}`}>
              {p.selected ? `#${photos.filter((x) => x.selected).indexOf(p) + 1}` : '—'}
            </div>
            <div className="photo-badge-ai">AI {p.aiScore}</div>
            <div className="photo-foot">
              <span className="photo-label">{p.label}</span>
              <span className="drag-handle" style={{ color: 'white' }}>
                <Icon name="grip" size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
