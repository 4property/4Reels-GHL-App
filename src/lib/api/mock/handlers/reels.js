import { ApiError } from '../../ApiError.js';
import { store } from '../store.js';

export const reelsHandlers = [
  {
    method: 'GET',
    pattern: '/reels',
    handler: () => ({ data: store.reels }),
  },
  {
    method: 'GET',
    pattern: '/reels/:id',
    handler: ({ params }) => {
      const reel = store.reels.find((r) => r.id === params.id);
      if (!reel) throw new ApiError(404, `Reel ${params.id} not found`);
      return reel;
    },
  },
  {
    method: 'PATCH',
    pattern: '/reels/:id',
    handler: ({ params, body }) => {
      const idx = store.reels.findIndex((r) => r.id === params.id);
      if (idx === -1) throw new ApiError(404, `Reel ${params.id} not found`);
      store.reels[idx] = { ...store.reels[idx], ...body };
      return store.reels[idx];
    },
  },
  {
    method: 'POST',
    pattern: '/reels/:id/approve',
    handler: ({ params }) => {
      const idx = store.reels.findIndex((r) => r.id === params.id);
      if (idx === -1) throw new ApiError(404, `Reel ${params.id} not found`);
      store.reels[idx].publishStatus = 'published';
      return store.reels[idx];
    },
  },
  {
    method: 'POST',
    pattern: '/reels/:id/reject',
    handler: ({ params }) => {
      const idx = store.reels.findIndex((r) => r.id === params.id);
      if (idx === -1) throw new ApiError(404, `Reel ${params.id} not found`);
      store.reels[idx].publishStatus = 'rejected';
      return store.reels[idx];
    },
  },
];
