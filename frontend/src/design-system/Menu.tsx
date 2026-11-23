import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '@/design-system/Button';
import { cx } from '@/lib/cx';

export type MenuItem =
  { icon: LucideIcon; label: string; onSelect: () => void; danger?: boolean } | '-';

/**
 * Dropdown (15) : bouton « … » et menu d'actions.
 * Flèches haut/bas, Échap rend le focus au bouton ; clic dehors, défilement et redimensionnement ferment.
 */
export function Menu({
  label,
  items,
  size = 'md',
  outline,
  className,
}: {
  label: string;
  items: MenuItem[];
  size?: 'sm' | 'md';
  outline?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();

  const close = (focus: boolean) => {
    setOpen(false);
    setPos(null);
    if (focus) btn.current?.focus({ preventScroll: true });
  };

  useLayoutEffect(() => {
    if (!open || !btn.current || !menu.current) return;
    const r = btn.current.getBoundingClientRect();
    const w = menu.current.offsetWidth;
    const h = menu.current.offsetHeight;
    const left = Math.min(Math.max(8, r.right - w), innerWidth - w - 8);
    const top = r.bottom + 4 + h > innerHeight - 8 ? r.top - h - 4 : r.bottom + 4;
    setPos({ left, top });
    menu.current.querySelector<HTMLButtonElement>('[role=menuitem]')?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menu.current?.contains(t) && !btn.current?.contains(t)) close(false);
    };
    const onScroll = () => close(false);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
    };
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    const all = [...(menu.current?.querySelectorAll<HTMLButtonElement>('[role=menuitem]') ?? [])];
    const i = all.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      all[(i + 1) % all.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      all[(i - 1 + all.length) % all.length]?.focus();
    } else if (e.key === 'Tab') close(false);
  };

  return (
    <>
      <IconButton
        ref={btn}
        label={label}
        size={size}
        outline={outline}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close(false) : setOpen(true))}
        className={className}
      >
        <MoreHorizontal aria-hidden size={18} strokeWidth={1.8} />
      </IconButton>
      {open &&
        createPortal(
          <div
            ref={menu}
            id={id}
            role="menu"
            aria-label={label}
            onKeyDown={onKey}
            style={{ left: pos?.left ?? -9999, top: pos?.top ?? 0 }}
            className="fixed z-[45] flex min-w-60 animate-fade flex-col rounded-sm border border-card-line bg-card py-1 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
          >
            {items.map((it, i) =>
              it === '-' ? (
                <hr key={i} className="mx-4 my-1 h-px border-0 bg-line" />
              ) : (
                <button
                  key={it.label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close(false);
                    it.onSelect();
                  }}
                  className={cx(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] font-semibold outline-none hover:bg-hover focus-visible:bg-hover',
                    it.danger ? 'text-danger' : 'text-text',
                  )}
                >
                  <it.icon aria-hidden size={18} strokeWidth={1.8} />
                  {it.label}
                </button>
              ),
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
