import { Tile } from '@/design-system/misc';
import { Skeleton } from '@/design-system/Spinner';
import { useMe } from '@/lib/session';
import { useSuggestions } from '@/features/social/api';
import { FollowButton } from '@/features/social/FollowButton';
import { UserRow } from '@/features/social/UserRow';

/** Tuile « Vous pourriez suivre » de la colonne de droite. */
export function Suggestions() {
  const { data: me } = useMe();
  const { data, isPending } = useSuggestions();
  if (!me || (data && !data.length)) return null;
  return (
    <Tile title="Vous pourriez suivre" flush>
      {isPending ? (
        <div className="flex flex-col gap-3 px-4 pb-4">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
      ) : (
        data?.map((u) => (
          <UserRow
            key={u.id}
            user={u}
            compact
            hideBio
            avatarSize="sm"
            end={<FollowButton user={u} size="sm" />}
          />
        ))
      )}
    </Tile>
  );
}
