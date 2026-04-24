import { useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';
import { GoogleReviewModal } from './GoogleReviewModal.jsx';
import { SlideRow } from './SlideRow.jsx';

const ADD_OPTIONS = [
  { id: 'intro-video', icon: 'play', label: 'Intro video', sub: 'Custom intro for this reel' },
  { id: 'outro-video', icon: 'film', label: 'Outro video', sub: 'Custom closing frame' },
  { id: 'google-review', icon: 'star', label: 'Google review', sub: 'Paste a review URL' },
  { id: 'text', icon: 'type', label: 'Text slide', sub: 'Plain text on brand colors' },
  { id: 'photo', icon: 'image', label: 'Photo slide', sub: 'Single photo with caption' },
];

const PRESETS = {
  'intro-video': { kind: 'intro-video', label: 'Intro · Custom', duration: 2.5 },
  'outro-video': { kind: 'outro-video', label: 'Outro · Custom', duration: 3 },
  'google-review': { kind: 'google-review', label: 'Google Review', duration: 5, url: '', status: 'empty' },
  text: { kind: 'text', label: 'Text slide', duration: 3, text: 'New price!' },
  photo: { kind: 'photo', label: 'Photo slide', duration: 2.5 },
};

/** Slides tab — extra intro/outro/review/text/photo slides inserted into the reel. */
export function SlidesPanel({ slides, setSlides }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);

  const move = (from, to) => {
    const next = [...slides];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setSlides(next);
  };

  const toggle = (id) => setSlides(slides.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  const remove = (id) => setSlides(slides.filter((s) => s.id !== id));
  const update = (id, changes) => setSlides(slides.map((s) => (s.id === id ? { ...s, ...changes } : s)));

  const addSlide = (kind) => {
    const base = { id: `sl${Date.now()}`, enabled: true, locked: false, source: 'custom' };
    setSlides([...slides, { ...base, ...PRESETS[kind] }]);
    setShowAddMenu(false);
    if (kind === 'google-review') setReviewModal(true);
  };

  const reviewTarget = slides.find(
    (s) => s.kind === 'google-review' && (reviewModal === true || s.id === reviewModal),
  );

  return (
    <div>
      <div className="panel-head">
        <div>
          <div className="panel-title">Extra slides</div>
          <div className="panel-sub">
            Intro/outro, Google reviews and custom slides inserted into this reel. Drag to reorder.
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="btn primary" onClick={() => setShowAddMenu(!showAddMenu)}>
            <Icon name="plus" size={13} /> Add slide
          </button>
          {showAddMenu && (
            <div className="slide-add-menu">
              {ADD_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className="slide-add-option"
                  onClick={() => addSlide(opt.id)}
                >
                  <span className="slide-add-icon">
                    <Icon name={opt.icon} size={13} />
                  </span>
                  <span className="grow">
                    <div className="slide-add-label">{opt.label}</div>
                    <div className="slide-add-sub">{opt.sub}</div>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="stack gap-4">
        {slides.map((s, i) => (
          <SlideRow
            key={s.id}
            slide={s}
            onToggle={() => toggle(s.id)}
            onRemove={() => remove(s.id)}
            onUpdate={(ch) => update(s.id, ch)}
            onOpenReview={() => setReviewModal(s.id)}
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragIdx !== null && dragIdx !== i) {
                move(dragIdx, i);
                setDragIdx(i);
              }
            }}
            onDragEnd={() => setDragIdx(null)}
            dragging={dragIdx === i}
          />
        ))}
      </div>

      {slides.length === 0 && (
        <div className="panel-empty-box">
          No extra slides yet. Add an intro, outro or Google review.
        </div>
      )}

      <div className="panel-hint">
        <Icon name="zap" size={14} />
        Defaults come from <span className="t-accent t-medium">Defaults · Intro & outro</span>.
        Changes here only affect this reel.
      </div>

      {reviewModal && (
        <GoogleReviewModal
          slide={reviewTarget}
          onClose={() => setReviewModal(false)}
          onSave={(data) => {
            if (reviewTarget) update(reviewTarget.id, { ...data, status: 'generated' });
            setReviewModal(false);
          }}
        />
      )}
    </div>
  );
}
