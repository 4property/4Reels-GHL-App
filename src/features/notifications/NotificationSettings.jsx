import { useState } from 'react';
import { Avatar } from '../../shared/Avatar.jsx';
import { Checkbox } from '../../shared/Checkbox.jsx';
import { Icon } from '../../shared/Icon.jsx';
import { Toggle } from '../../shared/Toggle.jsx';
import './notifications.css';

const INITIAL_RECIPIENTS = [
  {
    id: 'r1', email: 'marvin@ckpestateagents.ie', name: 'Marvin Farrell', role: 'Admin',
    events: { published: true, approval: true, failed: true },
  },
  {
    id: 'r2', email: 'listings@ckpestateagents.ie', name: 'Listings team', role: 'Editor',
    events: { published: false, approval: true, failed: true },
  },
];

const FREQUENCIES = [
  { id: 'instant', label: 'Instant', sub: 'As events happen' },
  { id: 'hourly', label: 'Hourly digest', sub: 'Grouped per hour' },
  { id: 'daily', label: 'Daily digest', sub: 'One email at 09:00' },
];

/** Modal — channels, recipients and delivery cadence. */
export function NotificationSettings({ onClose }) {
  const [recipients, setRecipients] = useState(INITIAL_RECIPIENTS);
  const [newEmail, setNewEmail] = useState('');
  const [channels, setChannels] = useState({ email: true, slack: false, sms: false });
  const [digest, setDigest] = useState('instant');

  const addRecipient = () => {
    if (!newEmail.trim() || !newEmail.includes('@')) return;
    setRecipients([
      ...recipients,
      {
        id: `r${Date.now()}`,
        email: newEmail.trim(),
        name: newEmail.split('@')[0],
        role: 'Viewer',
        events: { published: true, approval: true, failed: true },
      },
    ]);
    setNewEmail('');
  };

  const removeRecipient = (id) => setRecipients(recipients.filter((r) => r.id !== id));
  const toggleEvent = (id, key) =>
    setRecipients(recipients.map((r) =>
      r.id === id ? { ...r, events: { ...r.events, [key]: !r.events[key] } } : r,
    ));

  const totalChannels = Object.values(channels).filter(Boolean).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon">
            <Icon name="bell" size={16} />
          </div>
          <div className="grow">
            <div className="modal-title">Notification settings</div>
            <div className="modal-sub">Where should we send updates when reels publish or need approval?</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15} /></button>
        </div>

        <div className="modal-body scroll">
          <div className="notif-section">
            <div className="notif-section-title">Channels</div>
            <div className="stack gap-5">
              <Toggle on={channels.email} onChange={(v) => setChannels({ ...channels, email: v })} label="Email" sub="Classic email delivery" />
              <Toggle on={channels.slack} onChange={(v) => setChannels({ ...channels, slack: v })} label="Slack" sub="Post to #listings channel" />
              <Toggle on={channels.sms} onChange={(v) => setChannels({ ...channels, sms: v })} label="SMS" sub="For urgent failures only" />
            </div>
          </div>

          <hr className="sep" />

          <div className="notif-section">
            <div className="notif-section-title">Recipients</div>
            <div className="stack gap-4">
              {recipients.map((r) => (
                <RecipientRow
                  key={r.id}
                  recipient={r}
                  onRemove={() => removeRecipient(r.id)}
                  onToggleEvent={(key) => toggleEvent(r.id, key)}
                />
              ))}
            </div>

            <div className="row gap-4" style={{ marginTop: 10 }}>
              <input
                className="input grow"
                placeholder="add@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
              />
              <button className="btn primary" onClick={addRecipient}>
                <Icon name="plus" size={13} /> Add
              </button>
            </div>
          </div>

          <hr className="sep" />

          <div className="notif-section">
            <div className="notif-section-title">Delivery frequency</div>
            <div className="notif-freq">
              {FREQUENCIES.map((o) => (
                <button
                  key={o.id}
                  className={`notif-freq-btn ${digest === o.id ? 'selected' : ''}`}
                  onClick={() => setDigest(o.id)}
                >
                  <div className="notif-freq-label">{o.label}</div>
                  <div className="notif-freq-sub">{o.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer between">
          <div className="t-sm t-muted">
            {recipients.length} recipient{recipients.length !== 1 ? 's' : ''} · {totalChannels} channel{totalChannels !== 1 ? 's' : ''}
          </div>
          <div className="row gap-4">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={onClose}>
              <Icon name="check" size={13} /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipientRow({ recipient, onRemove, onToggleEvent }) {
  return (
    <div className="notif-recipient">
      <div className="notif-recipient-head">
        <Avatar
          name={recipient.name}
          color={`hsl(${(recipient.id.charCodeAt(1) * 37) % 360}, 55%, 55%)`}
        />
        <div className="grow min-w-0">
          <div className="notif-recipient-email">{recipient.email}</div>
          <div className="notif-recipient-meta">{recipient.name} · {recipient.role}</div>
        </div>
        <button className="icon-btn" onClick={onRemove}>
          <Icon name="trash" size={14} />
        </button>
      </div>
      <div className="notif-recipient-events">
        <Checkbox checked={recipient.events.approval} onChange={() => onToggleEvent('approval')} label="Needs approval" />
        <Checkbox checked={recipient.events.published} onChange={() => onToggleEvent('published')} label="Published" />
        <Checkbox checked={recipient.events.failed} onChange={() => onToggleEvent('failed')} label="Failed render" />
      </div>
    </div>
  );
}
