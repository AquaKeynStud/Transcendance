import { useNavigate } from 'react-router';
import { useConfirm, useToast } from '@/design-system/feedback';
import { useMe } from '@/lib/session';
import type { UserSummary } from '@/lib/types';
import { useFollow } from '@/features/social/api';

/** Texte de confirmation avant de se désabonner (SOC-04). */
export function unfollowText(u: Pick<UserSummary, 'username' | 'is_private' | 'follows_me'>) {
  if (u.is_private)
    return 'Ce compte est privé : vous ne verrez plus ses posts, et il faudra refaire une demande pour le suivre.';
  if (u.follows_me)
    return `Vous ne serez plus amis : @${u.username} ne verra plus votre statut en ligne, et vous non plus.`;
  return 'Ses posts n’apparaîtront plus dans votre fil Abonnements.';
}

/** Suivre, demander, annuler, se désabonner, avec les toasts et la confirmation. */
export function useFollowAction() {
  const follow = useFollow();
  const confirm = useConfirm();
  const toast = useToast();
  const navigate = useNavigate();
  const { data: me } = useMe();

  return async (u: Pick<UserSummary, 'username' | 'is_private' | 'follows_me' | 'relation'>) => {
    if (!me) return navigate('/login');
    const { username } = u;
    if (u.relation === 'following') {
      const ok = await confirm({
        title: `Se désabonner de @${username} ?`,
        text: unfollowText(u),
        ok: 'Se désabonner',
        danger: true,
      });
      if (!ok) return;
    }
    const on = u.relation === 'none';
    follow.mutate(
      { username, on },
      {
        onSuccess: (p) =>
          toast(
            on
              ? p.relation === 'requested'
                ? `Demande envoyée à @${username}`
                : `Vous suivez @${username}`
              : u.relation === 'requested'
                ? 'Demande annulée'
                : `Vous ne suivez plus @${username}`,
          ),
        onError: (e) => toast(e.message, { type: 'error' }),
      },
    );
  };
}
