import { useApi, useMutation } from '../../lib/hooks/useApi.js';
import { reelsApi } from './api.js';

export function useReels() {
  const { data, ...rest } = useApi(() => reelsApi.list(), []);
  return { reels: data?.data ?? [], ...rest };
}

export function useReel(id) {
  const { data, ...rest } = useApi(() => reelsApi.get(id), [id]);
  return { reel: data, ...rest };
}

export function useUpdateReel() {
  return useMutation(({ id, patch }) => reelsApi.update(id, patch));
}

export function useApproveReel() {
  return useMutation((id) => reelsApi.approve(id));
}

export function useRejectReel() {
  return useMutation((id) => reelsApi.reject(id));
}
