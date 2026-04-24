import { useState } from 'react';
import { Avatar } from '../../../shared/Avatar.jsx';
import { Icon } from '../../../shared/Icon.jsx';
import { Segmented } from '../../../shared/Segmented.jsx';
import { Toggle } from '../../../shared/Toggle.jsx';
import { useRoles } from '../hooks.js';

export function EditUserModal({ user, onClose, onSave }) {
  const { roles } = useRoles();
  const [role, setRole] = useState(user.role);
  const [twoFA, setTwoFA] = useState(user.twoFA);
  const [status, setStatus] = useState(user.status);

  const roleDesc = roles.find((r) => r.id === role)?.desc;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <Avatar name={user.name} color={`hsl(${user.avatarHue}, 55%, 55%)`} />
          <div className="grow min-w-0">
            <div className="modal-title">{user.name}</div>
            <div className="modal-sub">{user.email}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15} /></button>
        </div>

        <div className="modal-body stack">
          <div className="field">
            <div className="label">Role</div>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
            {roleDesc && <div className="hint" style={{ marginTop: 6 }}>{roleDesc}</div>}
          </div>
          <Toggle
            on={twoFA}
            onChange={setTwoFA}
            label="Two-factor authentication"
            sub={twoFA ? 'Enforced for this user' : 'User is exempt from 2FA'}
          />
          <div className="field">
            <div className="label">Status</div>
            <Segmented
              value={status}
              onChange={setStatus}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'suspended', label: 'Suspended' },
              ]}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => onSave({ role, twoFA, status })}>Save changes</button>
        </div>
      </div>
    </div>
  );
}
