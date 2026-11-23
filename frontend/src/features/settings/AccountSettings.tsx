import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/design-system/Button';
import { useConfirm, useToast } from '@/design-system/feedback';
import { FormRow, Input } from '@/design-system/Field';
import { Alert } from '@/design-system/misc';
import { Spinner } from '@/design-system/Spinner';
import { api, ApiError } from '@/lib/api';
import { useMe } from '@/lib/session';
import { Block, SettingsSection } from '@/features/settings/SettingsLayout';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_HELP = '3 à 20 caractères : lettres, chiffres et _';

function EmailBlock({ current }: { current: string }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const send = useMutation({
    mutationFn: () =>
      api<void>('/me/email', { method: 'POST', body: { email: email.trim(), password } }),
  });

  const reset = () => {
    setOpen(false);
    setEmail('');
    setPassword('');
    setErrors({});
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = email.trim();
    const errs = {
      email: !n
        ? 'Indiquez la nouvelle adresse.'
        : !EMAIL.test(n)
          ? 'Cette adresse n’est pas valide.'
          : null,
      password: !password ? 'Indiquez votre mot de passe.' : null,
    };
    setErrors(errs);
    if (errs.email || errs.password) return;
    send.mutate(undefined, {
      onSuccess: () => {
        setSentTo(n);
        reset();
        toast('Lien de confirmation envoyé');
      },
      onError: (err) =>
        err instanceof ApiError
          ? setErrors({ email: err.field('email'), password: err.field('password') })
          : toast(err.message, { type: 'error' }),
    });
  };

  return (
    <Block title="Adresse email">
      <div className="flex items-center gap-3 rounded-sm border border-card-line bg-card px-4 py-3">
        <Mail aria-hidden size={22} strokeWidth={1.8} />
        <div className="min-w-0 flex-1">
          <small className="block text-caption text-text-3">Adresse actuelle</small>
          <b className="font-semibold [overflow-wrap:anywhere]">{current}</b>
        </div>
        {!open && (
          <Button variant="outline" size="sm" onClick={() => (setOpen(true), setSentTo(null))}>
            Modifier
          </Button>
        )}
      </div>
      {sentTo && (
        <Alert tone="success" title="Confirmez votre nouvelle adresse">
          Nous avons envoyé un lien à <b className="inline">{sentTo}</b>. L’adresse change quand
          vous cliquez dessus. D’ici là, l’ancienne reste active.
        </Alert>
      )}
      {open && (
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <FormRow label="Nouvelle adresse" htmlFor="e-new" error={errors.email}>
            <Input
              id="e-new"
              type="email"
              autoFocus
              autoComplete="email"
              placeholder="vous@exemple.fr"
              value={email}
              error={!!errors.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormRow>
          <FormRow label="Mot de passe actuel" htmlFor="e-pw" error={errors.password}>
            <Input
              id="e-pw"
              type="password"
              autoComplete="current-password"
              placeholder="Pour confirmer que c’est bien vous"
              value={password}
              error={!!errors.password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormRow>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={reset}>
              Annuler
            </Button>
            <Button type="submit" loading={send.isPending}>
              Envoyer le lien de confirmation
            </Button>
          </div>
        </form>
      )}
    </Block>
  );
}

function UsernameBlock({ current }: { current: string }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [value, setValue] = useState(current);
  const [saved, setSaved] = useState(current);
  // Réponse du serveur pour un nom donné, et erreur d'enregistrement
  const [check, setCheck] = useState<{ value: string; available: boolean } | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: (username: string) => api('/me/username', { method: 'PATCH', body: { username } }),
  });

  const valid = /^\w{3,20}$/.test(value);
  const toCheck = valid && value !== saved;

  // Disponibilité vérifiée 500 ms après la dernière frappe
  useEffect(() => {
    if (!toCheck) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      api<{ available: boolean }>(`/usernames/${value}`, { signal: ctrl.signal })
        .then((r) => setCheck({ value, available: r.available }))
        .catch(() => undefined);
    }, 500);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value, toCheck]);

  const state: { status: 'idle' | 'checking' | 'ok' | 'error'; msg: string } = saveErr
    ? { status: 'error', msg: saveErr }
    : value === saved
      ? { status: 'idle', msg: USER_HELP }
      : !/^\w*$/.test(value)
        ? { status: 'error', msg: 'Seulement des lettres, des chiffres et _' }
        : value.length < 3
          ? {
              status: 'idle',
              msg: value.length
                ? `Encore ${3 - value.length} caractère${value.length === 2 ? '' : 's'}`
                : USER_HELP,
            }
          : check?.value !== value
            ? { status: 'checking', msg: 'Vérification…' }
            : check.available
              ? { status: 'ok', msg: `@${value} est disponible.` }
              : { status: 'error', msg: `@${value} est déjà pris.` };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.status !== 'ok') return;
    const ok = await confirm({
      title: `Devenir @${value} ?`,
      text: `Les liens vers @${saved} ne mèneront plus à votre profil, et quelqu’un d’autre pourra prendre ce nom. Vos posts, abonnés et messages ne changent pas.`,
      ok: 'Changer',
    });
    if (!ok) return;
    save.mutate(value, {
      onSuccess: () => {
        setSaved(value);
        toast(`Vous êtes maintenant @${value}`);
      },
      onError: (err) =>
        setSaveErr(err instanceof ApiError ? (err.field('username') ?? err.message) : err.message),
    });
  };

  return (
    <Block
      title="Nom d’utilisateur"
      desc="C’est votre @ : il apparaît sur vos posts et dans l’adresse de votre profil."
      onSubmit={(e) => void submit(e)}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="u-name" className="text-sm font-semibold text-text-2">
          Nom d’utilisateur
        </label>
        <Input
          id="u-name"
          prefix="@"
          value={value}
          maxLength={20}
          autoComplete="username"
          spellCheck={false}
          aria-describedby="u-help"
          error={state.status === 'error'}
          ok={state.status === 'ok'}
          end={state.status === 'checking' ? <Spinner size="sm" /> : undefined}
          onChange={(e) => {
            setSaveErr(null);
            setValue(e.target.value);
          }}
        />
        <p
          id="u-help"
          aria-live="polite"
          className={
            state.status === 'error' ? 'text-caption text-danger' : 'text-caption text-text-3'
          }
        >
          {state.msg}
        </p>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={state.status !== 'ok'} loading={save.isPending}>
          Enregistrer
        </Button>
      </div>
    </Block>
  );
}

/** Paramètres · Compte : email (avec mot de passe) et nom d'utilisateur (ACC-05). */
export function AccountSettings() {
  const { data: me } = useMe();
  if (!me) return null;
  return (
    <SettingsSection title="Compte" sub="Seul vous voyez votre adresse email">
      <EmailBlock current={me.email} />
      <UsernameBlock current={me.username} />
    </SettingsSection>
  );
}
