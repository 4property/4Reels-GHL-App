import { Icon } from './Icon.jsx';

/**
 * Circular chip for a social network. The caller passes the full `net` object
 * (with `color`, `icon`, `name`) — this is a presentation-only primitive and
 * does not depend on any data source.
 */
export function SocialDot({ net, size = 18 }) {
  if (!net) return null;
  return (
    <span
      className="social-dot"
      title={net.name}
      style={{ width: size, height: size, background: net.color }}
    >
      <Icon name={net.icon} size={size * 0.6} />
    </span>
  );
}
