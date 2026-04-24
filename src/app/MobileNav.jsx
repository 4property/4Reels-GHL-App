import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from '../shared/Avatar.jsx';
import { Icon } from '../shared/Icon.jsx';
import { useCurrentUser } from '../features/session/index.js';
import { useTheme } from './providers/ThemeProvider.jsx';

/**
 * Slide-in drawer shown in place of the inline tabs on tablet / mobile.
 * Owns its own backdrop and traps Escape. The caller controls visibility.
 */
export function MobileNav({ pages, open, onClose, onOpenNotifications }) {
  const user = useCurrentUser();
  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mnav-backdrop" onClick={onClose}>
      <aside
        className="mnav-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Navigation"
      >
        <header className="mnav-header">
          <div className="mnav-user">
            <Avatar name={user.name} color={`hsl(${user.avatarHue ?? 215}, 55%, 55%)`} />
            <div className="min-w-0">
              <div className="mnav-user-name">{user.name}</div>
              <div className="mnav-user-role">{user.role}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={16} />
          </button>
        </header>

        <nav className="mnav-list">
          {pages.map((p) => (
            <NavLink
              key={p.id}
              to={p.path}
              className={({ isActive }) => `mnav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon name={p.icon} size={16} />
              <span>{p.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mnav-divider" />

        <div className="mnav-actions">
          <button className="mnav-item" onClick={() => { toggleTheme(); }}>
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={16} />
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <button
            className="mnav-item"
            onClick={() => { onClose(); onOpenNotifications?.(); }}
          >
            <Icon name="bell" size={16} />
            <span>Notification settings</span>
          </button>
          <button className="mnav-item">
            <Icon name="help" size={16} />
            <span>Help & support</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
