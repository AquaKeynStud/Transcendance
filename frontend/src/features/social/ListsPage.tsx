import { Lock, UserMinus, Users } from 'lucide-react';
import { useParams } from 'react-router';
import { useConfirm, useToast } from '@/design-system/feedback';
import { Menu } from '@/design-system/Menu';
import { EmptyState, ListNote } from '@/design-system/misc';
import { PageHead } from '@/design-system/PageHead';
import { PostSkeleton } from '@/design-system/Spinner';
import { TabLinks } from '@/design-system/Tabs';
import { useMe } from '@/lib/session';
import { profileUrl } from '@/lib/urls';
import { useSentinel } from '@/lib/useSentinel';
import { useProfile, useRemoveFollower, useUserList, type ListKind } from '@/features/social/api';
import { FollowButton } from '@/features/social/FollowButton';
import { UserRow } from '@/features/social/UserRow';

const LABELS: Record<ListKind, string> = {
  followers: 'Abonnés',
  following: 'Abonnements',
  friends: 'Amis',
};

/** Listes Abonnés · Abonnements · Amis (SOC-06), et retrait d'un abonné (SOC-05). */
export function ListsPage({ kind }: { kind: ListKind }) {
  const { username = '' } = useParams();
  const { data: me } = useMe();
  const { data: p } = useProfile(username);
  const isMe = me?.username === username;
  const q = useUserList(username, kind, p?.can_see_content ?? false);
  const remove = useRemoveFollower();
  const confirm = useConfirm();
  const toast = useToast();
  const sentinel = useSentinel(() => {
    if (q.hasNextPage && !q.isFetchingNextPage) void q.fetchNextPage();
  }, !!q.hasNextPage);

  const counts: Record<ListKind, number | undefined> = {
    followers: p?.followers_count,
    following: p?.following_count,
    friends: p?.friends_count,
  };
  const users = q.data?.pages.flatMap((pg) => pg.results) ?? [];

  const askRemove = async (u: string) => {
    const ok = await confirm({
      title: `Retirer @${u} de vos abonnés ?`,
      text: `@${u} ne sera pas prévenu.${me?.is_private ? ' Comme votre compte est privé, il devra refaire une demande pour voir vos posts.' : ''}`,
      ok: 'Retirer',
      danger: true,
    });
    if (ok)
      remove.mutate(u, {
        onSuccess: () => toast(`@${u} ne fait plus partie de vos abonnés`),
        onError: (e) => toast(e.message, { type: 'error' }),
      });
  };

  return (
    <>
      <PageHead
        title={p?.display_name ?? username}
        sub={`@${username}`}
        back={profileUrl(username)}
        flush
      />
      <TabLinks
        label="Listes"
        items={(['followers', 'following', 'friends'] as const).map((k) => ({
          to: `${profileUrl(username)}/${k}`,
          label: LABELS[k],
          count: counts[k],
        }))}
      />
      {kind === 'friends' && (
        <ListNote icon={Users}>
          Un ami est un compte que{' '}
          {isMe ? 'vous suivez et qui vous suit' : `@${username} suit et qui le suit`}.{' '}
          {isMe && 'Vous voyez son statut en ligne, et il voit le vôtre.'}
        </ListNote>
      )}
      {kind === 'followers' && isMe && me?.is_private && (
        <ListNote icon={Lock}>
          Votre compte est privé : seuls ces comptes voient vos posts. Retirer un abonné ne le
          prévient pas.
        </ListNote>
      )}
      {p && !p.can_see_content ? (
        <EmptyState icon={Lock} title="Ce compte est privé">
          Seuls les abonnés de @{username} voient ses listes.
        </EmptyState>
      ) : q.isPending ? (
        <div aria-busy="true">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : users.length ? (
        <div>
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              end={
                <>
                  {isMe && kind === 'followers' && (
                    <Menu
                      label={`Options pour @${u.username}`}
                      size="sm"
                      items={[
                        {
                          icon: UserMinus,
                          label: 'Retirer cet abonné',
                          danger: true,
                          onSelect: () => void askRemove(u.username),
                        },
                      ]}
                    />
                  )}
                  <FollowButton user={u} size="sm" />
                </>
              }
            />
          ))}
          {q.hasNextPage && <div ref={sentinel} className="h-px" />}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={kind === 'friends' ? 'Pas encore d’amis' : 'Personne pour l’instant'}
        >
          {kind === 'friends'
            ? 'Suivez un compte qui vous suit déjà pour devenir amis.'
            : kind === 'following'
              ? 'Les comptes suivis apparaîtront ici.'
              : 'Les abonnés apparaîtront ici.'}
        </EmptyState>
      )}
    </>
  );
}
