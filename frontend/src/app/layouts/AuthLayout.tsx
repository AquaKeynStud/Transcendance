import { Link, Outlet } from 'react-router';
import { Footer } from '@/app/layouts/Footer';

/** Pages d'authentification : pas de navigation, contenu centré. */
export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="p-4">
        <Link to="/" className="text-lg font-semibold">
          Transcendance
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
