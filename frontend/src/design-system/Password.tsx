import { Eye, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes, type Ref } from 'react';
import { IconButton } from '@/design-system/Button';
import { Input } from '@/design-system/Field';
import { cx } from '@/lib/cx';
import type { PasswordRule } from '@/lib/password';

type Props = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  ok?: boolean;
  ref?: Ref<HTMLInputElement>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'>;

/** Input (04) de mot de passe, avec le bouton pour l'afficher ou le masquer. */
export function PasswordInput({ id, value, onChange, ...rest }: Props) {
  const [shown, setShown] = useState(false);
  return (
    <Input
      id={id}
      type={shown ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      end={
        <IconButton
          label={shown ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          size="sm"
          onClick={() => setShown(!shown)}
          className="size-8"
        >
          {shown ? <EyeOff aria-hidden size={18} /> : <Eye aria-hidden size={18} />}
        </IconButton>
      }
      {...rest}
    />
  );
}

/** Règles du mot de passe, cochées pendant la saisie. */
export function PasswordRules({ id, rules }: { id: string; rules: PasswordRule[] }) {
  return (
    <ul
      id={id}
      aria-label="Règles du mot de passe"
      className="mt-0.5 grid grid-cols-2 gap-x-3 gap-y-1 text-caption text-text-3 max-sm:grid-cols-1"
    >
      {rules.map((r) => (
        <li key={r.label} className={cx('flex items-center gap-1.5', r.ok && 'text-text-2')}>
          <span
            aria-hidden
            className={cx(
              'shrink-0 rounded-full',
              r.ok
                ? 'grid size-3.5 place-items-center bg-success text-[9px] font-bold text-white'
                : 'mx-1 size-1.5 bg-line-strong',
            )}
          >
            {r.ok && '✓'}
          </span>
          {r.label}
          <span className="sr-only">{r.ok ? ' : respecté' : ' : pas encore'}</span>
        </li>
      ))}
    </ul>
  );
}
