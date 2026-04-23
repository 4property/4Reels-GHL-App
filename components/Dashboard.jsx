// Dashboard — list of reels
const Dashboard = ({ onOpenReel }) => {
  const [view, setView] = React.useState("grid");
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const reels = window.MOCK.reels.filter(r => {
    if (filter !== "all" && r.publishStatus !== filter) return false;
    if (search && !(`${r.title} ${r.address}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const visibleCount = window.MOCK.reels.length;
  const countBy = (ps) => window.MOCK.reels.filter(r => r.publishStatus === ps).length;

  const filters = [
    { key: "all", label: "All", count: visibleCount, icon: "list" },
    { key: "needs-approval", label: "Needs approval", count: countBy("needs-approval"), icon: "bell" },
    { key: "published", label: "Published", count: countBy("published"), icon: "check" },
    { key: "rejected", label: "Rejected", count: countBy("rejected"), icon: "close" },
  ];

  // Top metrics
  const metrics = [
    { label: "Reels this month", value: "142", delta: "+18", trend: "up" },
    { label: "Published", value: countBy("published"), delta: "+4", trend: "up" },
    { label: "Needs approval", value: countBy("needs-approval"), delta: "", trend: "flat" },
    { label: "Rejected", value: countBy("rejected"), delta: "", trend: "flat" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reels <span className="count-chip">{visibleCount} total</span></h1>
          <p className="page-subtitle">Automatically generated from your listings. Review, edit or let them publish on their own.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn"><Icon name="download" size={14}/> Export</button>
          <button className="btn primary"><Icon name="plus" size={14}/> New reel</button>
        </div>
      </div>

      {/* Metrics strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {metrics.map(m => (
          <div key={m.label} className="card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{m.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>{m.value}</div>
              <div style={{ fontSize: 12, color: m.trend === "up" ? "var(--success)" : "var(--text-muted)" }}>{m.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div className="subtabs" style={{ marginBottom: 16 }}>
        {filters.map(f => (
          <button key={f.key} className={`subtab ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
            <Icon name={f.icon} size={12}/> {f.label}
            <span style={{
              fontSize: 11, color: "var(--text-subtle)", background: "var(--bg-sunken)",
              padding: "1px 6px", borderRadius: 999, marginLeft: 2,
            }}>{f.count}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
        <div className="row" style={{ gap: 8 }}>
          <div className="search">
            <Icon name="search" size={14}/>
            <input placeholder="Search by title or address" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn"><Icon name="filter" size={14}/> Advanced filters</button>
          <button className="btn"><Icon name="sort" size={14}/> Sort</button>
        </div>
        <Segmented
          options={[{value: "grid", label: "Grid"}, {value: "list", label: "List"}]}
          value={view}
          onChange={setView}
        />
      </div>

      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {reels.map(r => <ReelCard key={r.id} reel={r} onOpen={() => onOpenReel(r.id)} />)}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 36 }}><Checkbox checked={false} onChange={()=>{}} /></th>
                <th>Property</th>
                <th>Status</th>
                <th>Networks</th>
                <th>Duration</th>
                <th style={{ textAlign: "right" }}>Views</th>
                <th style={{ textAlign: "right" }}>Clicks</th>
                <th style={{ textAlign: "right" }}>CTR</th>
                <th>Created</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {reels.map(r => (
                <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => onOpenReel(r.id)}>
                  <td onClick={e => e.stopPropagation()}><Checkbox checked={false} onChange={()=>{}}/></td>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <div style={{ width: 36, height: 48, flex: "none" }}>
                        <Cover kind={r.cover} ratio="3/4" video/>
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{r.title}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.address}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={r.publishStatus} />
                  </td>
                  <td>
                    <div className="row" style={{ gap: -6 }}>
                      {r.networks.slice(0,5).map((n, i) => (
                        <span key={n} style={{ marginLeft: i === 0 ? 0 : -6 }}><SocialDot id={n} /></span>
                      ))}
                      {r.networks.length === 0 && <span className="subtle" style={{ fontSize: 12 }}>—</span>}
                    </div>
                  </td>
                  <td className="num">{r.duration}</td>
                  <td className="num" style={{ color: r.tracker ? "var(--text)" : "var(--text-subtle)" }}>{r.tracker ? fmtNum(r.tracker.views) : "—"}</td>
                  <td className="num" style={{ color: r.tracker ? "var(--accent)" : "var(--text-subtle)", fontWeight: r.tracker ? 600 : 400 }}>{r.tracker ? fmtNum(r.tracker.clicks) : "—"}</td>
                  <td className="num" style={{ color: r.tracker ? (r.tracker.ctr >= 1.5 ? "var(--success)" : r.tracker.ctr >= 1 ? "var(--warning)" : "var(--text-muted)") : "var(--text-subtle)" }}>{r.tracker ? `${r.tracker.ctr}%` : "—"}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{r.createdAt}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="icon-btn"><Icon name="more" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ReelCard = ({ reel, onOpen }) => {
  return (
    <div className="card" style={{ overflow: "hidden", cursor: "pointer", transition: "transform 0.12s, box-shadow 0.12s" }}
         onClick={onOpen}
         onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
         onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-xs)"; }}>
      <div style={{ position: "relative" }}>
        <Cover kind={reel.cover} ratio="3/4" label={reel.title} style={{ borderRadius: 0 }} video />
        <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", justifyContent: "space-between", gap: 6 }}>
          <StatusBadge status={reel.publishStatus} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 999, fontSize: 11, fontWeight: 500,
            background: "rgba(15,23,41,0.72)", color: "white", backdropFilter: "blur(4px)" }}>
            <Icon name="clock" size={10}/> {reel.duration}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 6 }}>
          <div>
            <KindBadge kind={reel.kind} />
          </div>
          <div className="row" style={{ gap: 0 }}>
            {reel.networks.map((n, i) => (
              <span key={n} style={{ marginLeft: i === 0 ? 0 : -6 }}><SocialDot id={n} size={24}/></span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{reel.title}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{reel.address}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap" }}>{reel.price}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--divider)" }}>
          {reel.publishStatus === "needs-approval" ? (
            <div className="row" style={{ gap: 6 }} onClick={e => e.stopPropagation()}>
              <button className="btn primary sm" style={{ padding: "4px 10px", fontSize: 11 }}><Icon name="check" size={11}/> Approve</button>
              <button className="btn sm" style={{ padding: "4px 10px", fontSize: 11 }}>Reject</button>
            </div>
          ) : reel.publishStatus === "rejected" ? (
            <span className="subtle" style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="close" size={11}/> Not published
            </span>
          ) : (
            <span className="subtle" style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4, color: "var(--success)" }}>
              <Icon name="check" size={11}/> Live on {reel.networks.length} network{reel.networks.length === 1 ? "" : "s"}
            </span>
          )}
          <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{reel.createdAt.split(" · ")[1]}</span>
        </div>
        {/* Link tracker stats */}
        <TrackerStats tracker={reel.tracker} />
      </div>
    </div>
  );
};

