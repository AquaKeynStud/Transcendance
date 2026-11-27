import { useMutation } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { Avatar } from '@/design-system/Avatar';
import { Button } from '@/design-system/Button';
import { useToast } from '@/design-system/feedback';
import { Counter, FormRow, Input, Textarea } from '@/design-system/Field';
import { Alert } from '@/design-system/misc';
import { api, ApiError } from '@/lib/api';
import { megabytes } from '@/lib/format';
import { useMe } from '@/lib/session';
import type { Me } from '@/lib/types';
import { AvatarCrop } from '@/features/settings/AvatarCrop';
import { Block, SettingsSection } from '@/features/settings/SettingsLayout';
import { useSaveMe } from '@/features/settings/useSaveMe';

const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Paramètres · Profil : photo (ACC-04), nom affiché et bio (ACC-03). */
export function ProfileSettings() {
  const { data: me } = useMe();
  return me ? <ProfileForm me={me} /> : null;
}

function ProfileForm({ me }: { me: Me }) {
  const save = useSaveMe();
  const toast = useToast();
  const file = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [avErr, setAvErr] = useState<{ title: string; detail: string } | null>(null);
  const [name, setName] = useState(me.display_name);
  const [bio, setBio] = useState(me.bio);
  const [orig, setOrig] = useState({ name: me.display_name, bio: me.bio });

  const avatar = useMutation({
    mutationFn: (blob: Blob | null) => {
      if (!blob) return api<Me>('/me/avatar', { method: 'DELETE' });
      const form = new FormData();
      form.append('avatar', blob, 'avatar.jpg');
      return api<Me>('/me/avatar', { method: 'POST', body: form });
    },
  });
  const profile = useMutation({
    mutationFn: (body: { display_name: string; bio: string }) =>
      api<Me>('/me', { method: 'PATCH', body }),
  });

  const dirty = name !== orig.name || bio !== orig.bio;
  const bioErr = bio.length > 160 ? `La bio fait ${bio.length} caractères : 160 maximum.` : null;
  const fieldErr = profile.error instanceof ApiError ? profile.error : null;

  const pick = (f: File | undefined) => {
    setAvErr(null);
    if (!f) return;
    if (!AVATAR_TYPES.includes(f.type))
      return setAvErr({
        title: `Format non accepté : « ${f.name} »`,
        detail: 'Choisissez une image JPG, PNG ou WEBP.',
      });
    if (f.size > 2 * 1_048_576)
      return setAvErr({
        title: `Photo trop lourde : « ${f.name} »`,
        detail: `${megabytes(f.size)}, la limite est de 2 Mo.`,
      });
    setCropSrc(URL.createObjectURL(f));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!dirty || bioErr) return;
    profile.mutate(
      { display_name: name, bio },
      {
        onSuccess: (m) => {
          save(m);
          setOrig({ name, bio });
          toast('Profil enregistré');
        },
      },
    );
  };

  return (
    <SettingsSection title="Profil" sub="Visible par tout le monde, visiteurs compris">
      <Block title="Photo de profil">
        <div className="flex items-center gap-5">
          <Avatar name={me.display_name} src={me.avatar} size="xxl" />
          <div>
            <div className="flex flex-wrap gap-2">
              <input
                ref={file}
                type="file"
                accept={AVATAR_TYPES.join(',')}
                hidden
                onChange={(e) => {
                  pick(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
              <Button
                variant="outline"
                size="sm"
                icon={<Camera aria-hidden size={18} strokeWidth={1.8} />}
                onClick={() => file.current?.click()}
              >
                Changer la photo
              </Button>
              {me.avatar && (
                <Button
                  variant="ghost"
                  size="sm"
                  loading={avatar.isPending && !cropSrc}
                  onClick={() =>
                    avatar.mutate(null, {
                      onSuccess: (m) => {
                        save(m);
                        toast('Photo retirée : l’avatar par défaut est affiché');
                      },
                    })
                  }
                >
                  Retirer
                </Button>
              )}
            </div>
            <p className="mt-2 text-caption text-text-3">
              JPG, PNG ou WEBP, 2 Mo maximum. Vous la recadrez en carré ensuite.
            </p>
          </div>
        </div>
        {avErr && (
          <Alert tone="danger" title={avErr.title}>
            {avErr.detail}
          </Alert>
        )}
      </Block>

      <Block title="Informations" onSubmit={submit}>
        <FormRow
          label="Nom affiché"
          htmlFor="p-name"
          aside={<Counter value={name.length} max={50} warnAt={45} />}
          help="Si vous le laissez vide, votre nom d’utilisateur est affiché."
          error={fieldErr?.field('display_name')}
        >
          <Input
            id="p-name"
            value={name}
            maxLength={50}
            autoComplete="nickname"
            onChange={(e) => setName(e.target.value)}
          />
        </FormRow>
        <FormRow
          label="Bio"
          htmlFor="p-bio"
          aside={<Counter value={bio.length} max={160} warnAt={140} />}
          error={bioErr ?? fieldErr?.field('bio')}
        >
          <Textarea
            id="p-bio"
            rows={3}
            value={bio}
            error={!!bioErr}
            onChange={(e) => setBio(e.target.value)}
          />
        </FormRow>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            disabled={!dirty}
            onClick={() => {
              setName(orig.name);
              setBio(orig.bio);
            }}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={!dirty || !!bioErr} loading={profile.isPending}>
            Enregistrer
          </Button>
        </div>
      </Block>

      {cropSrc && (
        <AvatarCrop
          src={cropSrc}
          busy={avatar.isPending}
          onCancel={() => setCropSrc(null)}
          onApply={(blob) =>
            avatar.mutate(blob, {
              onSuccess: (m) => {
                save(m);
                setCropSrc(null);
                toast('Photo de profil mise à jour');
              },
              onError: (e) => {
                setCropSrc(null);
                setAvErr({ title: 'Photo refusée', detail: e.message });
              },
            })
          }
        />
      )}
    </SettingsSection>
  );
}
