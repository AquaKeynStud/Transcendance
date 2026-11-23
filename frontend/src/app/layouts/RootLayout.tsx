import {
  Bell,
  Compass,
  Home,
  Mail,
  Search,
  Settings,
  Shield,
  User,
  type LucideIcon,
} from 'lucide-react';
import { NavLink, Outlet, ScrollRestoration } from 'react-router';
import { Footer } from '@/app/layouts/Footer';

const links: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/explore', label: 'Explorer', icon: Compass },
  { to: '/search', label: 'Recherche', icon: Search },
  { to: '/messages', label: 'Messages', icon: Mail },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/u/aboumall', label: 'Profil', icon: User },
  { to: '/settings', label: 'Paramètres', icon: Settings },
  { to: '/admin', label: 'Administration', icon: Shield },
];

/** Squelette des pages connectées : navigation, contenu, pied de page. */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <nav
        aria-label="Navigation principale"
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-neutral-800 p-2 md:sticky md:top-0 md:h-dvh md:w-56 md:flex-col md:border-r md:border-b-0 md:p-3"
      >
        <span className="hidden px-3 py-2 text-lg font-semibold md:block">Transcendance</span>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm whitespace-nowrap hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-neutral-100 ${
                isActive ? 'bg-neutral-800 font-semibold' : 'text-neutral-300'
              }`
            }
          >
            <Icon aria-hidden size={18} />
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/login"
          className="mt-auto hidden rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 md:block"
        >
          Se connecter
        </NavLink>
      </nav>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ScrollRestoration />
    </div>
  );
}
