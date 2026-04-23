// Shared small components
const Toggle = ({ on, onChange, label, sub }) => (
  <div className="row" style={{ gap: 12, alignItems: "flex-start", justifyContent: "space-between" }}>
    {(label || sub) && (
      <div style={{ flex: 1 }}>
        {label && <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{label}</div>}
        {sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>}
      </div>
    )}
    <button className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} aria-pressed={on} />
  </div>
);

const Checkbox = ({ checked, onChange, label }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--text)" }}>
    <span
      onClick={(e) => { e.preventDefault(); onChange?.(!checked); }}
      style={{
        width: 16, height: 16, borderRadius: 4,
        border: `1.5px solid ${checked ? "var(--accent)" : "var(--border-strong)"}`,
        background: checked ? "var(--accent)" : "var(--surface)",
        display: "grid", placeItems: "center",
        transition: "all 0.12s",
      }}
    >
      {checked && <Icon name="check" size={11} style={{ color: "white" }} />}
    </span>
    {label}
  </label>
);

const Avatar = ({ name, color }) => {
  const letters = name.split(" ").map(x => x[0]).slice(0,2).join("").toUpperCase();
  return <div className="avatar" style={{ background: color || "var(--accent)" }}>{letters}</div>;
};

const Segmented = ({ options, value, onChange }) => (
  <div className="seg">
    {options.map(o => (
      <button key={o.value} className={value === o.value ? "active" : ""} onClick={() => onChange(o.value)}>
        {o.label}
      </button>
    ))}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    "ready": { cls: "success", label: "Ready" },
    "rendering": { cls: "info", label: "Rendering" },
    "needs-review": { cls: "warning", label: "Needs approval" },
    "needs-approval": { cls: "warning", label: "Needs approval" },
    "failed": { cls: "danger", label: "Failed" },
    "published": { cls: "success", label: "Published" },
    "scheduled": { cls: "accent", label: "Scheduled" },
    "rejected": { cls: "danger", label: "Rejected" },
    "draft": { cls: "", label: "Draft" },
  };
  const m = map[status] || { cls: "", label: status };
  return <span className={`badge ${m.cls}`}><span className="dot" />{m.label}</span>;
};

const KindBadge = ({ kind }) => {
  const map = {
    "for-sale": "For sale",
    "sale-agreed": "Sale agreed",
    "sold": "Sold",
    "to-let": "To let",
    "let-agreed": "Let agreed",
    "let": "Let",
  };
  return <span className="badge">{map[kind] || kind}</span>;
};

const SocialDot = ({ id, size = 18 }) => {
  const net = window.MOCK.socials.find(s => s.id === id);
  if (!net) return null;
  return (
    <span title={net.name} style={{
      width: size, height: size, borderRadius: "50%",
      background: net.color, color: "white",
      display: "inline-grid", placeItems: "center",
      border: "2px solid var(--surface)",
    }}>
      <Icon name={net.icon} size={size * 0.6} />
    </span>
  );
};

const EmptyBox = ({ title, sub, icon = "film" }) => (
  <div className="empty">
    <div style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 999, background: "var(--bg-sunken)", color: "var(--text-muted)", margin: "0 auto 12px" }}>
      <Icon name={icon} size={18} />
    </div>
    <div style={{ color: "var(--text)", fontWeight: 500, marginBottom: 4 }}>{title}</div>
    {sub && <div style={{ fontSize: 12 }}>{sub}</div>}
  </div>
);

Object.assign(window, { Toggle, Checkbox, Avatar, Segmented, StatusBadge, KindBadge, SocialDot, EmptyBox });
