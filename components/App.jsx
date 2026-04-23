// Main shell
const PAGES = [
  { id: "dashboard", label: "Reels", icon: "film" },
  { id: "music", label: "Music", icon: "music" },
  { id: "social", label: "Social", icon: "share" },
  { id: "brand", label: "Brand", icon: "palette" },
  { id: "defaults", label: "Defaults", icon: "settings" },
  { id: "automation", label: "Automation", icon: "zap" },
  { id: "admin", label: "Admin", icon: "shield" },
];

const App = () => {
  const [page, setPage] = React.useState(() => localStorage.getItem("4r_page") || "dashboard");
  const [openReel, setOpenReel] = React.useState(null);
  const [theme, setTheme] = React.useState(() => localStorage.getItem("4r_theme") || "light");
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);

  React.useEffect(() => { localStorage.setItem("4r_page", page); }, [page]);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("4r_theme", theme);
  }, [theme]);

  // Tweaks protocol
  React.useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div>
      {/* Tabs topbar (no chrome / embedded) */}
      <div className="topbar" data-screen-label={`Nav · ${PAGES.find(p=>p.id===page)?.label || ""}`}>
        <div className="topbar-brand">
          <span className="topbar-brand-mark">4</span>
          <span>4Reels</span>
          <span style={{ width: 1, height: 16, background: "var(--border)", margin: "0 10px" }}/>
          <img src="assets/ck-logo.png" alt="CK" style={{ width: 20, height: 20, borderRadius: 4 }}/>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>CKP Estate Agents</span>
        </div>
        <div className="tabs">
          {PAGES.map(p => (
            <button key={p.id} className={`tab ${page === p.id ? "active" : ""}`} onClick={() => setPage(p.id)}>
              {p.label}
            </button>
          ))}
          <button className="icon-btn" style={{ marginLeft: 8, alignSelf: "center" }} title="Settings">
            <Icon name="settings" size={15}/>
          </button>
        </div>
        <div className="topbar-right">
          <div className="search" style={{ minWidth: 220 }}>
            <Icon name="search" size={14}/>
            <input placeholder="Search reels, properties…"/>
            <span className="kbd">⌘K</span>
          </div>
          <button className="icon-btn" title="Theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Icon name={theme === "light" ? "moon" : "sun"} size={15}/>
          </button>
          <button className="icon-btn" title="Notification settings" onClick={() => setNotifOpen(true)}><Icon name="bell" size={15}/></button>
          <button className="icon-btn" title="Help"><Icon name="help" size={15}/></button>
          <Avatar name="Marvin Farrell" color="hsl(215, 60%, 55%)"/>
        </div>
      </div>

      <div className="page" data-screen-label={`Page · ${PAGES.find(p=>p.id===page)?.label || ""}`}>
        {page === "dashboard" && <Dashboard onOpenReel={setOpenReel}/>}
        {page === "music" && <MusicConfig/>}
        {page === "social" && <SocialConfig/>}
        {page === "brand" && <BrandConfig/>}
        {page === "defaults" && <ReelDefaultsConfig/>}
        {page === "automation" && <AutomationConfig/>}
        {page === "admin" && <AdminView/>}
      </div>

      {openReel && <ReelEditor reelId={openReel} onClose={() => setOpenReel(null)}/>}

      {tweaksOpen && <TweaksPanel theme={theme} setTheme={setTheme} onClose={() => setTweaksOpen(false)}/>}
      {notifOpen && <NotificationSettings onClose={() => setNotifOpen(false)}/>}
    </div>
  );
};

