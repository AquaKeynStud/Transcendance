import { delay, http, HttpResponse } from 'msw';
import type { FeedItem, Media, UserSummary } from '@/lib/types';
import {
  canSeePost,
  db,
  exploreFeed,
  followingFeed,
  getUser,
  item,
  lists,
  ME,
  meProfile,
  pendingRequests,
  profile,
  profileTab,
  rel,
  serialize,
  summary,
} from '@/mocks/db';
import { authHandlers, viewer } from '@/mocks/auth';

// Handlers MSW : ils suivent le contrat de docs/SPEC_TECH.md (§2, §3) en attendant l'OpenAPI.
// Les routes de l'API sont des propositions du front : voir .context/2026-11-24_pages-s3-s4.md.

const API = '/api/v1';
const PAGE = 10;

const err = (status: number, code: string, message: string, fields?: Record<string, string[]>) =>
  HttpResponse.json({ error: { code, message, ...(fields ? { fields } : {}) } }, { status });
const notAuth = () => err(401, 'not_authenticated', 'Connectez-vous pour continuer.');
const notFound = () => err(404, 'not_found', 'Cette page n’existe pas.');

/** Pagination par curseur (le curseur est un simple décalage ici). */
function page<T>(request: Request, all: T[]) {
  const url = new URL(request.url);
  const start = Number(url.searchParams.get('cursor') ?? 0);
  const results = all.slice(start, start + PAGE);
  const next = start + PAGE < all.length ? new URL(url) : null;
  next?.searchParams.set('cursor', String(start + PAGE));
  return HttpResponse.json({ next: next?.toString() ?? null, previous: null, results });
}

const wait = () => delay(250 + Math.random() * 350);

