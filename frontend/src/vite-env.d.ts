interface ImportMetaEnv {
  /** "off" coupe MSW en dev : les appels /api partent alors vers le backend. */
  readonly VITE_MSW?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
