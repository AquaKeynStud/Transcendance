import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { IconButton } from '@/design-system/Button';
import { cx } from '@/lib/cx';

/**
 * En-tête de page collant : retour, titre, sous-titre, actions à droite.
 * Ligne du bas à 20 px des bords (§4.3), absente avec `flush` (des onglets suivent).
 */
export function PageHead({
  title,
  sub,
  end,
  back,
  flush,
  className,
}: {
  title: string;
  sub?: ReactNode;
  end?: ReactNode;
  /** Affiche la flèche de retour ; une URL, ou true pour revenir à la page précédente. */
  back?: string | true;
  flush?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <header
      className={cx(
        'sticky top-0 z-10 flex min-h-14 items-center gap-4 bg-bg/92 px-4 py-1 backdrop-blur-[8px]',
        !flush && 'after:absolute after:inset-x-5 after:bottom-0 after:h-px after:bg-line',
        className,
      )}
    >
      {back && (
        <IconButton
          label="Retour"
          className="text-text"
          onClick={() =>
            back === true ? (history.length > 1 ? navigate(-1) : navigate('/')) : navigate(back)
          }
        >
          <ArrowLeft aria-hidden size={22} strokeWidth={1.8} />
        </IconButton>
      )}
      <div className="min-w-0 flex-1 leading-tight">
        <h1 className="truncate text-title">{title}</h1>
        {sub && <p className="text-caption text-text-3">{sub}</p>}
      </div>
      {end && <div className="flex gap-2">{end}</div>}
    </header>
  );
}
