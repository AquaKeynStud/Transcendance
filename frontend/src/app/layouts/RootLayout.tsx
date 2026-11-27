import { Search } from 'lucide-react';
import { Form, Outlet, ScrollRestoration, useMatches } from 'react-router';
import { LegalLinks } from '@/app/layouts/LegalLinks';
import { Sidebar } from '@/app/layouts/Sidebar';
import { cx } from '@/lib/cx';
import { QuickComposer } from '@/features/feed/QuickComposer';
import { ComposerProvider } from '@/features/posts/Composer';
import { Suggestions } from '@/features/social/Suggestions';

/**
 * Ce qu'une route demande à la mise en page (champ `handle` du routeur) :
 * - rail : contenu de la colonne de droite (rédaction rapide sur le fil, suggestions ailleurs) ;
 * - wide : le contenu prend aussi la place de la colonne de droite (paramètres).
 */
export type RouteHandle = { rail?: 'composer' | 'suggestions' | 'none'; wide?: boolean };

function useHandle(): RouteHandle {
  const matches = useMatches();
  return Object.assign({}, ...matches.map((m) => (m.handle as RouteHandle | undefined) ?? {}));
}

/** Colonne de droite (≥ 1021 px) : recherche, puis la tuile de la page. */
function Rail({ content }: { content: RouteHandle['rail'] }) {
  return (
    <aside
      aria-label="Colonne de droite"
      className="sticky top-0 col-start-4 row-start-1 hidden h-dvh [scrollbar-width:none] flex-col gap-4 self-start overflow-y-auto pt-2 pb-4 pl-6 md:flex"
    >
      <Form action="/search" role="search" className="relative">
        <Search
          aria-hidden
          size={18}
          strokeWidth={1.8}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-3"
        />
        <input
          type="search"
          name="q"
          aria-label="Rechercher"
          placeholder="Rechercher"
          className="h-11 w-full rounded-full border border-card-line bg-card pr-4 pl-11 text-post placeholder:text-text-3 focus:border-accent focus:outline-none"
        />
      </Form>
      {content === 'composer' && <QuickComposer />}
      {(content === 'suggestions' || content === undefined) && <Suggestions />}
      <LegalLinks />
    </aside>
  );
}

/**
 * Mise en page des maquettes (DESIGN_SYSTEM.md §4.6) :
 * nav | marge | contenu (620) | colonne de droite (360) | marge.
 * ≤ 1180 px : nav en icônes · ≤ 1020 px : pas de colonne de droite · ≤ 720 px : une colonne, nav en bas.
 */
export function RootLayout() {
  const { rail, wide } = useHandle();
  return (
    <ComposerProvider>
      <div className="min-h-dvh pb-14 sm:grid sm:grid-cols-[var(--nav-w)_minmax(0,1fr)_minmax(0,var(--main-w))_minmax(0,1fr)] sm:pb-0 md:grid-cols-[var(--nav-w)_minmax(0,1fr)_minmax(0,var(--main-w))_var(--rail-w)_minmax(0,1fr)]">
        <Sidebar />
        <main
          className={cx(
            'col-start-3 row-start-1 flex min-h-dvh min-w-0 flex-col',
            wide ? 'sm:col-end-5 md:col-end-5' : 'sm:border-r sm:border-line',
          )}
        >
          <div className="flex-1">
            <Outlet />
          </div>
          <LegalLinks className={cx('py-4', !wide && 'md:hidden')} />
        </main>
        {!wide && <Rail content={rail} />}
        <ScrollRestoration />
      </div>
    </ComposerProvider>
  );
}
