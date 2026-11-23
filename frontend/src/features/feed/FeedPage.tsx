import { Users } from 'lucide-react';
import { Link, Navigate } from 'react-router';
import { buttonClass } from '@/design-system/Button';
import { EmptyState } from '@/design-system/misc';
import { useMe } from '@/lib/session';
import { TabLinks } from '@/design-system/Tabs';
import { useFeed, type FeedKind } from '@/features/posts/api';
import { PostList } from '@/features/posts/PostList';
import { useSuggestions } from '@/features/social/api';
import { FollowButton } from '@/features/social/FollowButton';
import { UserRow } from '@/features/social/UserRow';

function EmptyFollowing() {
  const { data } = useSuggestions();
  return (
    <>
      <EmptyState
        icon={Users}
        title="Votre fil est vide"
        action={
          <Link to="/explore" className={buttonClass()}>
            Parcourir Explorer
          </Link>
        }
      >
        Abonnez-vous à des comptes pour voir leurs posts ici. Vous pouvez commencer par ceux-ci, ou
        parcourir le fil Explorer.
      </EmptyState>
      <div className="border-t border-line">
        {data?.map((u) => (
          <UserRow key={u.id} user={u} end={<FollowButton user={u} size="sm" />} />
        ))}
      </div>
    </>
  );
}

/** Fils Abonnements (FEED-01) et Explorer (FEED-02), avec défilement infini. */
export function FeedPage({ kind }: { kind: FeedKind }) {
  const { data: me, isPending } = useMe();
  const query = useFeed(kind, kind === 'explore' || !!me);
  // FEED-02 : Explorer est la page d'accueil des visiteurs.
  if (kind === 'following' && !isPending && !me) return <Navigate to="/explore" replace />;
  return (
    <>
      <div className="sticky top-0 z-10 bg-bg/92 backdrop-blur-[8px]">
        <TabLinks
          label="Fils"
          items={[
            ...(me ? [{ to: '/', label: 'Abonnements' }] : []),
            { to: '/explore', label: 'Explorer' },
          ]}
        />
      </div>
      <PostList
        query={query}
        label={kind === 'following' ? 'Fil Abonnements' : 'Fil Explorer'}
        empty={
          kind === 'following' ? (
            <EmptyFollowing />
          ) : (
            <EmptyState icon={Users} title="Rien pour l’instant">
              Les posts des comptes publics apparaîtront ici.
            </EmptyState>
          )
        }
        end={
          <>
            Vous êtes à jour.{' '}
            {kind === 'following' && (
              <Link to="/explore" className="font-semibold text-link hover:underline">
                Parcourir Explorer
              </Link>
            )}
          </>
        }
      />
    </>
  );
}
