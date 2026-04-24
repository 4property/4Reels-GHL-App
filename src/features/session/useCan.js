import { usePermissions } from './SessionProvider.jsx';
import { can } from './permissions.js';

/**
 * Hook version of `can()`. Returns a boolean for the given (module, level).
 *
 *   const canPublish = useCan('publish', 'write');
 *   const canSeeAdmin = useCan('admin');
 */
export function useCan(module, level = 'read') {
  const permissions = usePermissions();
  return can(permissions, module, level);
}
