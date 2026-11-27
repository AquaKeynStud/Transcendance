import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Button, IconButton } from '@/design-system/Button';
import { useConfirm, useToast } from '@/design-system/feedback';
import { FormRow, Input } from '@/design-system/Field';
import { Alert, RadioGroup, Switch } from '@/design-system/misc';
import { api, ApiError } from '@/lib/api';
import { cx } from '@/lib/cx';
import { plural } from '@/lib/format';
import { useMe } from '@/lib/session';
import type { Me, Visibility } from '@/lib/types';
import { useSaveMe } from '@/features/settings/useSaveMe';
import { Block, SettingsSection } from '@/features/settings/SettingsLayout';

const CHOICES: { value: Visibility; label: string; description: string }[] = [
  {
    value: 'public',
    label: 'Tout le monde',
    description: 'Toute personne qui peut voir le post, visiteurs compris',
  },
  { value: 'followers', label: 'Vos abonnés', description: 'Seulement vos abonnés acceptés' },
  { value: 'private', label: 'Vous seulement', description: 'Personne d’autre ne voit la liste' },
];

/** Paramètres · Confidentialité (ACC-06, §3.1, §3.2) : enregistré à chaque changement. */
export function PrivacySettings() {
  const { data: me } = useMe();
  const save = useSaveMe();
  const toast = useToast();
  const confirm = useConfirm();
  const labelId = useId();
  const descId = useId();
  const privacy = useMutation({
    mutationFn: (
      body: Partial<Pick<Me, 'is_private' | 'likes_visibility' | 'reposts_visibility'>>,
    ) => api<Me>('/me/privacy', { method: 'PATCH', body }),
    onSuccess: save,
    onError: (e) => toast(e.message, { type: 'error' }),
  });
  if (!me) return null;
  const pending = me.pending_requests_count;

  const togglePrivate = async (on: boolean) => {
    if (!on) {
      const ok = await confirm({
        title: 'Passer en compte public ?',
        text: (
          <>
            Tout le monde, visiteurs compris, verra vos posts, vos réponses et vos médias.
            {pending > 0 && (
              <>
                {' '}
                Les <b>{plural(pending, 'demande en attente', 'demandes en attente')}</b> seront
                acceptées automatiquement.
              </>
            )}
          </>
        ),
        ok: 'Passer en public',
      });
      if (!ok) return;
    }
    privacy.mutate(
      { is_private: on },
      {
        onSuccess: () =>
          toast(
            on
              ? 'Votre compte est privé. Vos abonnés actuels sont conservés.'
              : 'Votre compte est public',
          ),
      },
    );
  };

  const setVis = (key: 'likes_visibility' | 'reposts_visibility', v: Visibility) =>
    privacy.mutate(
      { [key]: v },
      {
        onSuccess: () =>
          toast(
            `${key === 'likes_visibility' ? 'J’aime' : 'Republications'} visibles par : ${CHOICES.find((c) => c.value === v)!.label.toLowerCase()}`,
          ),
      },
    );

  return (
    <SettingsSection title="Confidentialité" sub="Enregistré automatiquement">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <b id={labelId} className="mb-0.5 block font-semibold">
            Compte privé
          </b>
          <p id={descId} className="text-sm leading-normal text-text-3">
            {me.is_private ? (
              <>
                Seuls vos abonnés acceptés voient vos posts, réponses, médias et listes. Votre
                profil (photo, nom, bio, compteurs) reste visible par tous.{' '}
                {pending > 0 && (
                  <Link to="/requests" className="font-semibold text-link hover:underline">
                    {plural(pending, 'demande')} en attente
                  </Link>
                )}
              </>
            ) : (
              'Tout le monde voit vos posts, visiteurs compris, et peut vous suivre sans demande.'
            )}
          </p>
        </div>
        <span className="mt-0.5">
          <Switch
            checked={me.is_private}
            labelledBy={labelId}
            describedBy={descId}
            disabled={privacy.isPending}
            onChange={(on) => void togglePrivate(on)}
          />
        </span>
      </div>
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-2 p-0 text-card-title font-extrabold">Qui voit vos J’aime</legend>
        <p className="mb-2 text-sm leading-normal text-text-3">
          Le nombre de J’aime d’un post reste visible par tous, sans les noms. Ce réglage s’applique
          aussi à vos anciens J’aime.
        </p>
        <RadioGroup
          name="likes"
          value={me.likes_visibility}
          options={CHOICES}
          onChange={(v) => setVis('likes_visibility', v)}
        />
      </fieldset>
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-2 p-0 text-card-title font-extrabold">
          Qui voit vos republications
        </legend>
        <p className="mb-2 text-sm leading-normal text-text-3">
          Une republication n’est jamais montrée à quelqu’un qui ne peut pas voir le post d’origine.
        </p>
        <RadioGroup
          name="reposts"
          value={me.reposts_visibility}
          options={CHOICES}
          onChange={(v) => setVis('reposts_visibility', v)}
        />
      </fieldset>
    </SettingsSection>
  );
}

