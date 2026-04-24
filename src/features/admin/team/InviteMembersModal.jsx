import { useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';

export function InviteMembersModal({ onClose, onInvite }) {
  const [invites, setInvites] = useState([{ email: '', role: 'Editor' }]);
  const [message, setMessage] = useState('');

  const addRow = () => setInvites([...invites, { email: '', role: 'Editor' }]);
  const update = (i, ch) => setInvites(invites.map((x, idx) => (idx === i ? { ...x, ...ch } : x)));
  const remove = (i) => setInvites(invites.filter((_, idx) => idx !== i));
  const valid = invites.filter((i) => i.email.trim() && i.email.includes('@'));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon">
            <Icon name="users" size={15} />
          </div>
          <div className="grow">
            <div className="modal-title">Invite members</div>
            <div className="modal-sub">
              Send an email invite. They'll appear as Invited until they sign in.
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15} /></button>
        </div>

        <div className="modal-body scroll">
          <div className="stack gap-4">
            {invites.map((inv, i) => (
              <div key={i} className="invite-row">
                <input
                  className="input"
                  placeholder="teammate@ckpestateagents.ie"
                  value={inv.email}
                  onChange={(e) => update(i, { email: e.target.value })}
                />
                <select
                  className="input"
                  value={inv.role}
                  onChange={(e) => update(i, { role: e.target.value })}
                >
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
                <button
                  className="icon-btn"
                  onClick={() => remove(i)}
                  disabled={invites.length === 1}
                >
                  <Icon name="trash" size={13} />
                </button>
              </div>
            ))}
          </div>
          <button className="btn sm" style={{ marginTop: 8 }} onClick={addRow}>
            <Icon name="plus" size={12} /> Add another
          </button>

          <hr className="sep" />

          <div className="field">
            <div className="label">
              Personal message <span className="t-muted" style={{ fontWeight: 400 }}>(optional)</span>
            </div>
            <textarea
              className="textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hey — I've added you to our 4Reels workspace so you can help with…"
              rows={3}
            />
          </div>

          <div className="invite-info">
            <Icon name="shield" size={14} style={{ color: 'var(--accent)', marginTop: 2, flex: 'none' }} />
            <div>
              New members will be required to enable 2FA on first sign-in. If they match your SSO domain, they'll sign in with Google Workspace automatically.
            </div>
          </div>
        </div>

        <div className="modal-footer between">
          <div className="t-sm t-muted">
            {valid.length} valid invitation{valid.length !== 1 ? 's' : ''}
          </div>
          <div className="row gap-4">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" disabled={valid.length === 0} onClick={() => onInvite(valid)}>
              <Icon name="send" size={13} /> Send {valid.length} invite{valid.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
