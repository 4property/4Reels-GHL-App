/**
 * Permission model
 * ----------------
 * Each role has a map { module: 'rw' | 'ro' | 'none' }. Modules in use:
 *   reels · publish · music · brand · automation · admin · api
 *
 * Call `can(permissions, module, level?)` where level is:
 *   - 'read'  (default) → true if 'ro' or 'rw'
 *   - 'write'            → true only if 'rw'
 *
 * Keep this file pure (no React) so it's trivial to test and reuse.
 */

/**
 * @param {Record<string, 'rw'|'ro'|'none'|undefined>} permissions
 * @param {string} module
 * @param {'read'|'write'} [level]
 * @returns {boolean}
 */
export function can(permissions, module, level = 'read') {
  const p = permissions?.[module];
  if (!p || p === 'none') return false;
  if (level === 'write') return p === 'rw';
  return p === 'ro' || p === 'rw';
}
