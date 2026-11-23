import { Link } from 'react-router';
import { PageHead } from '@/app/layouts/PageHead';

export function NotFound() {
  return (
    <>
      <PageHead title="Page introuvable" />
      <section className="px-5 py-16 text-center">
        <p className="text-caption text-text-3 font-semibold">Erreur 404</p>
        <h2 className="text-display mt-2">Cette page n’existe pas</h2>
        <p className="text-post text-text-2 mt-3">
          Le lien est peut-être cassé, ou le contenu a été supprimé.
        </p>
        <Link
          to="/"
          className="bg-accent text-accent-ink mt-6 inline-flex h-9 items-center rounded-full px-4 font-bold transition-opacity duration-150 hover:opacity-90"
        >
          Retour à l’accueil
        </Link>
      </section>
    </>
  );
}
