import { useEffect, useMemo, useState } from 'react';
import { Avatar } from '../../../shared/Avatar.jsx';
import { Icon } from '../../../shared/Icon.jsx';
import { ActivityTab } from './ActivityTab.jsx';
import { BillingTab } from './BillingTab.jsx';
import { GHLSourceCard } from './GHLSourceCard.jsx';
import { WPSourceCard } from './WPSourceCard.jsx';

/** Right-side drawer showing one agency's sources, billing and activity. */
export function AgencyDrawer({ agency, onClose }) {
  const [tab, setTab] = useState('sources');

  const initialConfig = useMemo(() => buildInitialConfig(agency), [agency]);
  const [ghl, setGhl] = useState(initialConfig.ghl);
  const [wp, setWp] = useState(initialConfig.wp);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setGhl(initialConfig.ghl);
    setWp(initialConfig.wp);
    setDirty(false);
  }, [initialConfig]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const updGhl = (ch) => { setGhl({ ...ghl, ...ch }); setDirty(true); };
  const updWp = (ch) => { setWp({ ...wp, ...ch }); setDirty(true); };

  const bothHealthy = ghl.status === 'connected' && wp.status === 'connected';

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <Header agency={agency} onClose={onClose} tab={tab} setTab={setTab} bothHealthy={bothHealthy} />

        <div className="agency-drawer-body scroll">
          {tab === 'sources' && (
            <div className="stack gap-8">
              <div className="agency-drawer-info">
                <Icon name="info" size={14} style={{ color: 'var(--accent)', marginTop: 2, flex: 'none' }} />
                <div>
                  Connect <b style={{ color: 'var(--text)' }}>{agency.name}</b>'s listing sources here. Each source feeds properties into their Automation queue. These credentials stay inside this agency — only you (super-admin) can see them.
                </div>
              </div>
              <GHLSourceCard config={ghl} onChange={updGhl} />
              <WPSourceCard config={wp} onChange={updWp} agency={agency} />
            </div>
          )}
          {tab === 'billing' && <BillingTab agency={agency} />}
          {tab === 'activity' && <ActivityTab />}
        </div>

        <Footer dirty={dirty} onClose={onClose} onSave={() => setDirty(false)} />
      </div>
    </div>
  );
}

function Header({ agency, onClose, tab, setTab, bothHealthy }) {
  return (
    <div className="agency-drawer-head">
      <div className="agency-drawer-title-row">
        <Avatar name={agency.name} color={`hsl(${(agency.id.charCodeAt(0) * 13) % 360}, 55%, 55%)`} />
        <div className="grow min-w-0">
          <div className="agency-drawer-name">
            <div className="agency-drawer-name-text">{agency.name}</div>
            <span className={`badge ${agency.plan === 'Scale' ? 'accent' : agency.plan === 'Growth' ? 'info' : ''}`}>
              {agency.plan}
            </span>
            <span className={`badge ${agency.status === 'active' ? 'success' : agency.status === 'trial' ? 'info' : 'warning'}`}>
              <span className="dot" />
              {agency.status}
            </span>
          </div>
          <div className="mono agency-drawer-id">{agency.id}</div>
        </div>
        <button className="icon-btn" onClick={onClose}>
          <Icon name="close" size={16} />
        </button>
      </div>

      <div className="agency-drawer-stats">
        <MiniStat label="Seats" value={agency.seats} />
        <MiniStat label="Reels 30d" value={agency.reelsMonth} />
        <MiniStat label="Storage" value={`${agency.storageGb} GB`} />
        <MiniStat label="MRR" value={`€${agency.mrr}`} />
      </div>

      <div className="subtabs agency-drawer-subtabs">
        <button className={`subtab ${tab === 'sources' ? 'active' : ''}`} onClick={() => setTab('sources')}>
          <Icon name="database" size={12} /> Data sources
          {!bothHealthy && <span className="badge danger">!</span>}
        </button>
        <button className={`subtab ${tab === 'billing' ? 'active' : ''}`} onClick={() => setTab('billing')}>
          <Icon name="tag" size={12} /> Billing
        </button>
        <button className={`subtab ${tab === 'activity' ? 'active' : ''}`} onClick={() => setTab('activity')}>
          <Icon name="list" size={12} /> Activity
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="mini-stat">
      <div className="mini-stat-label">{label}</div>
      <div className="mini-stat-value">{value}</div>
    </div>
  );
}

function Footer({ dirty, onClose, onSave }) {
  return (
    <div className="agency-drawer-footer">
      <div className={`agency-drawer-footer-state ${dirty ? 'dirty' : ''}`}>
        {dirty ? '● Unsaved changes' : 'All changes saved'}
      </div>
      <div className="row gap-4">
        <button className="btn" onClick={onClose}>Close</button>
        <button className="btn primary" disabled={!dirty} onClick={onSave}>
          <Icon name="check" size={13} /> Save config
        </button>
      </div>
    </div>
  );
}

function buildInitialConfig(agency) {
  const h = agency.id.charCodeAt(3) % 4;
  return {
    ghl: {
      status: h === 0 ? 'missing' : h === 1 ? 'error' : 'connected',
      apiKey: h === 0 ? '' : 'pit-0f3a9b2c-4e8d-4f21-b7a8-' + agency.id.replace(/-/g, '') + 'cd91',
      locationId: h === 0 ? '' : 'loc_' + agency.id.replace(/-/g, '').toUpperCase(),
      pipeline: h === 0 ? '' : 'Listings',
      stage: h === 0 ? '' : 'Listed',
      errorMsg: h === 1 ? '401 Unauthorized — API key expired 3 days ago' : '',
      lastSync: h === 2 || h === 3 ? '4 min ago' : '—',
    },
    wp: {
      status: h === 3 ? 'missing' : h === 2 ? 'error' : 'connected',
      url: h === 3 ? '' : `https://www.${agency.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 14)}.ie`,
      user: h === 3 ? '' : '4reels-integration',
      appPassword: h === 3 ? '' : 'XXXX XXXX XXXX XXXX XXXX XXXX',
      postType: h === 3 ? '' : 'property',
      pollMinutes: 5,
      errorMsg: h === 2 ? 'REST API returning 403 — Application Password rejected' : '',
      lastSync: h === 0 || h === 1 ? '2 min ago' : '—',
    },
  };
}
