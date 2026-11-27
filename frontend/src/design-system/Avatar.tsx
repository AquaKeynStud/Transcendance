import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
const px: Record<AvatarSize, number> = { xs: 28, sm: 34, md: 40, lg: 56, xl: 72, xxl: 96 };

/** Initiales du nom affiché (2 au plus), ou du nom d'utilisateur. Avatar par défaut (ACC-04). */
export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words[0]![0]! + words[1]![0]! : (words[0] ?? '?').slice(0, 1);
  return letters.toUpperCase();
}

/** Avatar (06) : photo ou initiales, point vert si en ligne (ACC-07). */
export function Avatar({
  name,
  src,
  size = 'md',
  online = false,
  className,
}: {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}) {
  const s = px[size];
  return (
    <span
      aria-hidden
      className={cx(
        'relative grid shrink-0 place-items-center rounded-full bg-avatar bg-cover bg-center leading-none font-bold tracking-[-0.03em] text-text',
        className,
      )}
      style={{
        width: s,
        height: s,
        fontSize: s * 0.4,
        backgroundImage: src ? `url(${src})` : undefined,
      }}
    >
      {!src && initials(name)}
      {online && (
        <span className="absolute right-0 bottom-0 size-[26%] rounded-full bg-success shadow-[0_0_0_2px_var(--bg)]" />
      )}
    </span>
  );
}

/** Badge (07) : pastille de compteur. */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-[5px] text-[11px] font-bold text-accent-ink shadow-[0_0_0_2px_var(--bg)]',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Badge « Privé » des comptes privés. */
export function PrivateBadge() {
  return (
    <span
      title="Compte privé"
      className="inline-flex h-[22px] items-center gap-1 rounded-full px-2 text-xs font-semibold text-text-2 shadow-[inset_0_0_0_1px_var(--line-strong)]"
    >
      <Lock aria-hidden size={12} strokeWidth={2.2} />
      Privé
    </span>
  );
}

/** Tag : petite étiquette grise (« Ami », « Vous suit », « S8 »). */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-5 items-center rounded-[4px] bg-surface px-1.5 text-xs font-semibold text-text-2">
      {children}
    </span>
  );
}
