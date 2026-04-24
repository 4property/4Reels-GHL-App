import { useEffect } from 'react';

/**
 * When 4Reels is embedded in a parent frame (the "Tweaks" host), the parent
 * can `postMessage({ type: '__activate_edit_mode' })` to pop the tweaks panel.
 * This hook sets that protocol up once per app mount.
 */
export function useEmbeddedEditMode(setOpen) {
  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', handler);
    // Signal to parent that this mode is available
    try {
      window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    } catch {
      /* cross-origin parent may throw — safe to ignore */
    }
    return () => window.removeEventListener('message', handler);
  }, [setOpen]);
}
