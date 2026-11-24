import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

/**
 * Disponibilité d'un nom d'utilisateur, demandée 500 ms après la dernière frappe.
 * Renvoie la dernière réponse : la comparer à la valeur saisie pour savoir si elle est à jour.
 */
export function useUsernameCheck(value: string, enabled: boolean) {
  const [check, setCheck] = useState<{ value: string; available: boolean } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      api<{ available: boolean }>(`/usernames/${encodeURIComponent(value)}`, {
        signal: ctrl.signal,
      })
        .then((r) => setCheck({ value, available: r.available }))
        .catch(() => undefined);
    }, 500);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value, enabled]);
  return check;
}
