import { useState } from 'react';
import { Icon } from '../../shared/Icon.jsx';
import { useTracks, useUpdateTrack } from './hooks.js';
import { MusicLibrary } from './MusicLibrary.jsx';
import { MusicRules } from './MusicRules.jsx';
import './music.css';

/** Music page — two sub-tabs: library / rules. */
export function MusicConfig() {
  const { tracks, loading, refetch } = useTracks();
  const [updateTrack] = useUpdateTrack();
  const [tab, setTab] = useState('library');

  const toggleFavorite = async (id) => {
    const t = tracks.find((x) => x.id === id);
    if (!t) return;
    await updateTrack({ id, patch: { favorite: !t.favorite } });
    refetch();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Music
            <span className="count-chip">{tracks.length} tracks</span>
          </h1>
          <p className="page-subtitle music-warning">
            <Icon name="shield" size={13} />
            Do not upload copyrighted music. Only royalty-free or licensed tracks are allowed.
          </p>
        </div>
        <div className="row gap-4">
          <button className="btn"><Icon name="download" size={14} /> Import library</button>
          <button className="btn primary"><Icon name="upload" size={14} /> Upload MP3</button>
        </div>
      </div>

      <div className="subtabs">
        <button className={`subtab ${tab === 'library' ? 'active' : ''}`} onClick={() => setTab('library')}>
          <Icon name="music" size={12} /> Library
        </button>
        <button className={`subtab ${tab === 'rules' ? 'active' : ''}`} onClick={() => setTab('rules')}>
          <Icon name="zap" size={12} /> Selection rules
        </button>
      </div>

      {loading && tracks.length === 0 ? (
        <div className="empty">Loading…</div>
      ) : tab === 'library' ? (
        <MusicLibrary tracks={tracks} onToggleFavorite={toggleFavorite} />
      ) : (
        <MusicRules tracks={tracks} />
      )}
    </div>
  );
}
