import { useState } from 'react';
import { Icon } from '../../shared/Icon.jsx';
import { Segmented } from '../../shared/Segmented.jsx';
import { Waveform } from './Waveform.jsx';

const MOODS = ['warm', 'relaxed', 'energetic', 'modern', 'luxurious', 'cinematic', 'acoustic', 'minimal'];

export function MusicLibrary({ tracks, onToggleFavorite }) {
  const [playing, setPlaying] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = tracks.filter((t) => {
    if (filter === 'favorites' && !t.favorite) return false;
    if (filter !== 'all' && filter !== 'favorites' && !t.mood.includes(filter)) return false;
    if (search && !`${t.title} ${t.artist}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-header music-card-head">
        <div className="row gap-4 grow min-w-0 row-wrap">
          <div className="search music-search">
            <Icon name="search" size={14} />
            <input placeholder="Search tracks, artists" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Segmented
            options={[
              { value: 'all', label: 'All' },
              { value: 'favorites', label: '⭐ Favorites' },
              ...MOODS.slice(0, 4).map((m) => ({ value: m, label: m })),
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="muted t-sm">
          {tracks.filter((t) => t.favorite).length} favorites used in the random pool
        </div>
      </div>

      <div className="music-table-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: 40 }}></th>
            <th>Track</th>
            <th style={{ width: 220 }}>Waveform</th>
            <th>BPM</th>
            <th>Duration</th>
            <th>Mood</th>
            <th>Used for</th>
            <th style={{ width: 40 }}></th>
            <th style={{ width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => (
            <tr key={t.id}>
              <td>
                <button
                  className={`icon-btn music-play-btn ${playing === t.id ? 'playing' : ''}`}
                  onClick={() => setPlaying(playing === t.id ? null : t.id)}
                >
                  <Icon name={playing === t.id ? 'pause' : 'play'} size={12} />
                </button>
              </td>
              <td>
                <div className="music-row-title">{t.title}</div>
                <div className="music-row-artist">{t.artist}</div>
              </td>
              <td>
                <Waveform
                  bars={t.waveform}
                  playing={playing === t.id}
                  color={t.favorite ? 'var(--accent)' : 'var(--border-strong)'}
                />
              </td>
              <td className="num">{t.bpm}</td>
              <td className="num">{t.duration}</td>
              <td>
                <div className="row gap-2 row-wrap">
                  {t.mood.map((m) => <span key={m} className="badge">{m}</span>)}
                </div>
              </td>
              <td>
                <div className="row gap-2 row-wrap">
                  {t.propertyTypes.map((p) => (
                    <span key={p} className="badge accent" style={{ fontSize: 10 }}>{p}</span>
                  ))}
                </div>
              </td>
              <td>
                <button
                  className={`icon-btn music-fav-btn ${t.favorite ? 'on' : 'off'}`}
                  onClick={() => onToggleFavorite(t.id)}
                >
                  <Icon name={t.favorite ? 'star-fill' : 'star'} size={15} />
                </button>
              </td>
              <td>
                <button className="icon-btn"><Icon name="more" size={15} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="music-drop">
        <Icon name="upload" size={16} style={{ color: 'var(--text-muted)' }} />
        <div className="music-drop-text">
          Drop MP3 files anywhere to upload. Only tracks marked as ⭐ favorite are eligible for random selection unless a rule says otherwise.
        </div>
        <button className="btn sm"><Icon name="upload" size={12} /> Upload</button>
      </div>
    </div>
  );
}
