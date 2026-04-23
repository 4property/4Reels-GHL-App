// Per-agency admin drawer — opened from the Agencies table.
// Lets super-admin inspect the agency and configure its data sources (GHL API key + WordPress URL).

const AgencyDrawer = ({ agency, onClose }) => {
  const [tab, setTab] = React.useState("sources");

  // Pretend per-agency config (would come from backend). Derived from agency id so different agencies have different states.
  const initialConfig = React.useMemo(() => {
    const h = agency.id.charCodeAt(3) % 4;
    return {
      ghl: {
        status: h === 0 ? "missing" : h === 1 ? "error" : "connected",
        apiKey: h === 0 ? "" : "pit-0f3a9b2c-4e8d-4f21-b7a8-" + agency.id.replace(/-/g, "") + "cd91",
        locationId: h === 0 ? "" : "loc_" + agency.id.replace(/-/g, "").toUpperCase(),
        pipeline: h === 0 ? "" : "Listings",
        stage: h === 0 ? "" : "Listed",
        errorMsg: h === 1 ? "401 Unauthorized — API key expired 3 days ago" : "",
        lastSync: h === 2 || h === 3 ? "4 min ago" : "—",
      },
      wp: {
        status: h === 3 ? "missing" : h === 2 ? "error" : "connected",
        url: h === 3 ? "" : `https://www.${agency.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 14)}.ie`,
        user: h === 3 ? "" : "4reels-integration",
        appPassword: h === 3 ? "" : "XXXX XXXX XXXX XXXX XXXX XXXX",
        postType: h === 3 ? "" : "property",
        pollMinutes: 5,
        errorMsg: h === 2 ? "REST API returning 403 — Application Password rejected" : "",
        lastSync: h === 0 || h === 1 ? "2 min ago" : "—",
      },
    };
  }, [agency.id]);

  const [ghl, setGhl] = React.useState(initialConfig.ghl);
  const [wp, setWp] = React.useState(initialConfig.wp);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    setGhl(initialConfig.ghl); setWp(initialConfig.wp); setDirty(false);
  }, [initialConfig]);

  // esc to close
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const updGhl = (ch) => { setGhl({ ...ghl, ...ch }); setDirty(true); };
  const updWp = (ch) => { setWp({ ...wp, ...ch }); setDirty(true); };

  const bothHealthy = ghl.status === "connected" && wp.status === "connected";

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(15,23,41,0.35)", display: "flex", justifyContent: "flex-end" }}>
      <div onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 680, background: "var(--surface)", height: "100vh",
          boxShadow: "-12px 0 40px rgba(15,23,41,0.12)", display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "slideInRight 180ms ease-out",
        }}>
        {/* Header */}
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--divider)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={agency.name} color={`hsl(${(agency.id.charCodeAt(0) * 13) % 360}, 55%, 55%)`}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{agency.name}</div>
                <span className={`badge ${agency.plan === "Scale" ? "accent" : agency.plan === "Growth" ? "info" : ""}`}>{agency.plan}</span>
                <span className={`badge ${agency.status === "active" ? "success" : agency.status === "trial" ? "info" : "warning"}`}>
                  <span className="dot"/>{agency.status}
                </span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{agency.id}</div>
            </div>
            <button className="icon-btn" onClick={onClose}><Icon name="close" size={16}/></button>
          </div>

          {/* At-a-glance stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
            <MiniStat label="Seats" value={agency.seats}/>
            <MiniStat label="Reels 30d" value={agency.reelsMonth}/>
            <MiniStat label="Storage" value={`${agency.storageGb} GB`}/>
            <MiniStat label="MRR" value={`€${agency.mrr}`}/>
          </div>

          {/* Tabs */}
          <div className="subtabs" style={{ marginTop: 16, marginBottom: -14 }}>
            <button className={`subtab ${tab === "sources" ? "active" : ""}`} onClick={() => setTab("sources")}>
              <Icon name="database" size={12}/> Data sources
              {!bothHealthy && <span className="badge danger" style={{ fontSize: 9, marginLeft: 4 }}>!</span>}
            </button>
            <button className={`subtab ${tab === "billing" ? "active" : ""}`} onClick={() => setTab("billing")}>
              <Icon name="tag" size={12}/> Billing
            </button>
            <button className={`subtab ${tab === "activity" ? "active" : ""}`} onClick={() => setTab("activity")}>
              <Icon name="list" size={12}/> Activity
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="scroll" style={{ flex: 1, overflow: "auto", padding: 22, background: "var(--bg-soft)" }}>
          {tab === "sources" && (
            <div className="stack" style={{ gap: 16 }}>
              {/* Explanatory header */}
              <div style={{ padding: 12, background: "var(--accent-soft)", borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12, color: "var(--text-muted)" }}>
                <Icon name="info" size={14} style={{ color: "var(--accent)", marginTop: 2, flex: "none" }}/>
                <div>
                  Connect <b style={{ color: "var(--text)" }}>{agency.name}</b>'s listing sources here. Each source feeds properties into their Automation queue. These credentials stay inside this agency — only you (super-admin) can see them.
                </div>
              </div>

              <GHLSourceCard config={ghl} onChange={updGhl}/>
              <WPSourceCard config={wp} onChange={updWp} agency={agency}/>
            </div>
          )}

          {tab === "billing" && <BillingTab agency={agency}/>}
          {tab === "activity" && <ActivityTab agency={agency}/>}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 22px", borderTop: "1px solid var(--divider)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)" }}>
          <div style={{ fontSize: 12, color: dirty ? "var(--warning)" : "var(--text-muted)" }}>
            {dirty ? "● Unsaved changes" : "All changes saved"}
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={onClose}>Close</button>
            <button className="btn primary" disabled={!dirty} onClick={() => setDirty(false)}>
              <Icon name="check" size={13}/> Save config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value }) => (
  <div style={{ padding: "8px 10px", background: "var(--bg-soft)", borderRadius: 8 }}>
    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 600, marginTop: 1 }}>{value}</div>
  </div>
);

