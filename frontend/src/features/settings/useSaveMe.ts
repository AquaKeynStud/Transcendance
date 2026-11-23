import { useQueryClient } from '@tanstack/react-query';
import { meKey } from '@/lib/session';
import type { Me } from '@/lib/types';

/** Mettre à jour la session et tout ce qui affiche mon profil. */
export function useSaveMe() {
  const qc = useQueryClient();
  return (me: Me) => {
    qc.setQueryData(meKey, me);
    void qc.invalidateQueries({ queryKey: ['profile', me.username] });
    void qc.invalidateQueries({ queryKey: ['feed'] });
    void qc.invalidateQueries({ queryKey: ['user-tab'] });
  };
}
