import { useState } from 'react';
import { Icon } from '../../shared/Icon.jsx';
import { INITIAL_DEFAULTS } from './initialState.js';
import { LivePreview } from './LivePreview.jsx';
import { AudioTab } from './tabs/AudioTab.jsx';
import { CaptionsTab } from './tabs/CaptionsTab.jsx';
import { FormatTab } from './tabs/FormatTab.jsx';
import { IntroOutroTab } from './tabs/IntroOutroTab.jsx';
import { SubtitlesTab } from './tabs/SubtitlesTab.jsx';
import { VideoTab } from './tabs/VideoTab.jsx';
import './defaults.css';

const TABS = [
  { id: 'format', label: 'Format & locale', icon: 'building' },
  { id: 'subtitles', label: 'Subtitles', icon: 'type' },
  { id: 'video', label: 'Video & timing', icon: 'film' },
  { id: 'intro-outro', label: 'Intro & outro', icon: 'play' },
  { id: 'audio', label: 'Audio', icon: 'music' },
  { id: 'captions', label: 'Caption generation', icon: 'zap' },
];

/** Reel defaults page — left sidebar picks the tab, right column previews. */
export function ReelDefaultsConfig() {
  const [tab, setTab] = useState('format');
  const [state, setState] = useState(INITIAL_DEFAULTS);

  const set = (patch) => setState((prev) => ({ ...prev, ...patch }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Defaults</h1>
          <p className="page-subtitle">Global settings applied to every reel. Individual reels can override these in the editor.</p>
        </div>
        <div className="row gap-4">
          <button className="btn"><Icon name="download" size={14} /> Reset to system defaults</button>
          <button className="btn primary"><Icon name="check" size={14} /> Save defaults</button>
        </div>
      </div>

      <div className="defaults-layout">
        <SideNav tab={tab} setTab={setTab} />

        <div className="defaults-content">
          <div className="stack gap-8">
            {tab === 'format' && <FormatTab state={state} set={set} />}
            {tab === 'subtitles' && <SubtitlesTab state={state} set={set} />}
            {tab === 'video' && <VideoTab state={state} set={set} />}
            {tab === 'intro-outro' && <IntroOutroTab state={state} set={set} />}
            {tab === 'audio' && <AudioTab state={state} set={set} />}
            {tab === 'captions' && <CaptionsTab state={state} set={set} />}
          </div>

          <LivePreview state={state} />
        </div>
      </div>
    </div>
  );
}

function SideNav({ tab, setTab }) {
  return (
    <div className="card defaults-sidenav">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`defaults-nav-btn ${tab === t.id ? 'active' : ''}`}
          onClick={() => setTab(t.id)}
        >
          <Icon name={t.icon} size={14} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
