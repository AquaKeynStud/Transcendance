import { Link } from 'react-router';

/** Liens légaux (UI-01, UI-02) : dans la colonne de droite, sous le contenu quand elle est masquée. */
export function LegalLinks({ className = '' }: { className?: string }) {
  const link = 'hover:text-text hover:underline';
  return (
    <footer className={`flex flex-wrap gap-x-3 gap-y-1 px-2 text-caption text-text-3 ${className}`}>
      <Link to="/privacy" className={link}>
        Confidentialité
      </Link>
      <Link to="/terms" className={link}>
        Conditions d’utilisation
      </Link>
      <Link to="/design-system" className={link}>
        Design system
      </Link>
      <span>© 2026 transcendance</span>
    </footer>
  );
}
