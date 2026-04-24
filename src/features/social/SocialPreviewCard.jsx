import { Cover } from '../../shared/Cover.jsx';
import { Icon } from '../../shared/Icon.jsx';

/**
 * Mock social-media post card used in previews. Intentionally network-agnostic:
 * the `net` prop carries the network's color/icon/handle/name.
 */
export function SocialPreviewCard({ net, text }) {
  if (!net) return null;
  const excerpt = text.split('\n').filter(Boolean).slice(0, 4).join(' ');

  return (
    <div className="social-preview">
      <div className="social-preview-head">
        <div className="social-preview-avatar" style={{ background: net.color }}>
          <Icon name={net.icon} size={16} />
        </div>
        <div className="grow">
          <div className="social-preview-name">{net.handle || 'Your page'}</div>
          <div className="social-preview-network">{net.name} · Sponsored</div>
        </div>
        <Icon name="more" size={16} style={{ color: 'var(--text-muted)' }} />
      </div>

      <div className="social-preview-media">
        <Cover kind="cranford-primary" ratio="3/4" style={{ borderRadius: 0, height: '100%' }} video />
        <div className="social-preview-caption">
          <div className="social-preview-caption-title">2-bed apt · Cranford Court</div>
          <div className="social-preview-caption-sub">€385,000</div>
        </div>
      </div>

      <div className="social-preview-body">
        <span className="social-preview-body-handle">{net.handle || 'your_page'} </span>
        {excerpt}
      </div>

      <div className="social-preview-actions">
        <Icon name="heart" size={16} />
        <Icon name="send" size={16} />
        <Icon name="share" size={16} />
      </div>
    </div>
  );
}
