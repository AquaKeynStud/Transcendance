import { delay, http, HttpResponse } from 'msw';
import { db, getUser, ME, meProfile } from '@/mocks/db';

// Authentification (AUTH-01 à 05) : SPEC_TECH §2 donne register, login, logout, me et csrf.
// Les autres routes (vérification, réinitialisation) sont des propositions du front,
// voir .context/2026-11-24_pages-s2.md.
//
// Comptes de test :
// - aboumall (ou aboumall@exemple.fr), mot de passe « transcendance » ;
// - nouveau@exemple.fr, même mot de passe : email pas encore vérifié.
// Jetons de test : /verify-email?token=demo, /reset-password?token=demo, et token=expired.

const API = '/api/v1';
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60_000;

type Account = { email: string; username: string; password: string; verified: boolean };

const store = {
  get session() {
    return read('mock-session') === '1';
  },
  set session(on: boolean) {
    write('mock-session', on ? '1' : null);
  },
  get accounts(): Account[] {
    try {
      return JSON.parse(read('mock-accounts') ?? '[]') as Account[];
    } catch {
      return [];
    }
  },
  set accounts(list: Account[]) {
    write('mock-accounts', JSON.stringify(list));
  },
};

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // stockage indisponible : la session ne survit pas au rechargement
  }
}

const SEED: Account[] = [
  { email: 'nouveau@exemple.fr', username: 'nouveau', password: 'transcendance', verified: false },
];
const accounts = () => [...SEED, ...store.accounts];

/** L'user vu par l'API : aboumall si la session est ouverte, sinon un visiteur. */
export function viewer(): string | null {
  return store.session ? ME : null;
}

// Blocage après 5 échecs (le compteur repart à zéro au rechargement de la page)
let fails = 0;
let lockedUntil = 0;

const err = (
  status: number,
  code: string,
  message: string,
  extra: { fields?: Record<string, string[]>; details?: Record<string, unknown> } = {},
) => HttpResponse.json({ error: { code, message, ...extra } }, { status });

const locked = () =>
  err(429, 'too_many_attempts', 'Trop de tentatives. Réessayez dans quelques minutes.', {
    details: { retry_after: Math.ceil((lockedUntil - Date.now()) / 1000) },
  });

const wait = () => delay(300 + Math.random() * 300);
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

export const authHandlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    await wait();
    if (lockedUntil > Date.now()) return locked();
    const { login = '', password = '' } = (await request.json()) as Record<string, string>;
    const id = login.trim();
    const isMe = same(id, ME) || same(id, db.email);
    const other = accounts().find((a) => same(id, a.email) || same(id, a.username));

    if (isMe && password === db.password) {
      fails = 0;
      store.session = true;
      return HttpResponse.json(meProfile());
    }
    if (other && password === other.password) {
      if (!other.verified)
        return err(
          403,
          'email_not_verified',
          'Confirmez votre adresse email pour vous connecter.',
          {
            details: { email: other.email },
          },
        );
      // Le mock ne sait servir que les données d'aboumall : un nouveau compte s'y connecte.
      fails = 0;
      store.session = true;
      return HttpResponse.json(meProfile());
    }
    fails++;
    if (fails >= MAX_FAILS) {
      lockedUntil = Date.now() + LOCK_MS;
      fails = 0;
      return locked();
    }
    return err(400, 'invalid_credentials', 'Identifiants incorrects.', {
      details: { remaining_attempts: MAX_FAILS - fails },
    });
  }),

  http.post(`${API}/auth/logout`, async () => {
    await delay(150);
    store.session = false;
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    await wait();
    const {
      email = '',
      username = '',
      password = '',
    } = (await request.json()) as Record<string, string>;
    const fields: Record<string, string[]> = {};
    const all = accounts();
    if (
      same(email, db.email) ||
      same(email, 'lea@exemple.fr') ||
      all.some((a) => same(a.email, email))
    )
      fields.email = ['Un compte existe déjà avec cette adresse.'];
    if (!/^\w{3,20}$/.test(username))
      fields.username = ['3 à 20 caractères : lettres, chiffres et _.'];
    else if (
      same(username, 'admin') ||
      getUser(username) ||
      [...db.users.keys()].some((u) => same(u, username)) ||
      all.some((a) => same(a.username, username))
    )
      fields.username = [`@${username} est déjà pris.`];
    if (password.length < 8) fields.password = ['Au moins 8 caractères.'];
    if (Object.keys(fields).length)
      return err(400, 'validation_error', 'Certains champs sont invalides.', { fields });
    store.accounts = [...store.accounts, { email, username, password, verified: false }];
    return HttpResponse.json({ email, username }, { status: 201 });
  }),

  http.post(`${API}/auth/verify-email`, async ({ request }) => {
    await wait();
    const { token = '' } = (await request.json()) as Record<string, string>;
    if (token === 'expired')
      return err(410, 'token_expired', 'Ce lien a expiré. Demandez-en un nouveau.');
    if (!token) return err(400, 'invalid_token', 'Ce lien n’est pas valide.');
    // Le dernier compte créé est confirmé (le mock n'envoie pas de vrai jeton)
    const list = store.accounts;
    const last = [...list].reverse().find((a) => !a.verified);
    if (last) last.verified = true;
    store.accounts = list;
    return HttpResponse.json({ username: last?.username ?? null });
  }),

  http.post(`${API}/auth/verify-email/resend`, async () => {
    await wait();
    return new HttpResponse(null, { status: 204 });
  }),

  // Réponse identique que le compte existe ou non : ne révèle pas les emails inscrits.
  http.post(`${API}/auth/password-reset`, async () => {
    await wait();
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API}/auth/password-reset/:token`, async ({ params }) => {
    await wait();
    if (params.token === 'expired')
      return err(410, 'token_expired', 'Ce lien a expiré. Demandez-en un nouveau.');
    return HttpResponse.json({ username: ME });
  }),

  http.post(`${API}/auth/password-reset/:token`, async ({ params, request }) => {
    await wait();
    if (params.token === 'expired')
      return err(410, 'token_expired', 'Ce lien a expiré. Demandez-en un nouveau.');
    const { password = '' } = (await request.json()) as Record<string, string>;
    if (password.length < 8)
      return err(400, 'validation_error', 'Certains champs sont invalides.', {
        fields: { password: ['Au moins 8 caractères.'] },
      });
    db.password = password;
    fails = 0;
    lockedUntil = 0;
    // « Vous serez déconnecté de vos autres appareils »
    store.session = false;
    return new HttpResponse(null, { status: 204 });
  }),
];
