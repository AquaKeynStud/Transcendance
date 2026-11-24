import { useMutation } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/design-system/Button';
import { useToast } from '@/design-system/feedback';
import { FormRow, Input } from '@/design-system/Field';
import { Checkbox } from '@/design-system/misc';
import { PasswordInput, PasswordRules } from '@/design-system/Password';
import { Spinner } from '@/design-system/Spinner';
import { api, ApiError } from '@/lib/api';
import { EMAIL_RE, newPasswordRules, USERNAME_RE } from '@/lib/password';
import { safeNext } from '@/lib/session';
import { useUsernameCheck } from '@/lib/useUsernameCheck';
import { AuthCard, AuthFoot, AuthHead, Button42, linkClass, Sep } from '@/features/auth/ui';

const USER_HELP = '3 à 20 caractères : lettres, chiffres et _';

/** Ce que la page de vérification reçoit après l'inscription. */
export type VerifyState = { email?: string } | null;

type Fields = 'email' | 'username' | 'password';

/** Inscription (AUTH-01) : bouton actif seulement quand tout est valide. */
export function SignupPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [terms, setTerms] = useState(false);
  // Un champ n'affiche son erreur qu'une fois quitté
  const [touched, setTouched] = useState<{ email?: boolean; username?: boolean; pw2?: boolean }>(
    {},
  );
  const [serverErr, setServerErr] = useState<Partial<Record<Fields, string>>>({});

  const register = useMutation({
    mutationFn: () =>
      api<{ email: string }>('/auth/register', {
        method: 'POST',
        body: { email: email.trim(), username, password: pw },
      }),
  });

  const emailOk = EMAIL_RE.test(email.trim());
  const userFormatOk = USERNAME_RE.test(username);
  const check = useUsernameCheck(username, userFormatOk);
  const rules = newPasswordRules(pw, [username, email.split('@')[0] ?? '']);
  const pwOk = rules.every((r) => r.ok);
  const match = !!pw2 && pw2 === pw;

  const user: { status: 'idle' | 'checking' | 'ok' | 'error'; msg: string } = serverErr.username
    ? { status: 'error', msg: serverErr.username }
    : !/^\w*$/.test(username)
      ? { status: 'error', msg: 'Seulement des lettres, des chiffres et _.' }
      : username.length < 3
        ? touched.username && username
          ? { status: 'error', msg: 'Au moins 3 caractères.' }
          : { status: 'idle', msg: USER_HELP }
        : check?.value !== username
          ? { status: 'checking', msg: 'Vérification…' }
          : check.available
            ? { status: 'ok', msg: `@${username} est disponible.` }
            : { status: 'error', msg: `@${username} est déjà pris.` };

  const emailErr =
    serverErr.email ??
    (touched.email && email && !emailOk ? 'Cette adresse email n’est pas valide.' : null);
  const pw2Err =
    touched.pw2 && pw2 && !match ? 'Les deux mots de passe ne correspondent pas.' : null;
  const ready = emailOk && !serverErr.email && user.status === 'ok' && pwOk && match && terms;

  const clearServer = (f: Fields) => setServerErr((e) => ({ ...e, [f]: undefined }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    register.mutate(undefined, {
      onSuccess: (r) =>
        navigate(
          next === '/' ? '/verify-email' : `/verify-email?next=${encodeURIComponent(next)}`,
          {
            state: { email: r.email } satisfies VerifyState,
          },
        ),
      onError: (err) => {
        if (err instanceof ApiError && Object.keys(err.fields).length)
          setServerErr({
            email: err.field('email') ?? undefined,
            username: err.field('username') ?? undefined,
            password: err.field('password') ?? undefined,
          });
        else toast(err.message, { type: 'error' });
      },
    });
  };

  return (
    <AuthCard label="Créer un compte">
      <AuthHead title="Créer un compte">Rejoignez la conversation en une minute.</AuthHead>
      <Button42>S’inscrire avec 42</Button42>
      <Sep>ou avec un email</Sep>

      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <FormRow label="Email" htmlFor="su-email" error={emailErr} errorId="su-email-err">
          <Input
            id="su-email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            value={email}
            ok={emailOk && !serverErr.email}
            error={!!emailErr}
            aria-describedby={emailErr ? 'su-email-err' : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              clearServer('email');
            }}
            onBlur={() => email && setTouched((t) => ({ ...t, email: true }))}
          />
        </FormRow>

        <FormRow
          label="Nom d’utilisateur"
          htmlFor="su-user"
          error={user.status === 'error' ? user.msg : null}
          errorId="su-user-help"
          help={
            <span id="su-user-help" className={user.status === 'ok' ? 'text-success' : undefined}>
              {user.msg}
            </span>
          }
        >
          <Input
            id="su-user"
            prefix="@"
            autoComplete="username"
            placeholder="pseudo"
            maxLength={20}
            spellCheck={false}
            autoCapitalize="none"
            value={username}
            ok={user.status === 'ok'}
            error={user.status === 'error'}
            aria-describedby="su-user-help"
            end={user.status === 'checking' ? <Spinner size="sm" /> : undefined}
            onChange={(e) => {
              setUsername(e.target.value.trim());
              clearServer('username');
            }}
            onBlur={() => username && setTouched((t) => ({ ...t, username: true }))}
          />
        </FormRow>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="su-pw" className="text-sm font-semibold text-text-2">
            Mot de passe
          </label>
          <PasswordInput
            id="su-pw"
            autoComplete="new-password"
            placeholder="8 caractères minimum"
            aria-describedby="su-rules"
            value={pw}
            error={!!serverErr.password}
            onChange={(v) => {
              setPw(v);
              clearServer('password');
            }}
          />
          <PasswordRules id="su-rules" rules={rules} />
          {serverErr.password && (
            <p role="alert" className="text-caption text-danger">
              {serverErr.password}
            </p>
          )}
        </div>

        <FormRow
          label="Confirmer le mot de passe"
          htmlFor="su-pw2"
          error={pw2Err}
          errorId="su-pw2-err"
        >
          <Input
            id="su-pw2"
            type="password"
            autoComplete="new-password"
            placeholder="Le même mot de passe"
            value={pw2}
            ok={match && pwOk}
            error={!!pw2Err}
            aria-describedby={pw2Err ? 'su-pw2-err' : undefined}
            onChange={(e) => setPw2(e.target.value)}
            onBlur={() => pw2 && setTouched((t) => ({ ...t, pw2: true }))}
          />
        </FormRow>

        <Checkbox id="su-terms" checked={terms} onChange={setTerms}>
          J’accepte les{' '}
          <Link to="/terms" target="_blank" className={linkClass}>
            conditions d’utilisation
          </Link>{' '}
          et la{' '}
          <Link to="/privacy" target="_blank" className={linkClass}>
            politique de confidentialité
          </Link>
          .
        </Checkbox>

        <Button
          type="submit"
          size="lg"
          block
          className="mt-1"
          disabled={!ready}
          loading={register.isPending}
        >
          Créer mon compte
        </Button>
      </form>

      <AuthFoot>
        Déjà un compte ?{' '}
        <Link
          to={next === '/' ? '/login' : `/login?next=${encodeURIComponent(next)}`}
          className={linkClass}
        >
          Se connecter
        </Link>
      </AuthFoot>
    </AuthCard>
  );
}
