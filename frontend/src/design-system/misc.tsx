import { AlertCircle, CheckCircle2, Info, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

/** EmptyState (16) : icône dans un cercle, titre, texte, action. */
export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('flex flex-col items-center gap-2 px-6 py-8 text-center', className)}>
      <span className="mb-2 grid size-14 place-items-center rounded-full border border-line-strong text-text-2">
        <Icon aria-hidden size={26} strokeWidth={1.8} />
      </span>
      <h3 className="text-title">{title}</h3>
      {children && <p className="max-w-[340px] text-sm leading-normal text-text-3">{children}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/** Switch (09). */
export function Switch({
  checked,
  onChange,
  label,
  labelledBy,
  describedBy,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50',
        checked ? 'bg-accent' : 'bg-line-strong',
      )}
    >
      <span
        className={cx(
          'absolute top-[3px] left-[3px] size-[18px] rounded-full transition-[transform,background-color] duration-200 ease-flat',
          checked ? 'translate-x-5 bg-accent-ink' : 'bg-white',
        )}
      />
    </button>
  );
}

/** Choix unique : liste de boutons radio séparés par une ligne. */
export function RadioGroup<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: { value: T; label: string; description?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col">
      {options.map((o, i) => (
        <label
          key={o.value}
          className={cx(
            'group relative flex cursor-pointer items-start gap-3 py-3 text-sm leading-[1.45] text-text-2',
            i > 0 && 'border-t border-line',
          )}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="peer pointer-events-none absolute opacity-0"
          />
          <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full border border-line-strong transition-colors duration-150 group-hover:border-text-2 peer-checked:border-2 peer-checked:border-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent after:size-2.5 after:scale-0 after:rounded-full after:bg-accent after:transition-transform after:duration-150 peer-checked:after:scale-100" />
          <span>
            <b className="block text-[15px] font-semibold text-text">{o.label}</b>
            {o.description}
          </span>
        </label>
      ))}
    </div>
  );
}

/** Alerte en ligne : erreur, succès ou information. */
export function Alert({
  tone,
  title,
  children,
}: {
  tone: 'danger' | 'success' | 'info';
  title: string;
  children?: ReactNode;
}) {
  const Icon = tone === 'danger' ? AlertCircle : tone === 'success' ? CheckCircle2 : Info;
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cx(
        'flex items-start gap-3 rounded-sm border px-4 py-3 text-sm leading-[1.45]',
        tone === 'danger' && 'border-danger/45 bg-danger/8 text-danger',
        tone === 'success' && 'border-success/45 bg-success/8 text-success',
        tone === 'info' && 'border-line-strong text-text-2',
      )}
    >
      <Icon aria-hidden size={18} strokeWidth={1.8} className="mt-px shrink-0" />
      <div>
        <b className="block text-text">{title}</b>
        {children && <span className="text-text-2">{children}</span>}
      </div>
    </div>
  );
}

/** Note grise en tête de liste (icône + texte). */
export function ListNote({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 px-5 py-3 text-sm text-text-3">
      <Icon aria-hidden size={18} strokeWidth={1.8} className="shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/** Tuile (01) : carte de la colonne de droite. */
export function Tile({
  title,
  children,
  flush,
  className,
}: {
  title?: string;
  children: ReactNode;
  flush?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cx(
        'flex flex-col rounded-md border border-card-line bg-card',
        flush ? 'overflow-hidden' : 'gap-3 p-4',
        className,
      )}
    >
      {title && <h2 className={cx('text-post-title', flush && 'px-4 pt-4 pb-2')}>{title}</h2>}
      {children}
    </section>
  );
}
