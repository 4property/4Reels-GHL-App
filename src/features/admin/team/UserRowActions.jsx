import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../shared/Icon.jsx';

export function UserRowActions({ user, onEdit, onRemove, onResend }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="icon-btn" onClick={() => setOpen(!open)}>
        <Icon name="more" />
      </button>
      {open && (
        <div className="menu">
          <MenuItem icon="edit" label="Edit member" onClick={() => { onEdit(); setOpen(false); }} />
          {user.status === 'invited' && (
            <MenuItem icon="send" label="Resend invite" onClick={() => { onResend(); setOpen(false); }} />
          )}
          <MenuItem icon="key" label="Reset 2FA" onClick={() => setOpen(false)} />
          <MenuItem icon="clock" label="View activity" onClick={() => setOpen(false)} />
          <hr className="sep" style={{ margin: '4px 0' }} />
          <MenuItem icon="trash" label="Remove" danger onClick={() => { onRemove(); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button className={`menu-item ${danger ? 'danger' : ''}`} onClick={onClick}>
      <Icon name={icon} size={12} /> {label}
    </button>
  );
}
