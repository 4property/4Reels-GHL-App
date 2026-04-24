import { useState } from 'react';
import { Cover } from '../../../shared/Cover.jsx';
import { Icon } from '../../../shared/Icon.jsx';
import { StatusBadge } from '../../../shared/StatusBadge.jsx';
import { useSocials } from '../../../app/providers/TenantProvider.jsx';
import { useReel } from '../hooks.js';
import { DescriptionsPanel } from './DescriptionsPanel.jsx';
import { PhotosPanel } from './PhotosPanel.jsx';
import { SlidesPanel } from './SlidesPanel.jsx';
import { SubtitlesPanel } from './SubtitlesPanel.jsx';
import { VoiceoverPanel } from './VoiceoverPanel.jsx';
import {
  CRANFORD_PHOTOS,
  CRANFORD_SUBTITLES,
  DEFAULT_DESCRIPTION,
  DEFAULT_SLIDES,
  DEFAULT_TAKE,
} from './defaults.js';
import './editor.css';

const TABS = [
  { id: 'photos', icon: 'image', label: 'Photos' },
  { id: 'subtitles', icon: 'type', label: 'Subtitles' },
  { id: 'descriptions', icon: 'share', label: 'Descriptions' },
  { id: 'slides', icon: 'film', label: 'Slides' },
  { id: 'voiceover', icon: 'mic', label: 'Voiceover' },
];

/** Full-screen overlay editor for a single reel. */
export function ReelEditor({ reelId, onClose }) {
  const { reel, loading } = useReel(reelId);

  if (loading || !reel) {
    return (
      <div className="editor-overlay">
        <div className="editor-loading">Loading reel…</div>
      </div>
    );
  }

  return <ReelEditorInner reel={reel} onClose={onClose} />;
}

