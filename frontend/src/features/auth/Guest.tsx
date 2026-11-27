import { Heart, Mail, MessageCircle, Repeat2, UserPlus, type LucideIcon } from 'lucide-react';
import { useCallback, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { buttonClass } from '@/design-system/Button';
import { Modal } from '@/design-system/Modal';
import { Tile } from '@/design-system/misc';
import { cx } from '@/lib/cx';
import { LoginPromptContext, type GuestAction } from '@/lib/login-prompt';
import { loginUrl } from '@/lib/session';

const TEXTS: Record<
  GuestAction,
  { icon: LucideIcon; tone?: 'like' | 'repost'; title: string; text: string }
> = {
  like: {
    icon: Heart,
    tone: 'like',
    title: 'Aimez ce post',
    text: 'Connectez-vous pour montrer à {u} que vous aimez son post.',
  },
  repost: {
    icon: Repeat2,
    tone: 'repost',
    title: 'Republiez ce post',
    text: 'Connectez-vous pour partager le post de {u} avec vos abonnés.',
  },
  reply: {
    icon: MessageCircle,
    title: 'Rejoignez la discussion',
    text: 'Connectez-vous pour commenter le post de {u}.',
  },
  follow: {
    icon: UserPlus,
    title: 'Abonnez-vous à {u}',
    text: 'Connectez-vous pour voir les posts de {u} dans votre fil.',
  },
  message: {
    icon: Mail,
    title: 'Écrivez à {u}',
    text: 'Connectez-vous pour envoyer un message à {u}.',
  },
};

/** La page actuelle, pour y revenir après la connexion (VIS-03). */
function useHere() {
  const { pathname, search } = useLocation();
  return pathname + search;
}

/**
 * Fenêtre « Connectez-vous » (VIS-03) : les boutons d'action restent visibles pour un visiteur,
 * et le clic ouvre cette fenêtre au lieu de l'action.
 */
export function LoginPromptProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ action: GuestAction; name: string } | null>(null);
  const here = useHere();
  const prompt = useCallback((action: GuestAction, name: string) => setState({ action, name }), []);
  const t = state && TEXTS[state.action];
  const fill = (s: string) => s.replaceAll('{u}', state?.name ?? '');
  const close = () => setState(null);

  return (
    <LoginPromptContext value={prompt}>
      {children}
      <Modal
        open={!!state}
        onClose={close}
        title={t ? fill(t.title) : ''}
        titleHidden
        describedBy="login-prompt-text"
      >
        {t && (
          <div className="-mt-6 flex flex-col items-center gap-4 text-center">
            <div
              className={cx(
                'grid size-14 place-items-center rounded-full',
                t.tone === 'like'
                  ? 'bg-like/12 text-like'
                  : t.tone === 'repost'
                    ? 'bg-repost/12 text-repost'
                    : 'bg-hover text-text',
              )}
            >
              <t.icon aria-hidden size={26} strokeWidth={1.8} />
            </div>
            <p aria-hidden className="text-title font-extrabold">
              {fill(t.title)}
            </p>
            <p id="login-prompt-text" className="text-post text-text-2">
              {fill(t.text)}
            </p>
            <div className="flex w-full flex-col gap-3">
              <Link
                to={loginUrl(here)}
                onClick={close}
                className={buttonClass({ size: 'lg', block: true })}
              >
                Se connecter
              </Link>
              <Link
                to={loginUrl(here, 'signup')}
                onClick={close}
                className={buttonClass({ variant: 'outline', size: 'lg', block: true })}
              >
                Créer un compte
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </LoginPromptContext>
  );
}

/** Bandeau permanent des visiteurs (VIS-04), en bas du contenu, au-dessus de la nav sur mobile. */
export function GuestBar() {
  const here = useHere();
  return (
    <div
      role="region"
      aria-label="Invitation à se connecter"
      className="sticky bottom-14 z-10 border-t border-line bg-bg sm:bottom-0"
    >
      <div className="flex items-center gap-4 px-5 py-3 max-sm:flex-col max-sm:items-stretch max-sm:gap-2 max-sm:px-4">
        <div className="min-w-0 flex-1">
          <b className="block text-card-title font-extrabold">Connectez-vous pour participer</b>
          <span className="text-sm text-text-2">Vous lisez transcendance en visiteur.</span>
        </div>
        <div className="flex gap-2">
          <Link
            to={loginUrl(here)}
            className={cx(buttonClass({ variant: 'outline', size: 'lg' }), 'max-sm:flex-1')}
          >
            Se connecter
          </Link>
          <Link
            to={loginUrl(here, 'signup')}
            className={cx(buttonClass({ size: 'lg' }), 'max-sm:flex-1')}
          >
            S’inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Tuile « Nouveau ici ? » de la colonne de droite, pour un visiteur. */
export function GuestTile() {
  const here = useHere();
  return (
    <Tile title="Nouveau ici ?">
      <p className="text-sm text-text-2">
        Inscrivez-vous pour publier, aimer, commenter et suivre les personnes qui vous intéressent.
      </p>
      <Link to={loginUrl(here, 'signup')} className={buttonClass({ size: 'lg', block: true })}>
        Créer un compte
      </Link>
      <Link
        to={loginUrl(here)}
        className={buttonClass({ variant: 'outline', size: 'lg', block: true })}
      >
        Se connecter
      </Link>
    </Tile>
  );
}
