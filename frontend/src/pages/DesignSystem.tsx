import { PageHead } from '@/app/layouts/PageHead';
import { useTheme } from '@/design-system/theme';

// Page /design-system : pour l'instant, les tokens seulement (front/feat/design-tokens).
// Les composants s'y ajouteront avec front/feat/ds-showcase.

const groups: { title: string; tokens: { name: string; usage: string }[] }[] = [
  {
    title: 'Surfaces et lignes',
    tokens: [
      { name: 'bg', usage: 'Fond de page' },
      { name: 'card', usage: 'Fond des cartes (= surface)' },
      { name: 'card-line', usage: 'Bord des cartes' },
      { name: 'well', usage: 'Creux dans une carte' },
      { name: 'line', usage: 'Séparations, nav, onglets' },
      { name: 'line-strong', usage: 'Bord des champs' },
      { name: 'avatar', usage: 'Avatar sans photo' },
    ],
  },
  {
    title: 'Texte, accent et liens',
    tokens: [
      { name: 'text', usage: 'Texte, accent' },
      { name: 'accent-ink', usage: 'Texte sur l’accent' },
      { name: 'text-2', usage: 'Texte secondaire' },
      { name: 'text-3', usage: '@username, dates' },
      { name: 'link', usage: 'Mentions, « Voir plus »' },
    ],
  },
  {
    title: 'Couleurs fonctionnelles',
    tokens: [
      { name: 'like', usage: 'J’aime' },
      { name: 'repost', usage: 'Republier' },
      { name: 'success', usage: 'En ligne, succès' },
      { name: 'danger', usage: 'Erreur' },
      { name: 'danger-fill', usage: 'Bouton Supprimer' },
      { name: 'warning', usage: 'Avertissement' },
    ],
  },
];

const type: { cls: string; label: string; sample: string }[] = [
  { cls: 'text-display font-extrabold', label: 'Display · 28 / 800', sample: 'transcendance' },
  {
    cls: 'text-title font-extrabold',
    label: 'Titre de page · 20 / 800',
    sample: 'Fil Abonnements',
  },
  {
    cls: 'text-post-title font-extrabold',
    label: 'Titre de post · 18 / 800',
    sample: 'Train de nuit pour Vienne',
  },
  {
    cls: 'text-card-title font-extrabold',
    label: 'Titre de carte · 17 / 800',
    sample: 'Commentaires',
  },
  { cls: 'text-nav', label: 'Nav · 19 / 400', sample: 'Explorer' },
  {
    cls: 'text-post',
    label: 'Texte de post · 15 / 1,5',
    sample: 'Le texte des posts, avec une @mention.',
  },
  { cls: 'text-comment', label: 'Commentaire · 14 / 1,45', sample: 'Un commentaire sous le post.' },
  { cls: 'text-caption text-text-3', label: 'Légende · 13', sample: '@lea_n · il y a 2 h' },
  { cls: 'text-overline font-semibold uppercase', label: 'Sur-titre · 12 / 600', sample: 'Météo' },
];

/** Valeurs des variables CSS dans le thème courant. data-theme change avant le rendu (setTheme), donc la lecture est à jour. */
function readTokens(names: string[]) {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(names.map((n) => [n, style.getPropertyValue(`--${n}`).trim()]));
}

const allNames = groups.flatMap((g) => g.tokens.map((t) => t.name));

export function DesignSystem() {
  const [theme, setTheme] = useTheme();
  const values = readTokens(allNames);
  return (
    <>
      <PageHead
        title="Design system"
        sub="Flat lines · v0.5 · tokens"
        end={
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex h-8 items-center rounded-full border border-line-strong px-3.5 text-sm font-bold transition-colors duration-150 hover:bg-hover"
          >
            Thème {theme === 'dark' ? 'clair' : 'sombre'}
          </button>
        }
      />
      <div className="flex flex-col gap-8 px-5 py-6">
        {groups.map((g) => (
          <section key={g.title} className="flex flex-col gap-3">
            <h2 className="text-card-title">{g.title}</h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
              {g.tokens.map((t) => (
                <li
                  key={t.name}
                  className="overflow-hidden rounded-md border border-card-line bg-card"
                >
                  <div
                    className="h-14 border-b border-card-line"
                    style={{ background: `var(--${t.name})` }}
                  />
                  <div className="p-3 leading-snug">
                    <code className="text-xs">--{t.name}</code>
                    <p className="mt-1 text-caption text-text-2">{t.usage}</p>
                    <p className="font-mono text-xs text-text-3 uppercase">{values[t.name]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="flex flex-col gap-3">
          <h2 className="text-card-title">Typographie · Inter</h2>
          <ul className="divide-y divide-line">
            {type.map((t) => (
              <li
                key={t.label}
                className="flex flex-wrap items-baseline justify-between gap-x-4 py-3"
              >
                <span className={t.cls}>{t.sample}</span>
                <span className="text-caption text-text-3">{t.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-card-title">Rayons et espacements</h2>
          <div className="flex flex-wrap items-end gap-4">
            {[
              ['rounded-sm', '8 px · champs, menus'],
              ['rounded-md', '16 px · cartes, médias'],
              ['rounded-full', 'pilule · boutons, nav'],
            ].map(([cls, label]) => (
              <div key={cls} className="flex flex-col gap-2">
                <div className={`h-12 w-28 border border-card-line bg-card ${cls}`} />
                <span className="text-caption text-text-3">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <div className="bg-text-3" style={{ width: n * 4, height: n * 4 }} />
                <span className="text-caption text-text-3">{n * 4}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
