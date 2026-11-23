/* eslint-disable react-hooks/immutability -- la troncature mesure le DOM et pose les hauteurs directement sur les éléments, sans rendu React. */
import { useLayoutEffect, useState, type RefObject } from 'react';

/** Budgets de hauteur d'un post dans le fil (DESIGN_SYSTEM §4.7). */
export const BUDGET = 0.45;
export const BUDGET_LAND = 0.65;
const HEAD = 56; // en-tête collant du fil
const SEE_MORE = 24; // hauteur du lien « Voir plus »
const MIN_LINES = 3;
const MIN_MEDIA = 200;

function setClamp(t: HTMLElement, lines: number | null) {
  const s = t.style;
  if (lines === null) {
    s.removeProperty('display');
    s.removeProperty('-webkit-box-orient');
    s.removeProperty('-webkit-line-clamp');
    s.removeProperty('overflow');
  } else {
    s.display = '-webkit-box';
    s.setProperty('-webkit-box-orient', 'vertical');
    s.setProperty('-webkit-line-clamp', String(lines));
    s.overflow = 'hidden';
  }
}

/**
 * Troncature « Voir plus » (§4.7) : le post entier tient dans 45 % de la hauteur visible du fil,
 * 3 lignes de texte au minimum. Si tous les médias sont horizontaux, le budget passe à 65 % :
 * l'aperçu prend toute la largeur à son format, plafonné pour laisser la place du texte
 * (sa hauteur réelle, 3 lignes au plus), jamais sous 200 px, et le texte prend ce qui reste.
 *
 * Mesure le DOM : la hauteur et le nombre de lignes sont posés directement sur les éléments.
 * Renvoie `true` quand le texte est coupé (le composant affiche alors « Voir plus »).
 */
export function useClamp(
  article: RefObject<HTMLElement | null>,
  text: RefObject<HTMLElement | null>,
  grid: RefObject<HTMLElement | null>,
  expanded: boolean,
  deps: unknown[],
) {
  const [clamped, setClamped] = useState(false);

  useLayoutEffect(() => {
    const run = () => {
      const el = article.current;
      if (!el) return;
      const t = text.current;
      const mg = grid.current?.dataset.ar ? grid.current : null;
      if (t) setClamp(t, null);
      const lh = t ? parseFloat(getComputedStyle(t).lineHeight) || 22.5 : 22.5;
      const budget = (innerHeight - HEAD) * (mg ? BUDGET_LAND : BUDGET);

      if (mg) {
        mg.style.height = '';
        const natural = mg.clientWidth / parseFloat(mg.dataset.ar!);
        const tFull = t && !expanded ? t.offsetHeight : 0;
        const others = el.offsetHeight - mg.offsetHeight - tFull;
        const keep = t
          ? Math.min(t.offsetHeight, MIN_LINES * lh) +
            (t.offsetHeight > MIN_LINES * lh + 1 ? SEE_MORE : 0)
          : 0;
        const cap = budget - others - keep;
        mg.style.height = `${Math.round(Math.max(MIN_MEDIA, Math.min(natural, cap)))}px`;
        // La hauteur est fixée : le format ne doit pas réduire la largeur.
        mg.style.aspectRatio = 'auto';
      }

      if (!t || expanded) return setClamped(false);
      const full = t.offsetHeight;
      const fixed = el.offsetHeight - full;
      const lines = Math.max(MIN_LINES, Math.floor((budget - fixed - SEE_MORE) / lh));
      const cut = full / lh > lines + 0.5;
      if (cut) setClamp(t, lines);
      setClamped(cut);
    };

    run();
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(run, 120);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, ...deps]);

  return clamped;
}
