import { initials } from '../lib/utils/format.js';

export function Avatar({ name, color }) {
  return (
    <div className="avatar" style={{ background: color || 'var(--accent)' }}>
      {initials(name)}
    </div>
  );
}
