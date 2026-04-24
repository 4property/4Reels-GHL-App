import { Icon } from './Icon.jsx';

export function Checkbox({ checked, onChange, label }) {
  return (
    <label className="checkbox">
      <span
        className={`checkbox-box ${checked ? 'is-checked' : ''}`}
        onClick={(e) => { e.preventDefault(); onChange?.(!checked); }}
      >
        {checked && <Icon name="check" size={11} />}
      </span>
      {label}
    </label>
  );
}
