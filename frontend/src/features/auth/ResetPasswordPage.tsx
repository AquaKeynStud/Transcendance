import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, KeyRound } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Button, buttonClass } from '@/design-system/Button';
import { useToast } from '@/design-system/feedback';
import { FormRow, Input } from '@/design-system/Field';
import { PasswordInput, PasswordRules } from '@/design-system/Password';
import { Spinner } from '@/design-system/Spinner';
import { api, ApiError } from '@/lib/api';
import { newPasswordRules } from '@/lib/password';
import { meKey } from '@/lib/session';
import type { LoginState } from '@/features/auth/LoginPage';
import { AuthCard, AuthHead } from '@/features/auth/ui';

const isExpired = (e: unknown) =>
  e instanceof ApiError && (e.code === 'token_expired' || e.code === 'invalid_token');

/** Nouveau mot de passe (AUTH-05), depuis le lien de l'email (`?token=`, valable 1 h). */
export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const info = useQuery({
    queryKey: ['password-reset', token],
    queryFn: () => api<{ username: string }>(`/auth/password-reset/${encodeURIComponent(token)}`),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });

  if (!token || (info.isError && isExpired(info.error))) return <Expired />;
  if (info.isPending)
    return (
      <AuthCard label="Chargement">
        <div className="flex justify-center py-6" role="status" aria-label="Chargement">
          <Spinner />
        </div>
      </AuthCard>
    );
  if (info.isError)
    return (
      <AuthCard label="Erreur">
        <AuthHead title="Une erreur est survenue">{info.error.message}</AuthHead>
        <Button size="lg" block onClick={() => void info.refetch()}>
          Réessayer
        </Button>
      </AuthCard>
    );
  return <ResetForm token={token} username={info.data.username} />;
}

function ResetForm({ token, username }: { token: string; username: string }) {
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [touched, setTouched] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const reset = useMutation({
    mutationFn: () =>
      api<void>(`/auth/password-reset/${encodeURIComponent(token)}`, {
        method: 'POST',
        body: { password: pw },
      }),
  });

  const rules = newPasswordRules(pw, [username]);
  const pwOk = rules.every((r) => r.ok);
  const match = !!pw2 && pw2 === pw;
  const pw2Err = touched && pw2 && !match ? 'Les deux mots de passe ne correspondent pas.' : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!pwOk || !match) return;
    reset.mutate(undefined, {
      onSuccess: () => {
        // Le backend ferme toutes les sessions du compte, celle-ci comprise
        qc.clear();
        qc.setQueryData(meKey, null);
        navigate('/login', { replace: true, state: { passwordReset: true } satisfies LoginState });
      },
      onError: (err) => {
        if (isExpired(err)) setExpired(true);
        else if (err instanceof ApiError && err.field('password'))
          setServerErr(err.field('password'));
        else toast(err.message, { type: 'error' });
      },
    });
  };

  if (expired) return <Expired />;

  return (
    <AuthCard label="Nouveau mot de passe">
      <AuthHead title="Nouveau mot de passe" icon={KeyRound}>
        Pour le compte <b className="text-text">@{username}</b>. Vous serez déconnecté de vos autres
        appareils.
      </AuthHead>
      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rs-pw" className="text-sm font-semibold text-text-2">
            Nouveau mot de passe
          </label>
          <PasswordInput
            id="rs-pw"
            autoComplete="new-password"
            autoFocus
            placeholder="8 caractères minimum"
            aria-describedby="rs-rules"
            value={pw}
            error={!!serverErr}
            onChange={(v) => {
              setPw(v);
              setServerErr(null);
            }}
          />
          <PasswordRules id="rs-rules" rules={rules} />
          {serverErr && (
            <p role="alert" className="text-caption text-danger">
              {serverErr}
            </p>
          )}
        </div>
        <FormRow
          label="Confirmer le mot de passe"
          htmlFor="rs-pw2"
          error={pw2Err}
          errorId="rs-pw2-err"
        >
          <Input
            id="rs-pw2"
            type="password"
            autoComplete="new-password"
            placeholder="Le même mot de passe"
            value={pw2}
            ok={match && pwOk}
            error={!!pw2Err}
            aria-describedby={pw2Err ? 'rs-pw2-err' : undefined}
            onChange={(e) => setPw2(e.target.value)}
            onBlur={() => pw2 && setTouched(true)}
          />
        </FormRow>
        <Button
          type="submit"
          size="lg"
          block
          className="mt-1"
          disabled={!pwOk || !match}
          loading={reset.isPending}
        >
          Enregistrer
        </Button>
      </form>
    </AuthCard>
  );
}

function Expired() {
  return (
    <AuthCard label="Lien expiré">
      <AuthHead title="Ce lien a expiré" icon={Clock} tone="ko">
        Les liens de réinitialisation sont valables 1 heure et ne servent qu’une fois. Demandez-en
        un nouveau.
      </AuthHead>
      <div className="flex flex-col gap-3">
        <Link to="/forgot-password" className={buttonClass({ size: 'lg', block: true })}>
          Demander un nouveau lien
        </Link>
        <Link to="/login" className={buttonClass({ variant: 'ghost', block: true })}>
          Retour à la connexion
        </Link>
      </div>
    </AuthCard>
  );
}
