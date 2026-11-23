import type { UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/design-system/Button';
import { EmptyState } from '@/design-system/misc';
import { PostSkeleton } from '@/design-system/Spinner';
import type { CursorPage, FeedItem } from '@/lib/types';
import { useSentinel } from '@/lib/useSentinel';
import { PostCard } from '@/features/posts/PostCard';

type Query = UseInfiniteQueryResult<InfiniteData<CursorPage<FeedItem>, unknown>>;

/**
 * Liste de posts avec défilement infini (FEED-01, FEED-02) : squelettes au premier chargement,
 * deux squelettes pendant la page suivante, état vide, erreur avec « Réessayer », fin de liste.
 */
export function PostList({
  query,
  empty,
  end,
  label,
}: {
  query: Query;
  empty: ReactNode;
  /** Message sous le dernier post. */
  end?: ReactNode;
  label: string;
}) {
  const { data, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    query;
  const sentinel = useSentinel(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, !!hasNextPage);

  if (isPending)
    return (
      <div aria-busy="true" aria-label={`Chargement : ${label}`}>
        {Array.from({ length: 4 }, (_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  if (isError)
    return (
      <EmptyState
        icon={RefreshCw}
        title="Impossible de charger les posts"
        action={
          <Button variant="outline" onClick={() => void refetch()}>
            Réessayer
          </Button>
        }
      >
        Vérifiez votre connexion, puis réessayez.
      </EmptyState>
    );
  const items = data.pages.flatMap((p) => p.results);
  if (!items.length) return <>{empty}</>;
  return (
    <div aria-label={label} aria-busy={isFetchingNextPage}>
      {items.map((it) => (
        <PostCard key={it.key} item={it} />
      ))}
      {isFetchingNextPage && (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}
      {hasNextPage ? (
        <div ref={sentinel} className="h-px" />
      ) : (
        end && <p className="px-5 pt-6 pb-8 text-center text-sm text-text-3">{end}</p>
      )}
    </div>
  );
}