function ReelEditorInner({ reel, onClose }) {
  const socials = useSocials();

  const [tab, setTab] = useState('photos');
  const [playing, setPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);

  const [photos, setPhotos] = useState(() =>
    CRANFORD_PHOTOS.map((p, i) => ({ id: `p${i}`, ...p, selected: i < 8 })),
  );

  const [subtitles, setSubtitles] = useState(CRANFORD_SUBTITLES);

  const [descs, setDescs] = useState(() => {
    const out = {};
    for (const s of socials) {
      out[s.id] = { enabled: reel.networks.includes(s.id), text: DEFAULT_DESCRIPTION };
    }
    return out;
  });
  const [activeNet, setActiveNet] = useState(reel.networks[0] || 'instagram');

  const [slides, setSlides] = useState(DEFAULT_SLIDES);

  // Voiceover state
  const [voTakes, setVoTakes] = useState([DEFAULT_TAKE]);
  const [voMode, setVoMode] = useState('record');
  const [voDucking, setVoDucking] = useState(60);
  const [voMusicVol, setVoMusicVol] = useState(35);
  const [voVoiceVol, setVoVoiceVol] = useState(90);
  const [voAiVoice, setVoAiVoice] = useState('emma-ie');
  const [voAiScript, setVoAiScript] = useState(subtitles.map((s) => s.text).join(' '));

  const selectedPhotos = photos.filter((p) => p.selected);
  const activePhotoKind = selectedPhotos[currentScene]?.kind || 'cranford-primary';
  const activePhotoLabel = selectedPhotos[currentScene]?.label;

  return (
    <div className="editor-overlay">
      <EditorHeader reel={reel} onClose={onClose} />

      <div className="editor-body">
        <PreviewColumn
          reel={reel}
          subtitles={subtitles}
          selectedPhotos={selectedPhotos}
          currentScene={currentScene}
          setCurrentScene={setCurrentScene}
          activePhotoKind={activePhotoKind}
          activePhotoLabel={activePhotoLabel}
          playing={playing}
          setPlaying={setPlaying}
        />

        <div className="editor-panels">
          <EditorTabs
            tab={tab}
            setTab={setTab}
            counts={{
              photos: `${selectedPhotos.length}/${photos.length}`,
              subtitles: subtitles.length,
              slides: slides.filter((s) => s.enabled).length,
            }}
            hasActiveTake={voTakes.some((t) => t.active)}
          />

          <div className="editor-panels-body scroll">
            {tab === 'photos' && <PhotosPanel photos={photos} setPhotos={setPhotos} />}
            {tab === 'subtitles' && (
              <SubtitlesPanel
                subtitles={subtitles}
                setSubtitles={setSubtitles}
                currentScene={currentScene}
                setCurrentScene={setCurrentScene}
              />
            )}
            {tab === 'descriptions' && (
              <DescriptionsPanel
                descs={descs}
                setDescs={setDescs}
                activeNet={activeNet}
                setActiveNet={setActiveNet}
              />
            )}
            {tab === 'slides' && <SlidesPanel slides={slides} setSlides={setSlides} />}
            {tab === 'voiceover' && (
              <VoiceoverPanel
                takes={voTakes}
                setTakes={setVoTakes}
                mode={voMode}
                setMode={setVoMode}
                ducking={voDucking}
                setDucking={setVoDucking}
                musicVol={voMusicVol}
                setMusicVol={setVoMusicVol}
                voiceVol={voVoiceVol}
                setVoiceVol={setVoVoiceVol}
                aiVoice={voAiVoice}
                setAiVoice={setVoAiVoice}
                aiScript={voAiScript}
                setAiScript={setVoAiScript}
                reelDuration={reel.duration}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorHeader({ reel, onClose }) {
  return (
    <div className="editor-header">
      <button className="btn ghost" onClick={onClose}>
        <Icon name="chevron-left" size={16} /> Back to reels
      </button>
      <div className="editor-header-sep" />
      <div className="editor-header-meta">
        <div className="editor-header-title">{reel.title}</div>
        <div className="editor-header-sub">
          {reel.address} · <span className="mono">{reel.id}</span>
        </div>
      </div>
      <StatusBadge status={reel.status} />
      {reel.publishStatus && <StatusBadge status={reel.publishStatus} />}
      <div className="editor-header-sep" />
      <button className="btn"><Icon name="zap" size={14} /> Regenerate with AI</button>
      <button className="btn"><Icon name="download" size={14} /> Export</button>
      <button className="btn primary"><Icon name="send" size={14} /> Publish</button>
    </div>
  );
}

function PreviewColumn({
  reel, subtitles, selectedPhotos, currentScene, setCurrentScene,
  activePhotoKind, activePhotoLabel, playing, setPlaying,
}) {
  return (
    <div className="editor-preview-col scroll">
      <div className="editor-preview-phone">
        <Cover kind={activePhotoKind} ratio="3/4" label={activePhotoLabel} video />

        <div className="editor-preview-brand">
          <img className="editor-preview-brand-logo" src="/assets/ck-logo.png" alt="CK" />
          CKP Estate Agents
        </div>

        <div className="editor-preview-caption">
          {subtitles[currentScene]?.text || ''}
        </div>

        <button
          className={`editor-preview-playbtn ${playing ? 'playing' : ''}`}
          onClick={() => setPlaying(!playing)}
        >
          {!playing && (
            <div className="editor-preview-playbtn-icon">
              <Icon name="play" size={20} />
            </div>
          )}
        </button>
      </div>

      <div className="editor-preview-controls">
        <div className="editor-preview-transport">
          <button className="icon-btn editor-preview-transport-btn" onClick={() => setPlaying(!playing)}>
            <Icon name={playing ? 'pause' : 'play'} size={14} />
          </button>
          <div className="mono editor-preview-timecode">
            0:{String(currentScene * 4).padStart(2, '0')} / {reel.duration}
          </div>
          <div className="grow" />
          <button className="icon-btn" title="Music"><Icon name="music" size={14} /></button>
          <button className="icon-btn" title="Captions"><Icon name="type" size={14} /></button>
        </div>

        <div className="editor-preview-strip">
          {selectedPhotos.map((p, i) => (
            <button
              key={p.id}
              className={`editor-preview-scene ${currentScene === i ? 'active' : ''}`}
              onClick={() => setCurrentScene(i)}
            >
              <Cover
                kind={p.kind}
                ratio="auto"
                style={{ aspectRatio: 'auto', width: '100%', height: '100%', borderRadius: 2 }}
              />
            </button>
          ))}
        </div>

        <div className="editor-preview-meta">
          <span>{selectedPhotos.length} scenes · {reel.duration}</span>
          <span className="row gap-3">
            <Icon name="music" size={11} /> {reel.music}
          </span>
        </div>
      </div>
    </div>
  );
}

function EditorTabs({ tab, setTab, counts, hasActiveTake }) {
  return (
    <div className="editor-tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`subtab ${tab === t.id ? 'active' : ''}`}
          onClick={() => setTab(t.id)}
        >
          <Icon name={t.icon} size={12} /> {t.label}
          {counts[t.id] !== undefined && <span className="badge">{counts[t.id]}</span>}
          {t.id === 'voiceover' && hasActiveTake && <span className="editor-tab-dot" />}
        </button>
      ))}
    </div>
  );
}
