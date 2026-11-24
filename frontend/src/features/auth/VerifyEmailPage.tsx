import { useQuery } from '@tanstack/react-query';
import { Check, Clock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';
import { Button, buttonClass } from '@/design-system/Button';
import { useToast } from '@/design-system/feedback';
import { Spinner } from '@/design-system/Spinner';
import { api, ApiError } from '@/lib/api';
import { safeNext } from '@/lib/session';
import type { VerifyState } from '@/features/auth/SignupPage';
import { useCooldown } from '@/features/auth/hooks';
import { AuthCard, AuthHead, DevNote, EmailOut, linkClass } from '@/features/auth/ui';

/**
 * Vérification de l'email (AUTH-04). Sans jeton : « regardez vos emails » après l'inscription.
 * Avec `?token=` (le lien de l'email) : confirmation du compte.
 */
export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  return token ? <Confirm token={token} next={safeNext(params.get('next'))} /> : <Pending />;
}

function Pending() {
  const toast = useToast();
  const email = (useLocation().state as VerifyState)?.email;
  const [left, start] = useCooldown();
  const [sending, setSending] = useState(false);

  const resend = async () => {
    if (!email) return;
    setSending(true);
    try {
      await api<void>('/auth/verify-email/resend', { method: 'POST', body: { email } });
      start();
      toast('Email de confirmation renvoyé');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Envoi impossible', { type: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthCard label="Vérifiez votre email">
      <AuthHead title="Vérifiez votre email" icon={Mail}>
        Nous avons envoyé un lien de confirmation{' '}
        {email ? (
          <>
            à <EmailOut>{email}</EmailOut>
          </>
        ) : (
          'à votre adresse'
        )}
        . Cliquez dessus pour activer votre compte.
      </AuthHead>
      <div className="flex flex-col gap-3">
        {email ? (
          <Button
            variant="outline"
            size="lg"
            block
            onClick={resend}
            loading={sending}
            disabled={left > 0}
          >
            {left ? `Renvoyer l’email (${left} s)` : 'Renvoyer l’email'}
          </Button>
        ) : (
          <Link
            to="/login"
            className={buttonClass({ variant: 'outline', size: 'lg', block: true })}
          >
            Se connecter
          </Link>
        )}
        <Link to="/signup" className={buttonClass({ variant: 'ghost', block: true })}>
          Modifier l’adresse email
        </Link>
      </div>
      <p className="text-caption leading-normal text-text-3">
        Rien reçu ? Regardez dans vos courriers indésirables. Vous pourrez utiliser le site une fois
        votre adresse confirmée.
      </p>
      <DevNote>
        Le lien de l’email :{' '}
        <Link to="/verify-email?token=demo" className={linkClass}>
          lien valide
        </Link>{' '}
        ·{' '}
        <Link to="/verify-email?token=expired" className={linkClass}>
          lien expiré
        </Link>
      </DevNote>
    </AuthCard>
  );
}

function Confirm({ token, next }: { token: string; next: string }) {
  const verify = useQuery({
    queryKey: ['verify-email', token],
    queryFn: () =>
      api<{ username: string | null }>('/auth/verify-email', { method: 'POST', body: { token } }),
    retry: false,
    staleTime: Infinity,
  });
  const loginTo = next === '/' ? '/login' : `/login?next=${encodeURIComponent(next)}`;

  if (verify.isPending)
    return (
      <AuthCard label="Vérification en cours">
        <div className="flex items-center justify-center gap-3 py-6 text-text-2" role="status">
          <Spinner /> Vérification de votre adresse…
        </div>
      </AuthCard>
    );

  if (verify.isError) {
    const expired = verify.error instanceof ApiError && verify.error.code === 'token_expired';
    return (
      <AuthCard label={expired ? 'Lien expiré' : 'Lien invalide'}>
        <AuthHead
          title={expired ? 'Ce lien a expiré' : 'Ce lien n’est pas valide'}
          icon={Clock}
          tone="ko"
        >
          {expired
            ? 'Les liens de confirmation ne durent pas : connectez-vous pour en recevoir un nouveau.'
            : 'Il a peut-être déjà servi. Connectez-vous : si l’adresse n’est pas encore confirmée, vous pourrez renvoyer l’email.'}
        </AuthHead>
        <Link to={loginTo} className={buttonClass({ size: 'lg', block: true })}>
          Se connecter
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard label="Email vérifié">
      <AuthHead title="Email vérifié" icon={Check} tone="ok">
        Votre compte est actif. Bienvenue sur transcendance !
      </AuthHead>
      <Link to={loginTo} className={buttonClass({ size: 'lg', block: true })}>
        Se connecter
      </Link>
    </AuthCard>
  );
}
