// Placeholder cover/photo (subtle striped svg with label) or real image if mapped
const PHOTO_MAP = {
  "cranford-primary": "assets/property/primary.jpg",
  "cranford-living": "assets/property/primary.jpg",
  "cranford-garden": "assets/property/01-exterior-garden.jpg",
  "cranford-kitchen": "assets/property/02-kitchen.jpg",
  "cranford-bedroom": "assets/property/03-bedroom.jpg",
  "cranford-bathroom": "assets/property/04-bathroom.jpg",
  "cranford-exterior": "assets/property/05-entrance.jpg",
  // Reuse real photos for other dashboard covers (mocked properties)
  "docklands": "assets/property/primary.jpg",
  "stoneybatter": "assets/property/02-kitchen.jpg",
  "dalkey": "assets/property/01-exterior-garden.jpg",
  "templebar": "assets/property/05-entrance.jpg",
  "phibsborough": "assets/property/03-bedroom.jpg",
  "howth": "assets/property/01-exterior-garden.jpg",
  "smithfield": "assets/property/04-bathroom.jpg",
  "malahide": "assets/property/primary.jpg",
  "ifsc": "assets/property/02-kitchen.jpg",
  "ranelagh": "assets/property/03-bedroom.jpg",
};
// Real reel video that plays in every preview
const REEL_VIDEO_SRC = "assets/property/reel.mp4";
const VIDEO_KINDS = new Set([
  "cranford-primary", "cranford-living", "cranford-garden", "cranford-kitchen",
  "cranford-bedroom", "cranford-bathroom", "cranford-exterior",
  "docklands", "stoneybatter", "dalkey", "templebar", "phibsborough",
  "howth", "smithfield", "malahide", "ifsc", "ranelagh",
]);
const Cover = ({ kind = "default", label, ratio = "3/4", className = "", style = {}, src, video = false }) => {
  const useVideo = video === true;
  const poster = src || PHOTO_MAP[kind];
  if (useVideo) {
    return (
      <div className={`cover ${className}`} style={{ aspectRatio: ratio, position: "relative", borderRadius: 8, overflow: "hidden", background: "#000", ...style }}>
        <video
          src={REEL_VIDEO_SRC}
          poster={poster}
          autoPlay muted loop playsInline preload="auto"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }
  const resolvedSrc = src || PHOTO_MAP[kind];
  if (resolvedSrc) {
    return (
      <div className={`cover ${className}`} style={{ aspectRatio: ratio, position: "relative", borderRadius: 8, overflow: "hidden", background: "var(--bg-sunken)", ...style }}>
        <img src={resolvedSrc} alt={label || ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
      </div>
    );
  }
  const palette = {
    docklands: { a: "#dde4ee", b: "#c3cfe0", t: "#4a5772" },
    stoneybatter: { a: "#ece1e7", b: "#dcc8d3", t: "#6b4f5c" },
    dalkey: { a: "#e4ebe8", b: "#c8dad3", t: "#3f6158" },
    templebar: { a: "#efe7dc", b: "#e2d3bd", t: "#6e5a3c" },
    phibsborough: { a: "#ede4e4", b: "#dcc8c8", t: "#6b4f4f" },
    howth: { a: "#dde7ec", b: "#c3d4dc", t: "#3c5a66" },
    smithfield: { a: "#e6e6ea", b: "#cfd0d8", t: "#4a4d58" },
    malahide: { a: "#ecebe1", b: "#dcd9c0", t: "#5f5a35" },
    ifsc: { a: "#e5e9ec", b: "#ccd3d9", t: "#47525b" },
    ranelagh: { a: "#e8ede4", b: "#d3dcc8", t: "#5c6b53" },
    default: { a: "#e6e8ee", b: "#d7dbe4", t: "#5a6478" },
  };
  const c = palette[kind] || palette.default;
  return (
    <div
      className={`cover ${className}`}
      style={{
        aspectRatio: ratio,
        background: `repeating-linear-gradient(45deg, ${c.a} 0 10px, ${c.b} 10px 20px)`,
        position: "relative",
        borderRadius: 8,
        overflow: "hidden",
        ...style,
      }}
    >
      {label ? (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: c.t,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          textAlign: "center",
          padding: 8,
        }}>{label}</div>
      ) : null}
    </div>
  );
};

window.Cover = Cover;
