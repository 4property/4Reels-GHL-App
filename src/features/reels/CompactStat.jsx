import { Icon } from '../../shared/Icon.jsx';

export function CompactStat({ icon, value, color }) {
  return (
    <span className="compact-stat" style={color ? { color } : undefined}>
      <Icon name={icon} size={11} /> {value}
    </span>
  );
}
