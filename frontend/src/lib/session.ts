import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

/**
 * Connexion (AUTH-02). Le cache est vidé : les fils et les profils lus en visiteur
 * n'ont pas les mêmes droits (§3) que ceux de l'user connecté.
 */
export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { login: string; password: string }) =>
      api<Me>('/auth/login', { method: 'POST', body }),
    onSuccess: (me) => {
      qc.clear();
      qc.setQueryData(meKey, me);
    },
  });
}

/** Déconnexion (AUTH-03). Le cache est vidé pour ne rien garder du compte. */
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>('/auth/logout', { method: 'POST' }),
    onSettled: () => {
      qc.clear();
      qc.setQueryData(meKey, null);
    },
  });
}

/**
 * Page où revenir après la connexion (VIS-03), passée dans `?next=`.
 * Seulement un chemin du site, pour ne pas servir de redirection ouverte.
 */
export function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
}

/** Lien vers la connexion qui ramène à `path` ensuite. */
export function loginUrl(path: string, page: 'login' | 'signup' = 'login') {
  return path === '/' || path.startsWith('/login') || path.startsWith('/signup')
    ? `/${page}`
    : `/${page}?next=${encodeURIComponent(path)}`;
}
