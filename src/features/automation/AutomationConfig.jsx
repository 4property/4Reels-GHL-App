import { useState } from 'react';
import { Icon } from '../../shared/Icon.jsx';
import { Toggle } from '../../shared/Toggle.jsx';
import { AutoPublishDetails } from './AutoPublishDetails.jsx';
import { ModeCard } from './ModeCard.jsx';
import { ReviewModeDetails } from './ReviewModeDetails.jsx';
import './automation.css';

/** Automation page — the core "auto vs review-first" decision for publishing. */
export function AutomationConfig() {
  const [publishMode, setPublishMode] = useState('auto');
  const [reviewWindow, setReviewWindow] = useState(true);
  const [reviewWindowHours, setReviewWindowHours] = useState(1);
  const [quietHours, setQuietHours] = useState(true);
  const [skipWeekends, setSkipWeekends] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [regenOnUpdate, setRegenOnUpdate] = useState(false);
  const [reviewEmails, setReviewEmails] = useState('marvin@ckpestateagents.ie, sarah@ckpestateagents.ie');
  const [autoIncludeNetworks, setAutoIncludeNetworks] = useState(['instagram', 'tiktok', 'facebook', 'gmb']);

  const toggleNet = (id) =>
    setAutoIncludeNetworks((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Automation</h1>
          <p className="page-subtitle">What happens when a new property lands via webhook, WordPress or CRM.</p>
        </div>
        <button className="btn primary"><Icon name="check" size={14} /> Save</button>
      </div>

      <ModePicker publishMode={publishMode} setPublishMode={setPublishMode} />

      <div className="stack gap-8">
        {publishMode === 'auto' ? (
          <AutoPublishDetails
            reviewWindow={reviewWindow}
            setReviewWindow={setReviewWindow}
            reviewWindowHours={reviewWindowHours}
            setReviewWindowHours={setReviewWindowHours}
            quietHours={quietHours}
            setQuietHours={setQuietHours}
            skipWeekends={skipWeekends}
            setSkipWeekends={setSkipWeekends}
            autoIncludeNetworks={autoIncludeNetworks}
            toggleNet={toggleNet}
          />
        ) : (
          <ReviewModeDetails
            reviewEmails={reviewEmails}
            setReviewEmails={setReviewEmails}
            quietHours={quietHours}
            setQuietHours={setQuietHours}
          />
        )}

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Rendering defaults</div>
              <div className="card-subtitle">Applied to every render.</div>
            </div>
          </div>
          <div className="card-body stack" style={{ gap: 18 }}>
            <Toggle
              on={captions}
              onChange={setCaptions}
              label="Auto-generate subtitles"
              sub="AI-generated subtitles, editable before publish."
            />
            <hr className="sep" style={{ margin: 0 }} />
            <Toggle
              on={regenOnUpdate}
              onChange={setRegenOnUpdate}
              label="Re-render when property data changes"
              sub="If price or photos update upstream, regenerate the reel automatically."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModePicker({ publishMode, setPublishMode }) {
  return (
    <div className="auto-mode-banner">
      <div className="auto-mode-banner-inner">
        <div className="auto-mode-label">
          <span className="badge accent t-semibold">
            <Icon name="zap" size={10} /> Core setting
          </span>
          <span className="t-sm t-muted">Applied to every new property from now on</span>
        </div>
        <h2 className="auto-mode-title">How should 4reels handle new reels?</h2>
        <p className="auto-mode-sub">Pick one. You can always override per-reel from the editor.</p>

        <div className="auto-mode-options">
          <ModeCard
            selected={publishMode === 'auto'}
            onClick={() => setPublishMode('auto')}
            icon="zap"
            tone="accent"
            title="Publish automatically"
            tagline="Hands-off · fastest time to post"
            points={[
              'Reel is published to connected networks as soon as it finishes rendering',
              'No human action required',
              'Best for agencies with high listing volume',
            ]}
          />
          <ModeCard
            selected={publishMode === 'review'}
            onClick={() => setPublishMode('review')}
            icon="bell"
            tone="warning"
            title="Send email before publishing"
            tagline="Review-first · always a human in the loop"
            points={[
              'Every new reel waits in "Needs review"',
              'You get an email with a 1-click approve or edit link',
              'Nothing is posted until someone confirms',
            ]}
          />
        </div>
      </div>
    </div>
  );
}
