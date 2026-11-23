import { useQueryClient } from '@tanstack/react-query';
import { ImagePlus, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Avatar } from '@/design-system/Avatar';
import { Button, IconButton } from '@/design-system/Button';
import { useConfirm, useToast } from '@/design-system/feedback';
import { Modal } from '@/design-system/Modal';
import { Alert } from '@/design-system/misc';
import { ProgressBar } from '@/design-system/Spinner';
import { api, ApiError, upload } from '@/lib/api';
import { cx } from '@/lib/cx';
import { duration as fmtDuration, megabytes } from '@/lib/format';
import { useMe } from '@/lib/session';
import type { FeedItem, Media, Post } from '@/lib/types';
import { refreshMyLists, updatePost } from '@/features/posts/api';
import { ComposerContext, type ComposerOptions } from '@/features/posts/composer-context';

/** MEDIA-01 : types acceptés et taille maximale en Mo. */
const LIMITS: Record<string, number> = {
  'image/jpeg': 5,
  'image/png': 5,
  'image/webp': 5,
  'image/gif': 10,
  'video/mp4': 50,
  'video/webm': 50,
};
const ACCEPT = Object.keys(LIMITS).join(',');
const MAX_VIDEO = 120;
const TITLE_MIN = 3;
const TITLE_MAX = 120;
const BODY_MAX = 500;

type Item = {
  key: number;
  name: string;
  type: Media['type'];
  preview: string | null;
  width: number;
  height: number;
  duration: number | null;
  progress: number;
  media: Media | null;
  abort?: AbortController;
  failed?: boolean;
};
type Err = { title: string; detail?: string } | null;

/** Lit les dimensions (et la durée d'une vidéo) avant l'envoi : le serveur et l'aperçu en ont besoin. */
function probe(
  file: File,
  url: string,
): Promise<{ width: number; height: number; duration: number | null }> {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('video')) {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () =>
        resolve({ width: v.videoWidth, height: v.videoHeight, duration: v.duration });
      v.onerror = reject;
      v.src = url;
    } else {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight, duration: null });
      img.onerror = reject;
      img.src = url;
    }
  });
}

function RingCount({ length }: { length: number }) {
  if (!length) return <span className="size-[22px]" aria-hidden />;
  const color =
    length > BODY_MAX ? 'var(--danger)' : length >= 450 ? 'var(--warning)' : 'var(--text-2)';
  return (
    <span
      aria-hidden
      className="size-[22px] rounded-full [mask:radial-gradient(circle,transparent_7px,#000_7.5px)]"
      style={{
        background: `conic-gradient(${color} ${Math.min(100, length / 5)}%, var(--line) 0)`,
      }}
    />
  );
}

