import {
  CalendarDays,
  ChevronRight,
  Eye,
  EyeOff,
  Heart,
  ImageIcon,
  Link2,
  Lock,
  Mail,
  MessageCircle,
  Repeat2,
  Rss,
  UserPlus,
  UserX,
  type LucideIcon,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Avatar, Badge, PrivateBadge } from '@/design-system/Avatar';
import { Button, buttonClass, IconButton } from '@/design-system/Button';
import { useToast } from '@/design-system/feedback';
import { Menu } from '@/design-system/Menu';
import { EmptyState, ListNote } from '@/design-system/misc';
import { PageHead } from '@/design-system/PageHead';
import { Skeleton } from '@/design-system/Spinner';
import { TabLinks } from '@/design-system/Tabs';
import { ApiError } from '@/lib/api';
import { fmtCount, monthYear, plural } from '@/lib/format';
import { useMe } from '@/lib/session';
import type { Profile, Visibility } from '@/lib/types';
import { profileUrl } from '@/lib/urls';
import { useProfileTab, type ProfileTab } from '@/features/posts/api';
import { useComposer } from '@/features/posts/composer-context';
import { PostList } from '@/features/posts/PostList';
import { useProfile } from '@/features/social/api';
import { FollowButton } from '@/features/social/FollowButton';
import { RelationTag } from '@/features/social/UserRow';

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'posts', label: 'Posts' },
  { id: 'replies', label: 'Réponses' },
  { id: 'media', label: 'Médias' },
  { id: 'likes', label: 'J’aime' },
  { id: 'reposts', label: 'Republications' },
];
const WHO: Record<Visibility, string> = {
  public: 'tout le monde',
  followers: 'ses abonnés',
  private: 'personne',
};

