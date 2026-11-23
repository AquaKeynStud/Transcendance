import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query';
import { useToast } from '@/design-system/feedback';
import { api } from '@/lib/api';
import type { CursorPage, FeedItem, Post } from '@/lib/types';

export type FeedKind = 'following' | 'explore';
export type ProfileTab = 'posts' | 'replies' | 'media' | 'likes' | 'reposts';
type Pages = InfiniteData<CursorPage<FeedItem>, string | null>;

/** Liste de posts paginée par curseur : fils et onglets du profil. */
export function usePostPages(queryKey: readonly unknown[], path: string, enabled = true) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => api<CursorPage<FeedItem>>(pageParam ?? path),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.next,
    enabled,
  });
}

export const useFeed = (kind: FeedKind, enabled = true) =>
  usePostPages(['feed', kind], `/feed/${kind}`, enabled);

export const useProfileTab = (username: string, tab: ProfileTab, enabled = true) =>
  usePostPages(['user-tab', username, tab], `/users/${username}/${tab}`, enabled);

/** Met à jour un post dans toutes les listes en cache (fils, onglets du profil). */
export function updatePost(qc: QueryClient, id: number, fn: (p: Post) => Post) {
  qc.setQueriesData<Pages>(
    { predicate: (q) => q.queryKey[0] === 'feed' || q.queryKey[0] === 'user-tab' },
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          results: page.results.map((it) =>
            it.post.id === id ? { ...it, post: fn(it.post) } : it,
          ),
        })),
      },
  );
}

/** Après une publication ou une suppression : les listes qui contiennent mes posts. */
export function refreshMyLists(qc: QueryClient, username: string) {
  void qc.invalidateQueries({ queryKey: ['feed'] });
  void qc.invalidateQueries({ queryKey: ['user-tab', username] });
  void qc.invalidateQueries({ queryKey: ['profile', username] });
  void qc.invalidateQueries({ queryKey: ['me'] });
}

/** J'aime et Republier (LIKE-01, REPOST-01) : mise à jour immédiate, annulée si l'API refuse. */
export function useToggle(kind: 'like' | 'repost') {
  const qc = useQueryClient();
  const toast = useToast();
  const flag = kind === 'like' ? 'liked' : 'reposted';
  const counter = kind === 'like' ? 'likes_count' : 'reposts_count';
  return useMutation({
    mutationFn: ({ post, on }: { post: Post; on: boolean }) =>
      api<Post>(`/posts/${post.id}/${kind}`, { method: on ? 'POST' : 'DELETE' }),
    onMutate: ({ post, on }) =>
      updatePost(qc, post.id, (p) => ({ ...p, [flag]: on, [counter]: p[counter] + (on ? 1 : -1) })),
    onSuccess: (post, { on }) => {
      updatePost(qc, post.id, () => post);
      if (kind === 'repost') {
        toast(on ? 'Republié sur votre profil' : 'Republication annulée');
        void qc.invalidateQueries({ queryKey: ['user-tab'], refetchType: 'none' });
      }
    },
    onError: (e, { post }) => {
      updatePost(qc, post.id, () => post);
      toast(e.message, { type: 'error' });
    },
  });
}

export function useDeletePost(username: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: number) => api<Post>(`/posts/${id}`, { method: 'DELETE' }),
    onSuccess: (post) => {
      updatePost(qc, post.id, () => post);
      void qc.invalidateQueries({ queryKey: ['profile', username] });
      toast('Post supprimé');
    },
    onError: (e) => toast(e.message, { type: 'error' }),
  });
}

export function copyPostLink(id: number) {
  return navigator.clipboard?.writeText(`${location.origin}/posts/${id}`);
}
