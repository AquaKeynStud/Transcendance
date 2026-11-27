import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Avatar, Tag, type AvatarSize } from '@/design-system/Avatar';
import { cx } from '@/lib/cx';
import type { UserSummary } from '@/lib/types';
import { profileUrl } from '@/lib/urls';

/** « Ami » (abonnement mutuel) ou « Vous suit ». */
export function RelationTag({ user }: { user: UserSummary }) {
  if (!user.follows_me) return null;
  return <Tag>{user.relation === 'following' ? 'Ami' : 'Vous suit'}</Tag>;
}

/** UserListItem (23) : avatar, nom, @username, bio sur une ligne, actions à droite. */
export function UserRow({
  user,
  end,
  meta,
  avatarSize = 'md',
  compact,
  hideBio,
}: {
  user: UserSummary;
  end?: ReactNode;
  /** Remplace le tag de relation (ex. « il y a 2 h »). */
  meta?: ReactNode;
  avatarSize?: AvatarSize;
  /** Dans une tuile : marges de 16 px. */
  compact?: boolean;
  hideBio?: boolean;
}) {
  const url = profileUrl(user.username);
  return (
    <div
      className={cx(
        'relative flex items-center gap-3 py-3 transition-colors duration-150 hover:bg-hover',
        compact ? 'px-4' : 'px-5',
        '[&+&]:before:absolute [&+&]:before:top-0 [&+&]:before:h-px [&+&]:before:bg-line',
        compact ? '[&+&]:before:inset-x-4' : '[&+&]:before:inset-x-5',
      )}
    >
      <Link to={url} tabIndex={-1} aria-hidden>
        <Avatar
          name={user.display_name}
          src={user.avatar}
          size={avatarSize}
          online={!!user.is_online}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col leading-[1.3]">
        <Link to={url} className="w-fit hover:underline">
          <b className="inline-flex items-center gap-1.5">
            {user.display_name}
            {user.is_private && (
              <Lock aria-label="Compte privé" size={14} className="text-text-3" />
            )}
          </b>
        </Link>
        <span className="flex items-center gap-1.5 text-sm text-text-3">
          @{user.username}
          {meta ?? <RelationTag user={user} />}
        </span>
        {!hideBio && user.bio && (
          <span className="mt-0.5 truncate text-sm text-text-2">{user.bio}</span>
        )}
      </div>
      {end && <div className="flex items-center gap-2">{end}</div>}
    </div>
  );
}
