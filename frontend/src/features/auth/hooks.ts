import { useEffect, useState } from 'react';

/** Délai entre deux envois d'email (60 s) : renvoie les secondes restantes et le déclencheur. */
export function useCooldown(seconds = 60) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (!left) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return [left, () => setLeft(seconds)] as const;
}

/** Compte à rebours mm:ss jusqu'à `until` (ms), puis `onEnd`. */
export function useCountdown(until: number | null, onEnd: () => void) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return;
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n >= until) {
        clearInterval(t);
        onEnd();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [until, onEnd]);
  if (!until) return '';
  const s = Math.max(0, Math.ceil((until - now) / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
