import { apiRequest } from '../../lib/api/client.js';

/**
 * All HTTP paths for the reels feature. Keeping them in one place makes it
 * trivial to spot what the backend needs to implement, and to adjust the
 * prefix (`/v1`, `/api`, etc.) in a single edit.
 */
export const reelsApi = {
  list: () => apiRequest('/reels'),
  get: (id) => apiRequest(`/reels/${id}`),
  update: (id, patch) => apiRequest(`/reels/${id}`, { method: 'PATCH', body: patch }),
  approve: (id) => apiRequest(`/reels/${id}/approve`, { method: 'POST' }),
  reject: (id) => apiRequest(`/reels/${id}/reject`, { method: 'POST' }),
};
