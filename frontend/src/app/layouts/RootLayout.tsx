import { Search } from 'lucide-react';
import { Form, Outlet, ScrollRestoration } from 'react-router';
import { LegalLinks } from '@/app/layouts/LegalLinks';
import { Sidebar } from '@/app/layouts/Sidebar';

/** Colonne de droite (≥ 1021 px) : recherche, puis les tuiles du sprint en cours. */
function Rail() {
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
  return (
    <div className="min-h-dvh pb-14 sm:grid sm:grid-cols-[var(--nav-w)_minmax(0,1fr)_minmax(0,var(--main-w))_minmax(0,1fr)] sm:pb-0 md:grid-cols-[var(--nav-w)_minmax(0,1fr)_minmax(0,var(--main-w))_var(--rail-w)_minmax(0,1fr)]">
      <Sidebar />
      <main className="col-start-3 row-start-1 flex min-h-dvh min-w-0 flex-col sm:border-r sm:border-line">
        <div className="flex-1">
          <Outlet />
        </div>
        <LegalLinks className="py-4 md:hidden" />
      </main>
      <Rail />
      <ScrollRestoration />
    </div>
  );
}
