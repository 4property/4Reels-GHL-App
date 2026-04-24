import { useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';
import { Toggle } from '../../../shared/Toggle.jsx';

const TEMPLATES = [
  { id: 'testimonial-light', label: 'Light card', bg: '#fef3c7' },
  { id: 'testimonial-dark', label: 'Dark card', bg: '#0f1729' },
  { id: 'quote', label: 'Big quote', bg: '#ffffff' },
];

const FAKE_REVIEW = {
  author: 'Aoife M.',
  rating: 5,
  text: 'Excellent service from start to finish. Sold our apartment above asking in under two weeks. Cannot recommend CKP highly enough.',
  date: '3 weeks ago',
  avatarColor: '#22c55e',
};

export function GoogleReviewModal({ slide, onClose, onSave }) {
  const [url, setUrl] = useState(slide?.url || '');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(
    slide?.status === 'generated'
      ? {
          author: slide.author || FAKE_REVIEW.author,
          rating: slide.rating || FAKE_REVIEW.rating,
          text: slide.reviewText || FAKE_REVIEW.text,
          date: slide.reviewDate || FAKE_REVIEW.date,
          avatarColor: FAKE_REVIEW.avatarColor,
        }
      : null,
  );
  const [template, setTemplate] = useState(slide?.template || 'testimonial-light');
  const [showAuthor, setShowAuthor] = useState(slide?.showAuthor !== false);
  const [showDate, setShowDate] = useState(slide?.showDate !== false);

  const fetchReview = () => {
    setLoading(true);
    setTimeout(() => {
      setPreview(FAKE_REVIEW);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="review-modal-backdrop" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <span className="review-modal-header-icon">
            <Icon name="star-fill" size={15} />
          </span>
          <div className="grow">
            <div className="t-md t-semibold">Google review slide</div>
            <div className="panel-sub">
              Paste the URL of a Google review. The backend will generate a branded slide.
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15} /></button>
        </div>

        <div className="review-modal-body">
          <div className="stack gap-7">
            <div className="field">
              <div className="label">Google review URL</div>
              <div className="row gap-4">
                <input
                  className="input grow mono"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://g.page/r/CK...YQ/review"
                  style={{ fontSize: 12 }}
                />
                <button className="btn primary" onClick={fetchReview} disabled={!url || loading}>
                  {loading ? (<><Icon name="zap" size={13} /> Fetching…</>) : (<><Icon name="download" size={13} /> Fetch</>)}
                </button>
              </div>
              <div className="hint" style={{ marginTop: 6 }}>
                Supports Google Maps review links and Google Business Profile share URLs.
              </div>
            </div>

            {preview && (
              <>
                <hr className="sep" />
                <div>
                  <div className="label" style={{ marginBottom: 8 }}>Review content</div>
                  <div className="review-card">
                    <div className="review-card-head">
                      <div className="review-avatar" style={{ background: preview.avatarColor }}>
                        {preview.author.charAt(0)}
                      </div>
                      <div className="grow">
                        <div className="t-base t-semibold">{preview.author}</div>
                        <div className="t-xs t-muted">{preview.date}</div>
                      </div>
                      <div className="review-stars">{'★'.repeat(preview.rating)}</div>
                    </div>
                    <textarea
                      className="textarea review-textarea"
                      defaultValue={preview.text}
                    />
                  </div>
                </div>

                <div>
                  <div className="label" style={{ marginBottom: 8 }}>Template</div>
                  <div className="review-templates">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        className={`review-template ${template === t.id ? 'active' : ''}`}
                        onClick={() => setTemplate(t.id)}
                      >
                        <div
                          className={`review-template-swatch ${t.id === 'testimonial-dark' ? 'dark' : 'light'}`}
                          style={{ background: t.bg }}
                        >★</div>
                        <div className="review-template-label">{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="row gap-8">
                  <Toggle on={showAuthor} onChange={setShowAuthor} label="Show author name" />
                  <Toggle on={showDate} onChange={setShowDate} label="Show date" />
                </div>
              </>
            )}
          </div>

          <ReviewSlidePreview
            preview={preview}
            template={template}
            showAuthor={showAuthor}
            showDate={showDate}
          />
        </div>

        <div className="review-modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn primary"
            disabled={!preview}
            onClick={() => onSave({
              url, template, showAuthor, showDate,
              author: preview?.author, rating: preview?.rating,
              reviewText: preview?.text, reviewDate: preview?.date,
              label: `Review · ${preview?.author || ''}`,
            })}
          >
            <Icon name="check" size={13} /> Add slide to reel
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewSlidePreview({ preview, template, showAuthor, showDate }) {
  const bg =
    template === 'testimonial-dark' ? '#0f1729'
    : template === 'quote' ? '#fff'
    : 'linear-gradient(180deg, #fef3c7, #fde68a)';

  return (
    <div>
      <div className="review-preview-label">Slide preview · 3:4</div>
      <div
        className="review-preview-slide"
        style={{
          background: bg,
          color: template === 'testimonial-dark' ? 'white' : '#1f2937',
        }}
      >
        {preview ? (
          <>
            <div className="review-preview-stars">{'★'.repeat(preview.rating)}</div>
            <div
              className="review-preview-body"
              style={{ fontWeight: template === 'quote' ? 600 : 500 }}
            >
              {template === 'quote' ? '“' : ''}{preview.text}{template === 'quote' ? '”' : ''}
            </div>
            {showAuthor && (
              <div className="review-preview-author">
                <div className="review-preview-avatar" style={{ background: preview.avatarColor }}>
                  {preview.author.charAt(0)}
                </div>
                <div className="review-preview-meta">
                  <div className="review-preview-meta-name">{preview.author}</div>
                  {showDate && <div className="review-preview-meta-date">{preview.date} · Google</div>}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="review-preview-empty">
            <Icon name="star" size={28} style={{ opacity: 0.4 }} />
            <div style={{ marginTop: 8 }}>Paste a URL and click Fetch</div>
          </div>
        )}
      </div>
    </div>
  );
}
