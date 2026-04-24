import { useState } from 'react';
import { Avatar } from '../../../shared/Avatar.jsx';
import { Icon } from '../../../shared/Icon.jsx';
import { useTenants } from '../hooks.js';
import { AgencyDrawer } from './AgencyDrawer.jsx';

/** The agencies metrics + table + drawer, driven by /admin/tenants. */
export function AgenciesTable() {
  const { tenants, loading } = useTenants();
  const [openAgency, setOpenAgency] = useState(null);
  const [search, setSearch] = useState('');

  const metrics = [
    { label: 'Active tenants', value: '47', delta: '+3 this month' },
    { label: 'MRR', value: '€12,840', delta: '+€1,260' },
    { label: 'Reels rendered (30d)', value: '18,421', delta: '+2,103' },
    { label: 'Renders failed', value: '0.4%', delta: '-0.2pp' },
  ];

  const filtered = tenants.filter(
    (t) =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="agencies-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="card agencies-metric-card">
            <div className="agencies-metric-label">{m.label}</div>
            <div className="agencies-metric-value">{m.value}</div>
            <div className="agencies-metric-delta">{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <div className="card-title">Agencies</div>
          <div className="search" style={{ minWidth: 260 }}>
            <Icon name="search" size={14} />
            <input
              placeholder="Search agencies"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading && tenants.length === 0 ? (
            <div className="empty">Loading…</div>
          ) : (
            <table className="tbl tbl-hover">
              <thead>
                <tr>
                  <th>Agency</th>
                  <th>Plan</th>
                  <th>Seats</th>
                  <th>Reels (30d)</th>
                  <th>Data sources</th>
                  <th>MRR</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const conn = fakeConnStatus(t);
                  return (
                    <tr key={t.id} onClick={() => setOpenAgency(t)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div className="row gap-5">
                          <Avatar name={t.name} color={`hsl(${(t.id.charCodeAt(0) * 13) % 360}, 55%, 55%)`} />
                          <div>
                            <div className="t-medium">{t.name}</div>
                            <div className="mono t-xs t-muted">{t.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${t.plan === 'Scale' ? 'accent' : t.plan === 'Growth' ? 'info' : ''}`}>
                          {t.plan}
                        </span>
                      </td>
                      <td className="num">{t.seats}</td>
                      <td className="num">{t.reelsMonth}</td>
                      <td>
                        <div className="agencies-status-pills">
                          <StatusPill state={conn.ghl} label="GHL" />
                          <StatusPill state={conn.wp} label="WP" />
                        </div>
                      </td>
                      <td className="num">€{t.mrr}</td>
                      <td>
                        <span className={`badge ${t.status === 'active' ? 'success' : t.status === 'trial' ? 'info' : 'warning'}`}>
                          <span className="dot" />{t.status}
                        </span>
                      </td>
                      <td className="t-sm t-muted">{t.joined}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button className="icon-btn"><Icon name="more" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {openAgency && <AgencyDrawer agency={openAgency} onClose={() => setOpenAgency(null)} />}
    </>
  );
}

function fakeConnStatus(t) {
  const h = t.id.charCodeAt(3) % 4;
  return {
    ghl: h === 0 ? 'missing' : h === 1 ? 'error' : 'connected',
    wp: h === 3 ? 'missing' : h === 2 ? 'error' : 'connected',
  };
}

function StatusPill({ state, label }) {
  if (state === 'connected')
    return <span className="badge success status-pill-sm"><span className="dot" />{label}</span>;
  if (state === 'error')
    return <span className="badge danger status-pill-sm"><Icon name="alert" size={9} />{label}</span>;
  return <span className="badge warning status-pill-sm"><Icon name="close" size={9} />{label} missing</span>;
}