const fmtNum = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);

const TrackerStats = ({ tracker }) => {
  if (!tracker) {
    return (
      <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 6, background: "var(--bg-soft)", fontSize: 11, color: "var(--text-subtle)", display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="link" size={11}/> No tracker data yet
      </div>
    );
  }
  const ctrColor = tracker.ctr >= 1.5 ? "var(--success)" : tracker.ctr >= 1 ? "var(--warning)" : "var(--text-muted)";
  const [range, setRange] = React.useState("7");
  const series = range === "7" ? (tracker.clicks7d || []) : (tracker.clicks30d || []);
  const rangeTotal = series.reduce((a, b) => a + b, 0);
  return (
    <div onClick={(e) => e.stopPropagation()}
         style={{ marginTop: 8, padding: 10, borderRadius: 6, background: "var(--bg-soft)", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Top row: compact stats + top network */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
          <CompactStat icon="eye" value={fmtNum(tracker.views)}/>
          <CompactStat icon="link" value={fmtNum(tracker.clicks)} color="var(--accent)"/>
          <CompactStat icon="trending-up" value={`${tracker.ctr}%`} color={ctrColor}/>
        </div>
        <SocialDot id={tracker.topNet} size={16}/>
      </div>

      {/* Sparkline row */}
      {series.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4, gap: 6 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{fmtNum(rangeTotal)}</span>
              <span style={{ fontSize: 10, color: "var(--text-subtle)" }}>clicks · {range}d</span>
            </div>
            <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden", background: "var(--surface)", flex: "none" }}>
              {["7", "30"].map(r => (
                <button key={r} onClick={() => setRange(r)}
                  style={{ padding: "2px 6px", fontSize: 10, fontWeight: 600, border: 0,
                    background: range === r ? "var(--accent)" : "transparent",
                    color: range === r ? "white" : "var(--text-muted)",
                    cursor: "pointer", fontFamily: "inherit", lineHeight: 1.2,
                  }}>{r}d</button>
              ))}
            </div>
          </div>
          <Sparkline data={series} width={undefined} height={24}/>
        </div>
      )}
    </div>
  );
};

const CompactStat = ({ icon, value, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, color: color || "var(--text)", whiteSpace: "nowrap" }}>
    <Icon name={icon} size={11} style={{ opacity: 0.75 }}/> {value}
  </span>
);

const Sparkline = ({ data, width, height = 24, color = "var(--accent)" }) => {
  if (!data || data.length === 0) return null;
  const vbW = 200; // internal viewBox width
  const max = Math.max(...data, 1);
  const stepX = data.length > 1 ? vbW / (data.length - 1) : 0;
  const pts = data.map((v, i) => {
    const x = i * stepX;
    const y = height - (v / max) * (height - 2) - 1;
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${vbW},${height} L0,${height} Z`;
  const lastX = pts[pts.length - 1][0];
  const lastY = pts[pts.length - 1][1];
  return (
    <svg viewBox={`0 0 ${vbW} ${height}`} preserveAspectRatio="none" width={width || "100%"} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)"/>
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={lastX} cy={lastY} r="2" fill={color}/>
    </svg>
  );
};

const StatCell = ({ icon, value, label, color, highlight }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: color || (highlight ? "var(--accent)" : "var(--text)"), lineHeight: 1 }}>
      <Icon name={icon} size={10}/> {value}
    </span>
    <span style={{ fontSize: 9, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1 }}>{label}</span>
  </div>
);

window.Dashboard = Dashboard;
