import { Button, type ButtonSize } from '@/design-system/Button';
import { cx } from '@/lib/cx';
import { useMe } from '@/lib/session';
import type { UserSummary } from '@/lib/types';
import { useFollowAction } from '@/features/social/useFollowAction';

/**
 * Bouton d'abonnement (SOC-01 à 04). « Abonné » et « Demandé » montrent l'action inverse au survol,
 * en rouge. Un compte qui me suit déjà propose « Suivre en retour ».
 */
export function FollowButton({ user, size = 'md' }: { user: UserSummary; size?: ButtonSize }) {
  const act = useFollowAction();
  const { data: me } = useMe();
  if (me?.username === user.username) return null;
  const r = user.relation;
  const on = r !== 'none';
  const main =
    r === 'following'
      ? 'Abonné'
      : r === 'requested'
        ? 'Demandé'
        : user.follows_me
          ? 'Suivre en retour'
          : 'S’abonner';
  const alt = r === 'following' ? 'Se désabonner' : 'Annuler';
  return (
    <Button
      size={size}
      variant={on ? 'outline' : 'primary'}
      onClick={() => void act(user)}
      aria-label={
        r === 'following'
          ? `Abonné à @${user.username}, cliquer pour se désabonner`
          : r === 'requested'
            ? `Demande envoyée à @${user.username}, cliquer pour annuler`
            : `S’abonner à @${user.username}`
      }
      className={cx(
        'group/follow min-w-[104px]',
        on && 'hover:border-danger/50 hover:bg-danger/8 hover:text-danger',
      )}
    >
      <span className={cx(on && 'group-hover/follow:hidden')}>{main}</span>
      {on && <span className="hidden group-hover/follow:inline">{alt}</span>}
    </Button>
  );
}