export const handlers = [
  // ------------------------------------------------------------ Session (§2)
  ...authHandlers,
  http.get(`${API}/auth/csrf`, () => new HttpResponse(null, { status: 204 })),
  http.get(`${API}/auth/me`, async () => {
    await delay(150);
    return viewer() ? HttpResponse.json(meProfile()) : notAuth();
  }),

  // ------------------------------------------------------------ Profils (ACC-01, ACC-02)
  http.get(`${API}/users/suggestions`, async () => {
    await wait();
    const v = viewer();
    const list = ['hugo', 'sami', 'camille', 'yanis', 'mehdi']
      .map((u) => getUser(u)!)
      .filter((u) => !v || !rel(v, u.username))
      .slice(0, 3)
      .map((u) => summary(v, u));
    return HttpResponse.json(list);
  }),
  http.get(`${API}/users/:username`, async ({ params }) => {
    await wait();
    const u = getUser(String(params.username));
    return u ? HttpResponse.json(profile(viewer(), u)) : notFound();
  }),
  http.get(`${API}/users/:username/:tab`, async ({ params, request }) => {
    await wait();
    const v = viewer();
    const u = getUser(String(params.username));
    const tab = String(params.tab);
    if (!u) return notFound();
    const p = profile(v, u);
    if (!p.can_see_content)
      return err(
        403,
        'private_account',
        'Ce compte est privé : abonnez-vous pour voir son contenu.',
      );
    if (tab === 'followers' || tab === 'following' || tab === 'friends') {
      const users: UserSummary[] = lists[tab](u.username).map((n) => summary(v, getUser(n)!));
      return page(request, users);
    }
    if (!['posts', 'replies', 'media', 'likes', 'reposts'].includes(tab)) return notFound();
    if ((tab === 'likes' && !p.can_see_likes) || (tab === 'reposts' && !p.can_see_reposts))
      return err(403, 'hidden_by_owner', 'Ce compte a masqué cette liste.');
    return page<FeedItem>(request, profileTab(v, u, tab));
  }),

  // ------------------------------------------------------------ Abonnements (SOC)
  http.post(`${API}/users/:username/follow`, async ({ params }) => {
    await wait();
    const v = viewer();
    if (!v) return notAuth();
    const u = getUser(String(params.username));
    if (!u || u.username === v) return notFound();
    db.follows.set(`${v}>${u.username}`, u.is_private ? 'pending' : 'accepted');
    return HttpResponse.json(profile(v, u));
  }),
  http.delete(`${API}/users/:username/follow`, async ({ params }) => {
    await wait();
    const v = viewer();
    if (!v) return notAuth();
    const u = getUser(String(params.username));
    if (!u) return notFound();
    db.follows.delete(`${v}>${u.username}`);
    return HttpResponse.json(profile(v, u));
  }),
  http.delete(`${API}/me/followers/:username`, async ({ params }) => {
    await wait();
    db.follows.delete(`${String(params.username)}>${ME}`);
    return new HttpResponse(null, { status: 204 });
  }),
  http.get(`${API}/me/follow-requests`, async ({ request }) => {
    await wait();
    const list = pendingRequests()
      .map((u) => ({
        user: summary(ME, getUser(u)!),
        created_at: db.followDates.get(`${u}>${ME}`) ?? new Date().toISOString(),
      }))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return page(request, list);
  }),
  http.post(`${API}/me/follow-requests/:username/:action`, async ({ params }) => {
    await wait();
    const key = `${String(params.username)}>${ME}`;
    if (db.follows.get(key) !== 'pending') return notFound();
    if (params.action === 'accept') db.follows.set(key, 'accepted');
    else if (params.action === 'reject') db.follows.delete(key);
    else return notFound();
    return HttpResponse.json(summary(ME, getUser(String(params.username))!));
  }),

  // ------------------------------------------------------------ Paramètres (ACC-03 à 06)
  http.patch(`${API}/me`, async ({ request }) => {
    await wait();
    const body = (await request.json()) as { display_name?: string; bio?: string };
    const u = getUser(ME)!;
    const fields: Record<string, string[]> = {};
    if (body.display_name !== undefined && body.display_name.length > 50)
      fields.display_name = ['50 caractères maximum.'];
    if (body.bio !== undefined && body.bio.length > 160) fields.bio = ['160 caractères maximum.'];
    if (Object.keys(fields).length)
      return err(400, 'validation_error', 'Certains champs sont invalides.', fields);
    if (body.display_name !== undefined) u.display_name = body.display_name.trim();
    if (body.bio !== undefined) u.bio = body.bio;
    return HttpResponse.json(meProfile());
  }),
  http.post(`${API}/me/avatar`, async ({ request }) => {
    await delay(600);
    const file = (await request.formData()).get('avatar');
    if (!(file instanceof File)) return err(400, 'validation_error', 'Aucun fichier.');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      return err(400, 'invalid_type', 'Choisissez une image JPG, PNG ou WEBP.');
    if (file.size > 2 * 1_048_576) return err(413, 'file_too_large', 'La limite est de 2 Mo.');
    getUser(ME)!.avatar = URL.createObjectURL(file);
    return HttpResponse.json(meProfile());
  }),
  http.delete(`${API}/me/avatar`, async () => {
    await wait();
    getUser(ME)!.avatar = null;
    return HttpResponse.json(meProfile());
  }),
  http.post(`${API}/me/email`, async ({ request }) => {
    await wait();
    const { email, password } = (await request.json()) as { email: string; password: string };
    const fields: Record<string, string[]> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      fields.email = ['Cette adresse n’est pas valide.'];
    else if (email === db.email) fields.email = ['C’est déjà votre adresse.'];
    else if (email === 'lea@exemple.fr')
      fields.email = ['Cette adresse est déjà utilisée par un autre compte.'];
    if (password !== db.password) fields.password = ['Mot de passe incorrect.'];
    if (Object.keys(fields).length)
      return err(400, 'validation_error', 'Certains champs sont invalides.', fields);
    // Le changement ne prend effet qu'après le clic sur le lien envoyé à la nouvelle adresse.
    return new HttpResponse(null, { status: 202 });
  }),
  http.get(`${API}/usernames/:username`, async ({ params }) => {
    await delay(400);
    const name = String(params.username).toLowerCase();
    const taken =
      name === 'admin' || [...db.users.keys()].some((u) => u.toLowerCase() === name && u !== ME);
    return HttpResponse.json({ available: !taken });
  }),
  http.patch(`${API}/me/username`, async ({ request }) => {
    await wait();
    const { username } = (await request.json()) as { username: string };
    if (!/^\w{3,20}$/.test(username))
      return err(400, 'validation_error', 'Nom invalide.', {
        username: ['3 à 20 caractères : lettres, chiffres et _'],
      });
    if (db.users.has(username) && username !== ME)
      return err(409, 'username_taken', 'Ce nom est déjà pris.', {
        username: [`@${username} est déjà pris.`],
      });
    // La maquette garde @aboumall comme identifiant de session : on ne change que l'affichage.
    return HttpResponse.json({ ...meProfile(), username });
  }),
  http.patch(`${API}/me/privacy`, async ({ request }) => {
    await wait();
    const body = (await request.json()) as {
      is_private?: boolean;
      likes_visibility?: 'public' | 'followers' | 'private';
      reposts_visibility?: 'public' | 'followers' | 'private';
    };
    const u = getUser(ME)!;
    if (body.is_private === false && u.is_private)
      // §3.1 : en passant public, les demandes en attente sont acceptées.
      for (const r of pendingRequests()) db.follows.set(`${r}>${ME}`, 'accepted');
    Object.assign(u, body);
    return HttpResponse.json(meProfile());
  }),
  http.post(`${API}/me/password`, async ({ request }) => {
    await wait();
    const { current_password, new_password } = (await request.json()) as Record<string, string>;
    if (current_password !== db.password)
      return err(400, 'validation_error', 'Mot de passe incorrect.', {
        current_password: ['Mot de passe actuel incorrect.'],
      });
    db.password = new_password ?? db.password;
    return new HttpResponse(null, { status: 204 });
  }),

  // ------------------------------------------------------------ Fils (FEED-01, FEED-02)
  http.get(`${API}/feed/following`, async ({ request }) => {
    await delay(500 + Math.random() * 400);
    const v = viewer();
    return v ? page(request, followingFeed(v)) : notAuth();
  }),
  http.get(`${API}/feed/explore`, async ({ request }) => {
    await delay(500 + Math.random() * 400);
    return page(request, exploreFeed(viewer()));
  }),

  // ------------------------------------------------------------ Posts (POST, MEDIA, LIKE, REPOST)
  http.post(`${API}/media`, async ({ request }) => {
    await delay(800);
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return err(400, 'validation_error', 'Aucun fichier.');
    const type: Media['type'] =
      file.type === 'image/gif' ? 'gif' : file.type.startsWith('video') ? 'video' : 'image';
    const media: Media = {
      id: db.nextMediaId++,
      type,
      url: URL.createObjectURL(file),
      width: Number(form.get('width')) || 1600,
      height: Number(form.get('height')) || 900,
      duration: form.get('duration') ? Number(form.get('duration')) : null,
    };
    db.uploads.set(media.id, media);
    return HttpResponse.json(media, { status: 201 });
  }),
  http.post(`${API}/posts`, async ({ request }) => {
    await wait();
    const v = viewer();
    if (!v) return notAuth();
    const body = (await request.json()) as { title: string; content: string; media_ids: number[] };
    const title = body.title.trim();
    if (title.length < 3 || title.length > 120)
      return err(400, 'validation_error', 'Titre invalide.', {
        title: ['Le titre doit faire 3 à 120 caractères.'],
      });
    if (body.content.length > 500)
      return err(400, 'validation_error', 'Texte trop long.', {
        content: ['500 caractères maximum.'],
      });
    const id = db.nextPostId++;
    db.posts.set(id, {
      id,
      author: v,
      title,
      content: body.content.trim(),
      media: body.media_ids.map((m) => db.uploads.get(m)).filter((m): m is Media => !!m),
      parent: null,
      created_at: new Date().toISOString(),
      edited_at: null,
      deleted: null,
      replies: 0,
      extra_likes: 0,
      extra_reposts: 0,
    });
    return HttpResponse.json(item(v, db.posts.get(id)!), { status: 201 });
  }),
  http.patch(`${API}/posts/:id`, async ({ params, request }) => {
    await wait();
    const p = db.posts.get(Number(params.id));
    if (!p || p.deleted) return notFound();
    if (p.author !== viewer()) return err(403, 'forbidden', 'Ce post n’est pas à vous.');
    const body = (await request.json()) as {
      title?: string;
      content?: string;
      media_ids?: number[];
    };
    if (body.title !== undefined) {
      const t = body.title.trim();
      if (p.title !== null && (t.length < 3 || t.length > 120))
        return err(400, 'validation_error', 'Titre invalide.', {
          title: ['Le titre doit faire 3 à 120 caractères.'],
        });
      p.title = t;
    }
    if (body.content !== undefined) p.content = body.content.trim();
    // POST-06 : on peut seulement retirer des médias.
    if (body.media_ids) p.media = p.media.filter((m) => body.media_ids!.includes(m.id));
    p.edited_at = new Date().toISOString();
    return HttpResponse.json(serialize(ME, p));
  }),
  http.delete(`${API}/posts/:id`, async ({ params }) => {
    await wait();
    const p = db.posts.get(Number(params.id));
    if (!p || p.deleted) return notFound();
    if (p.author !== viewer()) return err(403, 'forbidden', 'Ce post n’est pas à vous.');
    // §4.4.1 : la trace reste, le contenu, les J'aime et les republications partent.
    p.deleted = 'author';
    for (const map of [db.likes, db.reposts])
      for (const k of [...map.keys()]) if (k.endsWith(`:${p.id}`)) map.delete(k);
    return HttpResponse.json(serialize(ME, p));
  }),
  ...(['like', 'repost'] as const).flatMap((kind) => [
    http.post(`${API}/posts/:id/${kind}`, async ({ params }) => {
      await delay(200);
      const v = viewer();
      if (!v) return notAuth();
      const p = db.posts.get(Number(params.id));
      if (!p || p.deleted || !canSeePost(v, p)) return notFound();
      if (kind === 'repost' && getUser(p.author)!.is_private && p.author !== v)
        return err(403, 'private_repost', 'Impossible de republier le post d’un compte privé.');
      (kind === 'like' ? db.likes : db.reposts).set(`${v}:${p.id}`, new Date().toISOString());
      return HttpResponse.json(serialize(v, p));
    }),
    http.delete(`${API}/posts/:id/${kind}`, async ({ params }) => {
      await delay(200);
      const v = viewer();
      if (!v) return notAuth();
      const p = db.posts.get(Number(params.id));
      if (!p) return notFound();
      (kind === 'like' ? db.likes : db.reposts).delete(`${v}:${p.id}`);
      return HttpResponse.json(serialize(v, p));
    }),
  ]),
];
