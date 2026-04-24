import { ApiError } from '../../ApiError.js';
import { store } from '../store.js';

export const adminHandlers = [
  {
    method: 'GET',
    pattern: '/admin/tenants',
    handler: () => ({ data: store.tenants }),
  },
  {
    method: 'POST',
    pattern: '/admin/tenants',
    handler: ({ body }) => {
      const id = `new-${Date.now()}`;
      const t = { id, plan: 'Starter', seats: 1, reelsMonth: 0, storageGb: 0, mrr: 0, status: 'trial', joined: 'Today', ...body };
      store.tenants.push(t);
      return t;
    },
  },
  {
    method: 'GET',
    pattern: '/team',
    handler: () => ({ data: store.team }),
  },
  {
    method: 'POST',
    pattern: '/team',
    handler: ({ body }) => {
      const row = { id: `u${Date.now()}`, status: 'invited', twoFA: false, sso: false, lastSeen: '—', joined: 'Pending', ...body };
      store.team.push(row);
      return row;
    },
  },
  {
    method: 'PATCH',
    pattern: '/team/:id',
    handler: ({ params, body }) => {
      const idx = store.team.findIndex((u) => u.id === params.id);
      if (idx === -1) throw new ApiError(404, `User ${params.id} not found`);
      store.team[idx] = { ...store.team[idx], ...body };
      return store.team[idx];
    },
  },
  {
    method: 'DELETE',
    pattern: '/team/:id',
    handler: ({ params }) => {
      const idx = store.team.findIndex((u) => u.id === params.id);
      if (idx === -1) throw new ApiError(404, `User ${params.id} not found`);
      store.team.splice(idx, 1);
      return null;
    },
  },
  {
    method: 'GET',
    pattern: '/team/roles',
    handler: () => ({ data: store.roles }),
  },
];
