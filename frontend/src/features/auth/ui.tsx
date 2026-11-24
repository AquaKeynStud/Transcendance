import { ArrowLeft, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useToast } from '@/design-system/feedback';
import { cx } from '@/lib/cx';

/** Carte des pages d'authentification (Panel 01, version large). Sans bord sur mobile. */
export function AuthCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section
      aria-label={label}
      className="flex w-full flex-col gap-5 rounded-md border border-card-line bg-card p-8 max-sm:border-0 max-sm:bg-transparent max-sm:px-1 max-sm:py-4"
    >
      {children}
    </section>
  );
}

/** En-tête : pastille d'icône ou retour, titre, texte. */
export function AuthHead({
  title,
  children,
  icon: Icon,
  tone,
  back,
}: {
  title: string;
  children?: ReactNode;
  icon?: LucideIcon;
  tone?: 'ok' | 'ko';
  back?: { to: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {back && (
        <Link
          to={back.to}
          aria-label={back.label}
          title={back.label}
          className="-mt-2 mb-2 -ml-2.5 grid size-9 place-items-center rounded-full text-text-2 transition-colors hover:bg-hover hover:text-text"
        >
          <ArrowLeft aria-hidden size={22} strokeWidth={1.8} />
        </Link>
      )}
      {Icon && (
        <div
          className={cx(
            'mb-2 grid size-13 place-items-center rounded-full border',
            tone === 'ok'
              ? 'border-success/45 bg-success/8 text-success'
              : tone === 'ko'
                ? 'border-danger/45 bg-danger/8 text-danger'
                : 'border-line-strong text-text',
          )}
        >
          <Icon aria-hidden size={24} strokeWidth={1.8} />
        </div>
      )}
      <h1 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em]">{title}</h1>
      {children && <p className="text-post text-text-2">{children}</p>}
    </div>
  );
}

/** Adresse email mise en avant dans un texte. */
export function EmailOut({ children }: { children: ReactNode }) {
  return <span className="font-semibold [overflow-wrap:anywhere] text-text">{children}</span>;
}

/** Séparateur « ou ». */
export function Sep({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-caption text-text-3 before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
      {children}
    </div>
  );
}

export function AuthFoot({ children }: { children: ReactNode }) {
  return <p className="text-center text-sm text-text-2">{children}</p>;
}

export const linkClass = 'font-semibold text-link hover:underline hover:underline-offset-3';

/**
 * Bouton OAuth 42 (AUTH-07, module bonus « Could »). Pas encore branché :
 * il prévient au lieu de rediriger vers l'intranet.
 */
export function Button42({ children }: { children: ReactNode }) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => toast('La connexion avec 42 n’est pas encore disponible.', { type: 'info' })}
      className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full border border-line-strong text-[17px] font-bold transition-colors duration-150 hover:bg-hover"
    >
      <span
        aria-hidden
        className="grid size-[22px] place-items-center rounded-[5px] bg-text text-[11px] font-extrabold tracking-[-0.04em] text-bg"
      >
        42
      </span>
      {children}
    </button>
  );
}

/**
 * En dev avec MSW : les liens que le backend enverrait par email, pour tester sans boîte mail.
 * Rien ne s'affiche en production ni avec VITE_MSW=off.
 */
export function DevNote({ children }: { children: ReactNode }) {
  if (!import.meta.env.DEV || import.meta.env.VITE_MSW === 'off') return null;
  return (
    <aside className="rounded-sm border border-dashed border-line-strong px-4 py-3 text-caption text-text-3">
      <b className="mb-1 block text-overline tracking-[0.06em] text-text-2 uppercase">
        Dev · fausse API
      </b>
      {children}
    </aside>
  );
}
