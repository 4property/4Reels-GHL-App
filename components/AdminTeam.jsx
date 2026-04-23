// Admin · Team & permissions
const AdminTeam = () => {
  const [team, setTeam] = React.useState(window.MOCK.team);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [rolesModalOpen, setRolesModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState(null);
  const [selection, setSelection] = React.useState([]);

  // Security policy
  const [require2FA, setRequire2FA] = React.useState(true);
  const [ssoEnabled, setSsoEnabled] = React.useState(true);
  const [ssoProvider, setSsoProvider] = React.useState("google-workspace");
  const [ssoDomain, setSsoDomain] = React.useState("ckpestateagents.ie");
  const [autoAssign, setAutoAssign] = React.useState("Editor");
  const [sessionTimeout, setSessionTimeout] = React.useState(8);

  const filtered = team.filter(u =>
    (roleFilter === "all" || u.role === roleFilter) &&
    (search === "" || `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()))
  );

  const updateUser = (id, ch) => setTeam(team.map(u => u.id === id ? { ...u, ...ch } : u));
  const removeUser = (id) => setTeam(team.filter(u => u.id !== id));
  const bulkRemove = () => { setTeam(team.filter(u => !selection.includes(u.id))); setSelection([]); };
  const bulkChangeRole = (role) => { setTeam(team.map(u => selection.includes(u.id) ? { ...u, role } : u)); setSelection([]); };

  const roleCounts = {
    all: team.length,
    Admin: team.filter(u => u.role === "Admin").length,
    Editor: team.filter(u => u.role === "Editor").length,
    Viewer: team.filter(u => u.role === "Viewer").length,
  };
  const pendingInvites = team.filter(u => u.status === "invited").length;
  const noTwoFA = team.filter(u => u.status === "active" && !u.twoFA).length;

  return (
    <div>
      {/* Security policy strip */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Security policy</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Applies to all members of this workspace.</div>
          </div>
          {noTwoFA > 0 && require2FA && (
            <span className="badge warning"><Icon name="shield" size={11}/> {noTwoFA} member{noTwoFA !== 1 ? "s" : ""} without 2FA</span>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <PolicyRow icon="shield" title="Require 2FA" sub="Block sign-in until each member enables 2FA."
            control={<Toggle on={require2FA} onChange={setRequire2FA}/>}/>
          <PolicyRow icon="key" title="Single sign-on (SSO)" sub={ssoEnabled ? `${ssoProvider === "google-workspace" ? "Google Workspace" : ssoProvider === "microsoft" ? "Microsoft 365" : "Okta"} · ${ssoDomain}` : "Off"}
            control={<Toggle on={ssoEnabled} onChange={setSsoEnabled}/>}/>
          <PolicyRow icon="clock" title="Session timeout" sub={`Sign out after ${sessionTimeout}h of inactivity`}
            control={
              <select className="input" value={sessionTimeout} onChange={e => setSessionTimeout(+e.target.value)} style={{ width: 80, padding: "4px 8px" }}>
                <option value={1}>1h</option><option value={4}>4h</option><option value={8}>8h</option><option value={24}>24h</option><option value={168}>7d</option>
              </select>
            }/>
          <PolicyRow icon="users" title="Default role for SSO users" sub="Applied when new users sign in via SSO."
            control={
              <select className="input" value={autoAssign} onChange={e => setAutoAssign(e.target.value)} style={{ width: 100, padding: "4px 8px" }}>
                <option>Admin</option><option>Editor</option><option>Viewer</option>
              </select>
            }/>
        </div>
        {ssoEnabled && (
          <div style={{ marginTop: 12, padding: 12, background: "var(--bg-soft)", borderRadius: 8, display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="label">Provider</div>
              <select className="input" value={ssoProvider} onChange={e => setSsoProvider(e.target.value)}>
                <option value="google-workspace">Google Workspace</option>
                <option value="microsoft">Microsoft 365 / Azure AD</option>
                <option value="okta">Okta (SAML)</option>
                <option value="custom">Custom SAML</option>
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="label">Allowed email domain</div>
              <input className="input" value={ssoDomain} onChange={e => setSsoDomain(e.target.value)}/>
            </div>
            <button className="btn"><Icon name="settings" size={13}/> Configure</button>
          </div>
        )}
      </div>

      {/* Role filters */}
      <div className="subtabs" style={{ marginBottom: 14 }}>
        {[
          { key: "all", label: "All members" },
          { key: "Admin", label: "Admins" },
          { key: "Editor", label: "Editors" },
          { key: "Viewer", label: "Viewers" },
        ].map(f => (
          <button key={f.key} className={`subtab ${roleFilter === f.key ? "active" : ""}`} onClick={() => setRoleFilter(f.key)}>
            {f.label}
            <span style={{ fontSize: 11, color: "var(--text-subtle)", background: "var(--bg-sunken)", padding: "1px 6px", borderRadius: 999, marginLeft: 2 }}>{roleCounts[f.key]}</span>
          </button>
        ))}
        {pendingInvites > 0 && (
          <button className="subtab" style={{ color: "var(--warning)" }}>
            <Icon name="clock" size={12}/> {pendingInvites} pending invite{pendingInvites !== 1 ? "s" : ""}
          </button>
        )}
        <button className="subtab" style={{ color: "var(--accent)", marginLeft: "auto" }} onClick={() => setRolesModalOpen(true)}>
          <Icon name="shield" size={12}/> View role permissions
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
        <div className="row" style={{ gap: 8 }}>
          <div className="search">
            <Icon name="search" size={14}/>
            <input placeholder="Search by name or email" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          {selection.length > 0 && (
            <>
              <span style={{ fontSize: 12, color: "var(--text-muted)", padding: "0 8px" }}>{selection.length} selected</span>
              <select onChange={e => { if (e.target.value) bulkChangeRole(e.target.value); e.target.value = ""; }} className="btn" style={{ padding: "6px 10px" }}>
                <option value="">Change role…</option>
                <option value="Admin">→ Admin</option>
                <option value="Editor">→ Editor</option>
                <option value="Viewer">→ Viewer</option>
              </select>
              <button className="btn" onClick={bulkRemove}><Icon name="trash" size={13}/> Remove</button>
            </>
          )}
        </div>
        <button className="btn primary" onClick={() => setInviteOpen(true)}><Icon name="plus" size={13}/> Invite members</button>
      </div>

      {/* Team table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <Checkbox
                    checked={filtered.length > 0 && filtered.every(u => selection.includes(u.id))}
                    onChange={v => setSelection(v ? filtered.map(u => u.id) : [])}
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
              {filtered.map(u => (
                <tr key={u.id}>
                  <td onClick={e => e.stopPropagation()}>
                    <Checkbox checked={selection.includes(u.id)} onChange={v => setSelection(v ? [...selection, u.id] : selection.filter(x => x !== u.id))}/>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <Avatar name={u.name} color={`hsl(${u.avatarHue}, 55%, 55%)`}/>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 500 }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select value={u.role} onChange={e => updateUser(u.id, { role: e.target.value })}
                      className="input" style={{ padding: "3px 22px 3px 8px", fontSize: 12, width: "auto" }}>
                      <option>Admin</option><option>Editor</option><option>Viewer</option>
                    </select>
                  </td>
                  <td>
                    {u.twoFA
                      ? <span className="badge success"><Icon name="check" size={10}/> Enabled</span>
                      : <span className="badge warning"><Icon name="shield" size={10}/> Off</span>}
                  </td>
                  <td>
                    {u.sso
                      ? <span className="badge info"><Icon name="key" size={10}/> Linked</span>
                      : <span className="subtle" style={{ fontSize: 12 }}>—</span>}
                  </td>
                  <td>
                    {u.status === "active" && <span className="badge success"><span className="dot"/> Active</span>}
                    {u.status === "invited" && <span className="badge warning"><Icon name="clock" size={10}/> Invited</span>}
                    {u.status === "suspended" && <span className="badge"><Icon name="close" size={10}/> Suspended</span>}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{u.lastSeen}</td>
                  <td>
                    <UserRowActions user={u} onEdit={() => setEditingUser(u)} onRemove={() => removeUser(u.id)} onResend={() => {}}/>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)", fontSize: 13 }}>
                  No members match your filters.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {inviteOpen && <InviteMembersModal onClose={() => setInviteOpen(false)} onInvite={(invites) => {
        setTeam([...team, ...invites.map((i, idx) => ({
          id: `u${Date.now()}_${idx}`, name: i.email.split("@")[0], email: i.email, role: i.role,
          status: "invited", twoFA: false, sso: false, lastSeen: "—", avatarHue: (i.email.charCodeAt(0) * 13) % 360, joined: "Pending",
        }))]);
        setInviteOpen(false);
      }}/>}

      {rolesModalOpen && <RolePermissionsModal onClose={() => setRolesModalOpen(false)}/>}

      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={(ch) => { updateUser(editingUser.id, ch); setEditingUser(null); }}/>}
    </div>
  );
};

const PolicyRow = ({ icon, title, sub, control }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--bg-soft)", borderRadius: 8 }}>
    <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", flex: "none" }}>
      <Icon name={icon} size={14}/>
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</div>
    </div>
    <div style={{ flex: "none" }}>{control}</div>
  </div>
);

const UserRowActions = ({ user, onEdit, onRemove, onResend }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="icon-btn" onClick={() => setOpen(!open)}><Icon name="more"/></button>
      {open && (
        <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, boxShadow: "var(--shadow-md)", padding: 4, minWidth: 180 }}>
          <MenuItem icon="edit" label="Edit member" onClick={() => { onEdit(); setOpen(false); }}/>
          {user.status === "invited" && <MenuItem icon="send" label="Resend invite" onClick={() => { onResend(); setOpen(false); }}/>}
          <MenuItem icon="key" label="Reset 2FA" onClick={() => setOpen(false)}/>
          <MenuItem icon="clock" label="View activity" onClick={() => setOpen(false)}/>
          <hr className="sep" style={{ margin: "4px 0" }}/>
          <MenuItem icon="trash" label="Remove" color="var(--danger)" onClick={() => { onRemove(); setOpen(false); }}/>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, color }) => (
  <button onClick={onClick}
    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", border: 0, background: "transparent", borderRadius: 4, cursor: "pointer", textAlign: "left", fontSize: 13, color: color || "var(--text)", fontFamily: "inherit" }}
    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-soft)"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
    <Icon name={icon} size={12}/> {label}
  </button>
);

const InviteMembersModal = ({ onClose, onInvite }) => {
  const [invites, setInvites] = React.useState([{ email: "", role: "Editor" }]);
  const [message, setMessage] = React.useState("");
  const addRow = () => setInvites([...invites, { email: "", role: "Editor" }]);
  const update = (i, ch) => setInvites(invites.map((x, idx) => idx === i ? { ...x, ...ch } : x));
  const remove = (i) => setInvites(invites.filter((_, idx) => idx !== i));
  const valid = invites.filter(i => i.email.trim() && i.email.includes("@"));

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(15,23,41,0.45)", display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 640, background: "var(--surface)", borderRadius: 14, boxShadow: "var(--shadow-lg)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
            <Icon name="users" size={15}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Invite members</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Send an email invite. They'll appear as Invited until they sign in.</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15}/></button>
        </div>

        <div className="scroll" style={{ overflow: "auto", padding: 20, flex: 1 }}>
          <div className="stack" style={{ gap: 8 }}>
            {invites.map((inv, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 150px auto", gap: 8, alignItems: "center" }}>
                <input className="input" placeholder="teammate@ckpestateagents.ie" value={inv.email} onChange={e => update(i, { email: e.target.value })}/>
                <select className="input" value={inv.role} onChange={e => update(i, { role: e.target.value })}>
                  <option>Admin</option><option>Editor</option><option>Viewer</option>
                </select>
                <button className="icon-btn" onClick={() => remove(i)} disabled={invites.length === 1}><Icon name="trash" size={13}/></button>
              </div>
            ))}
          </div>
          <button className="btn sm" style={{ marginTop: 8 }} onClick={addRow}><Icon name="plus" size={12}/> Add another</button>

          <hr className="sep"/>

          <div className="field">
            <div className="label">Personal message <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></div>
            <textarea className="textarea" value={message} onChange={e => setMessage(e.target.value)} placeholder="Hey — I've added you to our 4Reels workspace so you can help with…" rows={3}/>
          </div>

          <div style={{ padding: 12, background: "var(--bg-soft)", borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12, color: "var(--text-muted)" }}>
            <Icon name="shield" size={14} style={{ color: "var(--accent)", marginTop: 2, flex: "none" }}/>
            <div>
              New members will be required to enable 2FA on first sign-in. If they match your SSO domain, they'll sign in with Google Workspace automatically.
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--divider)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-soft)" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{valid.length} valid invitation{valid.length !== 1 ? "s" : ""}</div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" disabled={valid.length === 0} onClick={() => onInvite(valid)}>
              <Icon name="send" size={13}/> Send {valid.length} invite{valid.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ user, onClose, onSave }) => {
  const [role, setRole] = React.useState(user.role);
  const [twoFA, setTwoFA] = React.useState(user.twoFA);
  const [status, setStatus] = React.useState(user.status);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(15,23,41,0.45)", display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: "var(--surface)", borderRadius: 14, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={user.name} color={`hsl(${user.avatarHue}, 55%, 55%)`}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{user.email}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15}/></button>
        </div>
        <div style={{ padding: 20 }} className="stack">
          <div className="field">
            <div className="label">Role</div>
            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option>Admin</option><option>Editor</option><option>Viewer</option>
            </select>
            <div className="hint" style={{ marginTop: 6 }}>{window.MOCK.roles.find(r => r.id === role)?.desc}</div>
          </div>
          <Toggle on={twoFA} onChange={setTwoFA} label="Two-factor authentication" sub={twoFA ? "Enforced for this user" : "User is exempt from 2FA"}/>
          <div className="field">
            <div className="label">Status</div>
            <Segmented value={status} onChange={setStatus} options={[
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" },
            ]}/>
          </div>
        </div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--divider)", display: "flex", justifyContent: "flex-end", gap: 8, background: "var(--bg-soft)" }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => onSave({ role, twoFA, status })}>Save changes</button>
        </div>
      </div>
    </div>
  );
};

const RolePermissionsModal = ({ onClose }) => {
  const rows = [
    { id: "reels", label: "View & edit reels" },
    { id: "publish", label: "Publish to networks" },
    { id: "music", label: "Music library" },
    { id: "brand", label: "Brand settings" },
    { id: "automation", label: "Automation rules" },
    { id: "admin", label: "Admin & billing" },
    { id: "api", label: "API keys & integrations" },
  ];
  const sym = { rw: { label: "Full", color: "var(--success)" }, ro: { label: "Read", color: "var(--info)" }, none: { label: "—", color: "var(--text-subtle)" } };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(15,23,41,0.45)", display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 720, background: "var(--surface)", borderRadius: 14, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}><Icon name="shield" size={15}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Role permissions</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>What each role can do in this workspace.</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15}/></button>
        </div>
        <div style={{ padding: 20, overflow: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Permission</th>
                {window.MOCK.roles.map(r => (
                  <th key={r.id} style={{ textAlign: "center" }}>{r.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.label}</td>
                  {window.MOCK.roles.map(r => (
                    <td key={r.id} style={{ textAlign: "center", color: sym[r.perms[row.id]].color, fontWeight: 600, fontSize: 12 }}>{sym[r.perms[row.id]].label}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16, padding: 12, background: "var(--bg-soft)", borderRadius: 8, fontSize: 12, color: "var(--text-muted)" }}>
            Custom roles and permissions are available on the Scale plan. <span style={{ color: "var(--accent)", fontWeight: 500, cursor: "pointer" }}>Upgrade →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

window.AdminTeam = AdminTeam;
