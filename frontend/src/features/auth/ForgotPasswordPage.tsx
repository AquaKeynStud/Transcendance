import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Button, buttonClass } from '@/design-system/Button';
import { useToast } from '@/design-system/feedback';
import { FormRow, Input } from '@/design-system/Field';
import { api } from '@/lib/api';
import { EMAIL_RE } from '@/lib/password';
import { useCooldown } from '@/features/auth/hooks';
import { AuthCard, AuthFoot, AuthHead, DevNote, EmailOut, linkClass } from '@/features/auth/ui';

/**
 * Mot de passe oublié (AUTH-05). Le message d'envoi ne dit pas si un compte existe
 * pour cette adresse : la page ne permet pas de deviner qui est inscrit.
 */
export function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [left, start] = useCooldown();
  const send = useMutation({
    mutationFn: (to: string) =>
      api<void>('/auth/password-reset', { method: 'POST', body: { email: to } }),
    onSuccess: (_, to) => {
      setSentTo(to);
      start();
    },
    onError: (e) => toast(e.message, { type: 'error' }),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const to = email.trim();
    if (!EMAIL_RE.test(to)) return setInvalid(true);
    send.mutate(to);
  };

  if (sentTo)
    return (
      <AuthCard label="Regardez vos emails">
        <AuthHead title="Regardez vos emails" icon={Mail}>
          Si un compte existe pour <EmailOut>{sentTo}</EmailOut>, vous allez recevoir un lien de
          réinitialisation. Il est valable <b className="text-text">1 heure</b>.
        </AuthHead>
        <div className="flex flex-col gap-3">
          <Link to="/login" className={buttonClass({ size: 'lg', block: true })}>
            Retour à la connexion
          </Link>
          <Button
            variant="ghost"
            block
            disabled={left > 0}
            loading={send.isPending}
            onClick={() => send.mutate(sentTo, { onSuccess: () => toast('Lien renvoyé') })}
          >
            {left ? `Renvoyer le lien (${left} s)` : 'Renvoyer le lien'}
          </Button>
        </div>
        <DevNote>
          Le lien de l’email :{' '}
          <Link to="/reset-password?token=demo" className={linkClass}>
            lien valide
          </Link>{' '}
          ·{' '}
          <Link to="/reset-password?token=expired" className={linkClass}>
            lien expiré
          </Link>
        </DevNote>
      </AuthCard>
    );

  return (
    <AuthCard label="Mot de passe oublié">
      <AuthHead title="Mot de passe oublié" back={{ to: '/login', label: 'Retour à la connexion' }}>
        Indiquez l’email de votre compte. Nous vous enverrons un lien pour choisir un nouveau mot de
        passe.
      </AuthHead>
      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <FormRow
          label="Email"
          htmlFor="fg-email"
          error={invalid ? 'Cette adresse email n’est pas valide.' : null}
          errorId="fg-email-err"
        >
          <Input
            id="fg-email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="vous@exemple.fr"
            value={email}
            error={invalid}
            aria-describedby={invalid ? 'fg-email-err' : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              setInvalid(false);
            }}
          />
        </FormRow>
        <Button type="submit" size="lg" block className="mt-1" loading={send.isPending}>
          Envoyer le lien
        </Button>
      </form>
      <AuthFoot>
        <Link to="/login" className={linkClass}>
          Retour à la connexion
        </Link>
      </AuthFoot>
    </AuthCard>
  );
}
