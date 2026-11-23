/** Compteurs : 1 234 → « 1,2 k », 12 000 → « 12 k ». */
export function fmtCount(n: number) {
  if (n >= 10_000) return `${Math.round(n / 1000)} k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.', ',')} k`;
  return String(n);
}

/** Date relative courte des posts : « à l'instant », « 5 min », « 2 h », « 3 j », puis la date. */
export function timeAgo(iso: string, now = Date.now()) {
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'à l’instant';
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  if (s < 86_400) return `${Math.floor(s / 3600)} h`;
  if (s < 7 * 86_400) return `${Math.floor(s / 86_400)} j`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/** « 22 novembre 2026 à 18:04 » (survol de « (modifié) », POST-06). */
export function dateTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}

/** « septembre 2026 » (date d'inscription, ACC-01). */
export function monthYear(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

/** « 1:48 » */
export function duration(seconds: number) {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** « 7,8 Mo » */
export function megabytes(bytes: number) {
  return `${(bytes / 1_048_576).toFixed(1).replace('.', ',')} Mo`;
}

/** Accord simple : plural(3, 'demande') → « 3 demandes ». */
export function plural(n: number, word: string, pluralWord = `${word}s`) {
  return `${n} ${n > 1 ? pluralWord : word}`;
}
