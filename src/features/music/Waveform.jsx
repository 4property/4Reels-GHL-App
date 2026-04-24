/** Renders an equalizer-style bar visualization for a track's waveform. */
export function Waveform({ bars, playing, color }) {
  return (
    <div className="waveform">
      {bars.map((b, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: `${b * 100}%`,
            background: color,
            opacity: playing ? 0.5 + 0.5 * Math.sin(Date.now() / 200 + i) : 1,
          }}
        />
      ))}
    </div>
  );
}
