import { cx } from '@/lib/cx';

/** Spinner (11). `inverted` : posé sur un bouton principal. */
export function Spinner({
  size = 'md',
  inverted = false,
  label,
}: {
  size?: 'sm' | 'md';
  inverted?: boolean;
  label?: string;
}) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx(
        'inline-block shrink-0 animate-spin rounded-full',
        size === 'sm' ? 'size-4 border-2' : 'size-[22px] border-[2.5px]',
        inverted ? 'border-accent-ink/30 border-t-accent-ink' : 'border-line-strong border-t-text',
      )}
    />
  );
}

/** Skeleton (11) : bloc qui scintille pendant le chargement. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        'block animate-shimmer rounded-[6px] bg-[linear-gradient(90deg,var(--line)_0%,color-mix(in_srgb,var(--line-strong)_55%,var(--line))_40%,var(--line)_80%)] bg-size-[300%_100%]',
        className,
      )}
    />
  );
}

/** Squelette d'un post, pour le premier chargement d'un fil. */
export function PostSkeleton() {
  return (
    <div className="flex gap-3 px-5 py-4" aria-hidden>
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2.5 pt-1">
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-[95%]" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

/** ProgressBar (10). */
export function ProgressBar({
  value,
  label,
  error,
  onMedia,
}: {
  value: number;
  label: string;
  error?: boolean;
  /** Posée sur une image : barre blanche sur fond translucide. */
  onMedia?: boolean;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx('h-1 overflow-hidden rounded-full', onMedia ? 'bg-white/35' : 'bg-line')}
    >
      <i
        className={cx(
          'block h-full rounded-[inherit] transition-[width] duration-150 ease-linear',
          error ? 'bg-danger' : onMedia ? 'bg-white' : 'bg-accent',
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
