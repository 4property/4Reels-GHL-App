/**
 * Seed data used when opening the editor. In a real backend these would come
 * from `GET /reels/:id/photos`, `/subtitles`, `/slides`, etc. — for now the
 * editor still takes them as in-memory state so we keep the current behavior.
 */

export const CRANFORD_PHOTOS = [
  { kind: 'cranford-primary', label: 'EXTERIOR · SIGN', aiScore: 96 },
  { kind: 'cranford-garden', label: 'GARDEN', aiScore: 91 },
  { kind: 'cranford-exterior', label: 'EXTERIOR · BUILDING', aiScore: 88 },
  { kind: 'cranford-living', label: 'LIVING ROOM', aiScore: 93 },
  { kind: 'cranford-kitchen', label: 'KITCHEN', aiScore: 84 },
  { kind: 'cranford-bedroom', label: 'BEDROOM', aiScore: 90 },
  { kind: 'cranford-bathroom', label: 'BATHROOM', aiScore: 78 },
  { kind: 'cranford-garden', label: 'GARDEN · ALT', aiScore: 72 },
  { kind: 'cranford-kitchen', label: 'KITCHEN · DETAIL', aiScore: 66 },
  { kind: 'cranford-bathroom', label: 'BATHROOM · ALT', aiScore: 58 },
];

export const CRANFORD_SUBTITLES = [
  { id: 's1', start: '0:00', end: '0:04', text: 'Welcome to Cranford Court' },
  { id: 's2', start: '0:04', end: '0:09', text: 'A private development in Stillorgan, Dublin 4' },
  { id: 's3', start: '0:09', end: '0:14', text: 'Beautiful communal gardens and mature trees' },
  { id: 's4', start: '0:14', end: '0:19', text: 'Bright living room with original fireplace' },
  { id: 's5', start: '0:19', end: '0:24', text: 'Fitted kitchen with integrated appliances' },
  { id: 's6', start: '0:24', end: '0:29', text: 'Double bedroom with built-in storage' },
  { id: 's7', start: '0:29', end: '0:33', text: 'Fully tiled bathroom with shower' },
  { id: 's8', start: '0:33', end: '0:36', text: 'Book a viewing with CKP Estate Agents' },
];

export const DEFAULT_DESCRIPTION =
  '🏡 2-bed apartment · Cranford Court\n' +
  '📍 Stillorgan Road, Dublin 4\n' +
  '💰 €385,000\n' +
  '🛏 2 · 🛁 1 · 📐 68 m²\n\n' +
  'A bright two-bed apartment in a sought-after private development with mature gardens and off-street parking.\n\n' +
  '👉 Book a viewing: ckpestateagents.ie/view/r8832\n\n' +
  '#dublinhomes #stillorgan #dublin4 #propertytour #ckpestateagents';

export const DEFAULT_SLIDES = [
  { id: 'sl1', kind: 'intro-video', label: 'Intro · CKP', duration: 2.5, enabled: true, locked: false, source: 'default' },
  { id: 'sl2', kind: 'outro-video', label: 'Outro · Book a viewing', duration: 3, enabled: true, locked: false, source: 'default' },
];

export const DEFAULT_TAKE = {
  id: 't1',
  name: 'Take 1',
  duration: '0:34',
  size: '1.2 MB',
  recorded: '2 min ago',
  active: true,
  waveform: [
    0.2, 0.4, 0.6, 0.8, 0.7, 0.5, 0.3, 0.6, 0.9, 0.8, 0.6, 0.4, 0.5, 0.7, 0.9,
    0.8, 0.6, 0.4, 0.3, 0.5, 0.7, 0.8, 0.6, 0.4, 0.2, 0.3, 0.5, 0.7, 0.9, 0.8,
    0.6, 0.4, 0.3, 0.2, 0.4, 0.6, 0.5, 0.3, 0.4, 0.6, 0.7, 0.5, 0.3, 0.2, 0.4,
    0.6, 0.8, 0.6, 0.4, 0.3,
  ],
};

/** Max-characters-per-description per social network. */
export const NETWORK_LIMITS = {
  instagram: 2200,
  tiktok: 2200,
  youtube: 5000,
  facebook: 63206,
  linkedin: 3000,
  gmb: 1500,
};
