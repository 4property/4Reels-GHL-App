/**
 * The app's top-level navigation. A plain data map — adding a new page is a
 * single entry here plus wiring it into <Shell>.
 *
 * Each entry's `path` is the route base; `requires` (optional) is the
 * permission needed to see/access the tab. When `requires` is set, the Topbar
 * hides the tab for users who don't have it and <Shell> redirects them if
 * they type the URL directly.
 */
export const PAGES = [
  { id: 'dashboard', path: '/reels', label: 'Reels', icon: 'film' },
  { id: 'music', path: '/music', label: 'Music', icon: 'music' },
  { id: 'social', path: '/social', label: 'Social', icon: 'share' },
  { id: 'brand', path: '/brand', label: 'Brand', icon: 'palette' },
  { id: 'defaults', path: '/defaults', label: 'Defaults', icon: 'settings' },
  { id: 'automation', path: '/automation', label: 'Automation', icon: 'zap' },
  { id: 'admin', path: '/admin', label: 'Admin', icon: 'shield', requires: { module: 'admin' } },
];
