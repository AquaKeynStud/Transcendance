import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CursorPage, FollowRequest, Profile, UserSummary } from '@/lib/types';

export type ListKind = 'followers' | 'following' | 'friends';

export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => api<Profile>(`/users/${username}`),
  });
}

export function useUserList(username: string, kind: ListKind, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['user-list', username, kind],
    queryFn: ({ pageParam }) =>
      api<CursorPage<UserSummary>>(pageParam ?? `/users/${username}/${kind}`),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.next,
    enabled,
  });
}

export function useRequests() {
  return useInfiniteQuery({
    queryKey: ['requests'],
    queryFn: ({ pageParam }) => api<CursorPage<FollowRequest>>(pageParam ?? '/me/follow-requests'),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.next,
  });
}

export function useSuggestions() {
  return useQuery({
    queryKey: ['suggestions'],
    queryFn: () => api<UserSummary[]>('/users/suggestions'),
  });
}

/** Tout ce qui dépend des relations : profils, listes, fils, suggestions, session. */
export function refreshSocial(qc: QueryClient) {
  for (const key of ['profile', 'user-list', 'user-tab', 'suggestions', 'me', 'requests'])
    void qc.invalidateQueries({ queryKey: [key] });
  void qc.invalidateQueries({ queryKey: ['feed', 'following'] });
}

/** S'abonner, demander, annuler, se désabonner (SOC-01, 02, 04). */
export function useFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ username, on }: { username: string; on: boolean }) =>
      api<Profile>(`/users/${username}/follow`, { method: on ? 'POST' : 'DELETE' }),
    onSuccess: (p) => {
      qc.setQueryData(['profile', p.username], p);
      refreshSocial(qc);
    },
  });
}

/** Accepter ou refuser une demande (SOC-03). */
export function useAnswerRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ username, accept }: { username: string; accept: boolean }) =>
      api<UserSummary>(`/me/follow-requests/${username}/${accept ? 'accept' : 'reject'}`, {
        method: 'POST',
      }),
    onSuccess: () => {
      for (const key of ['profile', 'user-list', 'me'])
        void qc.invalidateQueries({ queryKey: [key] });
    },
  });
}

/** Retirer un abonné (SOC-05). */
export function useRemoveFollower() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => api<void>(`/me/followers/${username}`, { method: 'DELETE' }),
    onSuccess: () => refreshSocial(qc),
  });
}
