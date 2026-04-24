import { ApiError } from '../../ApiError.js';
import { store } from '../store.js';

export const musicHandlers = [
  {
    method: 'GET',
    pattern: '/music/tracks',
    handler: () => ({ data: store.tracks }),
  },
  {
    method: 'PATCH',
    pattern: '/music/tracks/:id',
    handler: ({ params, body }) => {
      const idx = store.tracks.findIndex((t) => t.id === params.id);
      if (idx === -1) throw new ApiError(404, `Track ${params.id} not found`);
      store.tracks[idx] = { ...store.tracks[idx], ...body };
      return store.tracks[idx];
    },
  },
];
