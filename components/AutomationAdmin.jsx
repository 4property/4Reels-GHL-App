// Automation + Admin
const AutomationConfig = () => {
  // The headline decision: auto vs email-review-first
  const [publishMode, setPublishMode] = React.useState("auto"); // "auto" | "review"
  const [reviewWindow, setReviewWindow] = React.useState(true);
  const [reviewWindowHours, setReviewWindowHours] = React.useState(1);
  const [quietHours, setQuietHours] = React.useState(true);
  const [skipWeekends, setSkipWeekends] = React.useState(false);
  const [captions, setCaptions] = React.useState(true);
  const [regenOnUpdate, setRegenOnUpdate] = React.useState(false);
  const [reviewEmails, setReviewEmails] = React.useState("marvin@ckpestateagents.ie, sarah@ckpestateagents.ie");
  const [autoIncludeNetworks, setAutoIncludeNetworks] = React.useState(["instagram","tiktok","facebook","gmb"]);

  const toggleNet = (id) => setAutoIncludeNetworks(
    autoIncludeNetworks.includes(id)
      ? autoIncludeNetworks.filter(n => n !== id)
      : [...autoIncludeNetworks, id]
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Automation</h1>
          <p className="page-subtitle">What happens when a new property lands via webhook, WordPress or CRM.</p>
        </div>
        <button className="btn primary"><Icon name="check" size={14}/> Save</button>
      </div>

      {/* HERO: publish mode selector — the most important control */}
      <div style={{
        borderRadius: 14,
        padding: 2,
        background: `linear-gradient(135deg, var(--accent) 0%, #6a86ff 100%)`,
        marginBottom: 20,
      }}>
        <div style={{ background: "var(--surface)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span className="badge accent" style={{ fontWeight: 600 }}>
              <Icon name="zap" size={10}/> Core setting
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Applied to every new property from now on</span>
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: "6px 0 4px", letterSpacing: "-0.01em" }}>
            How should 4reels handle new reels?
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 18px" }}>
            Pick one. You can always override per-reel from the editor.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <ModeCard
              selected={publishMode === "auto"}
              onClick={() => setPublishMode("auto")}
              icon="zap"
              tone="accent"
              title="Publish automatically"
              tagline="Hands-off · fastest time to post"
              points={[
                "Reel is published to connected networks as soon as it finishes rendering",
                "No human action required",
                "Best for agencies with high listing volume",
              ]}
            />
            <ModeCard
              selected={publishMode === "review"}
              onClick={() => setPublishMode("review")}
              icon="bell"
              tone="warning"
              title="Send email before publishing"
              tagline="Review-first · always a human in the loop"
              points={[
                "Every new reel waits in “Needs review”",
                "You get an email with a 1-click approve or edit link",
                "Nothing is posted until someone confirms",
              ]}
            />
          </div>
        </div>
      </div>

      <div className="stack" style={{ gap: 16 }}>
        {/* Mode-specific detail card */}
        {publishMode === "auto" ? (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
                      <Icon name="zap" size={12}/>
                    </span>
                    Auto-publish details
                  </div>
                  <div className="card-subtitle">Settings that apply when automatic publishing is on.</div>
                </div>
              </div>
              <div className="card-body stack" style={{ gap: 18 }}>
                <div>
                  <Toggle on={reviewWindow} onChange={setReviewWindow}
                    label="Hold each reel before posting"
                    sub="Safety net — you can cancel or tweak from the dashboard during this window."/>
                  {reviewWindow && (
                    <div style={{ marginTop: 12, paddingLeft: 0 }}>
                      <div className="label" style={{ marginBottom: 6 }}>Hold for</div>
                      <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                        {[{v:0.5,l:"30 min"},{v:1,l:"1 h"},{v:2,l:"2 h"},{v:4,l:"4 h"},{v:8,l:"8 h"},{v:24,l:"24 h"}].map(o => (
                          <button key={o.v} onClick={() => setReviewWindowHours(o.v)} style={{
                            padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                            border: `1px solid ${reviewWindowHours === o.v ? "var(--accent)" : "var(--border-strong)"}`,
                            background: reviewWindowHours === o.v ? "var(--accent-soft)" : "var(--surface)",
                            color: reviewWindowHours === o.v ? "var(--accent)" : "var(--text-muted)",
                          }}>{o.l}</button>
                        ))}
                        <div className="input-group" style={{ width: 140 }}>
                          <input className="input" type="number" min="0" step="0.5"
                                 value={reviewWindowHours} onChange={e => setReviewWindowHours(parseFloat(e.target.value)||0)}/>
                          <span className="input-group-icon" style={{ fontSize: 12 }}>hours</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <hr className="sep" style={{ margin: 0 }}/>
                <Toggle on={quietHours} onChange={setQuietHours}
                  label="Respect quiet hours (22:00 → 07:00)"
                  sub="Reels that finish rendering at night will be queued for 07:00 the next morning."/>
                <hr className="sep" style={{ margin: 0 }}/>
                <Toggle on={skipWeekends} onChange={setSkipWeekends}
                  label="Don't publish on weekends"
                  sub="Reels finishing on Saturday or Sunday wait until Monday morning."/>
                <hr className="sep" style={{ margin: 0 }}/>
                <div>
                  <div className="label" style={{ marginBottom: 8 }}>Publish to these networks by default</div>
                  <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                    {window.MOCK.socials.map(s => {
                      const on = autoIncludeNetworks.includes(s.id);
                      return (
                        <button key={s.id} onClick={() => toggleNet(s.id)} disabled={!s.connected}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "6px 11px", borderRadius: 999,
                            border: `1px solid ${on ? s.color : "var(--border-strong)"}`,
                            background: on ? `${s.color}14` : "var(--surface)",
                            color: on ? s.color : "var(--text-muted)",
                            fontSize: 12, fontWeight: 500,
                            opacity: s.connected ? 1 : 0.5, cursor: s.connected ? "pointer" : "not-allowed",
                          }}>
                          <Icon name={s.icon} size={12}/>
                          {s.name}
                          {on && <Icon name="check" size={12}/>}
                          {!s.connected && <span style={{ fontSize: 10 }}>not connected</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: "var(--warning-soft)", color: "var(--warning)", display: "grid", placeItems: "center" }}>
                      <Icon name="bell" size={12}/>
                    </span>
                    Review-first details
                  </div>
                  <div className="card-subtitle">Who gets notified, and how the review email works.</div>
                </div>
              </div>
              <div className="card-body stack" style={{ gap: 18 }}>
                <div className="field">
                  <div className="label">Send review email to</div>
                  <input className="input" value={reviewEmails} onChange={e => setReviewEmails(e.target.value)}/>
                  <div className="hint">Comma-separated. Each recipient gets their own 1-click approve link.</div>
                </div>
                <hr className="sep" style={{ margin: 0 }}/>
                <div>
                  <div className="label" style={{ marginBottom: 8 }}>Preview of the review email</div>
                  <div style={{
                    border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden",
                    background: "var(--bg-soft)", fontSize: 12,
                  }}>
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", gap: 8, background: "var(--surface)" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, var(--accent), #6a86ff)", color: "white", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700 }}>4</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: "var(--text)" }}>A new reel is ready for your review</div>
                        <div style={{ color: "var(--text-muted)", fontSize: 11 }}>from 4reels · noreply@4reels.app</div>
                      </div>
                    </div>
                    <div style={{ padding: 14, display: "grid", gridTemplateColumns: "72px 1fr", gap: 12 }}>
                      <div style={{ width: 72, aspectRatio: "3/4", borderRadius: 6, overflow: "hidden", background: "var(--bg-sunken)" }}>
                        <Cover kind="cranford-primary" ratio="3/4" video/>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>Cranford Court · 2-bed · €385,000</div>
                        <div style={{ color: "var(--text-muted)", marginBottom: 10 }}>Ready to post to Instagram, TikTok, Facebook, GMB</div>
                        <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                          <span className="btn primary sm" style={{ pointerEvents: "none" }}>✓ Approve & publish</span>
                          <span className="btn sm" style={{ pointerEvents: "none" }}>Open editor</span>
                          <span className="btn sm danger" style={{ pointerEvents: "none" }}>Reject</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="sep" style={{ margin: 0 }}/>
                <Toggle on={quietHours} onChange={setQuietHours}
                  label="Don't send review emails during quiet hours"
                  sub="Emails queued between 22:00 and 07:00 are delivered at 07:00."/>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header"><div><div className="card-title">Rendering defaults</div><div className="card-subtitle">Applied to every render.</div></div></div>
            <div className="card-body stack" style={{ gap: 18 }}>
              <Toggle on={captions} onChange={setCaptions} label="Auto-generate subtitles" sub="AI-generated subtitles, editable before publish."/>
              <hr className="sep" style={{ margin: 0 }}/>
              <Toggle on={regenOnUpdate} onChange={setRegenOnUpdate} label="Re-render when property data changes" sub="If price or photos update upstream, regenerate the reel automatically."/>
            </div>
          </div>
      </div>
    </div>
  );
};

const ModeCard = ({ selected, onClick, icon, tone, title, tagline, points }) => {
  const toneColor = tone === "accent" ? "var(--accent)" : "var(--warning)";
  const toneSoft = tone === "accent" ? "var(--accent-soft)" : "var(--warning-soft)";
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left", cursor: "pointer",
        padding: 18,
        borderRadius: 10,
        border: `1.5px solid ${selected ? toneColor : "var(--border)"}`,
        background: selected ? toneSoft : "var(--surface)",
        boxShadow: selected ? "var(--shadow-sm)" : "none",
        transition: "all 0.15s ease",
        display: "flex", flexDirection: "column", gap: 10,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 34, height: 34, borderRadius: 8,
          background: selected ? toneColor : "var(--bg-sunken)",
          color: selected ? "white" : "var(--text-muted)",
          display: "grid", placeItems: "center",
        }}>
          <Icon name={icon} size={16}/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{title}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{tagline}</div>
        </div>
        <span style={{
          width: 18, height: 18, borderRadius: "50%",
          border: `2px solid ${selected ? toneColor : "var(--border-strong)"}`,
          background: selected ? toneColor : "transparent",
          display: "grid", placeItems: "center", flex: "none",
        }}>
          {selected && <Icon name="check" size={10} style={{ color: "white" }}/>}
        </span>
      </div>
      <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
        {points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </button>
  );
};

