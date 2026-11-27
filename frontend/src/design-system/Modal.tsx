import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { IconButton } from '@/design-system/Button';
import { cx } from '@/lib/cx';

type Props = {
  open: boolean;
  /** Appelé par Échap, le clic dehors et ×. Le parent décide de fermer (ex. demander avant d'abandonner un brouillon). */
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'md' | 'lg';
  /** alertdialog pour une confirmation. */
  role?: 'dialog' | 'alertdialog';
  hideClose?: boolean;
  describedBy?: string;
  className?: string;
};

/**
 * Modal (14) sur <dialog> natif : focus gardé dedans, Échap, retour du focus à l'ouverture,
 * couche au-dessus de tout (on peut empiler une confirmation sur la fenêtre de rédaction).
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  role = 'dialog',
  hideClose,
  describedBy,
  className,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const downOnBackdrop = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      role={role}
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onMouseDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (downOnBackdrop.current && e.target === e.currentTarget) onClose();
        downOnBackdrop.current = false;
      }}
      className={cx(
        'm-auto w-[calc(100%-32px)] rounded-md border border-card-line bg-card p-0 text-text backdrop:animate-fade backdrop:bg-overlay open:animate-pop',
        size === 'md' ? 'max-w-[400px]' : 'max-w-[600px]',
      )}
    >
      {open && (
        <div className={cx('flex flex-col gap-4 p-6 max-sm:p-5', className)}>
          <div className="-mt-2 -mr-2 flex items-center gap-3">
            <h2 id={titleId} className="flex-1 text-[19px]">
              {title}
            </h2>
            {!hideClose && (
              <IconButton label="Fermer" onClick={onClose}>
                <X aria-hidden size={22} strokeWidth={1.8} />
              </IconButton>
            )}
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
