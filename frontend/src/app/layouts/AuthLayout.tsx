import { Link, Outlet } from 'react-router';
import { Brand } from '@/app/layouts/Brand';
import { LegalLinks } from '@/app/layouts/LegalLinks';
import { Switch } from '@/design-system/misc';
import { useTheme } from '@/design-system/theme';

/** Pages d'authentification : logo, « Explorer sans compte », thème ; une carte de 420 px centrée. */
export function AuthLayout() {
  const [theme, setTheme] = useTheme();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-4 px-6 py-4 max-sm:px-4 max-sm:py-3">
        <Brand className="inline-flex" nameClassName="max-sm:hidden" />
        <div className="ml-auto flex items-center gap-4">
          <Link
            to="/explore"
            className="inline-flex h-9 items-center rounded-full px-4 font-semibold text-text-2 transition-colors hover:bg-hover hover:text-text"
          >
            Explorer sans compte
          </Link>
          <Switch
            label="Thème sombre"
            checked={theme === 'dark'}
            onChange={(dark) => setTheme(dark ? 'dark' : 'light')}
          />
        </div>
      </header>
      <main className="grid flex-1 place-items-center px-4 pt-6 pb-8 max-sm:place-items-start max-sm:px-4 max-sm:pt-2">
        <div className="w-full max-w-[420px]">
          <Outlet />
        </div>
      </main>
      <LegalLinks className="justify-center py-4" />
    </div>
  );
}