const FlowStep = ({ num, title, sub, highlight }) => (
  <div style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 12, padding: "10px 0", borderTop: num === "1" ? "0" : "1px solid var(--divider)" }}>
    <div style={{
      width: 24, height: 24, borderRadius: "50%", marginTop: 2,
      background: highlight ? "var(--accent)" : "var(--bg-sunken)", color: highlight ? "white" : "var(--text-muted)",
      display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600,
    }}>{num}</div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: highlight ? "var(--accent)" : "var(--text)" }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>
    </div>
  </div>
);

// Super admin — now a tabbed shell wrapping Agencies / Team / API
const AdminView = () => {
  const [showInvite, setShowInvite] = React.useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin</h1>
          <p className="page-subtitle">Super-admin view over all agencies on 4reels.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn primary" onClick={() => setShowInvite(true)}><Icon name="plus" size={14}/> Invite agency</button>
        </div>
      </div>

      <AgenciesPanel/>

      {showInvite && <InviteAgencyModal onClose={() => setShowInvite(false)}/>}
    </div>
  );
};

const InviteAgencyModal = ({ onClose }) => {
  const [form, setForm] = React.useState({
    name: "", adminEmail: "", adminName: "", sendInvite: true,
  });
  const upd = (ch) => setForm({ ...form, ...ch });
  const canSubmit = form.name.trim() && /@/.test(form.adminEmail);

  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(15,23,41,0.45)", display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 480, background: "var(--surface)", borderRadius: 12, boxShadow: "0 20px 60px rgba(15,23,41,0.25)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
            <Icon name="building" size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Add new agency</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Create the tenant — you'll configure data sources after.</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={16}/></button>
        </div>

        {/* Body */}
        <div style={{ padding: 22 }}>
          <div className="stack" style={{ gap: 14 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="label">Agency name</div>
              <input className="input" placeholder="e.g. Sherry FitzGerald" value={form.name} onChange={e => upd({ name: e.target.value })} autoFocus/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <div className="label">Admin name</div>
                <input className="input" placeholder="Darragh Byrne" value={form.adminName} onChange={e => upd({ adminName: e.target.value })}/>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <div className="label">Admin email</div>
                <input className="input" type="email" placeholder="darragh@agency.ie" value={form.adminEmail} onChange={e => upd({ adminEmail: e.target.value })}/>
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg-soft)", borderRadius: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={form.sendInvite} onChange={e => upd({ sendInvite: e.target.checked })}/>
              <div>
                <div style={{ fontSize: 13 }}>Send magic-link invitation now</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>The admin gets an email to set their password and finish onboarding.</div>
              </div>
            </label>
            <div style={{ padding: 12, background: "var(--accent-soft)", borderRadius: 8, fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 10 }}>
              <Icon name="info" size={14} style={{ color: "var(--accent)", marginTop: 1, flex: "none" }}/>
              <div>Once created, open the agency from the list to configure its GHL token, WordPress URL and plan.</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--divider)", display: "flex", justifyContent: "flex-end", gap: 8, background: "var(--bg-soft)" }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!canSubmit} onClick={onClose}>
            <Icon name="check" size={13}/> Create agency
          </button>
        </div>
      </div>
    </div>
  );
};

