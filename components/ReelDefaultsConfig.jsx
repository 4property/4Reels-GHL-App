// Reel defaults / Customization — global settings applied to every reel
const ReelDefaultsConfig = () => {
  const [tab, setTab] = React.useState("format");

  // Format & locale
  const [currency, setCurrency] = React.useState("EUR");
  const [currencyPosition, setCurrencyPosition] = React.useState("prefix");
  const [thousandsSep, setThousandsSep] = React.useState(",");
  const [decimalSep, setDecimalSep] = React.useState(".");
  const [priceRounding, setPriceRounding] = React.useState("exact");
  const [dateFormat, setDateFormat] = React.useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = React.useState("24h");
  const [measurement, setMeasurement] = React.useState("metric");
  const [language, setLanguage] = React.useState("en-IE");
  const [timezone, setTimezone] = React.useState("Europe/Dublin");

  // Subtitles
  const [subFont, setSubFont] = React.useState("Inter");
  const [subWeight, setSubWeight] = React.useState("700");
  const [subSize, setSubSize] = React.useState(44);
  const [subColor, setSubColor] = React.useState("#ffffff");
  const [subBgStyle, setSubBgStyle] = React.useState("pill");
  const [subBgColor, setSubBgColor] = React.useState("#0f1729");
  const [subBgOpacity, setSubBgOpacity] = React.useState(82);
  const [subPosition, setSubPosition] = React.useState("bottom");
  const [subAlign, setSubAlign] = React.useState("center");
  const [subUppercase, setSubUppercase] = React.useState(false);
  const [subHighlightWord, setSubHighlightWord] = React.useState(true);
  const [subHighlightColor, setSubHighlightColor] = React.useState("#2b57f6");
  const [subMaxChars, setSubMaxChars] = React.useState(36);

  // Video
  const [aspect, setAspect] = React.useState("3:4");
  const [resolution, setResolution] = React.useState("1080p");
  const [fps, setFps] = React.useState("30");
  const [duration, setDuration] = React.useState("auto");
  const [minDuration, setMinDuration] = React.useState(20);
  const [maxDuration, setMaxDuration] = React.useState(45);
  const [transition, setTransition] = React.useState("crossfade");
  const [kenBurns, setKenBurns] = React.useState(true);
  const [introCard, setIntroCard] = React.useState(true);
  const [outroCard, setOutroCard] = React.useState(true);

  // Audio
  const [musicVolume, setMusicVolume] = React.useState(65);
  const [fadeIn, setFadeIn] = React.useState(true);
  const [fadeOut, setFadeOut] = React.useState(true);
  const [duckOnVoice, setDuckOnVoice] = React.useState(true);
  const [voiceover, setVoiceover] = React.useState(false);

  // Caption generation
  const [captionLang, setCaptionLang] = React.useState("en");
  const [captionCase, setCaptionCase] = React.useState("sentence");
  const [emojiInCaptions, setEmojiInCaptions] = React.useState(false);

  // Intro / outro default videos
  const [introEnabled, setIntroEnabled] = React.useState(true);
  const [introSource, setIntroSource] = React.useState("uploaded"); // uploaded | brand-card | none
  const [introDuration, setIntroDuration] = React.useState(2.5);
  const [introFile, setIntroFile] = React.useState({ name: "agency-intro.mp4", size: "4.2 MB", duration: "0:02" });
  const [outroEnabled, setOutroEnabled] = React.useState(true);
  const [outroSource, setOutroSource] = React.useState("uploaded");
  const [outroDuration, setOutroDuration] = React.useState(3);
  const [outroFile, setOutroFile] = React.useState({ name: "agency-outro-cta.mp4", size: "5.8 MB", duration: "0:03" });
  const [skipForRentals, setSkipForRentals] = React.useState(false);

  // Number formatting preview
  const formatPrice = () => {
    const parts = "685000".split("").reverse().join("").match(/.{1,3}/g).join(thousandsSep).split("").reverse().join("");
    const sym = { EUR: "€", USD: "$", GBP: "£", CAD: "CA$", AUD: "A$" }[currency];
    return currencyPosition === "prefix" ? `${sym}${parts}` : `${parts} ${sym}`;
  };
  const formatDate = () => {
    const d = new Date(2026, 3, 22);
    const pad = n => String(n).padStart(2, "0");
    return dateFormat
      .replace("DD", pad(d.getDate()))
      .replace("MM", pad(d.getMonth()+1))
      .replace("MMM", ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()])
      .replace("YYYY", d.getFullYear());
  };

  const tabs = [
    { id: "format", label: "Format & locale", icon: "globe" },
    { id: "subtitles", label: "Subtitles", icon: "type" },
    { id: "video", label: "Video & timing", icon: "film" },
    { id: "intro-outro", label: "Intro & outro", icon: "play" },
    { id: "audio", label: "Audio", icon: "music" },
    { id: "captions", label: "Caption generation", icon: "zap" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Defaults</h1>
          <p className="page-subtitle">Global settings applied to every reel. Individual reels can override these in the editor.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn"><Icon name="download" size={14}/> Reset to system defaults</button>
          <button className="btn primary"><Icon name="check" size={14}/> Save defaults</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
        {/* Left nav */}
        <div className="card" style={{ padding: 6, alignSelf: "flex-start", position: "sticky", top: 68 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, border: 0, cursor: "pointer",
                background: tab === t.id ? "var(--accent-soft)" : "transparent",
                color: tab === t.id ? "var(--accent)" : "var(--text)",
                fontWeight: tab === t.id ? 600 : 500, fontSize: 13,
                marginBottom: 2,
              }}>
              <Icon name={t.icon === "globe" ? "building" : t.icon} size={14}/>
              {t.label}
            </button>
          ))}
        </div>

        {/* Right panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
          <div className="stack" style={{ gap: 16 }}>
            {tab === "format" && (
              <>
                <div className="card">
                  <div className="card-header"><div><div className="card-title">Currency & prices</div><div className="card-subtitle">How prices appear in subtitles, overlays and descriptions.</div></div></div>
                  <div className="card-body stack" style={{ gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="field"><div className="label">Currency</div>
                        <select className="select" value={currency} onChange={e => setCurrency(e.target.value)}>
                          <option value="EUR">EUR — Euro (€)</option>
                          <option value="USD">USD — US Dollar ($)</option>
                          <option value="GBP">GBP — British Pound (£)</option>
                          <option value="CAD">CAD — Canadian Dollar</option>
                          <option value="AUD">AUD — Australian Dollar</option>
                        </select>
                      </div>
                      <div className="field"><div className="label">Symbol position</div>
                        <Segmented options={[{value:"prefix",label:"€685,000"},{value:"suffix",label:"685,000 €"}]} value={currencyPosition} onChange={setCurrencyPosition}/>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <div className="field"><div className="label">Thousands separator</div>
                        <Segmented options={[{value:",",label:","},{value:".",label:"."},{value:" ",label:"space"}]} value={thousandsSep} onChange={setThousandsSep}/>
                      </div>
                      <div className="field"><div className="label">Decimal</div>
                        <Segmented options={[{value:".",label:"."},{value:",",label:","}]} value={decimalSep} onChange={setDecimalSep}/>
                      </div>
                      <div className="field"><div className="label">Rounding</div>
                        <select className="select" value={priceRounding} onChange={e => setPriceRounding(e.target.value)}>
                          <option value="exact">Exact</option>
                          <option value="k">To nearest 1,000 (€685K)</option>
                          <option value="10k">To nearest 10,000 (€690K)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><div><div className="card-title">Date & time</div></div></div>
                  <div className="card-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="field"><div className="label">Date format</div>
                      <select className="select" value={dateFormat} onChange={e => setDateFormat(e.target.value)}>
                        <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
                        <option>DD MMM YYYY</option><option>MMM DD, YYYY</option>
                      </select>
                    </div>
                    <div className="field"><div className="label">Time format</div>
                      <Segmented options={[{value:"24h",label:"24h · 14:30"},{value:"12h",label:"12h · 2:30 pm"}]} value={timeFormat} onChange={setTimeFormat}/>
                    </div>
                    <div className="field"><div className="label">Timezone</div>
                      <select className="select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                        <option>Europe/Dublin</option><option>Europe/London</option><option>Europe/Madrid</option>
                        <option>America/New_York</option><option>America/Los_Angeles</option>
                      </select>
                    </div>
                    <div className="field"><div className="label">Interface language</div>
                      <select className="select" value={language} onChange={e => setLanguage(e.target.value)}>
                        <option value="en-IE">English (Ireland)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><div><div className="card-title">Measurement</div></div></div>
                  <div className="card-body">
                    <div className="field"><div className="label">Unit system</div>
                      <Segmented
                        options={[{value:"metric",label:"Metric · m² · km"},{value:"imperial",label:"Imperial · ft² · mi"}]}
                        value={measurement} onChange={setMeasurement}/>
                    </div>
                  </div>
                </div>
              </>
            )}

            {tab === "subtitles" && (
              <>
                <div className="card">
                  <div className="card-header"><div><div className="card-title">Typography</div></div></div>
                  <div className="card-body stack" style={{ gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12 }}>
                      <div className="field"><div className="label">Font family</div>
                        <select className="select" value={subFont} onChange={e => setSubFont(e.target.value)}>
                          <option>Inter</option><option>Söhne</option><option>Manrope</option><option>Plus Jakarta Sans</option><option>Helvetica</option><option>Montserrat</option>
                        </select>
                      </div>
                      <div className="field"><div className="label">Weight</div>
                        <select className="select" value={subWeight} onChange={e => setSubWeight(e.target.value)}>
                          <option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Extra bold</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <div className="label" style={{ display: "flex", justifyContent: "space-between" }}>Font size <span className="mono">{subSize}px</span></div>
                      <input type="range" min="28" max="72" value={subSize} onChange={e => setSubSize(+e.target.value)} style={{ width: "100%" }}/>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="field"><div className="label">Text color</div><ColorRow value={subColor} onChange={setSubColor}/></div>
                      <div className="field"><div className="label">Text case</div>
                        <Segmented options={[{value:false,label:"Sentence"},{value:true,label:"UPPERCASE"}]} value={subUppercase} onChange={setSubUppercase}/>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="field"><div className="label">Max chars per line</div>
                        <input type="number" className="input" value={subMaxChars} onChange={e => setSubMaxChars(+e.target.value)}/>
                      </div>
                      <div className="field"><div className="label">Alignment</div>
                        <Segmented options={[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"}]} value={subAlign} onChange={setSubAlign}/>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><div><div className="card-title">Background & position</div></div></div>
                  <div className="card-body stack" style={{ gap: 14 }}>
                    <div className="field"><div className="label">Background style</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                        {[
                          { id: "none", label: "None" },
                          { id: "pill", label: "Pill" },
                          { id: "block", label: "Block" },
                          { id: "outline", label: "Outline" },
                        ].map(o => (
                          <button key={o.id} onClick={() => setSubBgStyle(o.id)}
                            className={`btn sm ${subBgStyle === o.id ? "primary" : ""}`}>{o.label}</button>
                        ))}
                      </div>
                    </div>
                    {subBgStyle !== "none" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div className="field"><div className="label">Background color</div><ColorRow value={subBgColor} onChange={setSubBgColor}/></div>
                        <div className="field"><div className="label" style={{ display: "flex", justifyContent: "space-between" }}>Opacity <span className="mono">{subBgOpacity}%</span></div>
                          <input type="range" min="0" max="100" value={subBgOpacity} onChange={e => setSubBgOpacity(+e.target.value)} style={{ width: "100%" }}/>
                        </div>
                      </div>
                    )}
                    <div className="field"><div className="label">Vertical position</div>
                      <Segmented options={[{value:"top",label:"Top"},{value:"middle",label:"Middle"},{value:"bottom",label:"Bottom"}]} value={subPosition} onChange={setSubPosition}/>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><div><div className="card-title">Word highlight</div><div className="card-subtitle">Karaoke-style: the current word is emphasized as it's spoken.</div></div>
                    <Toggle on={subHighlightWord} onChange={setSubHighlightWord}/>
                  </div>
                  {subHighlightWord && (
                    <div className="card-body">
                      <div className="field" style={{ maxWidth: 240 }}><div className="label">Highlight color</div><ColorRow value={subHighlightColor} onChange={setSubHighlightColor}/></div>
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === "video" && (
              <>
                <div className="card">
                  <div className="card-header"><div><div className="card-title">Canvas</div></div></div>
                  <div className="card-body stack" style={{ gap: 14 }}>
                    <div className="field"><div className="label">Aspect ratio</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                        {["9:16","3:4","1:1","4:5"].map(a => (
                          <button key={a} onClick={() => setAspect(a)} className={`btn sm ${aspect === a ? "primary" : ""}`}>{a}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="field"><div className="label">Resolution</div>
                        <select className="select" value={resolution} onChange={e => setResolution(e.target.value)}>
                          <option>720p</option><option>1080p</option><option>1440p</option><option>4K</option>
                        </select>
                      </div>
                      <div className="field"><div className="label">Frame rate</div>
                        <Segmented options={[{value:"24",label:"24"},{value:"30",label:"30"},{value:"60",label:"60"}]} value={fps} onChange={setFps}/>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><div><div className="card-title">Duration</div><div className="card-subtitle">How long the AI targets when building the reel.</div></div></div>
                  <div className="card-body stack" style={{ gap: 14 }}>
                    <div className="field"><div className="label">Strategy</div>
                      <Segmented options={[{value:"auto",label:"Auto (by photo count)"},{value:"fixed",label:"Fixed range"}]} value={duration} onChange={setDuration}/>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="field"><div className="label" style={{ display: "flex", justifyContent: "space-between" }}>Min duration <span className="mono">{minDuration}s</span></div>
                        <input type="range" min="10" max="60" value={minDuration} onChange={e => setMinDuration(+e.target.value)} style={{ width: "100%" }}/>
                      </div>
                      <div className="field"><div className="label" style={{ display: "flex", justifyContent: "space-between" }}>Max duration <span className="mono">{maxDuration}s</span></div>
                        <input type="range" min="20" max="90" value={maxDuration} onChange={e => setMaxDuration(+e.target.value)} style={{ width: "100%" }}/>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><div><div className="card-title">Motion & transitions</div></div></div>
                  <div className="card-body stack" style={{ gap: 14 }}>
                    <div className="field"><div className="label">Transition between scenes</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                        {[
                          { id: "hard-cut", label: "Hard cut" },
                          { id: "crossfade", label: "Crossfade" },
                          { id: "slide", label: "Slide" },
                          { id: "zoom", label: "Zoom" },
                        ].map(o => (
                          <button key={o.id} onClick={() => setTransition(o.id)} className={`btn sm ${transition === o.id ? "primary" : ""}`}>{o.label}</button>
                        ))}
                      </div>
                    </div>
                    <Toggle on={kenBurns} onChange={setKenBurns} label="Ken Burns effect" sub="Gentle pan & zoom on every photo."/>
                    <Toggle on={introCard} onChange={setIntroCard} label="Show intro card" sub="Brief branded frame at the start."/>
                    <Toggle on={outroCard} onChange={setOutroCard} label="Show outro card" sub="CTA frame at the end (configured in Brand)."/>
                  </div>
                </div>
              </>
            )}

            {tab === "intro-outro" && (
              <>
                <IntroOutroCard
                  kind="Intro"
                  enabled={introEnabled} setEnabled={setIntroEnabled}
                  source={introSource} setSource={setIntroSource}
                  duration={introDuration} setDuration={setIntroDuration}
                  file={introFile} setFile={setIntroFile}
                />
                <IntroOutroCard
                  kind="Outro"
                  enabled={outroEnabled} setEnabled={setOutroEnabled}
                  source={outroSource} setSource={setOutroSource}
                  duration={outroDuration} setDuration={setOutroDuration}
                  file={outroFile} setFile={setOutroFile}
                />
                <div className="card">
                  <div className="card-header"><div><div className="card-title">Rules</div><div className="card-subtitle">When to skip the intro/outro automatically.</div></div></div>
                  <div className="card-body stack" style={{ gap: 10 }}>
                    <Toggle on={skipForRentals} onChange={setSkipForRentals} label="Skip on rentals" sub="Use intro/outro only on sale listings."/>
                    <Toggle on={false} onChange={() => {}} label="Skip when reel is shorter than 15s" sub="Avoids a tiny clip of pure branding."/>
                    <Toggle on={false} onChange={() => {}} label="Allow agent to disable per reel" sub="Editor will show a toggle to remove the default intro or outro for one reel."/>
                  </div>
                </div>
              </>
            )}

            {tab === "audio" && (
              <div className="card">
                <div className="card-header"><div><div className="card-title">Mix</div></div></div>
                <div className="card-body stack" style={{ gap: 14 }}>
                  <div className="field"><div className="label" style={{ display: "flex", justifyContent: "space-between" }}>Music volume <span className="mono">{musicVolume}%</span></div>
                    <input type="range" min="0" max="100" value={musicVolume} onChange={e => setMusicVolume(+e.target.value)} style={{ width: "100%" }}/>
                  </div>
                  <Toggle on={fadeIn} onChange={setFadeIn} label="Fade music in" sub="1.5 second fade at the start."/>
                  <Toggle on={fadeOut} onChange={setFadeOut} label="Fade music out" sub="2 second fade at the end."/>
                  <Toggle on={voiceover} onChange={setVoiceover} label="AI voiceover" sub="Read the script aloud over the music (beta)."/>
                  <Toggle on={duckOnVoice} onChange={setDuckOnVoice} label="Duck music under voiceover" sub="Lower music volume when narration is active."/>
                </div>
              </div>
            )}

            {tab === "captions" && (
              <div className="card">
                <div className="card-header"><div><div className="card-title">AI caption generation</div><div className="card-subtitle">How the AI writes the subtitles on the video.</div></div></div>
                <div className="card-body stack" style={{ gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="field"><div className="label">Caption language</div>
                      <select className="select" value={captionLang} onChange={e => setCaptionLang(e.target.value)}>
                        <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="pt">Portuguese</option>
                      </select>
                    </div>
                    <div className="field"><div className="label">Case style</div>
                      <Segmented options={[{value:"sentence",label:"Sentence"},{value:"title",label:"Title Case"},{value:"upper",label:"UPPER"}]} value={captionCase} onChange={setCaptionCase}/>
                    </div>
                  </div>
                  <Toggle on={emojiInCaptions} onChange={setEmojiInCaptions} label="Include emoji" sub="AI may add relevant emoji (🏡 💰 📍) in subtitle text."/>
                </div>
              </div>
            )}
          </div>

          {/* Live preview column */}
          <div style={{ position: "sticky", top: 68, alignSelf: "flex-start" }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, textAlign: "center" }}>
                Live preview · <span className="mono">{aspect}</span>
              </div>
              <div style={{
                position: "relative",
                aspectRatio: aspect.replace(":","/"),
                borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)",
              }}>
                <Cover kind="cranford-living" ratio={aspect} style={{ height: "100%", borderRadius: 0 }} video/>
                {/* subtitle preview */}
                <div style={{
                  position: "absolute",
                  left: subAlign === "left" ? 12 : 12,
                  right: subAlign === "right" ? 12 : 12,
                  top: subPosition === "top" ? 16 : subPosition === "middle" ? "50%" : "auto",
                  bottom: subPosition === "bottom" ? "14%" : "auto",
                  transform: subPosition === "middle" ? "translateY(-50%)" : "none",
                  textAlign: subAlign,
                  display: "flex",
                  justifyContent: subAlign === "left" ? "flex-start" : subAlign === "right" ? "flex-end" : "center",
                }}>
                  <span style={{
                    fontFamily: `"${subFont}", sans-serif`,
                    fontWeight: subWeight,
                    fontSize: subSize * 0.3,
                    color: subColor,
                    textTransform: subUppercase ? "uppercase" : "none",
                    padding: subBgStyle === "none" ? 0 : "6px 12px",
                    borderRadius: subBgStyle === "pill" ? 999 : subBgStyle === "block" ? 4 : 4,
                    background: subBgStyle === "none" || subBgStyle === "outline"
                      ? "transparent"
                      : `${subBgColor}${Math.round(subBgOpacity*2.55).toString(16).padStart(2,"0")}`,
                    border: subBgStyle === "outline" ? `2px solid ${subBgColor}` : "none",
                    textShadow: subBgStyle === "none" ? "0 2px 4px rgba(0,0,0,0.6)" : "none",
                    lineHeight: 1.3,
                    display: "inline-block",
                    maxWidth: "88%",
                  }}>
                    South-facing garden ·{" "}
                    <span style={{ color: subHighlightWord ? subHighlightColor : "inherit" }}>renovated</span>
                    {" "}2024
                  </span>
                </div>
              </div>

              {/* Format summary */}
              <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: "var(--bg-soft)", fontSize: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 10px", color: "var(--text-muted)" }}>
                  <span>Price</span><span className="mono" style={{ color: "var(--text)", fontWeight: 500 }}>{formatPrice()}</span>
                  <span>Date</span><span className="mono" style={{ color: "var(--text)", fontWeight: 500 }}>{formatDate()}</span>
                  <span>Size</span><span className="mono" style={{ color: "var(--text)", fontWeight: 500 }}>{measurement === "metric" ? "112 m²" : "1,206 ft²"}</span>
                  <span>Duration</span><span className="mono" style={{ color: "var(--text)", fontWeight: 500 }}>{duration === "auto" ? "auto" : `${minDuration}-${maxDuration}s`} · {fps} fps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntroOutroCard = ({ kind, enabled, setEnabled, source, setSource, duration, setDuration, file, setFile }) => {
  const isIntro = kind === "Intro";
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{kind} video</div>
          <div className="card-subtitle">
            {isIntro ? "Plays at the start of every reel." : "Plays at the end of every reel. Great for CTAs and contact info."}
          </div>
        </div>
        <Toggle on={enabled} onChange={setEnabled}/>
      </div>
      <div className="card-body" style={{ display: enabled ? "block" : "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
          {/* Preview / drop zone */}
          <div>
            <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: 10, overflow: "hidden", background: "#000", border: "1px solid var(--border)" }}>
              {source === "uploaded" && file ? (
                <>
                  <video src="assets/property/reel.mp4" autoPlay muted loop playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                  <div style={{ position: "absolute", top: 8, left: 8, display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, background: "rgba(0,0,0,0.55)", color: "white", fontSize: 10, fontWeight: 600, letterSpacing: "0.04em" }}>
                    <Icon name="play" size={9}/> {kind.toUpperCase()}
                  </div>
                  <div style={{ position: "absolute", bottom: 8, right: 8, padding: "2px 7px", borderRadius: 4, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 10, fontFamily: "var(--font-mono)" }}>
                    {file.duration}
                  </div>
                </>
              ) : source === "brand-card" ? (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "linear-gradient(180deg, #0f1729 0%, #1e2944 100%)", color: "white", textAlign: "center", padding: 12 }}>
                  <div>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "white", margin: "0 auto 10px", display: "grid", placeItems: "center" }}>
                      <img src="assets/ck-logo.png" alt="" style={{ maxWidth: "80%", maxHeight: "80%" }}/>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{isIntro ? "CKP Estate Agents" : "Book a viewing"}</div>
                    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>{isIntro ? "Presenting this property" : "ckpestateagents.ie"}</div>
                  </div>
                </div>
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--text-muted)" }}>
                  <div style={{ textAlign: "center", padding: 10 }}>
                    <Icon name="film" size={22}/>
                    <div style={{ fontSize: 11, marginTop: 6 }}>No {kind.toLowerCase()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="stack" style={{ gap: 14 }}>
            <div className="field">
              <div className="label">Source</div>
              <Segmented
                options={[
                  { value: "uploaded", label: "Uploaded video" },
                  { value: "brand-card", label: "Brand card" },
                  { value: "none", label: "None" },
                ]}
                value={source} onChange={setSource}
              />
            </div>

            {source === "uploaded" && (
              <div>
                <div className="label" style={{ marginBottom: 6 }}>Video file</div>
                {file ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", flex: "none" }}>
                      <Icon name="film" size={14}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{file.duration} · {file.size}</div>
                    </div>
                    <button className="btn sm"><Icon name="edit" size={12}/> Replace</button>
                    <button className="icon-btn" onClick={() => setFile(null)}><Icon name="trash" size={13}/></button>
                  </div>
                ) : (
                  <div style={{ padding: 16, textAlign: "center", border: "1.5px dashed var(--border-strong)", borderRadius: 8, background: "var(--bg-soft)" }}>
                    <Icon name="upload" size={18} style={{ color: "var(--text-muted)" }}/>
                    <div style={{ fontSize: 12, marginTop: 6 }}>Drop an MP4 / MOV, or <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 500 }}>browse</span></div>
                    <div className="hint" style={{ marginTop: 4 }}>Max 10s · same aspect ratio as the reel</div>
                  </div>
                )}
              </div>
            )}

            {source === "brand-card" && (
              <div style={{ padding: 12, borderRadius: 8, background: "var(--bg-soft)", fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <Icon name="palette" size={14}/>
                <span>Generated from your logo, colors and {isIntro ? "agency name" : "CTA text"} in <span style={{ color: "var(--accent)", fontWeight: 500 }}>Brand</span>.</span>
              </div>
            )}

            <div className="field">
              <div className="label" style={{ display: "flex", justifyContent: "space-between" }}>
                {kind} duration <span className="mono">{duration.toFixed(1)}s</span>
              </div>
              <input type="range" min="1" max="6" step="0.5" value={duration} onChange={e => setDuration(+e.target.value)} style={{ width: "100%" }}/>
              <div className="hint">
                {isIntro ? "Trimmed from the start of the uploaded clip." : "Trimmed from the start of the uploaded clip. Adds over the last frame of the reel."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorRow = ({ value, onChange }) => (
  <div className="input-group">
    <span className="input-group-icon" style={{ padding: 4, paddingLeft: 6 }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width: 24, height: 24, border: 0, borderRadius: 4, padding: 0, background: "transparent", cursor: "pointer" }}/>
    </span>
    <input className="input" value={value} onChange={e => onChange(e.target.value)}/>
  </div>
);

window.ReelDefaultsConfig = ReelDefaultsConfig;
