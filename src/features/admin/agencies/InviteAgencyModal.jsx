import { useEffect, useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';

export function InviteAgencyModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', adminEmail: '', adminName: '', sendInvite: true });
  const upd = (ch) => setForm({ ...form, ...ch });
  const canSubmit = form.name.trim() && /@/.test(form.adminEmail);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const submit = () => {
    onCreated?.(form);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon" style={{ width: 36, height: 36 }}>
            <Icon name="building" size={16} />
          </div>
          <div className="grow">
            <div className="modal-title">Add new agency</div>
            <div className="modal-sub">Create the tenant — you'll configure data sources after.</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>

        <div className="modal-body">
          <div className="stack gap-7">
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="label">Agency name</div>
              <input
                className="input"
                placeholder="e.g. Sherry FitzGerald"
                value={form.name}
                onChange={(e) => upd({ name: e.target.value })}
                autoFocus
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <div className="label">Admin name</div>
                <input
                  className="input"
                  placeholder="Darragh Byrne"
                  value={form.adminName}
                  onChange={(e) => upd({ adminName: e.target.value })}
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <div className="label">Admin email</div>
                <input
                  className="input"
                  type="email"
                  placeholder="darragh@agency.ie"
                  value={form.adminEmail}
                  onChange={(e) => upd({ adminEmail: e.target.value })}
                />
              </div>
            </div>
            <label className="invite-checkbox-row">
              <input
                type="checkbox"
                checked={form.sendInvite}
                onChange={(e) => upd({ sendInvite: e.target.checked })}
              />
              <div>
                <div className="t-base">Send magic-link invitation now</div>
                <div className="t-xs t-muted">
                  The admin gets an email to set their password and finish onboarding.
                </div>
              </div>
            </label>
            <div className="agency-drawer-info">
              <Icon name="info" size={14} style={{ color: 'var(--accent)', marginTop: 1, flex: 'none' }} />
              <div>Once created, open the agency from the list to configure its GHL token, WordPress URL and plan.</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!canSubmit} onClick={submit}>
            <Icon name="check" size={13} /> Create agency
          </button>
        </div>
      </div>
    </div>
  );
}
