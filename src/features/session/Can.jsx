import { useCan } from './useCan.js';

/**
 * Conditionally renders children based on a permission check.
 *
 *   <Can I="publish" on="reels">       (treats `I`+`on` as "<module>.<level>")
 *     <ApproveButton/>
 *   </Can>
 *
 *   <Can module="admin">               (any access — ro or rw)
 *     <AdminTab/>
 *   </Can>
 *
 *   <Can module="brand" level="write" fallback={<ReadOnlyNote/>}>
 *     <BrandEditor/>
 *   </Can>
 */
export function Can({ module, level = 'read', fallback = null, children }) {
  const allowed = useCan(module, level);
  return allowed ? children : fallback;
}
