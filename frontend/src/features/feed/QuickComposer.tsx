import { useQueryClient } from '@tanstack/react-query';
import { ImagePlus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button, IconButton } from '@/design-system/Button';
import { useToast } from '@/design-system/feedback';
import { Counter } from '@/design-system/Field';
import { api, ApiError } from '@/lib/api';
import { useMe } from '@/lib/session';
import { refreshMyLists } from '@/features/posts/api';
import { useComposer } from '@/features/posts/composer-context';

/** Rédaction rapide dans la colonne de droite (titre + texte) ; les médias ouvrent la fenêtre complète. */
export function QuickComposer() {
  const { data: me } = useMe();
  const composer = useComposer();
  const qc = useQueryClient();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  if (!me) return null;
  const ok = title.trim().length >= 3 && content.length <= 500;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    setSending(true);
    try {
      await api('/posts', {
        method: 'POST',
        body: { title: title.trim(), content: content.trim(), media_ids: [] },
      });
      setTitle('');
      setContent('');
      refreshMyLists(qc, me.username);
      toast('Post publié');
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Publication impossible', { type: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void submit(e)}
      aria-label="Publier un post"
      noValidate
      className="flex flex-col rounded-md border border-card-line bg-card"
    >
      <label htmlFor="q-title" className="sr-only">
        Titre
      </label>
      <input
        id="q-title"
        value={title}
        maxLength={120}
        placeholder="Titre"
        autoComplete="off"
        onChange={(e) => setTitle(e.target.value)}
        className="min-h-11 bg-transparent px-4 text-card-title font-bold outline-none placeholder:text-text-3"
      />
      <label htmlFor="q-body" className="sr-only">
        Contenu
      </label>
      <textarea
        id="q-body"
        rows={3}
        value={content}
        placeholder="Contenu (optionnel)"
        onChange={(e) => setContent(e.target.value)}
        className="resize-none bg-transparent px-4 pb-3 leading-normal outline-none placeholder:text-text-3"
      />
      <div className="flex items-center gap-0.5 border-t border-line px-3 py-2">
        <IconButton
          label="Ajouter des médias (ouvre la fenêtre de rédaction)"
          className="text-text"
          onClick={() => {
            composer.open({ title, content, pickFiles: true });
            setTitle('');
            setContent('');
          }}
        >
          <ImagePlus aria-hidden size={18} strokeWidth={1.8} />
        </IconButton>
        <Counter value={content.length} max={500} warnAt={450} className="mr-3 ml-auto" />
        <Button
          type="submit"
          size="sm"
          disabled={!ok}
          loading={sending}
          title={title.trim().length < 3 ? 'Le titre doit faire au moins 3 caractères' : undefined}
        >
          Publier
        </Button>
      </div>
    </form>
  );
}
