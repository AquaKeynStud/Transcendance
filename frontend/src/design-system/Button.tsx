import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@/lib/cx';
import { Spinner } from '@/design-system/Spinner';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full border border-transparent font-bold whitespace-nowrap transition-[background-color,opacity,color,border-color] duration-150 ease-flat disabled:cursor-default';

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3.5 text-sm',
  md: 'h-9 px-4 text-[15px]',
  lg: 'h-13 px-4 text-[17px]',
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-ink hover:opacity-90 disabled:opacity-40',
  outline:
    'border-line-strong bg-transparent text-text hover:bg-hover disabled:opacity-50 disabled:hover:bg-transparent',
  ghost:
    'bg-transparent text-text hover:bg-hover disabled:opacity-50 disabled:hover:bg-transparent',
  danger: 'bg-danger-fill text-white hover:opacity-90 disabled:opacity-50',
};

/** Classes du bouton (02), aussi pour un <Link> qui a l'apparence d'un bouton. */
export function buttonClass({
  variant = 'primary',
  size = 'md',
  block = false,
}: { variant?: ButtonVariant; size?: ButtonSize; block?: boolean } = {}) {
  return cx(base, sizes[size], variants[variant], block && 'w-full');
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Affiche un Spinner et désactive le bouton. */
  loading?: boolean;
  icon?: ReactNode;
};

/** Button (02) : principal, contour, discret, danger. */
export function Button({
  variant,
  size,
  block,
  loading,
  icon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(buttonClass({ variant, size, block }), className)}
      {...rest}
    >
      {loading ? <Spinner size="sm" inverted={variant === 'primary' || !variant} /> : icon}
      {children}
    </button>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Obligatoire : une icône seule a toujours un libellé (§4.5). */
  label: string;
  size?: 'sm' | 'md';
  outline?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

/** IconButton (03) : bouton rond avec une icône seule. */
export function IconButton({
  label,
  size = 'md',
  outline,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={rest.title ?? label}
      className={cx(
        'inline-grid shrink-0 place-items-center rounded-full transition-colors duration-150 ease-flat hover:bg-hover hover:text-text disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent',
        size === 'md' ? 'size-9' : 'size-7',
        outline ? 'border border-line-strong text-text' : 'text-text-2',
        className,
      )}
      {...rest}
    />
  );
}
