import { Icon } from './Icon.jsx';

export function EmptyBox({ title, sub, icon = 'film' }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={18} />
      </div>
      <div className="empty-title">{title}</div>
      {sub && <div className="empty-sub">{sub}</div>}
    </div>
  );
}
