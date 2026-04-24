import { useState } from 'react';
import { Icon } from '../../shared/Icon.jsx';
import { SocialDot } from '../../shared/SocialDot.jsx';
import { useSocial } from '../../app/providers/TenantProvider.jsx';
import { ctrColor, fmtNum } from '../../lib/utils/format.js';
import { CompactStat } from './CompactStat.jsx';
import { Sparkline } from './Sparkline.jsx';

/**
 * Inline stats card under each reel thumb showing views / clicks / CTR and a
 * 7d/30d clicks sparkline.
 */
export function TrackerStats({ tracker }) {
  const [range, setRange] = useState('7');
  const topNet = useSocial(tracker?.topNet);

  if (!tracker) {
    return (
      <div className="tracker-empty">
        <Icon name="link" size={11} /> No tracker data yet
      </div>
    );
  }

  const series = range === '7' ? (tracker.clicks7d || []) : (tracker.clicks30d || []);
  const rangeTotal = series.reduce((a, b) => a + b, 0);

  return (
    <div className="tracker" onClick={(e) => e.stopPropagation()}>
      <div className="tracker-head">
        <div className="tracker-stats">
          <CompactStat icon="eye" value={fmtNum(tracker.views)} />
          <CompactStat icon="link" value={fmtNum(tracker.clicks)} color="var(--accent)" />
          <CompactStat icon="trending-up" value={`${tracker.ctr}%`} color={ctrColor(tracker.ctr)} />
        </div>
        <SocialDot net={topNet} size={16} />
      </div>

      {series.length > 0 && (
        <div>
          <div className="tracker-chart-head">
            <div className="tracker-chart-label">
              <span className="tracker-chart-total">{fmtNum(rangeTotal)}</span>
              <span className="tracker-chart-meta">clicks · {range}d</span>
            </div>
            <div className="tracker-range">
              {['7', '30'].map((r) => (
                <button
                  key={r}
                  className={`tracker-range-btn ${range === r ? 'active' : ''}`}
                  onClick={() => setRange(r)}
                >
                  {r}d
                </button>
              ))}
            </div>
          </div>
          <Sparkline data={series} height={24} />
        </div>
      )}
    </div>
  );
}