const COMMON = ['password', 'motdepasse', '12345678', 'azertyui', 'qwertyui', 'transcendance1'];

function PasswordInput({
  id,
  value,
  onChange,
  ...rest
}: { id: string; value: string; onChange: (v: string) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & { error?: boolean; ok?: boolean }) {
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

/** Paramètres · Sécurité : changer de mot de passe, avec l'ancien (ACC-05). */
export function SecuritySettings() {
  const toast = useToast();
  const [old, setOld] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [oldErr, setOldErr] = useState<string | null>(null);
  const [mismatch, setMismatch] = useState(false);
  const [done, setDone] = useState(false);
  const change = useMutation({
    mutationFn: () =>
      api<void>('/me/password', {
        method: 'POST',
        body: { current_password: old, new_password: pw },
      }),
  });

  const rules = [
    { ok: pw.length >= 8, label: '8 caractères min.' },
    { ok: !!pw && !/^\d+$/.test(pw), label: 'Pas que des chiffres' },
    { ok: !!pw && !COMMON.includes(pw.toLowerCase()), label: 'Pas trop courant' },
    { ok: !!pw && pw !== old, label: 'Différent de l’actuel' },
  ];
  const allOk = rules.every((r) => r.ok);
  const match = !!pw2 && pw2 === pw;
  const edit = (fn: (v: string) => void) => (v: string) => {
    setDone(false);
    fn(v);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!old || !allOk || !match) return;
    change.mutate(undefined, {
      onSuccess: () => {
        setOld('');
        setPw('');
        setPw2('');
        setOldErr(null);
        setDone(true);
        toast('Mot de passe modifié');
      },
      onError: (err) => {
        if (err instanceof ApiError && err.field('current_password'))
          setOldErr(err.field('current_password'));
        else toast(err.message, { type: 'error' });
      },
    });
  };

  return (
    <SettingsSection title="Sécurité" sub="Mot de passe">
      <Block title="Changer de mot de passe" onSubmit={submit}>
        {done && (
          <Alert tone="success" title="Mot de passe modifié">
            Utilisez-le à votre prochaine connexion.
          </Alert>
        )}
        <FormRow
          label="Mot de passe actuel"
          htmlFor="pw-old"
          error={oldErr}
          aside={
            <Link
              to="/forgot-password"
              className="text-caption font-semibold text-link hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          }
        >
          <PasswordInput
            id="pw-old"
            autoComplete="current-password"
            value={old}
            error={!!oldErr}
            onChange={edit(setOld)}
          />
        </FormRow>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pw-new" className="text-sm font-semibold text-text-2">
            Nouveau mot de passe
          </label>
          <PasswordInput
            id="pw-new"
            autoComplete="new-password"
            placeholder="8 caractères minimum"
            aria-describedby="pw-rules"
            value={pw}
            onChange={edit(setPw)}
          />
          <ul
            id="pw-rules"
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
        </div>
        <FormRow
          label="Confirmer le nouveau mot de passe"
          htmlFor="pw-2"
          error={mismatch ? 'Les deux mots de passe ne correspondent pas.' : null}
        >
          <Input
            id="pw-2"
            type="password"
            autoComplete="new-password"
            value={pw2}
            ok={match && allOk}
            error={mismatch}
            onChange={(e) => {
              setDone(false);
              setMismatch(false);
              setPw2(e.target.value);
            }}
            onBlur={() => setMismatch(!!pw2 && pw2 !== pw)}
          />
        </FormRow>
        <div className="flex justify-end">
          <Button type="submit" disabled={!old || !allOk || !match} loading={change.isPending}>
            Changer le mot de passe
          </Button>
        </div>
      </Block>
    </SettingsSection>
  );
}
