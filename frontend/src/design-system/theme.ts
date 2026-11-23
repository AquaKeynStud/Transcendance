import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const KEY = 'theme';
const listeners = new Set<() => void>();

function read(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Change le thème : attribut data-theme sur <html>, gardé dans localStorage. Sombre par défaut. */
export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Stockage indisponible (navigation privée) : le thème vaut pour la session.
  }
  listeners.forEach((l) => l());
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const theme = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    (): Theme => 'dark',
  );
  return [theme, setTheme];
}