const TweaksPanel = ({ theme, setTheme, onClose }) => (
  <div style={{
    position: "fixed", bottom: 20, right: 20, zIndex: 200,
    width: 280, background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 12, boxShadow: "var(--shadow-lg)", overflow: "hidden",
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1px solid var(--divider)" }}>
      <div style={{ fontSize: 13, fontWeight: 600 }}>Tweaks</div>
      <button className="icon-btn" onClick={onClose}><Icon name="close" size={14}/></button>
    </div>
    <div style={{ padding: 14 }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Theme</div>
      <Segmented
        options={[{ value: "light", label: "☀ Light" }, { value: "dark", label: "☾ Dark" }]}
        value={theme} onChange={setTheme}
      />
    </div>
  </div>
);

window.App = App;

const NotificationSettings = ({ onClose }) => {
  const [recipients, setRecipients] = React.useState([
    { id: "r1", email: "marvin@ckpestateagents.ie", name: "Marvin Farrell", role: "Admin", events: { published: true, approval: true, failed: true } },
    { id: "r2", email: "listings@ckpestateagents.ie", name: "Listings team", role: "Editor", events: { published: false, approval: true, failed: true } },
  ]);
  const [newEmail, setNewEmail] = React.useState("");
  const [channels, setChannels] = React.useState({ email: true, slack: false, sms: false });
  const [digest, setDigest] = React.useState("instant");

  const addRecipient = () => {
    if (!newEmail.trim() || !newEmail.includes("@")) return;
    setRecipients([...recipients, { id: `r${Date.now()}`, email: newEmail.trim(), name: newEmail.split("@")[0], role: "Viewer", events: { published: true, approval: true, failed: true } }]);
    setNewEmail("");
  };
  const removeRecipient = (id) => setRecipients(recipients.filter(r => r.id !== id));
  const toggleEvent = (id, key) => setRecipients(recipients.map(r => r.id === id ? { ...r, events: { ...r.events, [key]: !r.events[key] } } : r));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(15,23,41,0.45)", display: "grid", placeItems: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 620, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-lg)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
            <Icon name="bell" size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Notification settings</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Where should we send updates when reels publish or need approval?</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15}/></button>
        </div>

        <div className="scroll" style={{ overflow: "auto", padding: 20, flex: 1 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>Channels</div>
            <div className="stack" style={{ gap: 10 }}>
              <Toggle on={channels.email} onChange={v => setChannels({...channels, email: v})} label="Email" sub="Classic email delivery"/>
              <Toggle on={channels.slack} onChange={v => setChannels({...channels, slack: v})} label="Slack" sub="Post to #listings channel"/>
              <Toggle on={channels.sms} onChange={v => setChannels({...channels, sms: v})} label="SMS" sub="For urgent failures only"/>
            </div>
          </div>

          <hr className="sep"/>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>Recipients</div>
            <div className="stack" style={{ gap: 8 }}>
              {recipients.map(r => (
                <div key={r.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Avatar name={r.name} color={`hsl(${(r.id.charCodeAt(1)*37)%360}, 55%, 55%)`}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.email}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.name} · {r.role}</div>
                    </div>
                    <button className="icon-btn" onClick={() => removeRecipient(r.id)}><Icon name="trash" size={14}/></button>
                  </div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <Checkbox checked={r.events.approval} onChange={() => toggleEvent(r.id, "approval")} label="Needs approval"/>
                    <Checkbox checked={r.events.published} onChange={() => toggleEvent(r.id, "published")} label="Published"/>
                    <Checkbox checked={r.events.failed} onChange={() => toggleEvent(r.id, "failed")} label="Failed render"/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input className="input" placeholder="add@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && addRecipient()}/>
              <button className="btn primary" onClick={addRecipient}><Icon name="plus" size={13}/> Add</button>
            </div>
          </div>

          <hr className="sep"/>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>Delivery frequency</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { id: "instant", label: "Instant", sub: "As events happen" },
                { id: "hourly", label: "Hourly digest", sub: "Grouped per hour" },
                { id: "daily", label: "Daily digest", sub: "One email at 09:00" },
              ].map(o => (
                <button key={o.id} onClick={() => setDigest(o.id)}
                  style={{
                    textAlign: "left", padding: 12, borderRadius: 10,
                    border: `1.5px solid ${digest === o.id ? "var(--accent)" : "var(--border)"}`,
                    background: digest === o.id ? "var(--accent-soft-2)" : "var(--surface)",
                    cursor: "pointer",
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: digest === o.id ? "var(--accent)" : "var(--text)" }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{o.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--divider)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-soft)" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{recipients.length} recipient{recipients.length !== 1 ? "s" : ""} · {Object.values(channels).filter(Boolean).length} channel{Object.values(channels).filter(Boolean).length !== 1 ? "s" : ""}</div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={onClose}><Icon name="check" size={13}/> Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.NotificationSettings = NotificationSettings;

// Mount
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
