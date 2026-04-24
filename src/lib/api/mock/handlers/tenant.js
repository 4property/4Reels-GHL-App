import { store } from '../store.js';

export const tenantHandlers = [
  {
    method: 'GET',
    pattern: '/tenant',
    handler: () => store.agency,
  },
  {
    method: 'GET',
    pattern: '/tenant/variables',
    handler: () => ({ data: store.variables }),
  },
];
