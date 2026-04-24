import { useApi, useMutation } from '../../lib/hooks/useApi.js';
import { socialApi } from './api.js';

export function useSocialTemplates() {
  const { data, ...rest } = useApi(() => socialApi.listTemplates(), []);
  return { templates: data?.data ?? {}, ...rest };
}

export function useSaveSocialTemplates() {
  return useMutation((templates) => socialApi.saveTemplates(templates));
}
