import { useQuery } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import type { Me } from '@/lib/types';

export const meKey = ['me'] as const;

/** L'user connecté, ou null pour un visiteur (401). */
export function useMe() {
  return useQuery({
    queryKey: meKey,
    queryFn: async () => {
      try {
        return await api<Me>('/auth/me');
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return null;
        throw e;
      }
    },
    staleTime: 60_000,
  });
}
