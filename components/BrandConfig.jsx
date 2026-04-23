// Brand config — logo, colors, watermark, outro
const BrandConfig = () => {
  const [primary, setPrimary] = React.useState("#2b57f6");
  const [secondary, setSecondary] = React.useState("#0f1729");
  const [font, setFont] = React.useState("Inter");
  const [showWatermark, setShowWatermark] = React.useState(true);
  const [showOutro, setShowOutro] = React.useState(true);
  const [watermarkPos, setWatermarkPos] = React.useState("bottom-right");
  const [tagline, setTagline] = React.useState("Harbor & Vale Realty");
  const [outroHeadline, setOutroHeadline] = React.useState("Book a viewing");
  const [outroSub, setOutroSub] = React.useState("harborvale.ie · 01 234 5678");

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand</h1>
          <p className="page-subtitle">These settings are applied to every reel your agency generates.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn"><Icon name="eye" size={14}/> Preview on a reel</button>
          <button className="btn primary"><Icon name="check" size={14}/> Save brand</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 20 }}>
        <div className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Identity</div></div>
            <div className="card-body" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
              <div>
                <div className="label" style={{ marginBottom: 6 }}>Logo</div>
                <div style={{ position: "relative", aspectRatio: "1/1", border: "1px solid var(--border)", borderRadius: 12, background: "white", display: "grid", placeItems: "center", overflow: "hidden" }}>
                  <img src="assets/ck-logo.png" alt="CKP logo" style={{ maxWidth: "78%", maxHeight: "78%", objectFit: "contain" }}/>
                  <button className="btn sm" style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)" }}><Icon name="edit" size={12}/> Replace</button>
                </div>
                <div className="hint" style={{ marginTop: 6, textAlign: "center" }}>PNG · 512×512</div>
              </div>
              <div className="stack" style={{ gap: 14 }}>
                <div className="field">
                  <div className="label">Agency name</div>
                  <input className="input" value={tagline} onChange={e => setTagline(e.target.value)}/>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field">
                    <div className="label">Primary color</div>
                    <ColorInput value={primary} onChange={setPrimary}/>
                  </div>
                  <div className="field">
                    <div className="label">Secondary color</div>
                    <ColorInput value={secondary} onChange={setSecondary}/>
                  </div>
                </div>
                <div className="field">
                  <div className="label">Heading font</div>
                  <select className="select" value={font} onChange={e => setFont(e.target.value)}>
                    <option>Inter</option><option>Söhne</option><option>Manrope</option><option>Plus Jakarta Sans</option><option>Helvetica</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div><div className="card-title">Watermark</div><div className="card-subtitle">Small brand mark pinned to every reel.</div></div>
              <Toggle on={showWatermark} onChange={setShowWatermark}/>
            </div>
            <div className="card-body" style={{ display: showWatermark ? "block" : "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field">
                  <div className="label">Position</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[
                      { id: "top-left", label: "Top left" },
                      { id: "top-right", label: "Top right" },
                      { id: "bottom-left", label: "Bottom left" },
                      { id: "bottom-right", label: "Bottom right" },
                    ].map(p => (
                      <button key={p.id} className={`btn sm ${watermarkPos === p.id ? "primary" : ""}`} onClick={() => setWatermarkPos(p.id)}>{p.label}</button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <div className="label">Opacity</div>
                  <input type="range" min="30" max="100" defaultValue="80" style={{ width: "100%" }}/>
                  <div className="hint">80%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div><div className="card-title">Outro card</div><div className="card-subtitle">Closing frame with CTA. Appears in the last 2 seconds.</div></div>
              <Toggle on={showOutro} onChange={setShowOutro}/>
            </div>
            <div className="card-body" style={{ display: showOutro ? "block" : "none" }}>
              <div className="stack" style={{ gap: 12 }}>
                <div className="field"><div className="label">Headline</div><input className="input" value={outroHeadline} onChange={e => setOutroHeadline(e.target.value)}/></div>
                <div className="field"><div className="label">Sub-line</div><input className="input" value={outroSub} onChange={e => setOutroSub(e.target.value)}/></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: live 3:4 preview */}
        <div style={{ position: "sticky", top: 68, alignSelf: "flex-start" }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, textAlign: "center" }}>Live preview · 3:4</div>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
              <Cover kind="ranelagh" ratio="3/4" label="SAMPLE FRAME" video/>
              {/* watermark */}
              {showWatermark && (
                <div style={{
                  position: "absolute",
                  [watermarkPos.includes("top") ? "top" : "bottom"]: 12,
                  [watermarkPos.includes("left") ? "left" : "right"]: 12,
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.92)", color: secondary,
                  padding: "5px 9px 5px 6px", borderRadius: 6,
                  fontSize: 11, fontWeight: 600, letterSpacing: "-0.01em",
                }}>
                  <img src="assets/ck-logo.png" alt="" style={{ width: 16, height: 16, objectFit: "contain" }}/>
                  {tagline}
                </div>
              )}
              {/* subtitle strip */}
              <div style={{
                position: "absolute", bottom: "12%", left: 12, right: 12,
                padding: "6px 10px", background: "rgba(15,23,41,0.78)", color: "white",
                borderRadius: 4, fontSize: 12, fontWeight: 600, backdropFilter: "blur(4px)",
                fontFamily: `"${font}", sans-serif`,
              }}>
                South-facing garden · renovated 2024
              </div>
            </div>

            {/* Outro card preview */}
            {showOutro && (
              <div style={{ marginTop: 12, position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "3/4", background: secondary, color: "white", display: "grid", placeItems: "center", padding: 20, textAlign: "center" }}>
                <div>
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: "white", margin: "0 auto 16px", display: "grid", placeItems: "center", padding: 8 }}>
                    <img src="assets/ck-logo.png" alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}/>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: `"${font}", sans-serif` }}>{outroHeadline}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>{outroSub}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorInput = ({ value, onChange }) => (
  <div className="input-group">
    <span className="input-group-icon" style={{ padding: 4, paddingLeft: 6 }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width: 24, height: 24, border: "0", borderRadius: 4, padding: 0, background: "transparent" }}/>
    </span>
    <input className="input" value={value} onChange={e => onChange(e.target.value)}/>
  </div>
);

window.BrandConfig = BrandConfig;
