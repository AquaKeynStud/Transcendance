import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router';
import { Spinner } from '@/design-system/Spinner';
import { loginUrl, safeNext, useMe } from '@/lib/session';

function Loading() {
  return (
    <div className="grid min-h-60 place-items-center" role="status" aria-label="Chargement">
      <Spinner />
    </div>
  );
}

/** Pages réservées aux users connectés : un visiteur part vers la connexion, puis revient ici. */
export function RequireAuth() {
  const { data: me, isPending } = useMe();
  const { pathname, search } = useLocation();
  if (isPending) return <Loading />;
  if (!me) return <Navigate to={loginUrl(pathname + search)} replace />;
  return <Outlet />;
}

/** Connexion et inscription : un user déjà connecté part vers `?next=` ou le fil. */
export function GuestOnly() {
  const { data: me, isPending } = useMe();
  const [params] = useSearchParams();
  if (isPending) return <Loading />;
  if (me) return <Navigate to={safeNext(params.get('next'))} replace />;
  return <Outlet />;
}
