import { useState } from 'react';
import { ColorInput } from '../../shared/ColorInput.jsx';
import { Cover } from '../../shared/Cover.jsx';
import { Icon } from '../../shared/Icon.jsx';
import { Toggle } from '../../shared/Toggle.jsx';
import './brand.css';

const FONTS = ['Inter', 'Söhne', 'Manrope', 'Plus Jakarta Sans', 'Helvetica'];

const WATERMARK_POSITIONS = [
  { id: 'top-left', label: 'Top left' },
  { id: 'top-right', label: 'Top right' },
  { id: 'bottom-left', label: 'Bottom left' },
  { id: 'bottom-right', label: 'Bottom right' },
];

/** Brand page — identity, watermark, outro + live preview. */
export function BrandConfig() {
  const [primary, setPrimary] = useState('#2b57f6');
  const [secondary, setSecondary] = useState('#0f1729');
  const [font, setFont] = useState('Inter');
  const [showWatermark, setShowWatermark] = useState(true);
  const [showOutro, setShowOutro] = useState(true);
  const [watermarkPos, setWatermarkPos] = useState('bottom-right');
  const [tagline, setTagline] = useState('Harbor & Vale Realty');
  const [outroHeadline, setOutroHeadline] = useState('Book a viewing');
  const [outroSub, setOutroSub] = useState('harborvale.ie · 01 234 5678');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand</h1>
          <p className="page-subtitle">These settings are applied to every reel your agency generates.</p>
        </div>
        <div className="row gap-4">
          <button className="btn"><Icon name="eye" size={14} /> Preview on a reel</button>
          <button className="btn primary"><Icon name="check" size={14} /> Save brand</button>
        </div>
      </div>

      <div className="brand-layout">
        <div className="stack gap-8">
          <IdentityCard
            tagline={tagline}
            setTagline={setTagline}
            primary={primary}
            setPrimary={setPrimary}
            secondary={secondary}
            setSecondary={setSecondary}
            font={font}
            setFont={setFont}
          />

          <WatermarkCard
            enabled={showWatermark}
            setEnabled={setShowWatermark}
            position={watermarkPos}
            setPosition={setWatermarkPos}
          />

          <OutroCard
            enabled={showOutro}
            setEnabled={setShowOutro}
            headline={outroHeadline}
            setHeadline={setOutroHeadline}
            sub={outroSub}
            setSub={setOutroSub}
          />
        </div>

        <LivePreview
          tagline={tagline}
          primary={primary}
          secondary={secondary}
          font={font}
          showWatermark={showWatermark}
          watermarkPos={watermarkPos}
          showOutro={showOutro}
          outroHeadline={outroHeadline}
          outroSub={outroSub}
        />
      </div>
    </div>
  );
}

function IdentityCard({ tagline, setTagline, primary, setPrimary, secondary, setSecondary, font, setFont }) {
  return (
    <div className="card">
      <div className="card-header"><div className="card-title">Identity</div></div>
      <div className="card-body brand-identity-body">
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Logo</div>
          <div className="brand-logo-box">
            <img className="brand-logo-img" src="/assets/ck-logo.png" alt="CKP logo" />
            <button className="btn sm brand-logo-replace">
              <Icon name="edit" size={12} /> Replace
            </button>
          </div>
          <div className="hint brand-logo-hint" style={{ marginTop: 6 }}>PNG · 512×512</div>
        </div>
        <div className="stack gap-7">
          <div className="field">
            <div className="label">Agency name</div>
            <input className="input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <div className="brand-cols-2">
            <div className="field">
              <div className="label">Primary color</div>
              <ColorInput value={primary} onChange={setPrimary} />
            </div>
            <div className="field">
              <div className="label">Secondary color</div>
              <ColorInput value={secondary} onChange={setSecondary} />
            </div>
          </div>
          <div className="field">
            <div className="label">Heading font</div>
            <select className="select" value={font} onChange={(e) => setFont(e.target.value)}>
              {FONTS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function WatermarkCard({ enabled, setEnabled, position, setPosition }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Watermark</div>
          <div className="card-subtitle">Small brand mark pinned to every reel.</div>
        </div>
        <Toggle on={enabled} onChange={setEnabled} />
      </div>
      <div className="card-body" style={{ display: enabled ? 'block' : 'none' }}>
        <div className="brand-cols-2">
          <div className="field">
            <div className="label">Position</div>
            <div className="brand-cols-2" style={{ gap: 6 }}>
              {WATERMARK_POSITIONS.map((p) => (
                <button
                  key={p.id}
                  className={`btn sm ${position === p.id ? 'primary' : ''}`}
                  onClick={() => setPosition(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <div className="label">Opacity</div>
            <input type="range" min="30" max="100" defaultValue="80" style={{ width: '100%' }} />
            <div className="hint">80%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutroCard({ enabled, setEnabled, headline, setHeadline, sub, setSub }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Outro card</div>
          <div className="card-subtitle">Closing frame with CTA. Appears in the last 2 seconds.</div>
        </div>
        <Toggle on={enabled} onChange={setEnabled} />
      </div>
      <div className="card-body" style={{ display: enabled ? 'block' : 'none' }}>
        <div className="stack gap-6">
          <div className="field">
            <div className="label">Headline</div>
            <input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          </div>
          <div className="field">
            <div className="label">Sub-line</div>
            <input className="input" value={sub} onChange={(e) => setSub(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LivePreview({ tagline, secondary, font, showWatermark, watermarkPos, showOutro, outroHeadline, outroSub }) {
  return (
    <div className="brand-preview-wrap">
      <div className="card" style={{ padding: 16 }}>
        <div className="brand-preview-label">Live preview · 3:4</div>
        <div className="brand-preview-frame">
          <Cover kind="ranelagh" ratio="3/4" label="SAMPLE FRAME" video />

          {showWatermark && (
            <div className={`brand-watermark pos-${watermarkPos}`} style={{ color: secondary }}>
              <img src="/assets/ck-logo.png" alt="" />
              {tagline}
            </div>
          )}

          <div className="brand-caption" style={{ fontFamily: `"${font}", sans-serif` }}>
            South-facing garden · renovated 2024
          </div>
        </div>

        {showOutro && (
          <div className="brand-outro" style={{ background: secondary }}>
            <div>
              <div className="brand-outro-logo">
                <img src="/assets/ck-logo.png" alt="" />
              </div>
              <div className="brand-outro-headline" style={{ fontFamily: `"${font}", sans-serif` }}>
                {outroHeadline}
              </div>
              <div className="brand-outro-sub">{outroSub}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
