import type { ReactNode } from 'react';

/** En-tête de page collant : titre, sous-titre, actions à droite. Ligne du bas à 20 px des bords (§4.3). */
export function PageHead({ title, sub, end }: { title: string; sub?: ReactNode; end?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex min-h-14 items-center gap-4 bg-bg/92 px-4 py-1 backdrop-blur-[8px] after:absolute after:inset-x-5 after:bottom-0 after:h-px after:bg-line">
      <div className="min-w-0 flex-1 leading-tight">
        <h1 className="truncate text-title">{title}</h1>
        {sub && <p className="text-caption text-text-3">{sub}</p>}
      </div>
      {end && <div className="flex gap-2">{end}</div>}
    </header>
  );
}
