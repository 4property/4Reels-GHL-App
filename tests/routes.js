/**
 * The set of routes the smoke + visual suites iterate over. Keep in sync
 * with src/app/pages.js when adding a new page.
 *
 * `requiresAdmin` flags routes the default mock user (Admin) can hit. If
 * later we add a Viewer-as-default mode, the admin-gated routes need a
 * sign-in helper instead.
 */
export const ROUTES = [
  { name: 'reels', path: '/reels' },
  { name: 'editor', path: '/reels/r_8831' },
  { name: 'music', path: '/music' },
  { name: 'social', path: '/social' },
  { name: 'brand', path: '/brand' },
  { name: 'defaults', path: '/defaults' },
  { name: 'automation', path: '/automation' },
  { name: 'admin', path: '/admin', requiresAdmin: true },
];
