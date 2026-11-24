import { createContext, useContext } from 'react';

/** Action qu'un visiteur a tentée (VIS-03) : le texte de la fenêtre en dépend. */
export type GuestAction = 'like' | 'repost' | 'reply' | 'follow' | 'message';

export const LoginPromptContext = createContext<(action: GuestAction, name: string) => void>(
  () => undefined,
);

/** Ouvre la fenêtre « Connectez-vous » pour un visiteur. `name` : l'auteur ou le compte visé. */
export function useLoginPrompt() {
  return useContext(LoginPromptContext);
}
