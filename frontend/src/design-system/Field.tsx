import { Check } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';

type FieldState = { error?: boolean; ok?: boolean; disabled?: boolean };

const shell = ({ error, ok, disabled }: FieldState) =>
  cx(
    'flex min-h-11 items-center gap-2 rounded-sm border bg-transparent pr-2 pl-4 text-text-3 transition-colors duration-150',
    error ? 'border-danger' : 'border-line-strong focus-within:border-text',
    ok && !error && 'focus-within:border-text',
    disabled && 'opacity-60',
  );

const control =
  'min-w-0 flex-1 self-stretch border-0 bg-transparent text-text outline-none placeholder:text-text-3';

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  FieldState & {
    /** Texte avant la saisie, ex. « @ ». */
    prefix?: string;
    /** Contenu à droite : bouton, spinner… */
    end?: ReactNode;
    wrapperClassName?: string;
  };

/** Input (04) : champ à bord gris, bord du texte au focus, rouge en erreur, coche verte si valide. */
export function Input({
  error,
  ok,
  prefix,
  end,
  className,
  wrapperClassName,
  ...rest
}: InputProps) {
  return (
    <div className={cx(shell({ error, ok, disabled: rest.disabled }), wrapperClassName)}>
      {prefix && <span className="-mr-1.5 text-text-3">{prefix}</span>}
      <input aria-invalid={error || undefined} className={cx(control, className)} {...rest} />
      {end}
      {ok && !error && <Check aria-hidden size={18} className="mr-1.5 text-success" />}
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldState & { wrapperClassName?: string };

/** Textarea (05). */
export function Textarea({ error, className, wrapperClassName, ...rest }: TextareaProps) {
  return (
    <div className={cx(shell({ error, disabled: rest.disabled }), wrapperClassName)}>
      <textarea
        aria-invalid={error || undefined}
        className={cx(control, 'resize-none py-2.5 leading-normal', className)}
        {...rest}
      />
    </div>
  );
}

/** Compteur de caractères : orange près de la limite, rouge au-delà. */
export function Counter({
  value,
  max,
  warnAt,
  always = true,
  className,
}: {
  value: number;
  max: number;
  warnAt?: number;
  always?: boolean;
  className?: string;
}) {
  const warn = warnAt ?? Math.floor(max * 0.9);
  if (!always && value < warn) return null;
  return (
    <span
      className={cx(
        'text-caption tabular-nums',
        value > max ? 'font-bold text-danger' : value >= warn ? 'text-warning' : 'text-text-3',
        className,
      )}
    >
      {value} / {max}
    </span>
  );
}

/** Ligne de formulaire : libellé (avec compteur ou lien à droite), champ, aide ou erreur. */
export function FormRow({
  label,
  htmlFor,
  aside,
  help,
  error,
  children,
  errorId,
}: {
  label: string;
  htmlFor: string;
  aside?: ReactNode;
  help?: ReactNode;
  error?: string | null;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-text-2">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={errorId} className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : (
        help && <p className="text-caption text-text-3">{help}</p>
      )}
    </div>
  );
}
