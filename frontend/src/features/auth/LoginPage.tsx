import { Clock } from 'lucide-react';
import { useCallback, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/design-system/Button';
import { useToast } from '@/design-system/feedback';
import { FormRow, Input } from '@/design-system/Field';
import { Alert } from '@/design-system/misc';
import { PasswordInput } from '@/design-system/Password';
import { api, ApiError } from '@/lib/api';
import { safeNext, useLogin } from '@/lib/session';
import { useCooldown, useCountdown } from '@/features/auth/hooks';
import {
  AuthCard,
  AuthFoot,
  AuthHead,
  Button42,
  DevNote,
  linkClass,
  Sep,
} from '@/features/auth/ui';

/** Ce que la page de connexion peut afficher en tête après une autre page. */
export type LoginState = { passwordReset?: boolean } | null;

type Failure =
  | { kind: 'invalid'; remaining: number | null }
  | { kind: 'locked'; until: number }
  | { kind: 'unverified'; email: string }
  | { kind: 'other'; message: string };

const DEFAULT_LOCK_S = 15 * 60;

/** Connexion (AUTH-02) : email ou nom d'utilisateur, blocage après 5 échecs. */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const resetDone = (location.state as LoginState)?.passwordReset;

  const login = useLogin();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [missing, setMissing] = useState<{ id?: boolean; pw?: boolean }>({});
  const [failure, setFailure] = useState<Failure | null>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  const unlock = useCallback(() => setFailure(null), []);
  const timer = useCountdown(failure?.kind === 'locked' ? failure.until : null, unlock);
  const isLocked = failure?.kind === 'locked';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const m = { id: !id.trim(), pw: !pw };
    setMissing(m);
    if (m.id || m.pw || isLocked) return;
    login.mutate(
      { login: id.trim(), password: pw },
      {
        onSuccess: () => navigate(next, { replace: true }),
        onError: (err) => {
          setPw('');
          if (!(err instanceof ApiError))
            return setFailure({ kind: 'other', message: err.message });
          if (err.code === 'too_many_attempts') {
            const s = Number(err.details.retry_after) || DEFAULT_LOCK_S;
            return setFailure({ kind: 'locked', until: Date.now() + s * 1000 });
          }
          if (err.code === 'email_not_verified')
            return setFailure({
              kind: 'unverified',
              email: String(err.details.email ?? (id.includes('@') ? id.trim() : '')),
            });
          if (err.code === 'invalid_credentials') {
            const r = Number(err.details.remaining_attempts);
            setFailure({ kind: 'invalid', remaining: Number.isFinite(r) ? r : null });
            return pwRef.current?.focus();
          }
          setFailure({ kind: 'other', message: err.message });
        },
      },
    );
  };

  return (
    <AuthCard label="Se connecter">
      <AuthHead title="Se connecter">Content de vous revoir.</AuthHead>

      {resetDone && !failure && (
        <Alert tone="success" title="Mot de passe modifié">
          Connectez-vous avec votre nouveau mot de passe.
        </Alert>
      )}
      {failure?.kind === 'invalid' && (
        <Alert tone="danger" title="Identifiants incorrects">
          Vérifiez votre email ou nom d’utilisateur et votre mot de passe.
          {failure.remaining !== null &&
            failure.remaining <= 2 &&
            ` Encore ${failure.remaining} essai${failure.remaining > 1 ? 's' : ''} avant un blocage de 15 minutes.`}
        </Alert>
      )}
      {failure?.kind === 'locked' && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-sm border border-danger/45 bg-danger/8 px-4 py-3 text-sm leading-[1.45] text-danger"
        >
          <Clock aria-hidden size={18} strokeWidth={1.8} className="mt-px shrink-0" />
          <div>
            <b className="block text-text">Trop de tentatives</b>
            <span className="text-text-2">
              La connexion est bloquée pendant{' '}
              <strong className="text-text tabular-nums">{timer}</strong>. Vous pouvez aussi{' '}
              <Link to="/forgot-password" className={linkClass}>
                réinitialiser votre mot de passe
              </Link>
              .
            </span>
          </div>
        </div>
      )}
      {failure?.kind === 'unverified' && <Unverified email={failure.email} />}
      {failure?.kind === 'other' && <Alert tone="danger" title={failure.message} />}

      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <FormRow
          label="Email ou nom d’utilisateur"
          htmlFor="login-id"
          error={missing.id ? 'Indiquez votre email ou votre nom d’utilisateur.' : null}
          errorId="login-id-err"
        >
          <Input
            id="login-id"
            autoComplete="username"
            autoFocus
            placeholder="vous@exemple.fr"
            spellCheck={false}
            autoCapitalize="none"
            value={id}
            error={missing.id}
            aria-describedby={missing.id ? 'login-id-err' : undefined}
            onChange={(e) => {
              setId(e.target.value);
              setMissing((m) => ({ ...m, id: false }));
            }}
          />
        </FormRow>
        <FormRow
          label="Mot de passe"
          htmlFor="login-pw"
          error={missing.pw ? 'Indiquez votre mot de passe.' : null}
          errorId="login-pw-err"
          aside={
            <Link to="/forgot-password" className={`text-caption ${linkClass}`}>
              Mot de passe oublié ?
            </Link>
          }
        >
          <PasswordInput
            id="login-pw"
            ref={pwRef}
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            value={pw}
            error={missing.pw || failure?.kind === 'invalid'}
            aria-describedby={missing.pw ? 'login-pw-err' : undefined}
            onChange={(v) => {
              setPw(v);
              setMissing((m) => ({ ...m, pw: false }));
            }}
          />
        </FormRow>
        <Button
          type="submit"
          size="lg"
          block
          className="mt-1"
          loading={login.isPending}
          disabled={isLocked}
        >
          Se connecter
        </Button>
      </form>

      <Sep>ou</Sep>
      <Button42>Continuer avec 42</Button42>
      <AuthFoot>
        Pas encore de compte ?{' '}
        <Link
          to={next === '/' ? '/signup' : `/signup?next=${encodeURIComponent(next)}`}
          className={linkClass}
        >
          S’inscrire
        </Link>
      </AuthFoot>
      <DevNote>
        <b className="text-text-2">aboumall</b> / <b className="text-text-2">transcendance</b> pour
        se connecter. <b className="text-text-2">nouveau@exemple.fr</b>, même mot de passe : email
        pas encore vérifié. 5 échecs bloquent la connexion 15 min (recharger remet à zéro).
      </DevNote>
    </AuthCard>
  );
}

/** Compte pas encore confirmé : l'email doit être vérifié avant d'utiliser le site. */
function Unverified({ email }: { email: string }) {
  const toast = useToast();
  const [left, start] = useCooldown();
  const [sending, setSending] = useState(false);
  const resend = async () => {
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
    <div className="flex flex-col gap-3">
      <Alert tone="info" title="Confirmez votre adresse email">
        Cliquez sur le lien que nous avons envoyé{email ? ` à ${email}` : ''} pour activer votre
        compte, puis reconnectez-vous.
      </Alert>
      {email && (
        <Button variant="outline" block onClick={resend} loading={sending} disabled={left > 0}>
          {left ? `Renvoyer l’email (${left} s)` : 'Renvoyer l’email'}
        </Button>
      )}
    </div>
  );
}
