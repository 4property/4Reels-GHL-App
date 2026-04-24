import { apiRequest } from '../../lib/api/client.js';

export const sessionApi = {
  /** Returns the currently signed-in user with their resolved `permissions` map. */
  getCurrentUser: () => apiRequest('/me'),
};
