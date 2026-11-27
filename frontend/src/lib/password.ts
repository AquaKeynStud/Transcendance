// Règles du mot de passe affichées pendant la saisie. Elles reprennent les validateurs
// de Django (longueur, numérique, courant, similarité) : le backend reste juge, et son
// message s'affiche s'il refuse quand même.

export type PasswordRule = { ok: boolean; label: string };

const COMMON = [
  'password',
  'password1',
  'motdepasse',
  '12345678',
  '123456789',
  'azertyuiop',
  'azerty123',
  'qwertyuiop',
  'iloveyou',
  'transcendance1',
];

/** Les trois règles communes : longueur, pas que des chiffres, pas trop courant. */
export function baseRules(pw: string): PasswordRule[] {
  return [
    { ok: pw.length >= 8, label: '8 caractères min.' },
    { ok: !!pw && !/^\d+$/.test(pw), label: 'Pas que des chiffres' },
    { ok: !!pw && !COMMON.includes(pw.toLowerCase()), label: 'Pas trop courant' },
  ];
}

/** Ne contient pas le nom d'utilisateur ni le début de l'email (3 caractères ou plus). */
export function similarRule(pw: string, others: string[]): PasswordRule {
  const low = pw.toLowerCase();
  return {
    ok: !!pw && others.every((o) => o.length < 3 || !low.includes(o.toLowerCase())),
    label: 'Différent du pseudo',
  };
}

/** Règles d'un nouveau compte ou d'une réinitialisation. */
export function newPasswordRules(pw: string, others: string[]) {
  return [...baseRules(pw), similarRule(pw, others)];
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_RE = /^\w{3,20}$/;
