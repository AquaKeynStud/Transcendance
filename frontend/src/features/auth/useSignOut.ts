import { useNavigate } from 'react-router';
import { useToast } from '@/design-system/feedback';
import { useLogout } from '@/lib/session';

/** Déconnexion (AUTH-03) : ferme la session, puis le fil Explorer en visiteur. */
export function useSignOut() {
  const logout = useLogout();
  const navigate = useNavigate();
  const toast = useToast();
  return {
    pending: logout.isPending,
    signOut: () =>
      logout.mutate(undefined, {
        // Même si l'API échoue, le cache local est vidé : on ne garde rien du compte.
        onSettled: () => {
          navigate('/explore', { replace: true });
          toast('Vous êtes déconnecté');
        },
      }),
  };
}
