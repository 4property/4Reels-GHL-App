import { Avatar } from '../../../shared/Avatar.jsx';
import { Checkbox } from '../../../shared/Checkbox.jsx';
import { Icon } from '../../../shared/Icon.jsx';
import { UserRowActions } from './UserRowActions.jsx';

export function TeamTable({
  members, selection, setSelection,
  onUpdateRole, onEdit, onRemove, onResend,
}) {
  const allSelected = members.length > 0 && members.every((u) => selection.includes(u.id));

  return (
    <div className="card team-table-wrap">
      <div className="scroll-x">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <Checkbox
                  checked={allSelected}
                  onChange={(v) => setSelection(v ? members.map((u) => u.id) : [])}
                />
              </th>
              <th>Member</th>
              <th>Role</th>
              <th>2FA</th>
              <th>SSO</th>
              <th>Status</th>
              <th>Last active</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {members.map((u) => (
              <tr key={u.id}>
                <td onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selection.includes(u.id)}
                    onChange={(v) =>
                      setSelection(v ? [...selection, u.id] : selection.filter((x) => x !== u.id))
                    }
                  />
                </td>
                <td>
                  <div className="row gap-5">
                    <Avatar name={u.name} color={`hsl(${u.avatarHue}, 55%, 55%)`} />
                    <div className="min-w-0">
                      <div className="t-medium">{u.name}</div>
                      <div className="t-sm t-muted">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => onUpdateRole(u.id, e.target.value)}
                    className="input team-role-select"
                  >
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                </td>
                <td>
                  {u.twoFA ? (
                    <span className="badge success"><Icon name="check" size={10} /> Enabled</span>
                  ) : (
                    <span className="badge warning"><Icon name="shield" size={10} /> Off</span>
                  )}
                </td>
                <td>
                  {u.sso ? (
                    <span className="badge info"><Icon name="key" size={10} /> Linked</span>
                  ) : (
                    <span className="subtle t-sm">—</span>
                  )}
                </td>
                <td>
                  {u.status === 'active' && <span className="badge success"><span className="dot" /> Active</span>}
                  {u.status === 'invited' && (
                    <span className="badge warning"><Icon name="clock" size={10} /> Invited</span>
                  )}
                  {u.status === 'suspended' && (
                    <span className="badge"><Icon name="close" size={10} /> Suspended</span>
                  )}
                </td>
                <td className="t-sm t-muted">{u.lastSeen}</td>
                <td>
                  <UserRowActions
                    user={u}
                    onEdit={() => onEdit(u)}
                    onRemove={() => onRemove(u.id)}
                    onResend={() => onResend?.(u.id)}
                  />
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={8} className="team-empty-cell">
                  No members match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
