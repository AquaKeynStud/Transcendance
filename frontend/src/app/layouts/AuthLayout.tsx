import { Outlet } from 'react-router';
import { Brand } from '@/app/layouts/Brand';
import { LegalLinks } from '@/app/layouts/LegalLinks';

/** Pages d'authentification : pas de navigation, contenu centré. */
export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="p-4">
        <Brand className="inline-flex" />
      </header>
      <main className="mx-auto w-full max-w-[420px] flex-1 px-4">
        <Outlet />
      </main>
      <LegalLinks className="justify-center py-4" />
    </div>
  );
}
