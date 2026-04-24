import { apiRequest } from '../../lib/api/client.js';

export const adminApi = {
  // Agencies (super-admin)
  listTenants: () => apiRequest('/admin/tenants'),
  createTenant: (body) => apiRequest('/admin/tenants', { method: 'POST', body }),

  // Team (this tenant)
  listTeam: () => apiRequest('/team'),
  invite: (body) => apiRequest('/team', { method: 'POST', body }),
  updateMember: (id, patch) => apiRequest(`/team/${id}`, { method: 'PATCH', body: patch }),
  removeMember: (id) => apiRequest(`/team/${id}`, { method: 'DELETE' }),
  listRoles: () => apiRequest('/team/roles'),
};
