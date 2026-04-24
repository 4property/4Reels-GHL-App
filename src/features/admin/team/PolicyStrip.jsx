import { Icon } from '../../../shared/Icon.jsx';
import { Toggle } from '../../../shared/Toggle.jsx';

/** Card at the top of the Team page — security policies for the workspace. */
export function PolicyStrip({
  require2FA, setRequire2FA,
  ssoEnabled, setSsoEnabled,
  ssoProvider, setSsoProvider,
  ssoDomain, setSsoDomain,
  autoAssign, setAutoAssign,
  sessionTimeout, setSessionTimeout,
  noTwoFA,
}) {
  const ssoLabel =
    ssoProvider === 'google-workspace' ? 'Google Workspace'
    : ssoProvider === 'microsoft' ? 'Microsoft 365'
    : 'Okta';

  return (
    <div className="card policy-strip">
      <div className="policy-strip-head">
        <div>
          <div className="t-md t-semibold">Security policy</div>
          <div className="t-sm t-muted">Applies to all members of this workspace.</div>
        </div>
        {noTwoFA > 0 && require2FA && (
          <span className="badge warning">
            <Icon name="shield" size={11} /> {noTwoFA} member{noTwoFA !== 1 ? 's' : ''} without 2FA
          </span>
        )}
      </div>

      <div className="policy-grid">
        <PolicyRow
          icon="shield"
          title="Require 2FA"
          sub="Block sign-in until each member enables 2FA."
          control={<Toggle on={require2FA} onChange={setRequire2FA} />}
        />
        <PolicyRow
          icon="key"
          title="Single sign-on (SSO)"
          sub={ssoEnabled ? `${ssoLabel} · ${ssoDomain}` : 'Off'}
          control={<Toggle on={ssoEnabled} onChange={setSsoEnabled} />}
        />
        <PolicyRow
          icon="clock"
          title="Session timeout"
          sub={`Sign out after ${sessionTimeout}h of inactivity`}
          control={
            <select
              className="input"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(+e.target.value)}
              style={{ width: 80, padding: '4px 8px' }}
            >
              <option value={1}>1h</option>
              <option value={4}>4h</option>
              <option value={8}>8h</option>
              <option value={24}>24h</option>
              <option value={168}>7d</option>
            </select>
          }
        />
        <PolicyRow
          icon="users"
          title="Default role for SSO users"
          sub="Applied when new users sign in via SSO."
          control={
            <select
              className="input"
              value={autoAssign}
              onChange={(e) => setAutoAssign(e.target.value)}
              style={{ width: 100, padding: '4px 8px' }}
            >
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          }
        />
      </div>

      {ssoEnabled && (
        <div className="policy-sso">
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="label">Provider</div>
            <select className="input" value={ssoProvider} onChange={(e) => setSsoProvider(e.target.value)}>
              <option value="google-workspace">Google Workspace</option>
              <option value="microsoft">Microsoft 365 / Azure AD</option>
              <option value="okta">Okta (SAML)</option>
              <option value="custom">Custom SAML</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="label">Allowed email domain</div>
            <input className="input" value={ssoDomain} onChange={(e) => setSsoDomain(e.target.value)} />
          </div>
          <button className="btn"><Icon name="settings" size={13} /> Configure</button>
        </div>
      )}
    </div>
  );
}

function PolicyRow({ icon, title, sub, control }) {
  return (
    <div className="policy-row">
      <span className="policy-row-icon">
        <Icon name={icon} size={14} />
      </span>
      <div className="grow min-w-0">
        <div className="policy-row-title">{title}</div>
        <div className="policy-row-sub">{sub}</div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
