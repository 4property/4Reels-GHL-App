import { ApiError } from '../../ApiError.js';
import { store } from '../store.js';

/**
 * In mock mode, the "signed-in user" is the first Admin in the team — this
 * lets us exercise the full Admin view in dev. Real backend will resolve the
 * user from the session cookie / bearer token.
 */
function currentMember() {
  return store.team.find((u) => u.role === 'Admin') || store.team[0] || null;
}

export const sessionHandlers = [
  {
    method: 'GET',
    pattern: '/me',
    handler: () => {
      const user = currentMember();
      if (!user) throw new ApiError(401, 'Not signed in');
      const role = store.roles.find((r) => r.id === user.role);
      return {
        ...user,
        permissions: role?.perms || {},
      };
    },
  },
];
