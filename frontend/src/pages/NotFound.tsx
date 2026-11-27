import { Link } from 'react-router';

export function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-sm font-medium text-neutral-400">Erreur 404</p>
      <h1 className="mt-2 text-2xl font-semibold">Cette page n’existe pas</h1>
      <p className="mt-3 text-neutral-400">
        Le lien est peut-être cassé, ou le contenu a été supprimé.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-neutral-100 px-4 py-2 font-medium text-neutral-900"
      >
        Retour à l’accueil
      </Link>
    </section>
  );
}
