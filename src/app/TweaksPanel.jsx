import { Icon } from '../shared/Icon.jsx';
import { Segmented } from '../shared/Segmented.jsx';
import { useTheme } from './providers/ThemeProvider.jsx';
import './app.css';

/** Tiny floating panel shown when the host frame activates edit mode. */
export function TweaksPanel({ onClose }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="tweaks-panel">
      <div className="tweaks-panel-header">
        <div className="tweaks-panel-title">Tweaks</div>
        <button className="icon-btn" onClick={onClose}>
          <Icon name="close" size={14} />
        </button>
      </div>
      <div className="tweaks-panel-body">
        <div className="tweaks-panel-label">Theme</div>
        <Segmented
          options={[
            { value: 'light', label: '☀ Light' },
            { value: 'dark', label: '☾ Dark' },
          ]}
          value={theme}
          onChange={setTheme}
        />
      </div>
    </div>
  );
}
