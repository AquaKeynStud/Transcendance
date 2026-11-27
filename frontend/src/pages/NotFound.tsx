import { Link } from 'react-router';
import { PageHead } from '@/design-system/PageHead';

export function NotFound() {
  return (
    <>
      <PageHead title="Page introuvable" />
      <section className="px-5 py-16 text-center">
        <p className="text-caption font-semibold text-text-3">Erreur 404</p>
        <h2 className="mt-2 text-display">Cette page n’existe pas</h2>
        <p className="mt-3 text-post text-text-2">
          Le lien est peut-être cassé, ou le contenu a été supprimé.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-9 items-center rounded-full bg-accent px-4 font-bold text-accent-ink transition-opacity duration-150 hover:opacity-90"
        >
          Retour à l’accueil
        </Link>
      </section>
    </>
  );
}
