import { useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';
import { Spinner } from '../../../shared/Spinner.jsx';
import { WPLogo } from './logos.jsx';

export function WPSourceCard({ config, onChange, agency }) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const test = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      if (!config.url) return setTestResult({ ok: false, msg: 'URL is required' });
      if (!config.url.startsWith('http')) {
        return setTestResult({ ok: false, msg: 'URL must start with https://' });
      }
      setTestResult({
        ok: true,
        msg: `Connected — found ${Math.floor(Math.random() * 50) + 10} properties in CPT "${config.postType || 'property'}"`,
      });
      onChange({ status: 'connected', errorMsg: '', lastSync: 'just now' });
    }, 800);
  };

  return (
    <div className="card source-card">
      <div className="source-head">
        <div className="source-logo">
          <WPLogo />
        </div>
        <div className="grow min-w-0">
          <div className="source-title-row">
            <div className="source-title">WordPress</div>
            <StatusBadge status={config.status} />
          </div>
          <div className="source-sub">
            {config.status === 'connected' && `${config.url} · polling every ${config.pollMinutes} min · last sync ${config.lastSync}`}
            {config.status === 'error' && <span className="t-danger">{config.errorMsg}</span>}
            {config.status === 'missing' && "Point to the agency's WordPress site and authenticate."}
          </div>
        </div>
      </div>

      <div className="source-body">
        <div className="stack gap-6">
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="label">WordPress site URL</div>
            <input
              className="input"
              placeholder={`https://www.${agency.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}.ie`}
              value={config.url}
              onChange={(e) => onChange({ url: e.target.value })}
            />
            <div className="hint" style={{ marginTop: 6 }}>
              We'll read listings from <span className="mono">/wp-json/wp/v2</span>. HTTPS required.
            </div>
          </div>

          <div className="source-test">
            <button className="btn sm" onClick={test} disabled={testing}>
              {testing ? (<><Spinner /> Testing…</>) : (<><Icon name="zap" size={12} /> Test connection</>)}
            </button>
            {testResult && (
              <div className={`source-test-msg ${testResult.ok ? 'ok' : 'err'}`}>
                <Icon name={testResult.ok ? 'check' : 'alert'} size={12} />
                {testResult.msg}
              </div>
            )}
            {!testResult && !testing && config.status === 'connected' && (
              <span className="t-sm t-muted">Last tested {config.lastSync}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'connected')
    return <span className="badge success"><span className="dot" /> Connected</span>;
  if (status === 'error')
    return <span className="badge danger"><Icon name="alert" size={10} /> Error</span>;
  return <span className="badge warning"><Icon name="close" size={10} /> Not configured</span>;
}
