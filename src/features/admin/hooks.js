import { useApi, useMutation } from '../../lib/hooks/useApi.js';
import { adminApi } from './api.js';

export function useTenants() {
  const { data, ...rest } = useApi(() => adminApi.listTenants(), []);
  return { tenants: data?.data ?? [], ...rest };
}

export function useCreateTenant() {
  return useMutation((body) => adminApi.createTenant(body));
}

export function useTeam() {
  const { data, ...rest } = useApi(() => adminApi.listTeam(), []);
  return { team: data?.data ?? [], ...rest };
}

export function useInvite() {
  return useMutation((body) => adminApi.invite(body));
}

export function useUpdateMember() {
  return useMutation(({ id, patch }) => adminApi.updateMember(id, patch));
}

export function useRemoveMember() {
  return useMutation((id) => adminApi.removeMember(id));
}

export function useRoles() {
  const { data, ...rest } = useApi(() => adminApi.listRoles(), []);
  return { roles: data?.data ?? [], ...rest };
}
