import { useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';
import { Spinner } from '../../../shared/Spinner.jsx';
import { GHLLogo } from './logos.jsx';

export function GHLSourceCard({ config, onChange }) {
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const test = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      if (config.apiKey && config.apiKey.length > 20 && config.locationId) {
        setTestResult({ ok: true, msg: `Connected — location "${config.locationId}" verified` });
        onChange({ status: 'connected', errorMsg: '', lastSync: 'just now' });
      } else if (!config.locationId) {
        setTestResult({ ok: false, msg: 'Location ID is required' });
      } else {
        setTestResult({ ok: false, msg: 'API token missing or invalid format' });
      }
    }, 800);
  };

  return (
    <div className="card source-card">
      <div className="source-head">
        <div className="source-logo">
          <GHLLogo />
        </div>
        <div className="grow min-w-0">
          <div className="source-title-row">
            <div className="source-title">GoHighLevel</div>
            <StatusBadge status={config.status} />
          </div>
          <div className="source-sub">
            {config.status === 'connected' && `Last sync: ${config.lastSync}`}
            {config.status === 'error' && <span className="t-danger">{config.errorMsg}</span>}
            {config.status === 'missing' && "Paste this agency's private integration key from GHL."}
          </div>
        </div>
      </div>

      <div className="source-body">
        <div className="stack gap-6">
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="label">Location ID</div>
            <input
              className="input mono"
              placeholder="loc_ABCD1234"
              value={config.locationId}
              onChange={(e) => onChange({ locationId: e.target.value })}
              style={{ fontSize: 11 }}
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <div className="label">GHL API token</div>
            <div className="row gap-3">
              <input
                className="input mono grow"
                type={showKey ? 'text' : 'password'}
                placeholder="pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={config.apiKey}
                onChange={(e) => onChange({ apiKey: e.target.value })}
                style={{ fontSize: 11 }}
              />
              <button className="btn sm" onClick={() => setShowKey(!showKey)} title={showKey ? 'Hide' : 'Reveal'}>
                <Icon name="eye" size={12} />
              </button>
            </div>
            <div className="hint" style={{ marginTop: 6 }}>
              In GHL: <span className="mono">Settings → Integrations → Private Integrations → Create new</span>.
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
