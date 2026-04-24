import { apiRequest } from '../../lib/api/client.js';

export const socialApi = {
  listTemplates: () => apiRequest('/socials/templates'),
  saveTemplates: (templates) =>
    apiRequest('/socials/templates', { method: 'PUT', body: templates }),
};
