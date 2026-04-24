/** Color picker wrapped in an input-group with a text field for the hex. */
export function ColorInput({ value, onChange }) {
  return (
    <div className="input-group">
      <span className="input-group-icon color-input-swatch">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
