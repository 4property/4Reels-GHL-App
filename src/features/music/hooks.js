import { useApi, useMutation } from '../../lib/hooks/useApi.js';
import { musicApi } from './api.js';

export function useTracks() {
  const { data, ...rest } = useApi(() => musicApi.listTracks(), []);
  return { tracks: data?.data ?? [], ...rest };
}

export function useUpdateTrack() {
  return useMutation(({ id, patch }) => musicApi.updateTrack(id, patch));
}
