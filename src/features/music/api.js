import { apiRequest } from '../../lib/api/client.js';

export const musicApi = {
  listTracks: () => apiRequest('/music/tracks'),
  updateTrack: (id, patch) =>
    apiRequest(`/music/tracks/${id}`, { method: 'PATCH', body: patch }),
};
