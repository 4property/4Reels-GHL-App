import { Cover } from '../../shared/Cover.jsx';
import { formatDateSample, formatPriceSample } from './formatter.js';

/** 3:4 preview of the current defaults (subtitle style + format summary). */
export function LivePreview({ state }) {
  const {
    aspect, subFont, subWeight, subSize, subColor,
    subBgStyle, subBgColor, subBgOpacity,
    subPosition, subAlign, subUppercase,
    subHighlightWord, subHighlightColor,
    currency, currencyPosition, thousandsSep, dateFormat,
    measurement, duration, minDuration, maxDuration, fps,
  } = state;

  const bgColorHex = `${subBgColor}${Math.round(subBgOpacity * 2.55).toString(16).padStart(2, '0')}`;
  const bg =
    subBgStyle === 'none' || subBgStyle === 'outline' ? 'transparent'
    : bgColorHex;

  return (
    <div className="defaults-preview-wrap">
      <div className="card" style={{ padding: 16 }}>
        <div className="defaults-preview-label">
          Live preview · <span className="mono">{aspect}</span>
        </div>

        <div className="defaults-preview-frame" style={{ aspectRatio: aspect.replace(':', '/') }}>
          <Cover kind="cranford-living" ratio={aspect} style={{ height: '100%', borderRadius: 0 }} video />

          <div
            className="defaults-sub"
            style={{
              top: subPosition === 'top' ? 16 : subPosition === 'middle' ? '50%' : 'auto',
              bottom: subPosition === 'bottom' ? '14%' : 'auto',
              transform: subPosition === 'middle' ? 'translateY(-50%)' : 'none',
              textAlign: subAlign,
              justifyContent: subAlign === 'left' ? 'flex-start' : subAlign === 'right' ? 'flex-end' : 'center',
            }}
          >
            <span
              className="defaults-sub-span"
              style={{
                fontFamily: `"${subFont}", sans-serif`,
                fontWeight: subWeight,
                fontSize: subSize * 0.3,
                color: subColor,
                textTransform: subUppercase ? 'uppercase' : 'none',
                padding: subBgStyle === 'none' ? 0 : '6px 12px',
                borderRadius: subBgStyle === 'pill' ? 999 : 4,
                background: bg,
                border: subBgStyle === 'outline' ? `2px solid ${subBgColor}` : 'none',
                textShadow: subBgStyle === 'none' ? '0 2px 4px rgba(0,0,0,0.6)' : 'none',
              }}
            >
              South-facing garden ·{' '}
              <span style={{ color: subHighlightWord ? subHighlightColor : 'inherit' }}>renovated</span>
              {' '}2024
            </span>
          </div>
        </div>

        <div className="defaults-summary">
          <div className="defaults-summary-grid">
            <span>Price</span>
            <span className="mono val">{formatPriceSample({ currency, currencyPosition, thousandsSep })}</span>
            <span>Date</span>
            <span className="mono val">{formatDateSample(dateFormat)}</span>
            <span>Size</span>
            <span className="mono val">{measurement === 'metric' ? '112 m²' : '1,206 ft²'}</span>
            <span>Duration</span>
            <span className="mono val">
              {duration === 'auto' ? 'auto' : `${minDuration}-${maxDuration}s`} · {fps} fps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
