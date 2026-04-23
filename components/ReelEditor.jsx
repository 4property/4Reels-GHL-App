// Reel editor — 3:4 preview + photos/subtitles/descriptions/music
const ReelEditor = ({ reelId, onClose }) => {
  const reel = window.MOCK.reels.find(r => r.id === reelId) || window.MOCK.reels[0];
  const [tab, setTab] = React.useState("photos");
  const [playing, setPlaying] = React.useState(false);
  const [currentScene, setCurrentScene] = React.useState(0);

  // Real photos for Cranford Court
  const sourcePhotos = [
    { kind: "cranford-primary", label: "EXTERIOR · SIGN", aiScore: 96 },
    { kind: "cranford-garden", label: "GARDEN", aiScore: 91 },
    { kind: "cranford-exterior", label: "EXTERIOR · BUILDING", aiScore: 88 },
    { kind: "cranford-living", label: "LIVING ROOM", aiScore: 93 },
    { kind: "cranford-kitchen", label: "KITCHEN", aiScore: 84 },
    { kind: "cranford-bedroom", label: "BEDROOM", aiScore: 90 },
    { kind: "cranford-bathroom", label: "BATHROOM", aiScore: 78 },
    { kind: "cranford-garden", label: "GARDEN · ALT", aiScore: 72 },
    { kind: "cranford-kitchen", label: "KITCHEN · DETAIL", aiScore: 66 },
    { kind: "cranford-bathroom", label: "BATHROOM · ALT", aiScore: 58 },
  ];
  const [photos, setPhotos] = React.useState(() =>
    sourcePhotos.map((p, i) => ({ id: `p${i}`, ...p, selected: i < 8 }))
  );

  // Subtitles
  const [subtitles, setSubtitles] = React.useState([
    { id: "s1", start: "0:00", end: "0:04", text: "Welcome to Cranford Court" },
    { id: "s2", start: "0:04", end: "0:09", text: "A private development in Stillorgan, Dublin 4" },
    { id: "s3", start: "0:09", end: "0:14", text: "Beautiful communal gardens and mature trees" },
    { id: "s4", start: "0:14", end: "0:19", text: "Bright living room with original fireplace" },
    { id: "s5", start: "0:19", end: "0:24", text: "Fitted kitchen with integrated appliances" },
    { id: "s6", start: "0:24", end: "0:29", text: "Double bedroom with built-in storage" },
    { id: "s7", start: "0:29", end: "0:33", text: "Fully tiled bathroom with shower" },
    { id: "s8", start: "0:33", end: "0:36", text: "Book a viewing with CKP Estate Agents" },
  ]);

  // Descriptions per network
  const defaultDesc = "🏡 2-bed apartment · Cranford Court\n📍 Stillorgan Road, Dublin 4\n💰 €385,000\n🛏 2 · 🛁 1 · 📐 68 m²\n\nA bright two-bed apartment in a sought-after private development with mature gardens and off-street parking.\n\n👉 Book a viewing: ckpestateagents.ie/view/r8832\n\n#dublinhomes #stillorgan #dublin4 #propertytour #ckpestateagents";
  const [descs, setDescs] = React.useState(() => {
    const o = {};
    window.MOCK.socials.forEach(s => { o[s.id] = { enabled: reel.networks.includes(s.id), text: defaultDesc }; });
    return o;
  });
  const [activeNet, setActiveNet] = React.useState(reel.networks[0] || "instagram");

  // Voiceover state
  const [voTakes, setVoTakes] = React.useState([
    { id: "t1", name: "Take 1", duration: "0:34", size: "1.2 MB", recorded: "2 min ago", active: true, waveform: [0.2,0.4,0.6,0.8,0.7,0.5,0.3,0.6,0.9,0.8,0.6,0.4,0.5,0.7,0.9,0.8,0.6,0.4,0.3,0.5,0.7,0.8,0.6,0.4,0.2,0.3,0.5,0.7,0.9,0.8,0.6,0.4,0.3,0.2,0.4,0.6,0.5,0.3,0.4,0.6,0.7,0.5,0.3,0.2,0.4,0.6,0.8,0.6,0.4,0.3] },
  ]);
  const [voMode, setVoMode] = React.useState("record"); // "record" | "ai"
  const [voDucking, setVoDucking] = React.useState(60);
  const [voMusicVol, setVoMusicVol] = React.useState(35);
  const [voVoiceVol, setVoVoiceVol] = React.useState(90);
  const [voAiVoice, setVoAiVoice] = React.useState("emma-ie");
  const [voAiScript, setVoAiScript] = React.useState(subtitles.map(s => s.text).join(" "));

  // Slides: extra slides (intro, outro, google review, text, photo) that the agent can add
  const [slides, setSlides] = React.useState([
    { id: "sl1", kind: "intro-video", label: "Intro · CKP", duration: 2.5, enabled: true, locked: false, source: "default" },
    { id: "sl2", kind: "outro-video", label: "Outro · Book a viewing", duration: 3, enabled: true, locked: false, source: "default" },
  ]);

  const selectedPhotos = photos.filter(p => p.selected);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Editor header */}
      <div style={{ height: 56, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 20px", gap: 14 }}>
        <button className="btn ghost" onClick={onClose}>
          <Icon name="chevron-left" size={16}/> Back to reels
        </button>
        <div style={{ height: 20, width: 1, background: "var(--border)" }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{reel.title}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {reel.address} · <span className="mono">{reel.id}</span>
          </div>
        </div>
        <StatusBadge status={reel.status}/>
        {reel.publishStatus && <StatusBadge status={reel.publishStatus}/>}
        <div style={{ height: 20, width: 1, background: "var(--border)" }}/>
        <button className="btn"><Icon name="zap" size={14}/> Regenerate with AI</button>
        <button className="btn"><Icon name="download" size={14}/> Export</button>
        <button className="btn primary"><Icon name="send" size={14}/> Publish</button>
      </div>

      {/* Body: preview | tabs panel */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(320px, 460px) 1fr", minHeight: 0, overflow: "hidden" }}>
        {/* Left: 3:4 preview */}
        <div style={{ background: "var(--bg-soft)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, borderRight: "1px solid var(--border)", overflow: "auto" }} className="scroll">
          <div style={{ width: "100%", maxWidth: 360, aspectRatio: "3/4", borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: "var(--shadow-md)" }}>
            <Cover kind={selectedPhotos[currentScene]?.kind || "cranford-primary"} ratio="3/4" label={selectedPhotos[currentScene]?.label} video/>
            {/* watermark */}
            <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.92)", padding: "3px 6px 3px 4px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
              <img src="assets/ck-logo.png" alt="CK" style={{ width: 16, height: 16, borderRadius: 3 }}/>
              CKP Estate Agents
            </div>
            {/* subtitle strip */}
            <div style={{ position: "absolute", bottom: "14%", left: 16, right: 16, padding: "8px 12px", background: "rgba(15,23,41,0.82)", color: "white", borderRadius: 6, fontSize: 13, fontWeight: 600, backdropFilter: "blur(4px)", textAlign: "center", lineHeight: 1.3 }}>
              {subtitles[currentScene]?.text || ""}
            </div>
            {/* play overlay */}
            <button onClick={() => setPlaying(!playing)} style={{
              position: "absolute", inset: 0, background: playing ? "transparent" : "rgba(0,0,0,0.15)",
              border: 0, cursor: "pointer", display: "grid", placeItems: "center", color: "white", transition: "background 0.15s",
            }}>
              {!playing && <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.95)", color: "var(--text)", display: "grid", placeItems: "center" }}><Icon name="play" size={20}/></div>}
            </button>
          </div>

          {/* Scrubber */}
          <div style={{ width: "100%", maxWidth: 360 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <button className="icon-btn" onClick={() => setPlaying(!playing)} style={{ background: "var(--accent)", color: "white", width: 34, height: 34, borderRadius: "50%" }}>
                <Icon name={playing ? "pause" : "play"} size={14}/>
              </button>
              <div className="mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>
                0:{String(currentScene * 4).padStart(2, "0")} / {reel.duration}
              </div>
              <div style={{ flex: 1 }}/>
              <button className="icon-btn" title="Music"><Icon name="music" size={14}/></button>
              <button className="icon-btn" title="Captions"><Icon name="type" size={14}/></button>
            </div>
            {/* Timeline scenes */}
            <div style={{ display: "flex", gap: 3, height: 44, padding: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}>
              {selectedPhotos.map((p, i) => (
                <button key={p.id} onClick={() => setCurrentScene(i)}
                        style={{
                          flex: 1, border: `2px solid ${currentScene === i ? "var(--accent)" : "transparent"}`,
                          borderRadius: 4, overflow: "hidden", background: "transparent", padding: 0, cursor: "pointer",
                        }}>
                  <Cover kind={p.kind} ratio="auto" style={{ aspectRatio: "auto", width: "100%", height: "100%", borderRadius: 2 }}/>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
              <span>{selectedPhotos.length} scenes · {reel.duration}</span>
              <span className="row" style={{ gap: 6 }}>
                <Icon name="music" size={11}/> {reel.music}
              </span>
            </div>
          </div>

          {/* AI summary card */}
        </div>

        {/* Right: editor panel */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 20px", gap: 2 }}>
            <button className={`subtab ${tab === "photos" ? "active" : ""}`} onClick={() => setTab("photos")}>
              <Icon name="image" size={12}/> Photos <span className="badge">{selectedPhotos.length}/{photos.length}</span>
            </button>
            <button className={`subtab ${tab === "subtitles" ? "active" : ""}`} onClick={() => setTab("subtitles")}>
              <Icon name="type" size={12}/> Subtitles <span className="badge">{subtitles.length}</span>
            </button>
            <button className={`subtab ${tab === "descriptions" ? "active" : ""}`} onClick={() => setTab("descriptions")}>
              <Icon name="share" size={12}/> Descriptions
            </button>
            <button className={`subtab ${tab === "slides" ? "active" : ""}`} onClick={() => setTab("slides")}>
              <Icon name="film" size={12}/> Slides <span className="badge">{slides.filter(s => s.enabled).length}</span>
            </button>
            <button className={`subtab ${tab === "voiceover" ? "active" : ""}`} onClick={() => setTab("voiceover")}>
              <Icon name="mic" size={12}/> Voiceover {voTakes.some(t => t.active) && <span className="dot" style={{ width: 6, height: 6, borderRadius: 999, background: "var(--success)" }}/>}
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 24 }} className="scroll">
            {tab === "photos" && <PhotosPanel photos={photos} setPhotos={setPhotos}/>}
            {tab === "subtitles" && <SubtitlesPanel subtitles={subtitles} setSubtitles={setSubtitles} currentScene={currentScene} setCurrentScene={setCurrentScene}/>}
            {tab === "descriptions" && <DescriptionsPanel descs={descs} setDescs={setDescs} activeNet={activeNet} setActiveNet={setActiveNet}/>}
            {tab === "slides" && <SlidesPanel slides={slides} setSlides={setSlides}/>}
            {tab === "voiceover" && <VoiceoverPanel
              takes={voTakes} setTakes={setVoTakes}
              mode={voMode} setMode={setVoMode}
              ducking={voDucking} setDucking={setVoDucking}
              musicVol={voMusicVol} setMusicVol={setVoMusicVol}
              voiceVol={voVoiceVol} setVoiceVol={setVoVoiceVol}
              aiVoice={voAiVoice} setAiVoice={setVoAiVoice}
              aiScript={voAiScript} setAiScript={setVoAiScript}
              reelDuration={reel.duration}
              subtitles={subtitles}
            />}
          </div>
        </div>
      </div>
    </div>
  );
};

const PhotosPanel = ({ photos, setPhotos }) => {
  const [dragIdx, setDragIdx] = React.useState(null);
  const toggle = (id) => setPhotos(photos.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  const move = (from, to) => { const next = [...photos]; const [m] = next.splice(from, 1); next.splice(to, 0, m); setPhotos(next); };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Property photos</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>AI pre-selected the top 8. Drag to reorder, click to include/exclude.</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn sm"><Icon name="zap" size={12}/> Re-run AI selection</button>
          <button className="btn sm"><Icon name="upload" size={12}/> Upload</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {photos.map((p, i) => (
          <div key={p.id}
               draggable
               onDragStart={() => setDragIdx(i)}
               onDragOver={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) { move(dragIdx, i); setDragIdx(i); } }}
               onDragEnd={() => setDragIdx(null)}
               onClick={() => toggle(p.id)}
               style={{
                 position: "relative", borderRadius: 8, overflow: "hidden", cursor: "pointer",
                 border: `2px solid ${p.selected ? "var(--accent)" : "transparent"}`,
                 opacity: p.selected ? 1 : 0.45,
                 transition: "all 0.15s",
               }}>
            <Cover kind={p.kind} ratio="3/4" label={p.label}/>
            <div style={{ position: "absolute", top: 6, left: 6, display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", borderRadius: 4, background: p.selected ? "var(--accent)" : "rgba(15,23,41,0.6)", color: "white", fontSize: 11, fontWeight: 600 }}>
              {p.selected ? `#${photos.filter(x => x.selected).indexOf(p) + 1}` : "—"}
            </div>
            <div style={{ position: "absolute", top: 6, right: 6, padding: "2px 6px", borderRadius: 4, background: "rgba(15,23,41,0.7)", color: "white", fontSize: 10, fontWeight: 600 }}>
              AI {p.aiScore}
            </div>
            <div style={{ position: "absolute", bottom: 6, left: 6, right: 6, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
              <span style={{ color: "white", fontSize: 10, fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.6)", letterSpacing: "0.04em" }}>{p.label}</span>
              <span className="drag-handle" style={{ color: "white" }}><Icon name="grip" size={14}/></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubtitlesPanel = ({ subtitles, setSubtitles, currentScene, setCurrentScene }) => {
  const update = (id, changes) => setSubtitles(subtitles.map(s => s.id === id ? { ...s, ...changes } : s));
  const del = (id) => setSubtitles(subtitles.filter(s => s.id !== id));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Subtitles</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>AI-generated. Edit text and timing, or regenerate.</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn sm"><Icon name="zap" size={12}/> Regenerate</button>
          <button className="btn sm"><Icon name="plus" size={12}/> Add line</button>
        </div>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        {subtitles.map((s, i) => (
          <div key={s.id}
               onClick={() => setCurrentScene(i)}
               style={{
                 display: "grid", gridTemplateColumns: "auto 130px 1fr auto", gap: 10, alignItems: "center",
                 padding: "10px 12px", borderRadius: 8, border: `1px solid ${currentScene === i ? "var(--accent)" : "var(--border)"}`,
                 background: currentScene === i ? "var(--accent-soft-2)" : "var(--surface)",
                 cursor: "pointer",
               }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", width: 20 }}>#{i+1}</span>
            <div className="row" style={{ gap: 4 }}>
              <input className="input mono" style={{ width: 52, padding: "4px 6px", fontSize: 12, textAlign: "center" }}
                     value={s.start} onChange={e => update(s.id, { start: e.target.value })} onClick={e => e.stopPropagation()}/>
              <span style={{ color: "var(--text-subtle)" }}>→</span>
              <input className="input mono" style={{ width: 52, padding: "4px 6px", fontSize: 12, textAlign: "center" }}
                     value={s.end} onChange={e => update(s.id, { end: e.target.value })} onClick={e => e.stopPropagation()}/>
            </div>
            <input className="input" value={s.text} onChange={e => update(s.id, { text: e.target.value })} onClick={e => e.stopPropagation()} style={{ background: "transparent", border: "0", padding: "4px 0", fontSize: 13 }}/>
            <button className="icon-btn" onClick={(e) => { e.stopPropagation(); del(s.id); }}><Icon name="trash" size={13}/></button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "var(--bg-soft)", display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
        <Icon name="type" size={14}/>
        Subtitle style inherits from your brand font. Change it in <span style={{ color: "var(--accent)", fontWeight: 500 }}>Brand</span>.
      </div>
    </div>
  );
};

const DescriptionsPanel = ({ descs, setDescs, activeNet, setActiveNet }) => {
  const net = window.MOCK.socials.find(s => s.id === activeNet);
  const limits = { instagram: 2200, tiktok: 2200, youtube: 5000, facebook: 63206, linkedin: 3000, gmb: 1500 };
  const limit = limits[activeNet] || 2200;
  const current = descs[activeNet] || { enabled: false, text: "" };
  const setText = (text) => setDescs({ ...descs, [activeNet]: { ...current, text } });
  const setEnabled = (enabled) => setDescs({ ...descs, [activeNet]: { ...current, enabled } });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Per-network descriptions</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Filled from your template. Edit freely for this specific reel.</div>
        </div>
        <button className="btn sm"><Icon name="copy" size={12}/> Reset to template</button>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: 2, overflowX: "auto", marginBottom: 16 }}>
        {window.MOCK.socials.map(s => (
          <button key={s.id} className={`subtab ${activeNet === s.id ? "active" : ""}`} onClick={() => setActiveNet(s.id)}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: s.color, color: "white", display: "grid", placeItems: "center" }}>
              <Icon name={s.icon} size={10}/>
            </span>
            {s.name.split(" ")[0]}
            {descs[s.id]?.enabled && <span className="dot" style={{ width: 6, height: 6, borderRadius: 999, background: "var(--success)" }}/>}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Toggle on={current.enabled} onChange={setEnabled} label={`Publish to ${net?.name}`} sub={net?.handle || "Not connected"}/>
          </div>
          <textarea className="textarea" value={current.text} onChange={e => setText(e.target.value)}
            style={{ minHeight: 320, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.6 }}/>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
            <span>Insert: {window.MOCK.variables.slice(0, 4).map(v => <span key={v.key} className="mono" style={{ marginRight: 6, color: "var(--accent)" }}>{`{{${v.key}}}`}</span>)}</span>
            <span className="mono">{current.text.length}/{limit}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Preview on {net?.name}</div>
          <SocialPreviewCard net={net} text={current.text}/>
        </div>
      </div>
    </div>
  );
};

window.ReelEditor = ReelEditor;

// --- Slides panel: intro/outro/google review/custom slides ---
const SlidesPanel = ({ slides, setSlides }) => {
  const [dragIdx, setDragIdx] = React.useState(null);
  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const [reviewModal, setReviewModal] = React.useState(false);

  const move = (from, to) => { const n = [...slides]; const [m] = n.splice(from, 1); n.splice(to, 0, m); setSlides(n); };
  const toggle = (id) => setSlides(slides.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  const remove = (id) => setSlides(slides.filter(s => s.id !== id));
  const update = (id, ch) => setSlides(slides.map(s => s.id === id ? { ...s, ...ch } : s));

  const addSlide = (kind) => {
    const base = { id: `sl${Date.now()}`, enabled: true, locked: false, source: "custom" };
    const presets = {
      "intro-video": { kind: "intro-video", label: "Intro · Custom", duration: 2.5 },
      "outro-video": { kind: "outro-video", label: "Outro · Custom", duration: 3 },
      "google-review": { kind: "google-review", label: "Google Review", duration: 5, url: "", status: "empty" },
      "text": { kind: "text", label: "Text slide", duration: 3, text: "New price!" },
      "photo": { kind: "photo", label: "Photo slide", duration: 2.5 },
    };
    setSlides([...slides, { ...base, ...presets[kind] }]);
    setShowAddMenu(false);
    if (kind === "google-review") setReviewModal(true);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Extra slides</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Intro/outro, Google reviews and custom slides inserted into this reel. Drag to reorder.</div>
        </div>
        <div style={{ position: "relative" }}>
          <button className="btn primary" onClick={() => setShowAddMenu(!showAddMenu)}>
            <Icon name="plus" size={13}/> Add slide
          </button>
          {showAddMenu && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 10, width: 240, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "var(--shadow-md)", padding: 6 }}>
              {[
                { id: "intro-video", icon: "play", label: "Intro video", sub: "Custom intro for this reel" },
                { id: "outro-video", icon: "film", label: "Outro video", sub: "Custom closing frame" },
                { id: "google-review", icon: "star", label: "Google review", sub: "Paste a review URL" },
                { id: "text", icon: "type", label: "Text slide", sub: "Plain text on brand colors" },
                { id: "photo", icon: "image", label: "Photo slide", sub: "Single photo with caption" },
              ].map(opt => (
                <button key={opt.id} onClick={() => addSlide(opt.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 10px", border: 0, background: "transparent", borderRadius: 6, cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-soft)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ width: 28, height: 28, borderRadius: 6, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
                    <Icon name={opt.icon} size={13}/>
                  </span>
                  <span style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{opt.sub}</div>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        {slides.map((s, i) => (
          <SlideRow key={s.id} slide={s} idx={i} total={slides.length}
            onToggle={() => toggle(s.id)}
            onRemove={() => remove(s.id)}
            onUpdate={(ch) => update(s.id, ch)}
            onOpenReview={() => setReviewModal(s.id)}
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) { move(dragIdx, i); setDragIdx(i); } }}
            onDragEnd={() => setDragIdx(null)}
            dragging={dragIdx === i}
          />
        ))}
      </div>

      {slides.length === 0 && (
        <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)", border: "1.5px dashed var(--border-strong)", borderRadius: 10, fontSize: 13 }}>
          No extra slides yet. Add an intro, outro or Google review.
        </div>
      )}

      <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "var(--bg-soft)", display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
        <Icon name="zap" size={14}/>
        Defaults come from <span style={{ color: "var(--accent)", fontWeight: 500 }}>Defaults · Intro & outro</span>. Changes here only affect this reel.
      </div>

      {reviewModal && <GoogleReviewModal
        slide={slides.find(s => s.kind === "google-review" && (reviewModal === true || s.id === reviewModal))}
        onClose={() => setReviewModal(false)}
        onSave={(data) => {
          const target = slides.find(s => s.kind === "google-review" && (reviewModal === true || s.id === reviewModal));
          if (target) update(target.id, { ...data, status: "generated" });
          setReviewModal(false);
        }}
      />}
    </div>
  );
};

const SlideRow = ({ slide, idx, total, onToggle, onRemove, onUpdate, onOpenReview, onDragStart, onDragOver, onDragEnd, dragging }) => {
  const meta = {
    "intro-video": { icon: "play", color: "var(--accent)", tag: "INTRO" },
    "outro-video": { icon: "film", color: "var(--info)", tag: "OUTRO" },
    "google-review": { icon: "star-fill", color: "#fbbf24", tag: "REVIEW" },
    "text": { icon: "type", color: "var(--text-muted)", tag: "TEXT" },
    "photo": { icon: "image", color: "var(--success)", tag: "PHOTO" },
  }[slide.kind] || { icon: "film", color: "var(--text-muted)", tag: "SLIDE" };

  return (
    <div draggable onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}
      style={{
        display: "grid", gridTemplateColumns: "auto 80px 1fr auto", gap: 12, alignItems: "center",
        padding: "10px 12px", borderRadius: 10,
        border: "1px solid var(--border)",
        background: dragging ? "var(--accent-soft-2)" : "var(--surface)",
        opacity: slide.enabled ? (dragging ? 0.6 : 1) : 0.5,
      }}>
      <span className="drag-handle" style={{ cursor: "grab" }}><Icon name="grip" size={14}/></span>

      {/* Mini thumb */}
      <div style={{ position: "relative", width: 72, aspectRatio: "3/4", borderRadius: 6, overflow: "hidden", background: "#000", border: "1px solid var(--border)" }}>
        {slide.kind === "google-review" && slide.status !== "generated" ? (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "linear-gradient(180deg, #fef3c7, #fde68a)", color: "#78350f" }}>
            <Icon name="star" size={22}/>
          </div>
        ) : slide.kind === "google-review" ? (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #fef3c7, #fde68a)", padding: 6, color: "#78350f", fontSize: 7, lineHeight: 1.2, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
            <div style={{ display: "flex", gap: 1, color: "#f59e0b" }}>{"★★★★★"}</div>
            <div style={{ fontWeight: 700, fontSize: 8 }}>Aoife M.</div>
            <div style={{ opacity: 0.8 }}>Excellent service, fast and…</div>
          </div>
        ) : slide.kind === "text" ? (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "linear-gradient(180deg, #0f1729, #1e2944)", color: "white", fontSize: 9, fontWeight: 700, padding: 6, textAlign: "center" }}>
            {slide.text || "Text"}
          </div>
        ) : slide.kind === "photo" ? (
          <Cover kind="cranford-living" ratio="3/4" style={{ borderRadius: 0 }}/>
        ) : (
          <video src="assets/property/reel.mp4" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        )}
        <div style={{ position: "absolute", top: 4, left: 4, fontSize: 8, fontWeight: 700, letterSpacing: "0.05em", padding: "1px 5px", borderRadius: 3, background: meta.color, color: slide.kind === "google-review" ? "#78350f" : "white" }}>
          {meta.tag}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Icon name={meta.icon} size={13} style={{ color: meta.color }}/>
          <input className="input" value={slide.label} onChange={e => onUpdate({ label: e.target.value })}
            style={{ border: 0, padding: "2px 0", background: "transparent", fontSize: 13, fontWeight: 500, flex: 1 }}/>
          {slide.source === "default" && <span className="badge">From defaults</span>}
        </div>
        {slide.kind === "google-review" ? (
          slide.status === "generated" ? (
            <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#f59e0b" }}>{"★".repeat(slide.rating || 5)}</span>
              <span style={{ color: "var(--text)" }}>{slide.author || "Aoife M."}</span>
              <span>· {slide.duration}s</span>
              <button className="btn sm ghost" style={{ marginLeft: 6, padding: "2px 8px", fontSize: 11 }} onClick={onOpenReview}>
                <Icon name="edit" size={10}/> Edit
              </button>
            </div>
          ) : (
            <button className="btn sm" onClick={onOpenReview} style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
              <Icon name="link" size={11}/> Paste Google review URL
            </button>
          )
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
            <span className="mono">{slide.duration.toFixed(1)}s</span>
            <input type="range" min="1" max="8" step="0.5" value={slide.duration}
              onChange={e => onUpdate({ duration: +e.target.value })}
              style={{ flex: 1, maxWidth: 200 }}/>
          </div>
        )}
      </div>

      <div className="row" style={{ gap: 4 }}>
        <Toggle on={slide.enabled} onChange={onToggle}/>
        <button className="icon-btn" onClick={onRemove} title="Remove"><Icon name="trash" size={13}/></button>
      </div>
    </div>
  );
};

const GoogleReviewModal = ({ slide, onClose, onSave }) => {
  const [url, setUrl] = React.useState(slide?.url || "");
  const [loading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState(slide?.status === "generated" ? {
    author: slide.author || "Aoife M.",
    rating: slide.rating || 5,
    text: slide.reviewText || "Excellent service from start to finish. Sold our apartment above asking in under two weeks. Cannot recommend CKP highly enough.",
    date: slide.reviewDate || "3 weeks ago",
    avatarColor: "#22c55e",
  } : null);
  const [template, setTemplate] = React.useState(slide?.template || "testimonial-light");
  const [showAuthor, setShowAuthor] = React.useState(slide?.showAuthor !== false);
  const [showDate, setShowDate] = React.useState(slide?.showDate !== false);

  const fetchReview = () => {
    setLoading(true);
    setTimeout(() => {
      setPreview({
        author: "Aoife M.",
        rating: 5,
        text: "Excellent service from start to finish. Sold our apartment above asking in under two weeks. Cannot recommend CKP highly enough.",
        date: "3 weeks ago",
        avatarColor: "#22c55e",
      });
      setLoading(false);
    }, 900);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,23,41,0.55)", display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 720, background: "var(--surface)", borderRadius: 14, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "#fef3c7", color: "#b45309", display: "grid", placeItems: "center" }}>
            <Icon name="star-fill" size={15}/>
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Google review slide</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Paste the URL of a Google review. The backend will generate a branded slide.</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15}/></button>
        </div>

        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 240px", gap: 20 }}>
          <div className="stack" style={{ gap: 14 }}>
            <div className="field">
              <div className="label">Google review URL</div>
              <div className="row" style={{ gap: 8 }}>
                <input className="input" value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://g.page/r/CK...YQ/review"
                  style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 12 }}/>
                <button className="btn primary" onClick={fetchReview} disabled={!url || loading}>
                  {loading ? <><Icon name="zap" size={13}/> Fetching…</> : <><Icon name="download" size={13}/> Fetch</>}
                </button>
              </div>
              <div className="hint" style={{ marginTop: 6 }}>
                Supports Google Maps review links and Google Business Profile share URLs.
              </div>
            </div>

            {preview && (
              <>
                <hr className="sep"/>
                <div>
                  <div className="label" style={{ marginBottom: 8 }}>Review content</div>
                  <div style={{ padding: 14, border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-soft)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: preview.avatarColor, color: "white", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 14 }}>
                        {preview.author.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{preview.author}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{preview.date}</div>
                      </div>
                      <div style={{ color: "#f59e0b", fontSize: 14 }}>{"★".repeat(preview.rating)}</div>
                    </div>
                    <textarea className="textarea" defaultValue={preview.text}
                      style={{ minHeight: 80, fontSize: 13, lineHeight: 1.5, background: "var(--surface)" }}/>
                  </div>
                </div>

                <div>
                  <div className="label" style={{ marginBottom: 8 }}>Template</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {[
                      { id: "testimonial-light", label: "Light card", bg: "#fef3c7" },
                      { id: "testimonial-dark", label: "Dark card", bg: "#0f1729" },
                      { id: "quote", label: "Big quote", bg: "#ffffff" },
                    ].map(t => (
                      <button key={t.id} onClick={() => setTemplate(t.id)}
                        style={{
                          padding: 10, border: `1.5px solid ${template === t.id ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: 8, background: template === t.id ? "var(--accent-soft-2)" : "var(--surface)",
                          cursor: "pointer", textAlign: "left",
                        }}>
                        <div style={{ height: 48, borderRadius: 4, background: t.bg, marginBottom: 6, display: "grid", placeItems: "center", color: t.id === "testimonial-dark" ? "white" : "#78350f", fontSize: 18 }}>★</div>
                        <div style={{ fontSize: 11, fontWeight: 500 }}>{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="row" style={{ gap: 16 }}>
                  <Toggle on={showAuthor} onChange={setShowAuthor} label="Show author name"/>
                  <Toggle on={showDate} onChange={setShowDate} label="Show date"/>
                </div>
              </>
            )}
          </div>

          {/* Live preview of the slide */}
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, textAlign: "center" }}>Slide preview · 3:4</div>
            <div style={{
              aspectRatio: "3/4", borderRadius: 10, overflow: "hidden",
              background: template === "testimonial-dark" ? "#0f1729" : template === "quote" ? "#fff" : "linear-gradient(180deg, #fef3c7, #fde68a)",
              color: template === "testimonial-dark" ? "white" : "#1f2937",
              padding: 18, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12,
              border: "1px solid var(--border)",
            }}>
              {preview ? (
                <>
                  <div style={{ color: "#f59e0b", fontSize: 22, letterSpacing: "0.05em" }}>
                    {"★".repeat(preview.rating)}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.4, fontWeight: template === "quote" ? 600 : 500 }}>
                    {template === "quote" ? "“" : ""}{preview.text}{template === "quote" ? "”" : ""}
                  </div>
                  {showAuthor && (
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: preview.avatarColor, color: "white", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 12 }}>
                        {preview.author.charAt(0)}
                      </div>
                      <div style={{ fontSize: 11 }}>
                        <div style={{ fontWeight: 600 }}>{preview.author}</div>
                        {showDate && <div style={{ opacity: 0.6 }}>{preview.date} · Google</div>}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                  <Icon name="star" size={28} style={{ opacity: 0.4 }}/>
                  <div style={{ marginTop: 8 }}>Paste a URL and click Fetch</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!preview}
            onClick={() => onSave({
              url, template, showAuthor, showDate,
              author: preview?.author, rating: preview?.rating, reviewText: preview?.text, reviewDate: preview?.date,
              label: `Review · ${preview?.author || ""}`,
            })}>
            <Icon name="check" size={13}/> Add slide to reel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Voiceover panel ---
const AI_VOICES = [
  { id: "emma-ie", name: "Emma", accent: "Irish", tone: "Warm", gender: "F" },
  { id: "conor-ie", name: "Conor", accent: "Irish", tone: "Confident", gender: "M" },
  { id: "ava-uk", name: "Ava", accent: "British RP", tone: "Elegant", gender: "F" },
  { id: "noah-us", name: "Noah", accent: "American", tone: "Friendly", gender: "M" },
];

const VoiceoverPanel = ({
  takes, setTakes, mode, setMode,
  ducking, setDucking, musicVol, setMusicVol, voiceVol, setVoiceVol,
  aiVoice, setAiVoice, aiScript, setAiScript,
  reelDuration, subtitles,
}) => {
  const [recording, setRecording] = React.useState(false);
  const [recTime, setRecTime] = React.useState(0);
  const [countdown, setCountdown] = React.useState(0);
  const [micArmed, setMicArmed] = React.useState(true);
  const [playbackDuringRec, setPlaybackDuringRec] = React.useState(true);
  const [mutedMusic, setMutedMusic] = React.useState(true);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setRecTime(t => t + 0.1), 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const startCountdown = () => {
    setCountdown(3);
    let n = 3;
    const iv = setInterval(() => {
      n -= 1;
      setCountdown(n);
      if (n <= 0) {
        clearInterval(iv);
        setCountdown(0);
        setRecording(true);
        setRecTime(0);
      }
    }, 700);
  };

  const stopRecording = () => {
    setRecording(false);
    // Add new take with random-ish waveform
    const bars = Array.from({ length: 60 }, () => 0.2 + Math.random() * 0.8);
    const newTake = {
      id: `t${takes.length + 1}`,
      name: `Take ${takes.length + 1}`,
      duration: fmtTime(recTime),
      size: `${(recTime * 0.04).toFixed(1)} MB`,
      recorded: "just now",
      active: false,
      waveform: bars,
    };
    setTakes([...takes.map(t => ({ ...t, active: false })), { ...newTake, active: true }]);
    setRecTime(0);
  };

  const setActive = (id) => setTakes(takes.map(t => ({ ...t, active: t.id === id })));
  const deleteTake = (id) => setTakes(takes.filter(t => t.id !== id));
  const renameTake = (id, name) => setTakes(takes.map(t => t.id === id ? { ...t, name } : t));

  const activeTake = takes.find(t => t.active);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Voiceover</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Record yourself narrating, or let AI read the script.</div>
        </div>
        <div style={{ display: "flex", gap: 2, padding: 3, background: "var(--bg-soft)", borderRadius: 8, border: "1px solid var(--border)" }}>
          <button className={`btn sm ${mode === "record" ? "primary" : "ghost"}`} style={{ borderRadius: 6 }} onClick={() => setMode("record")}>
            <Icon name="mic" size={13}/> Record
          </button>
          <button className={`btn sm ${mode === "ai" ? "primary" : "ghost"}`} style={{ borderRadius: 6 }} onClick={() => setMode("ai")}>
            <Icon name="zap" size={13}/> AI voice
          </button>
        </div>
      </div>

      {mode === "record" && (
        <>
          {/* Record console */}
          <div style={{
            position: "relative",
            borderRadius: 12, overflow: "hidden",
            background: recording ? "linear-gradient(180deg, #2a0f13 0%, #1a0a0d 100%)" : "linear-gradient(180deg, var(--surface) 0%, var(--bg-soft) 100%)",
            border: `1px solid ${recording ? "#ef4444" : "var(--border)"}`,
            padding: 18,
            transition: "all 0.2s",
          }}>
            {/* REC indicator */}
            {recording && (
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 6, color: "#ef4444", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 1s infinite" }}/>
                REC
              </div>
            )}

            {/* Countdown */}
            {countdown > 0 && (
              <div style={{
                position: "absolute", inset: 0, display: "grid", placeItems: "center",
                background: "rgba(15,23,41,0.6)", backdropFilter: "blur(8px)",
                color: "white", fontSize: 88, fontWeight: 800, letterSpacing: "-0.04em",
                zIndex: 2,
              }}>
                {countdown}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 20, minHeight: 120 }}>
              {/* Left: mic level meter */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: recording ? "rgba(255,255,255,0.65)" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Input level</div>
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 44 }}>
                  {Array.from({ length: 22 }).map((_, i) => {
                    const active = recording && Math.random() * 22 > i * 0.85;
                    const hue = i < 14 ? "#22c55e" : i < 18 ? "#eab308" : "#ef4444";
                    return (
                      <div key={i} style={{
                        flex: 1,
                        height: `${8 + i * 1.6}px`,
                        background: active ? hue : (recording ? "rgba(255,255,255,0.08)" : "var(--border)"),
                        borderRadius: 1,
                        transition: "background 0.05s",
                      }}/>
                    );
                  })}
                </div>
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: recording ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}>
                  <Icon name="mic" size={12}/>
                  {micArmed ? "MacBook Pro Microphone" : "No input"}
                  <button className="btn sm ghost" style={{ marginLeft: "auto", padding: "2px 6px", fontSize: 11, color: "inherit" }}>Change</button>
                </div>
              </div>

              {/* Center: big record button + timer */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => {
                    if (recording) stopRecording();
                    else if (countdown === 0) startCountdown();
                  }}
                  style={{
                    width: 72, height: 72, borderRadius: "50%",
                    border: `3px solid ${recording ? "#ef4444" : "rgba(239,68,68,0.35)"}`,
                    background: recording ? "#ef4444" : "rgba(239,68,68,0.12)",
                    cursor: "pointer", display: "grid", placeItems: "center",
                    transition: "all 0.15s",
                    boxShadow: recording ? "0 0 0 6px rgba(239,68,68,0.2)" : "none",
                  }}>
                  {recording
                    ? <div style={{ width: 22, height: 22, background: "white", borderRadius: 4 }}/>
                    : <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ef4444" }}/>}
                </button>
                <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: recording ? "white" : "var(--text)", letterSpacing: "0.04em" }}>
                  {fmtTime(recTime)}
                </div>
                <div style={{ fontSize: 10, color: recording ? "rgba(255,255,255,0.5)" : "var(--text-muted)", letterSpacing: "0.05em" }}>
                  {recording ? "Click to stop" : `Max ${reelDuration}`}
                </div>
              </div>

              {/* Right: options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                <Toggle on={playbackDuringRec} onChange={setPlaybackDuringRec} label="Play reel while recording" sub="Read subtitles as the scenes change"/>
                <Toggle on={mutedMusic} onChange={setMutedMusic} label="Mute music during takes" sub="Avoids bleed into the mic"/>
                <Toggle on={micArmed} onChange={setMicArmed} label="Mic armed" sub="Use spacebar to start/stop"/>
              </div>
            </div>

            {/* Teleprompter hint */}
            {!recording && (
              <div style={{
                marginTop: 14, padding: "10px 12px", borderRadius: 8,
                background: "var(--surface)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)",
              }}>
                <Icon name="type" size={13}/>
                <span>Subtitles appear on the preview as a teleprompter while you record.</span>
                <button className="btn sm ghost" style={{ marginLeft: "auto" }}>Edit script</button>
              </div>
            )}
          </div>

          {/* Takes list */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Takes · {takes.length}
              </div>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn sm"><Icon name="upload" size={12}/> Upload audio</button>
              </div>
            </div>

            {takes.length === 0 ? (
              <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)", border: "1.5px dashed var(--border-strong)", borderRadius: 10, fontSize: 13 }}>
                No takes yet. Hit record to capture your first narration.
              </div>
            ) : (
              <div className="stack" style={{ gap: 8 }}>
                {takes.map(t => (
                  <TakeRow key={t.id} take={t}
                    onSelect={() => setActive(t.id)}
                    onDelete={() => deleteTake(t.id)}
                    onRename={(n) => renameTake(t.id, n)}/>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {mode === "ai" && (
        <div className="stack" style={{ gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="label" style={{ marginBottom: 10 }}>AI voice</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
              {AI_VOICES.map(v => (
                <button key={v.id}
                  onClick={() => setAiVoice(v.id)}
                  className="stack"
                  style={{
                    gap: 4, padding: 12, textAlign: "left", cursor: "pointer",
                    borderRadius: 10,
                    border: `1.5px solid ${aiVoice === v.id ? "var(--accent)" : "var(--border)"}`,
                    background: aiVoice === v.id ? "var(--accent-soft-2)" : "var(--surface)",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{v.name}</span>
                    <span className="badge">{v.gender}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.accent} · {v.tone}</div>
                  <button className="btn sm ghost" style={{ marginTop: 6, alignSelf: "flex-start", padding: "2px 8px", fontSize: 11 }} onClick={(e) => e.stopPropagation()}>
                    <Icon name="play" size={10}/> Preview
                  </button>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="label">Script</div>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn sm"><Icon name="copy" size={12}/> Copy from subtitles</button>
                <button className="btn sm"><Icon name="zap" size={12}/> Rewrite with AI</button>
              </div>
            </div>
            <textarea className="textarea" value={aiScript} onChange={e => setAiScript(e.target.value)}
              style={{ minHeight: 180, fontSize: 13, lineHeight: 1.6 }}/>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
              <span>~{Math.max(1, Math.round(aiScript.split(/\s+/).length / 2.5))}s at normal pace</span>
              <span className="mono">{aiScript.length} chars</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn"><Icon name="play" size={13}/> Preview voice</button>
            <button className="btn primary"><Icon name="zap" size={13}/> Generate voiceover</button>
          </div>
        </div>
      )}

      {/* Mix controls (always visible) */}
      <div className="card" style={{ marginTop: 20, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon name="headphones" size={14}/>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Audio mix</div>
          {activeTake && mode === "record" && (
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>
              Using <span style={{ color: "var(--text)", fontWeight: 500 }}>{activeTake.name}</span>
            </span>
          )}
        </div>
        <div className="stack" style={{ gap: 14 }}>
          <Slider label="Voice volume" value={voiceVol} onChange={setVoiceVol} unit="%" icon="mic"/>
          <Slider label="Music volume" value={musicVol} onChange={setMusicVol} unit="%" icon="music"/>
          <Slider label="Music ducking" value={ducking} onChange={setDucking} unit="%" icon="volume"
            hint="Lowers music by this amount whenever the voice is speaking."/>
        </div>
      </div>
    </div>
  );
};

const TakeRow = ({ take, onSelect, onDelete, onRename }) => {
  const [playing, setPlaying] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(take.name);

  return (
    <div
      onClick={onSelect}
      style={{
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center",
        padding: "10px 12px", borderRadius: 10,
        border: `1.5px solid ${take.active ? "var(--accent)" : "var(--border)"}`,
        background: take.active ? "var(--accent-soft-2)" : "var(--surface)",
        cursor: "pointer",
      }}>
      {/* Play button */}
      <button
        className="icon-btn"
        onClick={(e) => { e.stopPropagation(); setPlaying(!playing); }}
        style={{ width: 34, height: 34, borderRadius: "50%", background: take.active ? "var(--accent)" : "var(--bg-soft)", color: take.active ? "white" : "var(--text)" }}>
        <Icon name={playing ? "pause" : "play"} size={13}/>
      </button>

      {/* Waveform + meta */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          {editing ? (
            <input className="input" autoFocus value={name}
              onClick={(e) => e.stopPropagation()}
              onChange={e => setName(e.target.value)}
              onBlur={() => { onRename(name); setEditing(false); }}
              onKeyDown={e => { if (e.key === "Enter") { onRename(name); setEditing(false); } }}
              style={{ padding: "2px 6px", fontSize: 12, height: 24, width: 120 }}/>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 600 }} onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}>{take.name}</span>
          )}
          {take.active && <span className="badge" style={{ background: "var(--accent)", color: "white" }}>Active</span>}
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {take.duration} · {take.size} · {take.recorded}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", height: 28, gap: 2 }}>
          {take.waveform.map((h, i) => (
            <div key={i} style={{
              flex: 1,
              height: `${h * 100}%`,
              minHeight: 2,
              background: take.active ? "var(--accent)" : "var(--text-muted)",
              opacity: playing && i < take.waveform.length * 0.3 ? 1 : (take.active ? 0.9 : 0.5),
              borderRadius: 1,
            }}/>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="row" style={{ gap: 4 }} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn" title="Rename" onClick={() => setEditing(true)}><Icon name="edit" size={13}/></button>
        <button className="icon-btn" title="Download"><Icon name="download" size={13}/></button>
        <button className="icon-btn" title="Delete" onClick={onDelete}><Icon name="trash" size={13}/></button>
      </div>
    </div>
  );
};

const Slider = ({ label, value, onChange, unit = "", icon, hint }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      {icon && <Icon name={icon} size={12} style={{ marginRight: 6, color: "var(--text-muted)" }}/>}
      <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
      <span className="mono" style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>{value}{unit}</span>
    </div>
    <input type="range" min="0" max="100" value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%" }}/>
    {hint && <div className="hint" style={{ marginTop: 4 }}>{hint}</div>}
  </div>
);
