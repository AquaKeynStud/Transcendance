import {
  ChevronRight,
  Download,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Trash2,
  User,
  type LucideIcon,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router';
import { Tag } from '@/design-system/Avatar';
import { PageHead } from '@/design-system/PageHead';
import { cx } from '@/lib/cx';
import { useSignOut } from '@/features/auth/useSignOut';

const SECTIONS: { to: string; icon: LucideIcon; label: string; sub: string; soon?: string }[] = [
  { to: 'profile', icon: User, label: 'Profil', sub: 'Photo, nom affiché, bio' },
  { to: 'account', icon: Mail, label: 'Compte', sub: 'Email, nom d’utilisateur' },
  {
    to: 'privacy',
    icon: Lock,
    label: 'Confidentialité',
    sub: 'Compte privé, J’aime, republications',
  },
  { to: 'security', icon: KeyRound, label: 'Sécurité', sub: 'Mot de passe' },
  { to: 'data', icon: Download, label: 'Mes données', sub: 'Exporter en JSON', soon: 'S8' },
  { to: 'delete', icon: Trash2, label: 'Supprimer le compte', sub: 'Définitif', soon: 'S8' },
];

/**
 * Paramètres (ACC-03 à 06) : liste des sections à gauche, section à droite.
 * Sous 1 021 px, la liste devient une barre d'onglets qui défile.
 */
export function SettingsLayout() {
  return (
    <div className="grid min-h-dvh content-start md:grid-cols-[300px_minmax(0,1fr)]">
      <nav
        aria-label="Sections des paramètres"
        className="sticky top-0 z-[6] flex [scrollbar-width:none] items-center overflow-x-auto border-b border-line bg-bg md:static md:block md:border-r md:border-b-0 md:pb-6"
      >
        <h1 className="hidden min-h-14 items-center px-5 text-title md:flex">Paramètres</h1>
        {SECTIONS.map((s) => (
          <NavLink
            key={s.to}
            to={s.to}
            className={({ isActive }) =>
              cx(
                'flex shrink-0 items-center gap-3 px-4 py-3 transition-colors hover:bg-hover md:px-5',
                isActive &&
                  'bg-hover shadow-[inset_0_-3px_0_var(--accent)] md:shadow-[inset_-3px_0_0_var(--accent)]',
                s.soon && 'opacity-55 max-md:hidden',
              )
            }
          >
            <s.icon aria-hidden size={22} strokeWidth={1.8} />
            <span className="min-w-0 flex-1">
              <b className="block font-semibold">{s.label}</b>
              <small className="hidden truncate text-caption text-text-3 md:block">{s.sub}</small>
            </span>
            {s.soon ? (
              <span className="hidden md:inline">
                <Tag>{s.soon}</Tag>
              </span>
            ) : (
              <ChevronRight aria-hidden size={18} className="hidden text-text-3 md:block" />
            )}
          </NavLink>
        ))}
        <SignOutRow />
      </nav>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

/** Se déconnecter (AUTH-03) : aussi ici, puisque la barre du bas des mobiles n'a pas ce bouton. */
function SignOutRow() {
  const { signOut, pending } = useSignOut();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={signOut}
      className="flex w-full shrink-0 items-center gap-3 px-4 py-3 text-left text-danger transition-colors hover:bg-hover disabled:opacity-50 max-md:w-auto md:mt-2 md:border-t md:border-line md:px-5 md:pt-4"
    >
      <LogOut aria-hidden size={22} strokeWidth={1.8} />
      <b className="font-semibold">Se déconnecter</b>
    </button>
  );
}

/** Une section des paramètres : en-tête (masqué sur petit écran, la barre suffit) et corps. */
export function SettingsSection({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <section aria-label={title}>
      <PageHead title={title} sub={sub} className="max-md:hidden" />
      <div className="flex max-w-[600px] flex-col gap-6 px-6 pt-5 pb-8 max-sm:p-4 [&>*+*]:border-t [&>*+*]:border-line [&>*+*]:pt-6">
        {children}
      </div>
    </section>
  );
}

/** Bloc titré à l'intérieur d'une section ; `onSubmit` en fait un formulaire. */
export function Block({
  title,
  desc,
  children,
  onSubmit,
}: {
  title?: string;
  desc?: ReactNode;
  children: ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const inner = (
    <>
      {title && <h2 className="text-card-title">{title}</h2>}
      {desc && <p className="-mt-2 text-sm leading-normal text-text-3">{desc}</p>}
      {children}
    </>
  );
  return onSubmit ? (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      {inner}
    </form>
  ) : (
    <div className="flex flex-col gap-4">{inner}</div>
  );
}
