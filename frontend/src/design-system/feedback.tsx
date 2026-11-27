import { Check, Info, X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '@/design-system/Button';
import { Modal } from '@/design-system/Modal';
import { cx } from '@/lib/cx';

/* ---------------------------------------------------------------- Toast (13) */

type ToastType = 'success' | 'error' | 'info';
type ToastItem = { id: number; message: ReactNode; type: ToastType; undo?: () => void };
type ToastFn = (message: ReactNode, options?: { type?: ToastType; undo?: () => void }) => void;

/* ------------------------------------------------- Confirmation (14, danger) */

export type ConfirmOptions = {
  title: string;
  text?: ReactNode;
  ok: string;
  cancel?: string;
  danger?: boolean;
};
type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ToastContext = createContext<ToastFn | null>(null);
const ConfirmContext = createContext<ConfirmFn | null>(null);

function ToastView({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  const Icon = item.type === 'error' ? X : item.type === 'info' ? Info : Check;
  return (
    <div className="pointer-events-auto flex max-w-[min(440px,calc(100vw-32px))] animate-toast-in items-center gap-3 rounded-sm bg-accent py-2.5 pr-2 pl-4 text-sm font-semibold text-accent-ink">
      <span
        className={cx(
          'grid size-[22px] shrink-0 place-items-center rounded-full',
          item.type === 'success' && 'bg-success text-white',
          item.type === 'error' && 'bg-danger-fill text-white',
          item.type === 'info' && 'shadow-[inset_0_0_0_1.5px_currentColor]',
        )}
      >
        <Icon aria-hidden size={14} strokeWidth={2.6} />
      </span>
      <span className="flex-1">{item.message}</span>
      {item.undo && (
        <button
          type="button"
          className="px-2 py-1 font-bold underline underline-offset-3"
          onClick={() => {
            item.undo?.();
            onClose();
          }}
        >
          Annuler
        </button>
      )}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="grid size-7 place-items-center rounded-full opacity-70 hover:bg-accent-ink/12 hover:opacity-100"
      >
        <X aria-hidden size={14} />
      </button>
    </div>
  );
}

/** Fournit useToast() et useConfirm() à toute l'application. */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const seq = useRef(0);
  const toast = useCallback<ToastFn>((message, options = {}) => {
    const item = {
      id: ++seq.current,
      message,
      type: options.type ?? 'success',
      undo: options.undo,
    };
    setToasts((list) => [...list, item].slice(-3));
  }, []);
  const remove = useCallback((id: number) => setToasts((l) => l.filter((t) => t.id !== id)), []);

  const [pending, setPending] = useState<
    (ConfirmOptions & { resolve: (ok: boolean) => void }) | null
  >(null);
  const confirm = useCallback<ConfirmFn>(
    (options) => new Promise<boolean>((resolve) => setPending({ ...options, resolve })),
    [],
  );
  const answer = (ok: boolean) => {
    pending?.resolve(ok);
    setPending(null);
  };
  const textId = useId();

  return (
    <ToastContext.Provider value={toast}>
      <ConfirmContext.Provider value={confirm}>
        {children}
        <Modal
          open={!!pending}
          onClose={() => answer(false)}
          title={pending?.title ?? ''}
          role="alertdialog"
          hideClose
          describedBy={pending?.text ? textId : undefined}
        >
          {pending?.text && (
            <p id={textId} className="leading-normal text-text-2">
              {pending.text}
            </p>
          )}
          <div className="mt-1 flex flex-col gap-2">
            <Button
              size="lg"
              block
              variant={pending?.danger ? 'danger' : 'primary'}
              onClick={() => answer(true)}
              autoFocus
            >
              {pending?.ok}
            </Button>
            <Button size="lg" block variant="outline" onClick={() => answer(false)}>
              {pending?.cancel ?? 'Annuler'}
            </Button>
          </div>
        </Modal>
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-7 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2 max-sm:bottom-[72px]"
        >
          {toasts.map((t) => (
            <ToastView key={t.id} item={t} onClose={() => remove(t.id)} />
          ))}
        </div>
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast() doit être utilisé dans <FeedbackProvider>');
  return ctx;
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm() doit être utilisé dans <FeedbackProvider>');
  return ctx;
}

/** Valeur stable pour les tests et la page /design-system. */
export function useFeedback() {
  const toast = useToast();
  const confirm = useConfirm();
  return useMemo(() => ({ toast, confirm }), [toast, confirm]);
}
