// Music library — upload, favorite, rules by property type/status
const MusicConfig = () => {
  const [tracks, setTracks] = React.useState(window.MOCK.tracks);
  const [playing, setPlaying] = React.useState(null);
  const [tab, setTab] = React.useState("library");
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const toggleFav = (id) => {
    const t = tracks.find(x => x.id === id);
    if (!t) return;
    if (t.favorite) {
      // unfavoriting: just flip
      setTracks(tracks.map(x => x.id === id ? { ...x, favorite: false } : x));
    } else {
      // favoriting: flip AND move to top of list
      const updated = { ...t, favorite: true };
      const others = tracks.filter(x => x.id !== id);
      setTracks([updated, ...others]);
    }
  };

  const filtered = tracks.filter(t => {
    if (filter === "favorites" && !t.favorite) return false;
    if (filter !== "all" && filter !== "favorites" && !t.mood.includes(filter)) return false;
    if (search && !`${t.title} ${t.artist}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const moods = ["warm","relaxed","energetic","modern","luxurious","cinematic","acoustic","minimal"];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Music <span className="count-chip">{tracks.length} tracks</span></h1>
          <p className="page-subtitle" style={{ color: "var(--danger)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="shield" size={13}/>
            Do not upload copyrighted music. Only royalty-free or licensed tracks are allowed.
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn"><Icon name="download" size={14}/> Import library</button>
          <button className="btn primary"><Icon name="upload" size={14}/> Upload MP3</button>
        </div>
      </div>

      <div className="subtabs" style={{ marginBottom: 20 }}>
        <button className={`subtab ${tab === "library" ? "active" : ""}`} onClick={() => setTab("library")}>
          <Icon name="music" size={12}/> Library
        </button>
        <button className={`subtab ${tab === "rules" ? "active" : ""}`} onClick={() => setTab("rules")}>
          <Icon name="zap" size={12}/> Selection rules
        </button>
      </div>

      {tab === "library" ? (
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="card-header" style={{ gap: 10, flexWrap: "wrap" }}>
            <div className="row" style={{ gap: 8, flex: 1, minWidth: 0, flexWrap: "wrap" }}>
              <div className="search" style={{ minWidth: 220 }}>
                <Icon name="search" size={14}/>
                <input placeholder="Search tracks, artists" value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
              <Segmented
                options={[
                  { value: "all", label: "All" },
                  { value: "favorites", label: "⭐ Favorites" },
                  ...moods.slice(0, 4).map(m => ({ value: m, label: m }))
                ]}
                value={filter}
                onChange={setFilter}
              />
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              {tracks.filter(t => t.favorite).length} favorites used in the random pool
            </div>
          </div>

          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Track</th>
                <th style={{ width: 220 }}>Waveform</th>
                <th>BPM</th>
                <th>Duration</th>
                <th>Mood</th>
                <th>Used for</th>
                <th style={{ width: 40 }}></th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ transition: "background 0.3s" }}>
                  <td>
                    <button className="icon-btn" onClick={() => setPlaying(playing === t.id ? null : t.id)}
                            style={{ width: 32, height: 32, borderRadius: "50%", background: playing === t.id ? "var(--accent)" : "var(--bg-sunken)", color: playing === t.id ? "white" : "var(--text)" }}>
                      <Icon name={playing === t.id ? "pause" : "play"} size={12}/>
                    </button>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.artist}</div>
                  </td>
                  <td>
                    <Waveform bars={t.waveform} playing={playing === t.id} color={t.favorite ? "var(--accent)" : "var(--border-strong)"} />
                  </td>
                  <td className="num">{t.bpm}</td>
                  <td className="num">{t.duration}</td>
                  <td>
                    <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                      {t.mood.map(m => <span key={m} className="badge">{m}</span>)}
                    </div>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                      {t.propertyTypes.map(p => <span key={p} className="badge accent" style={{ fontSize: 10 }}>{p}</span>)}
                    </div>
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => toggleFav(t.id)} style={{ color: t.favorite ? "var(--accent)" : "var(--text-subtle)" }}>
                      <Icon name={t.favorite ? "star-fill" : "star"} size={15}/>
                    </button>
                  </td>
                  <td><button className="icon-btn"><Icon name="more" size={15}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: 16, borderTop: "1px solid var(--divider)", background: "var(--bg-soft)", display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="upload" size={16} style={{ color: "var(--text-muted)" }}/>
            <div style={{ fontSize: 12, color: "var(--text-muted)", flex: 1 }}>
              Drop MP3 files anywhere to upload. Only tracks marked as ⭐ favorite are eligible for random selection unless a rule says otherwise.
            </div>
            <button className="btn sm"><Icon name="upload" size={12}/> Upload</button>
          </div>
        </div>
      ) : (
        <RulesPanel tracks={tracks} />
      )}
    </div>
  );
};

const Waveform = ({ bars, playing, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 2, height: 28 }}>
    {bars.map((b, i) => (
      <div key={i} style={{
        width: 3, height: `${b * 100}%`, minHeight: 3,
        background: color,
        borderRadius: 2,
        opacity: playing ? (0.5 + 0.5 * Math.sin((Date.now()/200) + i)) : 1,
        transition: "opacity 0.2s",
      }}/>
    ))}
  </div>
);

const RulesPanel = ({ tracks }) => {
  const propertyTypes = [
    { id: "luxury", label: "Luxury", desc: "High-end listings, architect pieces" },
    { id: "family", label: "Family", desc: "Suburban homes, multi-bedroom" },
    { id: "rental", label: "Rental", desc: "Studios, urban apartments to let" },
  ];
  const statuses = [
    { id: "for-sale", label: "For sale", color: "var(--accent)" },
    { id: "sale-agreed", label: "Sale agreed", color: "var(--warning)" },
    { id: "sold", label: "Sold", color: "var(--success)" },
    { id: "to-let", label: "To let", color: "var(--info)" },
    { id: "let-agreed", label: "Let agreed", color: "var(--warning)" },
    { id: "let", label: "Let", color: "var(--success)" },
  ];

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Rules by property type</div>
            <div className="card-subtitle">Restrict which favorites are picked based on the property kind.</div>
          </div>
        </div>
        <div style={{ padding: 0 }}>
          {propertyTypes.map((p, i) => (
            <div key={p.id} style={{ padding: "14px 20px", borderTop: i > 0 ? "1px solid var(--divider)" : "0", display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.desc}</div>
              </div>
              <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                {tracks.filter(t => t.propertyTypes.includes(p.id) && t.favorite).map(t => (
                  <span key={t.id} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 12, padding: "4px 10px", borderRadius: 999,
                    background: "var(--accent-soft-2)", color: "var(--accent)", border: "1px solid var(--border)",
                  }}>
                    <Icon name="music" size={10}/> {t.title}
                  </span>
                ))}
                <button className="btn sm ghost"><Icon name="plus" size={12}/> Add track</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Rules by property status</div>
            <div className="card-subtitle">Match the tone to the moment — e.g. celebratory for "Sold", calm for "For sale".</div>
          </div>
        </div>
        <div style={{ padding: 0 }}>
          {statuses.map((s, i) => (
            <div key={s.id} style={{ padding: "14px 20px", borderTop: i > 0 ? "1px solid var(--divider)" : "0", display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, alignItems: "center" }}>
              <div className="row" style={{ gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: s.color }}/>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
              </div>
              <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                {tracks.filter(t => t.statuses?.includes(s.id) && t.favorite).map(t => (
                  <span key={t.id} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 12, padding: "4px 10px", borderRadius: 999,
                    background: "var(--accent-soft-2)", color: "var(--accent)", border: "1px solid var(--border)",
                  }}>
                    <Icon name="music" size={10}/> {t.title}
                  </span>
                ))}
                <button className="btn sm ghost"><Icon name="plus" size={12}/> Add track</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <Toggle
            on={true} onChange={() => {}}
            label="Fall back to full favorites pool if no rule matches"
            sub="When no rule produces tracks for a given property, pick randomly from all ⭐ favorites instead of failing the render."
          />
        </div>
      </div>
    </div>
  );
};

window.MusicConfig = MusicConfig;
