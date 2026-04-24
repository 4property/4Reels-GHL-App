import { useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';
import { useInvite, useRemoveMember, useTeam, useUpdateMember } from '../hooks.js';
import { EditUserModal } from './EditUserModal.jsx';
import { InviteMembersModal } from './InviteMembersModal.jsx';
import { PolicyStrip } from './PolicyStrip.jsx';
import { RolePermissionsModal } from './RolePermissionsModal.jsx';
import { TeamTable } from './TeamTable.jsx';
import '../admin.css';

const ROLE_TABS = [
  { key: 'all', label: 'All members' },
  { key: 'Admin', label: 'Admins' },
  { key: 'Editor', label: 'Editors' },
  { key: 'Viewer', label: 'Viewers' },
];

/** Team & permissions page for a single tenant. */
export function AdminTeam() {
  const { team, refetch } = useTeam();
  const [invite] = useInvite();
  const [updateMember] = useUpdateMember();
  const [removeMember] = useRemoveMember();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selection, setSelection] = useState([]);

  const [require2FA, setRequire2FA] = useState(true);
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [ssoProvider, setSsoProvider] = useState('google-workspace');
  const [ssoDomain, setSsoDomain] = useState('ckpestateagents.ie');
  const [autoAssign, setAutoAssign] = useState('Editor');
  const [sessionTimeout, setSessionTimeout] = useState(8);

  const filtered = team.filter(
    (u) =>
      (roleFilter === 'all' || u.role === roleFilter) &&
      (search === '' || `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())),
  );

  const roleCounts = {
    all: team.length,
    Admin: team.filter((u) => u.role === 'Admin').length,
    Editor: team.filter((u) => u.role === 'Editor').length,
    Viewer: team.filter((u) => u.role === 'Viewer').length,
  };

  const pendingInvites = team.filter((u) => u.status === 'invited').length;
  const noTwoFA = team.filter((u) => u.status === 'active' && !u.twoFA).length;

  const handleUpdateRole = async (id, role) => {
    await updateMember({ id, patch: { role } });
    refetch();
  };

  const handleRemove = async (id) => {
    await removeMember(id);
    refetch();
  };

  const handleBulkRemove = async () => {
    await Promise.all(selection.map((id) => removeMember(id)));
    setSelection([]);
    refetch();
  };

  const handleBulkChangeRole = async (role) => {
    await Promise.all(selection.map((id) => updateMember({ id, patch: { role } })));
    setSelection([]);
    refetch();
  };

  const handleInvite = async (invites) => {
    await Promise.all(
      invites.map((i) =>
        invite({
          email: i.email,
          name: i.email.split('@')[0],
          role: i.role,
          avatarHue: (i.email.charCodeAt(0) * 13) % 360,
        }),
      ),
    );
    setInviteOpen(false);
    refetch();
  };

  const handleEditSave = async (patch) => {
    await updateMember({ id: editingUser.id, patch });
    setEditingUser(null);
    refetch();
  };

  return (
    <div>
      <PolicyStrip
        require2FA={require2FA}
        setRequire2FA={setRequire2FA}
        ssoEnabled={ssoEnabled}
        setSsoEnabled={setSsoEnabled}
        ssoProvider={ssoProvider}
        setSsoProvider={setSsoProvider}
        ssoDomain={ssoDomain}
        setSsoDomain={setSsoDomain}
        autoAssign={autoAssign}
        setAutoAssign={setAutoAssign}
        sessionTimeout={sessionTimeout}
        setSessionTimeout={setSessionTimeout}
        noTwoFA={noTwoFA}
      />

      <div className="subtabs">
        {ROLE_TABS.map((f) => (
          <button
            key={f.key}
            className={`subtab ${roleFilter === f.key ? 'active' : ''}`}
            onClick={() => setRoleFilter(f.key)}
          >
            {f.label}
            <span className="team-subtab-count">{roleCounts[f.key]}</span>
          </button>
        ))}
        {pendingInvites > 0 && (
          <button className="subtab team-subtab-pending">
            <Icon name="clock" size={12} /> {pendingInvites} pending invite{pendingInvites !== 1 ? 's' : ''}
          </button>
        )}
        <button
          className="subtab team-subtab-roles"
          onClick={() => setRolesModalOpen(true)}
        >
          <Icon name="shield" size={12} /> View role permissions
        </button>
      </div>

      <div className="team-toolbar">
        <div className="row gap-4">
          <div className="search">
            <Icon name="search" size={14} />
            <input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {selection.length > 0 && (
            <>
              <span className="team-bulk-count">{selection.length} selected</span>
              <select
                onChange={(e) => {
                  if (e.target.value) handleBulkChangeRole(e.target.value);
                  e.target.value = '';
                }}
                className="btn team-bulk-select"
              >
                <option value="">Change role…</option>
                <option value="Admin">→ Admin</option>
                <option value="Editor">→ Editor</option>
                <option value="Viewer">→ Viewer</option>
              </select>
              <button className="btn" onClick={handleBulkRemove}>
                <Icon name="trash" size={13} /> Remove
              </button>
            </>
          )}
        </div>
        <button className="btn primary" onClick={() => setInviteOpen(true)}>
          <Icon name="plus" size={13} /> Invite members
        </button>
      </div>

      <TeamTable
        members={filtered}
        selection={selection}
        setSelection={setSelection}
        onUpdateRole={handleUpdateRole}
        onEdit={setEditingUser}
        onRemove={handleRemove}
      />

      {inviteOpen && (
        <InviteMembersModal onClose={() => setInviteOpen(false)} onInvite={handleInvite} />
      )}
      {rolesModalOpen && <RolePermissionsModal onClose={() => setRolesModalOpen(false)} />}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
