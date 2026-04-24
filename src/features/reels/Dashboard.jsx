import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../shared/Icon.jsx';
import { Segmented } from '../../shared/Segmented.jsx';
import { useReels, useApproveReel, useRejectReel } from './hooks.js';
import { ReelCard } from './ReelCard.jsx';
import { ReelsTable } from './ReelsTable.jsx';
import './reels.css';

/** Main page — filterable list of reels + top metrics. */
export function Dashboard() {
  const navigate = useNavigate();
  const openReel = (id) => navigate(`/reels/${id}`);

  const { reels, loading, refetch } = useReels();
  const [approve] = useApproveReel();
  const [reject] = useRejectReel();

  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredReels = reels.filter((r) => {
    if (filter !== 'all' && r.publishStatus !== filter) return false;
    if (search && !`${r.title} ${r.address}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const countBy = (ps) => reels.filter((r) => r.publishStatus === ps).length;

  const filters = [
    { key: 'all', label: 'All', count: reels.length, icon: 'list' },
    { key: 'needs-approval', label: 'Needs approval', count: countBy('needs-approval'), icon: 'bell' },
    { key: 'published', label: 'Published', count: countBy('published'), icon: 'check' },
    { key: 'rejected', label: 'Rejected', count: countBy('rejected'), icon: 'close' },
  ];

  const metrics = [
    { label: 'Reels this month', value: '142', delta: '+18', trend: 'up' },
    { label: 'Published', value: countBy('published'), delta: '+4', trend: 'up' },
    { label: 'Needs approval', value: countBy('needs-approval'), delta: '', trend: 'flat' },
    { label: 'Rejected', value: countBy('rejected'), delta: '', trend: 'flat' },
  ];

  const handleApprove = async (id) => { await approve(id); refetch(); };
  const handleReject = async (id) => { await reject(id); refetch(); };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Reels
            <span className="count-chip">{reels.length} total</span>
          </h1>
          <p className="page-subtitle">Automatically generated from your listings. Review, edit or let them publish on their own.</p>
        </div>
        <div className="row gap-4">
          <button className="btn"><Icon name="download" size={14} /> Export</button>
          <button className="btn primary"><Icon name="plus" size={14} /> New reel</button>
        </div>
      </div>

      <div className="reels-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="card reels-metric-card">
            <div className="reels-metric-label">{m.label}</div>
            <div className="reels-metric-value-row">
              <div className="reels-metric-value">{m.value}</div>
              <div className={`reels-metric-delta ${m.trend === 'up' ? 'up' : ''}`}>{m.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="subtabs">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`subtab ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            <Icon name={f.icon} size={12} /> {f.label}
            <span className="reels-subtab-count">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="reels-toolbar">
        <div className="row gap-4">
          <div className="search">
            <Icon name="search" size={14} />
            <input placeholder="Search by title or address" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn"><Icon name="filter" size={14} /> Advanced filters</button>
          <button className="btn"><Icon name="sort" size={14} /> Sort</button>
        </div>
        <Segmented
          options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]}
          value={view}
          onChange={setView}
        />
      </div>

      {loading && reels.length === 0 ? (
        <div className="empty">Loading…</div>
      ) : view === 'grid' ? (
        <div className="reels-grid">
          {filteredReels.map((r) => (
            <ReelCard
              key={r.id}
              reel={r}
              onOpen={() => openReel(r.id)}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <ReelsTable reels={filteredReels} onOpen={openReel} />
      )}
    </div>
  );
}
