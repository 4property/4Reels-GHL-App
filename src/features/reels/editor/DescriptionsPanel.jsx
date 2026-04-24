import { Icon } from '../../../shared/Icon.jsx';
import { Toggle } from '../../../shared/Toggle.jsx';
import { useSocials, useVariables } from '../../../app/providers/TenantProvider.jsx';
import { SocialPreviewCard } from '../../social/SocialPreviewCard.jsx';
import { NETWORK_LIMITS } from './defaults.js';

/** Descriptions tab — one editable copy + preview per connected network. */
export function DescriptionsPanel({ descs, setDescs, activeNet, setActiveNet }) {
  const socials = useSocials();
  const variables = useVariables();

  const net = socials.find((s) => s.id === activeNet);
  const limit = NETWORK_LIMITS[activeNet] || 2200;
  const current = descs[activeNet] || { enabled: false, text: '' };

  const setText = (text) => setDescs({ ...descs, [activeNet]: { ...current, text } });
  const setEnabled = (enabled) => setDescs({ ...descs, [activeNet]: { ...current, enabled } });

  return (
    <div>
      <div className="panel-head">
        <div>
          <div className="panel-title">Per-network descriptions</div>
          <div className="panel-sub">Filled from your template. Edit freely for this specific reel.</div>
        </div>
        <button className="btn sm"><Icon name="copy" size={12} /> Reset to template</button>
      </div>

      <div className="desc-subtabs">
        {socials.map((s) => (
          <button
            key={s.id}
            className={`subtab ${activeNet === s.id ? 'active' : ''}`}
            onClick={() => setActiveNet(s.id)}
          >
            <span className="desc-net-icon" style={{ background: s.color }}>
              <Icon name={s.icon} size={10} />
            </span>
            {s.name.split(' ')[0]}
            {descs[s.id]?.enabled && <span className="editor-tab-dot" />}
          </button>
        ))}
      </div>

      <div className="desc-layout">
        <div>
          <div className="row-between mb-3" style={{ marginBottom: 10 }}>
            <Toggle
              on={current.enabled}
              onChange={setEnabled}
              label={`Publish to ${net?.name}`}
              sub={net?.handle || 'Not connected'}
            />
          </div>
          <textarea
            className="textarea desc-textarea"
            value={current.text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="desc-meta">
            <span>
              Insert:{' '}
              {variables.slice(0, 4).map((v) => (
                <span key={v.key} className="mono desc-var">
                  {`{{${v.key}}}`}
                </span>
              ))}
            </span>
            <span className="mono">{current.text.length}/{limit}</span>
          </div>
        </div>
        <div>
          <div className="panel-sub" style={{ marginBottom: 8 }}>Preview on {net?.name}</div>
          <SocialPreviewCard net={net} text={current.text} />
        </div>
      </div>
    </div>
  );
}