function Header({ p, me }: { p: Profile; me: boolean }) {
  const toast = useToast();
  const friend = !me && p.relation === 'following' && p.follows_me;
  const pending = me && 'pending_requests_count' in p ? Number(p.pending_requests_count) : 0;
  const counts: [string, number, string][] = [
    ['following', p.following_count, 'abonnements'],
    ['followers', p.followers_count, 'abonnés'],
    ['friends', p.friends_count, 'amis'],
  ];
  return (
    <div className="px-5 pt-4 max-sm:px-4 max-sm:pt-3">
      <div className="flex items-end justify-between gap-3">
        <span
          title={
            p.is_online
              ? friend
                ? 'En ligne (visible car vous êtes amis)'
                : 'En ligne'
              : undefined
          }
        >
          <Avatar
            name={p.display_name}
            src={p.avatar}
            size="xxl"
            online={!!p.is_online}
            className="max-sm:!size-[76px]"
          />
        </span>
        <div className="flex items-center gap-2">
          {me ? (
            <Link to="/settings/profile" className={buttonClass({ variant: 'outline' })}>
              Modifier le profil
            </Link>
          ) : (
            <>
              <Menu
                label="Plus d’actions"
                outline
                className="text-text"
                items={[
                  {
                    icon: Link2,
                    label: 'Copier le lien du profil',
                    onSelect: () =>
                      void navigator.clipboard
                        ?.writeText(location.origin + profileUrl(p.username))
                        .then(() => toast('Lien copié')),
                  },
                  {
                    icon: UserX,
                    label: `Bloquer @${p.username}`,
                    danger: true,
                    onSelect: () =>
                      toast('Bloquer (SOC-07) est en « Could » : pas prévu pour l’instant.', {
                        type: 'info',
                      }),
                  },
                ]}
              />
              <IconButton
                label="Envoyer un message"
                outline
                onClick={() => toast('Les messages arrivent au S5.', { type: 'info' })}
              >
                <Mail aria-hidden size={18} strokeWidth={1.8} />
              </IconButton>
              <FollowButton user={p} />
            </>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h2 className="text-[22px] tracking-[-0.02em]">{p.display_name}</h2>
        {p.is_private && <PrivateBadge />}
      </div>
      <div className="flex items-center gap-2 text-text-3">
        @{p.username}
        {!me && <RelationTag user={p} />}
      </div>
      {p.bio && <p className="mt-3 leading-normal">{p.bio}</p>}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-3">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays aria-hidden size={16} strokeWidth={1.8} />A rejoint transcendance en{' '}
          {monthYear(p.created_at)}
        </span>
        {friend && p.is_online && <span className="text-success">● En ligne</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-3">
        {counts.map(([path, n, label]) =>
          p.can_see_content ? (
            <Link
              key={path}
              to={`${profileUrl(p.username)}/${path}`}
              className="hover:text-text-2 hover:underline hover:underline-offset-3"
            >
              <b className="mr-1 font-bold text-text tabular-nums">{fmtCount(n)}</b>
              {label}
            </Link>
          ) : (
            <span
              key={path}
              className="cursor-not-allowed"
              title="Visible seulement par ses abonnés"
            >
              <b className="mr-1 font-bold text-text tabular-nums">{fmtCount(n)}</b>
              {label}
            </span>
          ),
        )}
      </div>
      {me && p.is_private && (
        <Link
          to="/requests"
          className="mt-4 flex items-center gap-3 rounded-sm border border-card-line bg-card px-4 py-3 transition-colors hover:bg-[color-mix(in_srgb,var(--card)_80%,var(--hover))]"
        >
          <UserPlus aria-hidden size={18} strokeWidth={1.8} />
          <span className="flex-1 text-sm text-text-2">
            <b className="block text-[15px] text-text">Demandes d’abonnement</b>
            {pending
              ? `${plural(pending, 'en attente', 'en attente')} : votre compte est privé, vous choisissez qui vous suit.`
              : 'Aucune demande en attente.'}
          </span>
          {pending > 0 && <Badge>{pending}</Badge>}
          <ChevronRight aria-hidden size={18} className="text-text-3" />
        </Link>
      )}
    </div>
  );
}

const EMPTY: Record<ProfileTab, { icon: LucideIcon; title: string; mine: string; other: string }> =
  {
    posts: {
      icon: Rss,
      title: 'Aucun post',
      mine: 'Publiez votre premier post avec le bouton « Publier ».',
      other: 'n’a encore rien publié.',
    },
    replies: {
      icon: MessageCircle,
      title: 'Aucune réponse',
      mine: 'Vos réponses aux posts apparaîtront ici.',
      other: 'n’a encore répondu à personne.',
    },
    media: {
      icon: ImageIcon,
      title: 'Aucun média',
      mine: 'Les photos et vidéos de vos posts apparaîtront ici.',
      other: 'n’a pas encore publié de média.',
    },
    likes: {
      icon: Heart,
      title: 'Aucun J’aime',
      mine: 'Les posts que vous aimez apparaîtront ici.',
      other: 'n’a encore rien aimé.',
    },
    reposts: {
      icon: Repeat2,
      title: 'Aucune republication',
      mine: 'Les posts que vous republiez apparaîtront ici, et sur le fil de vos abonnés.',
      other: 'n’a encore rien republié.',
    },
  };

function Gallery({ username }: { username: string }) {
  const toast = useToast();
  const q = useProfileTab(username, 'media');
  const media = q.data?.pages.flatMap((p) => p.results.flatMap((it) => it.post.media)) ?? [];
  if (q.isPending)
    return (
      <div className="grid grid-cols-3 gap-1 px-5 pt-3 pb-5">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="aspect-square rounded-sm" />
        ))}
      </div>
    );
  return media.length ? (
    <div className="grid grid-cols-3 gap-1 px-5 pt-3 pb-5 max-sm:px-4">
      {media.map((m, i) => (
        <button
          key={m.id}
          type="button"
          aria-label={m.type === 'video' ? 'Vidéo' : m.type === 'gif' ? 'GIF' : 'Image'}
          onClick={() => toast('Plein écran : prévu au S5 (MEDIA-08).', { type: 'info' })}
          className="aspect-square cursor-zoom-in rounded-sm bg-cover bg-center"
          style={{
            backgroundImage:
              m.url && m.type !== 'video' ? `url(${m.url})` : `var(--ph${(i % 3) + 1})`,
          }}
        />
      ))}
    </div>
  ) : null;
}

