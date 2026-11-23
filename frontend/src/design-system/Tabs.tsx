import { useRef, type KeyboardEvent } from 'react';
import { NavLink } from 'react-router';
import { cx } from '@/lib/cx';

const bar =
  'relative flex overflow-x-auto [scrollbar-width:none] after:pointer-events-none after:absolute after:inset-x-5 after:bottom-0 after:h-px after:bg-line';

const tab = (selected: boolean) =>
  cx(
    'relative grid h-13 flex-[1_0_auto] place-items-center px-4 text-[15px] whitespace-nowrap transition-colors duration-150 hover:bg-hover',
    selected
      ? 'font-bold text-text before:absolute before:bottom-0 before:left-1/2 before:z-[1] before:h-1 before:w-14 before:-translate-x-1/2 before:rounded-[4px] before:bg-accent'
      : 'font-medium text-text-3',
  );

export type TabItem<T extends string> = { id: T; label: string; count?: number };

/** Tabs (08) : onglets d'un même écran (role="tablist"), flèches gauche et droite. */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  idPrefix,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  idPrefix: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    onChange(items[next]!.id);
    refs.current[next]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className={bar}>
      {items.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${t.id}`}
          aria-controls={`${idPrefix}-panel`}
          aria-selected={t.id === value}
          tabIndex={t.id === value ? 0 : -1}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => onKey(e, i)}
          className={tab(t.id === value)}
        >
          <span>
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1.5 font-medium text-text-3">{t.count}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Onglets qui sont des liens (une URL par onglet) : fils Abonnements / Explorer, listes. */
export function TabLinks({
  items,
  label,
}: {
  items: { to: string; label: string; count?: number; end?: boolean }[];
  label: string;
}) {
  return (
    <nav aria-label={label} className={bar}>
      {items.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end ?? true}
          className={({ isActive }) => tab(isActive)}
        >
          <span>
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1.5 font-medium text-text-3">{t.count}</span>
            )}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
