import { useEffect, useRef } from 'react';

/** Déclenche `onHit` quand l'élément approche de l'écran (400 px avant). */
export function useSentinel(onHit: () => void, active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onHit);
  useEffect(() => {
    cb.current = onHit;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const io = new IntersectionObserver((e) => e[0]?.isIntersecting && cb.current(), {
      rootMargin: '400px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [active]);
  return ref;
}
