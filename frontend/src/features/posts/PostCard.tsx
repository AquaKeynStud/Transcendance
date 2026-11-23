import {
  Heart,
  Link2,
  Lock,
  MessageCircle,
  Pencil,
  Repeat2,
  Trash2,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Avatar } from '@/design-system/Avatar';
import { useConfirm, useToast } from '@/design-system/feedback';
import { Menu, type MenuItem } from '@/design-system/Menu';
import { cx } from '@/lib/cx';
import { dateTime, fmtCount, timeAgo } from '@/lib/format';
import { useMe } from '@/lib/session';
import type { FeedItem } from '@/lib/types';
import { profileUrl } from '@/lib/urls';
import { copyPostLink, useDeletePost, useToggle } from '@/features/posts/api';
import { useComposer } from '@/features/posts/composer-context';
import { MediaGrid } from '@/features/posts/MediaGrid';
import { useClamp } from '@/features/posts/useClamp';
import { useFollowAction } from '@/features/social/useFollowAction';

/** Texte du post : les @mentions connues deviennent des liens vers le profil (POST-05). */
function Linkified({ text, mentions }: { text: string; mentions: string[] }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(/@(\w{3,20})/g)) {
    if (!mentions.includes(m[1]!)) continue;
    parts.push(text.slice(last, m.index));
    parts.push(
      <Link
        key={m.index}
        to={profileUrl(m[1]!)}
        className="font-semibold text-link hover:underline hover:underline-offset-3"
      >
        @{m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

function Action({
  label,
  count,
  icon,
  pressed,
  tone,
  disabled,
  title,
  onClick,
}: {
  label: string;
  count: number;
  icon: ReactNode;
  pressed?: boolean;
  tone?: 'like' | 'repost';
  disabled?: boolean;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${label} : ${count}`}
      aria-pressed={pressed}
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={cx(
        'group/act inline-flex items-center gap-0.5 text-caption text-text-3 tabular-nums transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45',
        !disabled && !tone && 'hover:text-text',
        tone === 'like' && (pressed ? 'text-like' : 'enabled:hover:text-like'),
        tone === 'repost' && (pressed ? 'text-repost' : 'enabled:hover:text-repost'),
      )}
    >
      <span
        className={cx(
          'grid size-[34px] place-items-center rounded-full transition-colors duration-150 [&>svg]:transition-transform [&>svg]:duration-200 active:[&>svg]:scale-125',
          !disabled && !tone && 'group-hover/act:bg-hover',
          !disabled && tone === 'like' && 'group-hover/act:bg-like/12',
          !disabled && tone === 'repost' && 'group-hover/act:bg-repost/12',
        )}
      >
        {icon}
      </span>
      {fmtCount(count)}
    </button>
  );
}

/** PostCard (18) : contexte, en-tête, titre, texte coupé au budget du fil, médias, actions. */
export function PostCard({ item, isNew }: { item: FeedItem; isNew?: boolean }) {
  const { post, reposted_by } = item;
  const { data: me } = useMe();
  const toast = useToast();
  const confirm = useConfirm();
  const composer = useComposer();
  const like = useToggle('like');
  const repost = useToggle('repost');
  const remove = useDeletePost(me?.username ?? '');
  const followAction = useFollowAction();
  const [expanded, setExpanded] = useState(false);
  const article = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const clamped = useClamp(article, text, grid, expanded, [
    post.content,
    post.title,
    post.media.length,
  ]);

  const shell = cx(
    'relative rounded-md px-5 py-4 transition-colors duration-150 hover:bg-post-hover max-sm:px-4 max-sm:py-3',
    'after:absolute after:inset-x-5 after:bottom-0 after:h-px after:bg-line after:transition-opacity after:duration-150 max-sm:after:inset-x-4',
    'hover:after:opacity-0 [&:has(+_*:hover)]:after:opacity-0',
    isNew && 'animate-flash',
  );

  if (post.deleted || !post.author)
    return (
      <article ref={article} className={shell}>
        <div className="rounded-sm border border-line px-4 py-3 text-sm text-text-3">
          {post.deleted === 'moderation' ? 'Post supprimé par la modération' : 'Post supprimé'}
        </div>
      </article>
    );

  const a = post.author;
  const mine = me?.username === a.username;
  const noRepost = a.is_private && !mine;
  const needLogin = () => toast('Connectez-vous pour interagir avec les posts.', { type: 'info' });

  const askDelete = async () => {
    const ok = await confirm({
      title: 'Supprimer ce post ?',
      text: 'Le texte, les médias, les J’aime et les republications seront supprimés. Les réponses restent visibles, et « Post supprimé » s’affiche à sa place. C’est définitif.',
      ok: 'Supprimer',
      danger: true,
    });
    if (ok) remove.mutate(post.id);
  };
  const copy = () =>
    void copyPostLink(post.id)?.then(
      () => toast('Lien copié'),
      () => toast('Impossible de copier le lien', { type: 'error' }),
    );

  const menu: MenuItem[] = mine
    ? [
        { icon: Pencil, label: 'Modifier', onSelect: () => composer.open({ mode: 'edit', post }) },
        { icon: Link2, label: 'Copier le lien', onSelect: copy },
        '-',
        { icon: Trash2, label: 'Supprimer', danger: true, onSelect: () => void askDelete() },
      ]
    : [
        { icon: Link2, label: 'Copier le lien', onSelect: copy },
        ...(me
          ? [
              {
                icon: a.relation === 'none' ? UserPlus : UserMinus,
                label:
                  a.relation === 'following'
                    ? `Se désabonner de @${a.username}`
                    : a.relation === 'requested'
                      ? `Annuler la demande à @${a.username}`
                      : `S’abonner à @${a.username}`,
                onSelect: () => void followAction(a),
              },
            ]
          : []),
      ];

  return (
    <article
      ref={article}
      className={shell}
      aria-labelledby={post.title ? `post-${post.id}-title` : undefined}
    >
      {reposted_by ? (
        <div className="mb-2 flex items-center gap-1.5 text-caption font-bold text-text-3">
          <Repeat2 aria-hidden size={16} className="text-repost" />
          <Link to={profileUrl(reposted_by.username)} className="hover:underline">
            {reposted_by.username === me?.username ? 'Vous avez' : `${reposted_by.display_name} a`}{' '}
            republié
          </Link>
        </div>
      ) : (
        post.parent && (
          <div className="mb-2 flex items-center gap-1.5 text-caption font-bold text-text-3">
            <MessageCircle aria-hidden size={16} />
            {post.parent.author_username ? (
              <>
                En réponse à
                <Link
                  to={profileUrl(post.parent.author_username)}
                  className="text-link hover:underline"
                >
                  @{post.parent.author_username}
                </Link>
              </>
            ) : (
              'En réponse à un post indisponible'
            )}
          </div>
        )
      )}

      <header className="flex items-center gap-3">
        <Link to={profileUrl(a.username)} tabIndex={-1} aria-hidden>
          <Avatar name={a.display_name} src={a.avatar} online={!!a.is_online} />
        </Link>
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1">
          <Link to={profileUrl(a.username)} className="hover:underline">
            <b>{a.display_name}</b>
          </Link>
          <span className="text-text-3">
            @{a.username}
            {a.is_private && (
              <Lock aria-label="Compte privé" size={14} className="ml-1 inline align-[-2px]" />
            )}
            {' · '}
            <time dateTime={post.created_at} title={dateTime(post.created_at)}>
              {timeAgo(post.created_at)}
            </time>
            {post.edited_at && (
              <>
                {' · '}
                <span
                  tabIndex={0}
                  title={`Modifié le ${dateTime(post.edited_at)}`}
                  className="cursor-help border-b border-dotted border-text-3"
                >
                  (modifié)
                </span>
              </>
            )}
          </span>
        </div>
        <Menu label="Options du post" items={menu} className="ml-auto text-text-3" />
      </header>

      {post.title && (
        <h3
          id={`post-${post.id}-title`}
          className="mt-3 text-post-title font-extrabold [overflow-wrap:anywhere]"
        >
          {post.title}
        </h3>
      )}
      {post.content && (
        <>
          <p
            ref={text}
            className={cx(
              'text-post [overflow-wrap:anywhere] whitespace-pre-line',
              post.title ? 'mt-1' : 'mt-3',
            )}
          >
            <Linkified text={post.content} mentions={post.mentions} />
          </p>
          {clamped && !expanded && (
            <button
              type="button"
              aria-expanded={false}
              onClick={() => setExpanded(true)}
              className="mt-1 text-sm font-semibold text-link hover:underline hover:underline-offset-3"
            >
              Voir plus
            </button>
          )}
        </>
      )}
      <MediaGrid ref={grid} media={post.media} />

      <footer className="mt-3 -ml-2 flex gap-6 max-sm:justify-between max-sm:gap-3">
        <Action
          label="Réponses"
          count={post.replies_count}
          icon={<MessageCircle aria-hidden size={18} strokeWidth={1.8} />}
          onClick={() =>
            toast('Les réponses arrivent avec la page d’un post (S5).', { type: 'info' })
          }
        />
        <Action
          label="Republier"
          tone="repost"
          count={post.reposts_count}
          pressed={post.reposted}
          disabled={noRepost}
          title={noRepost ? 'Impossible de republier le post d’un compte privé' : undefined}
          icon={<Repeat2 aria-hidden size={18} strokeWidth={post.reposted ? 2.4 : 1.8} />}
          onClick={() => (me ? repost.mutate({ post, on: !post.reposted }) : needLogin())}
        />
        <Action
          label="J’aime"
          tone="like"
          count={post.likes_count}
          pressed={post.liked}
          icon={
            <Heart
              aria-hidden
              size={18}
              strokeWidth={1.8}
              fill={post.liked ? 'currentColor' : 'none'}
            />
          }
          onClick={() => (me ? like.mutate({ post, on: !post.liked }) : needLogin())}
        />
      </footer>
    </article>
  );
}
