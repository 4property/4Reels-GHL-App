import { Icon } from '../../../shared/Icon.jsx';

/** Labelled range slider 0–100 with optional unit suffix and hint below. */
export function Slider({ label, value, onChange, unit = '', icon, hint }) {
  return (
    <div>
      <div className="slider-head">
        {icon && <Icon name={icon} size={12} className="slider-head-icon" />}
        <span className="slider-label">{label}</span>
        <span className="mono slider-value">{value}{unit}</span>
      </div>
      <input
        className="slider-range"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <div className="hint" style={{ marginTop: 4 }}>{hint}</div>}
    </div>
  );
}
