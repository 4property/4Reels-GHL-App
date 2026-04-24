import { Icon } from '../../../shared/Icon.jsx';
import { useRoles } from '../hooks.js';

const ROWS = [
  { id: 'reels', label: 'View & edit reels' },
  { id: 'publish', label: 'Publish to networks' },
  { id: 'music', label: 'Music library' },
  { id: 'brand', label: 'Brand settings' },
  { id: 'automation', label: 'Automation rules' },
  { id: 'admin', label: 'Admin & billing' },
  { id: 'api', label: 'API keys & integrations' },
];

const SYMBOLS = {
  rw: { label: 'Full', color: 'var(--success)' },
  ro: { label: 'Read', color: 'var(--info)' },
  none: { label: '—', color: 'var(--text-subtle)' },
};

export function RolePermissionsModal({ onClose }) {
  const { roles } = useRoles();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon">
            <Icon name="shield" size={15} />
          </div>
          <div className="grow">
            <div className="modal-title">Role permissions</div>
            <div className="modal-sub">What each role can do in this workspace.</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15} /></button>
        </div>

        <div className="modal-body">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Permission</th>
                {roles.map((r) => (
                  <th key={r.id} style={{ textAlign: 'center' }}>{r.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.id}>
                  <td>{row.label}</td>
                  {roles.map((r) => {
                    const perm = SYMBOLS[r.perms[row.id]] || SYMBOLS.none;
                    return (
                      <td
                        key={r.id}
                        className="t-semibold t-sm"
                        style={{ textAlign: 'center', color: perm.color }}
                      >
                        {perm.label}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="role-perms-hint">
            Custom roles and permissions are available on the Scale plan.{' '}
            <span className="role-perms-upgrade">Upgrade →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
