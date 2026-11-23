import { Link } from 'react-router';

/** Logo : la marque « t » et le nom. */
export function Brand({
  className = '',
  nameClassName = '',
}: {
  className?: string;
  nameClassName?: string;
}) {
  return (
    <Link to="/" aria-label="transcendance, accueil" className={`items-center gap-3 ${className}`}>
      <span className="bg-text text-bg grid size-[30px] place-items-center rounded-sm text-[17px] font-extrabold tracking-[-0.04em]">
        t
      </span>
      <span className={`text-lg font-extrabold tracking-[-0.02em] ${nameClassName}`}>
        transcendance
      </span>
    </Link>
  );
}
