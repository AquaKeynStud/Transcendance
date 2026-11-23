import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="flex flex-wrap gap-x-4 gap-y-1 border-t border-neutral-800 px-4 py-3 text-xs text-neutral-400">
      <Link to="/privacy" className="hover:text-neutral-100">
        Politique de confidentialité
      </Link>
      <Link to="/terms" className="hover:text-neutral-100">
        Conditions d’utilisation
      </Link>
      <Link to="/design-system" className="hover:text-neutral-100">
        Design system
      </Link>
      <span className="ml-auto">ft_transcendence · 2026</span>
    </footer>
  );
}
