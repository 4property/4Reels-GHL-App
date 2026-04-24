import { Icon } from '../../shared/Icon.jsx';
import { Segmented } from '../../shared/Segmented.jsx';
import { Toggle } from '../../shared/Toggle.jsx';

/** Card reused twice — once for Intro, once for Outro. */
export function IntroOutroCard({ kind, enabled, setEnabled, source, setSource, duration, setDuration, file, setFile }) {
  const isIntro = kind === 'Intro';
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{kind} video</div>
          <div className="card-subtitle">
            {isIntro
              ? 'Plays at the start of every reel.'
              : 'Plays at the end of every reel. Great for CTAs and contact info.'}
          </div>
        </div>
        <Toggle on={enabled} onChange={setEnabled} />
      </div>

      <div className="card-body" style={{ display: enabled ? 'block' : 'none' }}>
        <div className="io-body">
          <Preview kind={kind} source={source} file={file} />
          <Controls
            kind={kind}
            source={source}
            setSource={setSource}
            file={file}
            setFile={setFile}
            duration={duration}
            setDuration={setDuration}
          />
        </div>
      </div>
    </div>
  );
}

function Preview({ kind, source, file }) {
  const isIntro = kind === 'Intro';
  return (
    <div>
      <div className="io-preview">
        {source === 'uploaded' && file ? (
          <>
            <video
              className="cover-media"
              src="/assets/property/reel.mp4"
              autoPlay muted loop playsInline
            />
            <div className="io-preview-tag">
              <Icon name="play" size={9} /> {kind.toUpperCase()}
            </div>
            <div className="io-preview-duration">{file.duration}</div>
          </>
        ) : source === 'brand-card' ? (
          <div className="io-brand-card">
            <div>
              <div className="io-brand-logo">
                <img src="/assets/ck-logo.png" alt="" />
              </div>
              <div className="io-brand-title">
                {isIntro ? 'CKP Estate Agents' : 'Book a viewing'}
              </div>
              <div className="io-brand-sub">
                {isIntro ? 'Presenting this property' : 'ckpestateagents.ie'}
              </div>
            </div>
          </div>
        ) : (
          <div className="io-none">
            <div>
              <Icon name="film" size={22} />
              <div style={{ fontSize: 11, marginTop: 6 }}>No {kind.toLowerCase()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Controls({ kind, source, setSource, file, setFile, duration, setDuration }) {
  const isIntro = kind === 'Intro';
  return (
    <div className="stack gap-7">
      <div className="field">
        <div className="label">Source</div>
        <Segmented
          options={[
            { value: 'uploaded', label: 'Uploaded video' },
            { value: 'brand-card', label: 'Brand card' },
            { value: 'none', label: 'None' },
          ]}
          value={source}
          onChange={setSource}
        />
      </div>

      {source === 'uploaded' && (
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Video file</div>
          {file ? (
            <div className="io-file-chip">
              <div className="io-file-icon">
                <Icon name="film" size={14} />
              </div>
              <div className="grow min-w-0">
                <div className="io-file-name">{file.name}</div>
                <div className="io-file-meta">{file.duration} · {file.size}</div>
              </div>
              <button className="btn sm"><Icon name="edit" size={12} /> Replace</button>
              <button className="icon-btn" onClick={() => setFile(null)}>
                <Icon name="trash" size={13} />
              </button>
            </div>
          ) : (
            <div className="io-dropzone">
              <Icon name="upload" size={18} style={{ color: 'var(--text-muted)' }} />
              <div style={{ fontSize: 12, marginTop: 6 }}>
                Drop an MP4 / MOV, or{' '}
                <span className="t-accent t-medium" style={{ cursor: 'pointer' }}>browse</span>
              </div>
              <div className="hint" style={{ marginTop: 4 }}>Max 10s · same aspect ratio as the reel</div>
            </div>
          )}
        </div>
      )}

      {source === 'brand-card' && (
        <div className="io-brand-hint">
          <Icon name="palette" size={14} />
          <span>
            Generated from your logo, colors and {isIntro ? 'agency name' : 'CTA text'} in{' '}
            <span className="t-accent t-medium">Brand</span>.
          </span>
        </div>
      )}

      <div className="field">
        <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {kind} duration <span className="mono">{duration.toFixed(1)}s</span>
        </div>
        <input
          type="range"
          min="1" max="6" step="0.5"
          value={duration}
          onChange={(e) => setDuration(+e.target.value)}
          style={{ width: '100%' }}
        />
        <div className="hint">
          {isIntro
            ? 'Trimmed from the start of the uploaded clip.'
            : 'Trimmed from the start of the uploaded clip. Adds over the last frame of the reel.'}
        </div>
      </div>
    </div>
  );
}