const AgenciesPanel = () => {
  const [openAgency, setOpenAgency] = React.useState(null);
  const [search, setSearch] = React.useState("");

  const metrics = [
    { label: "Active tenants", value: "47", delta: "+3 this month" },
    { label: "MRR", value: "€12,840", delta: "+€1,260" },
    { label: "Reels rendered (30d)", value: "18,421", delta: "+2,103" },
    { label: "Renders failed", value: "0.4%", delta: "-0.2pp" },
  ];

  // Pretend connection status derived from agency id
  const connStatus = (t) => {
    const h = t.id.charCodeAt(3) % 4;
    return {
      ghl: h === 0 ? "missing" : h === 1 ? "error" : "connected",
      wp: h === 3 ? "missing" : h === 2 ? "error" : "connected",
    };
  };

  const StatusPill = ({ state, label }) => (
    state === "connected"
      ? <span className="badge success" style={{ fontSize: 10 }}><span className="dot"/>{label}</span>
      : state === "error"
        ? <span className="badge danger" style={{ fontSize: 10 }}><Icon name="alert" size={9}/>{label}</span>
        : <span className="badge warning" style={{ fontSize: 10 }}><Icon name="close" size={9}/>{label} missing</span>
  );

  const filtered = window.MOCK.tenants.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search.toLowerCase()));

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {metrics.map(m => (
          <div key={m.label} className="card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>{m.value}</div>
            <div style={{ fontSize: 12, color: "var(--success)", marginTop: 2 }}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="card-header">
          <div className="card-title">Agencies</div>
          <div className="search" style={{ minWidth: 260 }}>
            <Icon name="search" size={14}/>
            <input placeholder="Search agencies" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
        <table className="tbl tbl-hover">
          <thead>
            <tr>
              <th>Agency</th><th>Plan</th><th>Seats</th><th>Reels (30d)</th>
              <th>Data sources</th><th>MRR</th><th>Status</th><th>Joined</th><th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const conn = connStatus(t);
              return (
                <tr key={t.id} onClick={() => setOpenAgency(t)} style={{ cursor: "pointer" }}>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <Avatar name={t.name} color={`hsl(${(t.id.charCodeAt(0) * 13) % 360}, 55%, 55%)`}/>
                      <div>
                        <div style={{ fontWeight: 500 }}>{t.name}</div>
                        <div className="mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${t.plan === "Scale" ? "accent" : t.plan === "Growth" ? "info" : ""}`}>{t.plan}</span></td>
                  <td className="num">{t.seats}</td>
                  <td className="num">{t.reelsMonth}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <StatusPill state={conn.ghl} label="GHL"/>
                      <StatusPill state={conn.wp} label="WP"/>
                    </div>
                  </td>
                  <td className="num">€{t.mrr}</td>
                  <td>
                    <span className={`badge ${t.status === "active" ? "success" : t.status === "trial" ? "info" : "warning"}`}>
                      <span className="dot"/>{t.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{t.joined}</td>
                  <td onClick={e => e.stopPropagation()}><button className="icon-btn"><Icon name="more"/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {openAgency && <AgencyDrawer agency={openAgency} onClose={() => setOpenAgency(null)}/>}
    </>
  );
};

Object.assign(window, { AutomationConfig, AdminView });
