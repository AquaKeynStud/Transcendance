import {
  Bell,
  Compass,
  House,
  LayoutGrid,
  LogIn,
  Mail,
  Moon,
  Search,
  Settings,
  Shield,
  User,
  type LucideIcon,
} from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { Brand } from '@/app/layouts/Brand';
import { useTheme } from '@/design-system/theme';

type Item = { to: string; label: string; icon: LucideIcon; end?: boolean; className?: string };

const primary: Item[] = [
  { to: '/', label: 'Accueil', icon: House, end: true },
  { to: '/explore', label: 'Explorer', icon: Compass },
  // Sans colonne de droite (< 1021 px), la recherche passe dans la nav.
  { to: '/search', label: 'Recherche', icon: Search, className: 'md:hidden' },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/messages', label: 'Messages', icon: Mail },
  { to: '/u/aboumall', label: 'Profil', icon: User },
];

const secondary: Item[] = [
  { to: '/design-system', label: 'Design system', icon: LayoutGrid },
  { to: '/admin', label: 'Administration', icon: Shield },
  { to: '/settings', label: 'Paramètres', icon: Settings },
];

function NavItem({ to, label, icon: Icon, end, className = '' }: Item) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      className={({ isActive }) =>
        `text-nav ease-flat hover:bg-hover relative flex w-fit items-center gap-4 rounded-full p-3 transition-colors duration-150 lg:py-2.5 lg:pr-5 lg:pl-3 ${
          isActive ? 'font-bold' : ''
        } ${className}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon aria-hidden size={26} strokeWidth={isActive ? 2.4 : 1.8} />
          <span className="hidden lg:inline">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function ThemeSwitch() {
  const [theme, setTheme] = useTheme();
  const dark = theme === 'dark';
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2">
      <span className="text-text-3 hidden items-center gap-2 text-sm lg:inline-flex">
        <Moon aria-hidden size={18} strokeWidth={1.8} />
        Thème sombre
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Thème sombre"
        onClick={() => setTheme(dark ? 'light' : 'dark')}
        className={`ease-flat relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ${
          dark ? 'bg-accent' : 'bg-line-strong'
        }`}
      >
        <span
          className={`bg-bg ease-flat absolute top-0.5 left-0.5 size-5 rounded-full transition-transform duration-200 ${
            dark ? 'translate-x-4' : ''
          }`}
        />
      </button>
    </div>
  );
}

/** Nav gauche (composant 22) : colonne à gauche dès 721 px, barre en bas de l'écran en dessous. */
export function Sidebar() {
  return (
    <aside
      aria-label="Navigation principale"
      className="border-line bg-bg fixed inset-x-0 bottom-0 z-20 flex h-14 border-t sm:sticky sm:top-0 sm:col-start-1 sm:row-start-1 sm:h-dvh sm:flex-col sm:items-center sm:gap-1 sm:border-t-0 sm:border-r sm:px-2 sm:py-3 lg:items-stretch lg:pr-4 lg:pl-3"
    >
      <Brand className="mb-2 hidden rounded-full p-3 sm:flex" nameClassName="hidden lg:inline" />

      <nav className="flex w-full justify-around sm:w-auto sm:flex-col sm:gap-0.5">
        {primary.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
      <div className="bg-line m-3 hidden h-px lg:block" />
      <nav aria-label="Navigation secondaire" className="hidden flex-col gap-0.5 sm:flex">
        {secondary.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="mt-auto hidden flex-col gap-2 sm:flex">
        <ThemeSwitch />
        <Link
          to="/login"
          aria-label="Se connecter"
          className="bg-accent text-accent-ink inline-flex h-13 items-center justify-center gap-2 rounded-full text-[17px] font-bold transition-opacity duration-150 hover:opacity-90 max-lg:w-13 lg:px-4"
        >
          <LogIn aria-hidden size={20} strokeWidth={1.8} />
          <span className="hidden lg:inline">Se connecter</span>
        </Link>
      </div>
    </aside>
  );
}