// ─── GoHighLevel source card ───────────────────────────────────

const GHLSourceCard = ({ config, onChange }) => {
  const [showKey, setShowKey] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null);
  const test = () => {
    setTesting(true); setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      if (config.apiKey && config.apiKey.length > 20 && config.locationId) {
        setTestResult({ ok: true, msg: `Connected — location "${config.locationId}" verified` });
        onChange({ status: "connected", errorMsg: "", lastSync: "just now" });
      } else if (!config.locationId) {
        setTestResult({ ok: false, msg: "Location ID is required" });
      } else {
        setTestResult({ ok: false, msg: "API token missing or invalid format" });
      }
    }, 800);
  };

  const statusBadge = config.status === "connected"
    ? <span className="badge success"><span className="dot"/> Connected</span>
    : config.status === "error"
      ? <span className="badge danger"><Icon name="alert" size={10}/> Error</span>
      : <span className="badge warning"><Icon name="close" size={10}/> Not configured</span>;

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: 16, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-soft)", display: "grid", placeItems: "center", flex: "none", border: "1px solid var(--divider)" }}>
          <DrawerGHLLogo/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>GoHighLevel</div>
            {statusBadge}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {config.status === "connected" && `Last sync: ${config.lastSync}`}
            {config.status === "error" && <span style={{ color: "var(--danger)" }}>{config.errorMsg}</span>}
            {config.status === "missing" && "Paste this agency's private integration key from GHL."}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: "0 16px 16px" }}>
        <div className="stack" style={{ gap: 12 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="label">Location ID</div>
            <input className="input mono" placeholder="loc_ABCD1234" value={config.locationId} onChange={e => onChange({ locationId: e.target.value })} style={{ fontSize: 11 }}/>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <div className="label">GHL API token</div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                className="input mono"
                type={showKey ? "text" : "password"}
                placeholder="pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={config.apiKey}
                onChange={e => onChange({ apiKey: e.target.value })}
                style={{ flex: 1, fontSize: 11 }}
              />
              <button className="btn sm" onClick={() => setShowKey(!showKey)} title={showKey ? "Hide" : "Reveal"}>
                <Icon name="eye" size={12}/>
              </button>
            </div>
            <div className="hint" style={{ marginTop: 6 }}>
              In GHL: <span className="mono">Settings → Integrations → Private Integrations → Create new</span>.
            </div>
          </div>

          {/* Test + status row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg-soft)", borderRadius: 8 }}>
            <button className="btn sm" onClick={test} disabled={testing}>
              {testing ? <><Spinner/> Testing…</> : <><Icon name="zap" size={12}/> Test connection</>}
            </button>
            {testResult && (
              <div style={{ fontSize: 12, color: testResult.ok ? "var(--success)" : "var(--danger)", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name={testResult.ok ? "check" : "alert"} size={12}/>
                {testResult.msg}
              </div>
            )}
            {!testResult && !testing && config.status === "connected" && (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Last tested {config.lastSync}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── WordPress source card ─────────────────────────────────────

const WPSourceCard = ({ config, onChange, agency }) => {
  const [showPwd, setShowPwd] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null);
  const test = () => {
    setTesting(true); setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      if (!config.url) return setTestResult({ ok: false, msg: "URL is required" });
      if (!config.url.startsWith("http")) return setTestResult({ ok: false, msg: "URL must start with https://" });
      setTestResult({ ok: true, msg: `Connected — found ${Math.floor(Math.random()*50)+10} properties in CPT "${config.postType || "property"}"` });
      onChange({ status: "connected", errorMsg: "", lastSync: "just now" });
    }, 800);
  };

  const statusBadge = config.status === "connected"
    ? <span className="badge success"><span className="dot"/> Connected</span>
    : config.status === "error"
      ? <span className="badge danger"><Icon name="alert" size={10}/> Error</span>
      : <span className="badge warning"><Icon name="close" size={10}/> Not configured</span>;

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: 16, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-soft)", display: "grid", placeItems: "center", flex: "none", border: "1px solid var(--divider)" }}>
          <DrawerWPLogo/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>WordPress</div>
            {statusBadge}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {config.status === "connected" && `${config.url} · polling every ${config.pollMinutes} min · last sync ${config.lastSync}`}
            {config.status === "error" && <span style={{ color: "var(--danger)" }}>{config.errorMsg}</span>}
            {config.status === "missing" && "Point to the agency's WordPress site and authenticate."}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <div className="stack" style={{ gap: 12 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="label">WordPress site URL</div>
            <input
              className="input"
              placeholder={`https://www.${agency.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 10)}.ie`}
              value={config.url}
              onChange={e => onChange({ url: e.target.value })}
            />
            <div className="hint" style={{ marginTop: 6 }}>We'll read listings from <span className="mono">/wp-json/wp/v2</span>. HTTPS required.</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg-soft)", borderRadius: 8 }}>
            <button className="btn sm" onClick={test} disabled={testing}>
              {testing ? <><Spinner/> Testing…</> : <><Icon name="zap" size={12}/> Test connection</>}
            </button>
            {testResult && (
              <div style={{ fontSize: 12, color: testResult.ok ? "var(--success)" : "var(--danger)", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name={testResult.ok ? "check" : "alert"} size={12}/>
                {testResult.msg}
              </div>
            )}
            {!testResult && !testing && config.status === "connected" && (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Last tested {config.lastSync}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Billing tab ───────────────────────────────────────────────

const BillingTab = ({ agency }) => (
  <div className="stack" style={{ gap: 12 }}>
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Subscription</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <KV label="Plan" value={agency.plan}/>
        <KV label="MRR" value={`€${agency.mrr}`}/>
        <KV label="Seats" value={agency.seats}/>
        <KV label="Joined" value={agency.joined}/>
        <KV label="Next invoice" value="Apr 30, 2026"/>
        <KV label="Payment method" value="Visa •••• 4821"/>
      </div>
      <div className="row" style={{ gap: 8, marginTop: 14 }}>
        <button className="btn sm"><Icon name="external" size={12}/> Open in Stripe</button>
        <button className="btn sm">Change plan</button>
      </div>
    </div>
  </div>
);

const ActivityTab = ({ agency }) => {
  const rows = [
    { t: "2 min ago", text: "Reel published · 12 Sandymount Rd · Instagram + Facebook", kind: "publish" },
    { t: "14 min ago", text: "New property synced from WordPress · 45b Rathgar Ave", kind: "sync" },
    { t: "1 hr ago", text: "GHL opportunity moved to stage 'Listed' · 28 Ranelagh Sq", kind: "sync" },
    { t: "Yesterday", text: "Seat added · darragh@ckpestateagents.ie", kind: "admin" },
    { t: "3 days ago", text: "Plan upgraded: Growth → Scale", kind: "admin" },
  ];
  const meta = {
    publish: { icon: "send", color: "var(--accent)" },
    sync: { icon: "refresh", color: "var(--info)" },
    admin: { icon: "shield", color: "var(--text-muted)" },
  };
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Recent activity</div>
      <div className="stack" style={{ gap: 10 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i < rows.length - 1 ? 10 : 0, borderBottom: i < rows.length - 1 ? "1px solid var(--divider)" : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-soft)", color: meta[r.kind].color, display: "grid", placeItems: "center", flex: "none" }}>
              <Icon name={meta[r.kind].icon} size={12}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13 }}>{r.text}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{r.t}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const KV = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{value}</div>
  </div>
);

// ─── Small inline logos (drawer-local to avoid collision) ─────

const DrawerGHLLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect width="64" height="64" rx="12" fill="#1f80f0"/>
    <path d="M18 40 L32 20 L46 40 M24 40 L24 32 H40 V40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const DrawerWPLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="30" fill="#21759b"/>
    <text x="32" y="40" textAnchor="middle" fontSize="26" fontWeight="700" fill="white" fontFamily="system-ui">W</text>
  </svg>
);

const Spinner = () => (
  <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid currentColor", borderRightColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }}/>
);

window.AgencyDrawer = AgencyDrawer;
