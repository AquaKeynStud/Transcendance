import { createContext, useContext } from 'react';
import type { Post } from '@/lib/types';

export type ComposerOptions =
  | { mode?: 'new'; title?: string; content?: string; pickFiles?: boolean }
  | { mode: 'edit'; post: Post };

export const ComposerContext = createContext<{ open: (o?: ComposerOptions) => void } | null>(null);

/** Ouvre la fenêtre de rédaction (21) : nouveau post ou modification. */
export function useComposer() {
  const ctx = useContext(ComposerContext);
  if (!ctx) throw new Error('useComposer() doit être utilisé dans <ComposerProvider>');
  return ctx;
}