function ComposerDialog({ options, onDone }: { options: ComposerOptions; onDone: () => void }) {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const edit = options.mode === 'edit' ? options.post : null;

  const initialMedia = useMemo<Item[]>(
    () =>
      (edit?.media ?? []).map((m) => ({
        key: m.id,
        name: 'média',
        type: m.type,
        preview: m.url,
        width: m.width,
        height: m.height,
        duration: m.duration,
        progress: 100,
        media: m,
      })),
    [edit],
  );
  const [title, setTitle] = useState(
    edit?.title ?? (options.mode !== 'edit' ? (options.title ?? '') : ''),
  );
  const [body, setBody] = useState(
    edit?.content ?? (options.mode !== 'edit' ? (options.content ?? '') : ''),
  );
  const [items, setItems] = useState<Item[]>(initialMedia);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<Err>(null);
  const [sending, setSending] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const seq = useRef(0);

  const isReply = edit !== null && edit.title === null;
  const t = title.trim().length;
  const titleOk = isReply || t >= TITLE_MIN;
  const uploading = items.some((i) => i.progress < 100 && !i.failed);
  const hasVideo = items.some((i) => i.type === 'video');
  const changed =
    !edit ||
    title !== (edit.title ?? '') ||
    body !== edit.content ||
    items.length !== edit.media.length;
  const failed = items.some((i) => i.failed);
  const canSubmit =
    titleOk && body.length <= BODY_MAX && !uploading && !failed && changed && !sending;
  const dirty = edit ? changed : !!(title.trim() || body.trim() || items.length);

  // Textarea qui grandit avec le texte (320 px au plus)
  useEffect(() => {
    const b = bodyRef.current;
    if (!b) return;
    b.style.height = 'auto';
    b.style.height = `${Math.min(b.scrollHeight, 320)}px`;
  }, [body]);

  // Ouverture depuis la rédaction rapide avec « Ajouter des médias »
  useEffect(() => {
    if (options.mode !== 'edit' && options.pickFiles) fileInput.current?.click();
  }, [options]);

  // Annule les envois en cours si la fenêtre se ferme
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  });
  useEffect(() => () => itemsRef.current.forEach((i) => i.abort?.abort()), []);

  const patch = (key: number, p: Partial<Item>) =>
    setItems((list) => list.map((i) => (i.key === key ? { ...i, ...p } : i)));

  const addFile = async (file: File, slots: { count: number; video: boolean }) => {
    const limit = LIMITS[file.type];
    if (!limit)
      return setError({
        title: `Format non accepté : « ${file.name} »`,
        detail: 'Images JPG, PNG ou WEBP, GIF, vidéos MP4 ou WEBM.',
      });
    if (file.size > limit * 1_048_576)
      return setError({
        title: `Fichier trop lourd : « ${file.name} »`,
        detail: `${megabytes(file.size)}, la limite est de ${limit} Mo pour ce type de fichier.`,
      });
    const video = file.type.startsWith('video');
    if (video && slots.count > 0)
      return setError({
        title: 'Une vidéo doit être seule',
        detail: 'Retirez les autres médias pour ajouter une vidéo (MEDIA-02).',
      });
    if (slots.video)
      return setError({
        title: 'Une vidéo doit être seule',
        detail: 'Retirez la vidéo pour ajouter des images.',
      });
    if (slots.count >= 4)
      return setError({
        title: '4 médias maximum',
        detail: `« ${file.name} » n’a pas été ajouté.`,
      });
    slots.count++;
    slots.video = video;

    const url = URL.createObjectURL(file);
    let dims;
    try {
      dims = await probe(file, url);
    } catch {
      slots.count--;
      return setError({
        title: `Fichier illisible : « ${file.name} »`,
        detail:
          'Le fichier ne correspond pas à son extension (le serveur vérifie le vrai type MIME).',
      });
    }
    if (dims.duration !== null && dims.duration > MAX_VIDEO) {
      slots.count--;
      return setError({
        title: `Vidéo trop longue : « ${file.name} »`,
        detail: 'La limite est de 2 minutes.',
      });
    }
    const key = --seq.current;
    const abort = new AbortController();
    const type: Media['type'] = file.type === 'image/gif' ? 'gif' : video ? 'video' : 'image';
    setItems((list) => [
      ...list,
      { key, name: file.name, type, preview: url, ...dims, progress: 0, media: null, abort },
    ]);
    const form = new FormData();
    form.append('file', file);
    form.append('width', String(dims.width));
    form.append('height', String(dims.height));
    if (dims.duration !== null) form.append('duration', String(dims.duration));
    try {
      const media = await upload<Media>(
        '/media',
        form,
        (p) => patch(key, { progress: Math.min(p, 99) }),
        abort.signal,
      );
      patch(key, { media, progress: 100 });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      patch(key, { failed: true });
      setError({
        title: `Envoi impossible : « ${file.name} »`,
        detail: e instanceof Error ? e.message : undefined,
      });
    }
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    setError(null);
    const slots = { count: items.length, video: hasVideo };
    for (const f of files) void addFile(f, slots);
  };

  const removeItem = (it: Item) => {
    it.abort?.abort();
    setItems((list) => list.filter((i) => i.key !== it.key));
    setError(null);
  };

  const close = async () => {
    if (dirty) {
      const ok = await confirm({
        title: edit ? 'Abandonner les modifications ?' : 'Abandonner ce post ?',
        text: edit
          ? 'Le post restera tel qu’il était.'
          : 'Le titre, le texte et les médias ne seront pas gardés.',
        ok: 'Abandonner',
        cancel: 'Continuer',
        danger: true,
      });
      if (!ok) return;
    }
    onDone();
  };

  const submit = async () => {
    setTouched(true);
    if (!canSubmit || !me) return;
    setSending(true);
    try {
      const media_ids = items.map((i) => i.media!.id);
      if (edit) {
        const post = await api<Post>(`/posts/${edit.id}`, {
          method: 'PATCH',
          body: {
            ...(edit.title !== null ? { title: title.trim() } : {}),
            content: body.trim(),
            media_ids,
          },
        });
        updatePost(qc, post.id, () => post);
        toast('Post modifié');
      } else {
        await api<FeedItem>('/posts', {
          method: 'POST',
          body: { title: title.trim(), content: body.trim(), media_ids },
        });
        refreshMyLists(qc, me.username);
        toast('Post publié');
      }
      onDone();
    } catch (e) {
      setSending(false);
      if (e instanceof ApiError)
        setError({ title: e.field('title') ?? e.field('content') ?? e.message });
      else
        setError({
          title: 'Publication impossible',
          detail: 'Vérifiez votre connexion et réessayez.',
        });
    }
  };

  const help =
    touched && !titleOk
      ? t
        ? 'Le titre doit faire au moins 3 caractères.'
        : 'Le titre est obligatoire.'
      : null;
  const addTitle = edit
    ? 'On ne peut pas ajouter de média à un post publié (POST-06)'
    : hasVideo
      ? 'Une vidéo est toujours seule'
      : items.length >= 4
        ? '4 médias maximum'
        : 'Images, GIF ou vidéo : 4 médias max, ou 1 vidéo';

  return (
    <Modal
      open
      onClose={() => void close()}
      title={edit ? 'Modifier le post' : 'Nouveau post'}
      size="lg"
    >
      <div className="flex gap-3">
        <Avatar name={me?.display_name ?? '?'} src={me?.avatar} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {!isReply && (
            <>
              <label htmlFor="cp-title" className="sr-only">
                Titre
              </label>
              <input
                id="cp-title"
                autoFocus
                value={title}
                maxLength={TITLE_MAX}
                placeholder="Titre"
                autoComplete="off"
                aria-invalid={!!help || undefined}
                aria-describedby="cp-help"
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => title && setTouched(true)}
                className="min-h-10 bg-transparent text-[19px] font-extrabold outline-none placeholder:text-text-3"
              />
            </>
          )}
          <label htmlFor="cp-body" className="sr-only">
            Contenu
          </label>
          <textarea
            id="cp-body"
            ref={bodyRef}
            rows={3}
            value={body}
            autoFocus={isReply}
            placeholder={isReply ? 'Votre réponse' : 'Contenu (optionnel)'}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void submit();
            }}
            className="min-h-[72px] resize-none bg-transparent py-1 text-base leading-normal outline-none placeholder:text-text-3"
          />
          <div className="flex min-h-[18px] justify-between gap-3 text-caption text-text-3">
            <span id="cp-help" className={cx(help && 'text-danger')}>
              {help ??
                (edit
                  ? 'En modification, on peut changer le titre et le texte, et retirer des médias.'
                  : 'Titre obligatoire : 3 à 120 caractères.')}
            </span>
            {title.length >= 100 && (
              <span className={cx('tabular-nums', title.length >= 115 && 'text-warning')}>
                {title.length} / {TITLE_MAX}
              </span>
            )}
          </div>
          {error && (
            <Alert tone="danger" title={error.title}>
              {error.detail}
            </Alert>
          )}
          {items.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {items.map((it) => (
                <div
                  key={it.key}
                  className={cx(
                    'relative aspect-square overflow-hidden rounded-sm border bg-cover bg-center',
                    it.failed ? 'border-danger' : 'border-line',
                  )}
                  style={{
                    backgroundImage:
                      it.preview && it.type !== 'video' ? `url(${it.preview})` : 'var(--ph1)',
                  }}
                >
                  {it.type === 'video' && it.preview && (
                    <video
                      src={it.preview}
                      muted
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                  {it.progress < 100 && !it.failed && (
                    <span className="bg-black/35 absolute inset-0" />
                  )}
                  <span className="bg-black/55 absolute bottom-1.5 left-1.5 rounded-[4px] px-1.5 py-px text-[10px] font-bold text-white">
                    {it.type === 'video'
                      ? `Vidéo ${it.duration !== null ? fmtDuration(it.duration) : ''}`
                      : it.type === 'gif'
                        ? 'GIF'
                        : it.width > it.height
                          ? 'Horizontale'
                          : 'Verticale'}
                  </span>
                  {it.progress < 100 && !it.failed && (
                    <div className="absolute inset-x-2 bottom-2">
                      <ProgressBar value={it.progress} label={`Envoi de ${it.name}`} onMedia />
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label={`Retirer ${it.name}`}
                    onClick={() => removeItem(it)}
                    className="bg-black/60 hover:bg-black/80 absolute top-1.5 right-1.5 grid size-[26px] place-items-center rounded-full text-white"
                  >
                    <X aria-hidden size={14} strokeWidth={2.4} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex items-center gap-0.5 border-t border-line pt-3">
            <input
              ref={fileInput}
              type="file"
              accept={ACCEPT}
              multiple
              hidden
              onChange={(e) => {
                onFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <IconButton
              label="Ajouter des images, un GIF ou une vidéo"
              title={addTitle}
              disabled={!!edit || hasVideo || items.length >= 4}
              onClick={() => fileInput.current?.click()}
              className="text-text"
            >
              <ImagePlus aria-hidden size={20} strokeWidth={1.8} />
            </IconButton>
            {items.length > 0 && (
              <span className="ml-1.5 text-caption text-text-3">
                {hasVideo ? '1 vidéo' : `${items.length} / 4 médias`}
              </span>
            )}
            <div className="ml-auto flex items-center gap-3">
              {body.length >= 450 && (
                <span
                  className={cx(
                    'text-caption tabular-nums',
                    body.length > BODY_MAX ? 'font-bold text-danger' : 'text-warning',
                  )}
                >
                  {BODY_MAX - body.length}
                </span>
              )}
              <RingCount length={body.length} />
              <Button
                disabled={!canSubmit}
                loading={sending || uploading}
                onClick={() => void submit()}
              >
                {uploading ? 'Envoi…' : edit ? 'Enregistrer' : 'Publier'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/** Fournit useComposer() et affiche la fenêtre de rédaction. */
export function ComposerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ id: number; options: ComposerOptions } | null>(null);
  const open = useCallback(
    (options: ComposerOptions = {}) => setState((s) => ({ id: (s?.id ?? 0) + 1, options })),
    [],
  );
  const value = useMemo(() => ({ open }), [open]);
  return (
    <ComposerContext.Provider value={value}>
      {children}
      {state && (
        <ComposerDialog key={state.id} options={state.options} onDone={() => setState(null)} />
      )}
    </ComposerContext.Provider>
  );
}