function TabPanel({ p, tab, me }: { p: Profile; tab: ProfileTab; me: boolean }) {
  const composer = useComposer();
  const hidden = (tab === 'likes' && !p.can_see_likes) || (tab === 'reposts' && !p.can_see_reposts);
  const query = useProfileTab(p.username, tab, !hidden && tab !== 'media');
  const e = EMPTY[tab];
  const empty = (
    <EmptyState
      icon={e.icon}
      title={e.title}
      action={me && tab === 'posts' && <Button onClick={() => composer.open()}>Publier</Button>}
    >
      {me ? e.mine : `@${p.username} ${e.other}`}
    </EmptyState>
  );
  const what = tab === 'likes' ? 'J’aime' : 'republications';
  const vis = tab === 'likes' ? p.likes_visibility : p.reposts_visibility;

  if (hidden)
    return (
      <EmptyState
        icon={EyeOff}
        title={tab === 'likes' ? 'J’aime masqués' : 'Republications masquées'}
      >
        @{p.username} a choisi de montrer ses {what} à {WHO[vis]}. Les compteurs des posts, eux,
        restent visibles par tous.
      </EmptyState>
    );
  if (tab === 'media')
    return (
      <>
        <Gallery username={p.username} />
        <MediaEmpty username={p.username} empty={empty} />
      </>
    );
  return (
    <>
      {(tab === 'likes' || tab === 'reposts') &&
        (me ? (
          <ListNote icon={Eye}>
            Visibles par{' '}
            {vis === 'followers'
              ? 'vos abonnés'
              : vis === 'private'
                ? 'vous seulement'
                : 'tout le monde'}
            .{' '}
            <Link to="/settings/privacy" className="font-semibold text-link hover:underline">
              Changer dans Confidentialité
            </Link>
          </ListNote>
        ) : (
          vis === 'followers' && (
            <ListNote icon={Eye}>
              @{p.username} montre ses {what} à ses abonnés : vous les voyez parce que vous le
              suivez.
            </ListNote>
          )
        ))}
      <PostList
        query={query}
        empty={empty}
        label={`${e.title.replace('Aucun', '')} de @${p.username}`}
      />
    </>
  );
}

/** Affiche l'état vide de l'onglet Médias quand la galerie est vide. */
function MediaEmpty({ username, empty }: { username: string; empty: React.ReactNode }) {
  const q = useProfileTab(username, 'media');
  const n = q.data?.pages.reduce((s, p) => s + p.results.length, 0) ?? -1;
  return n === 0 ? <>{empty}</> : null;
}

/** Page profil (ACC-01, ACC-02, ACC-07) et ses onglets, filtrés selon le §3. */
export function ProfilePage({ tab = 'posts' }: { tab?: ProfileTab }) {
  const { username = '' } = useParams();
  const { data: me } = useMe();
  const { data: p, isPending, error } = useProfile(username);
  const isMe = me?.username === username;

  if (isPending)
    return (
      <>
        <PageHead title=" " back flush />
        <div
          className="flex flex-col gap-3 px-5 pt-4"
          aria-busy="true"
          aria-label="Chargement du profil"
        >
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </>
    );
  if (!p)
    return (
      <>
        <PageHead title="Profil" back />
        <EmptyState
          icon={UserX}
          title={
            error instanceof ApiError && error.status === 404
              ? 'Ce compte n’existe pas'
              : 'Profil indisponible'
          }
        >
          {error instanceof ApiError && error.status === 404
            ? `Aucun compte ne s’appelle @${username}. Il a peut-être changé de nom ou supprimé son compte.`
            : 'Réessayez dans un instant.'}
        </EmptyState>
      </>
    );

  return (
    <>
      <PageHead title={p.display_name} sub={plural(p.posts_count, 'post')} back flush />
      <Header p={isMe && me ? me : p} me={isMe} />
      {p.can_see_content ? (
        <>
          <div className="mt-4">
            <TabLinks
              label="Contenu du profil"
              items={TABS.map((t) => ({
                to: t.id === 'posts' ? profileUrl(p.username) : `${profileUrl(p.username)}/${t.id}`,
                label: t.label,
              }))}
            />
          </div>
          <TabPanel key={tab} p={p} tab={tab} me={isMe} />
        </>
      ) : (
        <EmptyState
          icon={Lock}
          className="mt-5 border-t border-line"
          title={p.relation === 'requested' ? 'Demande envoyée' : 'Ce compte est privé'}
        >
          {p.relation === 'requested'
            ? `Vous verrez les posts, les réponses et les médias de @${p.username} quand sa demande sera acceptée.`
            : `Abonnez-vous à @${p.username} pour voir ses posts, ses réponses et ses médias. Le compte doit accepter votre demande.`}
        </EmptyState>
      )}
    </>
  );
}
