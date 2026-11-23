// Base de données en mémoire de MSW : les comptes, posts et relations des maquettes flat lines.
// Elle applique les règles de visibilité de SPEC_FONC §3 comme le fera le backend,
// pour que le front se comporte déjà comme avec la vraie API. Recharger la page la remet à zéro.
import type {
  FeedItem,
  Me,
  Media,
  Post,
  Profile,
  Relation,
  UserSummary,
  Visibility,
} from '@/lib/types';

type UserRow = {
  id: number;
  username: string;
  display_name: string;
  bio: string;
  avatar: string | null;
  is_private: boolean;
  online: boolean;
  created_at: string;
  likes_visibility: Visibility;
  reposts_visibility: Visibility;
  /** Comptes hors de la maquette, pour avoir des compteurs réalistes. */
  extra: { followers: number; following: number; posts: number };
};

type PostRow = {
  id: number;
  author: string;
  title: string | null;
  content: string;
  media: Media[];
  parent: number | null;
  created_at: string;
  edited_at: string | null;
  deleted: null | 'author' | 'moderation';
  replies: number;
  /** J'aime et republications de comptes hors maquette (compteurs anonymes, §3.2). */
  extra_likes: number;
  extra_reposts: number;
};

export const ME = 'aboumall';
export const PASSWORD = 'transcendance';
const now = Date.now();
const ago = (min: number) => new Date(now - min * 60_000).toISOString();
const H = 60;
const D = 24 * H;

function user(
  id: number,
  username: string,
  display_name: string,
  bio: string,
  o: Partial<UserRow> = {},
): UserRow {
  return {
    id,
    username,
    display_name,
    bio,
    avatar: null,
    is_private: false,
    online: false,
    created_at: '2026-10-04T10:00:00Z',
    likes_visibility: 'public',
    reposts_visibility: 'public',
    extra: { followers: 0, following: 0, posts: 0 },
    ...o,
  };
}

export const db = {
  email: 'aboumall@exemple.fr',
  password: PASSWORD,
  users: new Map<string, UserRow>(
    [
      user(
        1,
        'aboumall',
        'aboumall',
        'Front de transcendance. Je maquette, je code, je recommence. Lyon.',
        {
          is_private: true,
          online: true,
          created_at: '2026-09-12T10:00:00Z',
          extra: { followers: 0, following: 0, posts: 120 },
        },
      ),
      user(2, 'lea_n', 'Léa N.', 'Front et design system. Flat lines, toujours.', {
        online: true,
        created_at: '2026-09-14T10:00:00Z',
        likes_visibility: 'followers',
        extra: { followers: 207, following: 55, posts: 337 },
      }),
      user(3, 'mehdi', 'Mehdi B.', 'Backend Django, pagination par curseur et café.', {
        likes_visibility: 'private',
        extra: { followers: 66, following: 39, posts: 85 },
      }),
      user(4, 'nora', 'Nora', 'WebSocket, Redis, et beaucoup de logs.', {
        is_private: true,
        extra: { followers: 23, following: 19, posts: 54 },
      }),
      user(5, 'theok', 'Théo K.', 'DevOps · nginx · Vault', {
        extra: { followers: 88, following: 30, posts: 60 },
      }),
      user(6, 'sami', 'Sami M.', 'MSW, TanStack Query, tests.', {
        extra: { followers: 40, following: 41, posts: 31 },
      }),
      user(7, 'jade', 'Jade', 'RGPD et pages légales.', {
        online: true,
        extra: { followers: 51, following: 47, posts: 44 },
      }),
      user(8, 'ines', 'Inès R.', 'Photo argentique, trains de nuit.', {
        is_private: true,
        created_at: '2026-11-02T10:00:00Z',
        extra: { followers: 13, following: 10, posts: 22 },
      }),
      user(9, 'yanis', 'Yanis', 'Étudiant 42 Lyon.', {
        extra: { followers: 4, following: 12, posts: 3 },
      }),
      user(10, 'camille', 'Camille D.', 'Je poste surtout des photos de chats.', {
        is_private: true,
        extra: { followers: 31, following: 18, posts: 40 },
      }),
      user(11, 'hugo', 'Hugo L.', 'Speedrun, Snake, et le plugin météo.', {
        extra: { followers: 19, following: 22, posts: 12 },
      }),
    ].map((u) => [u.username, u]),
  ),
  /** follower → suivi, avec l'état de l'abonnement. */
  follows: new Map<string, 'pending' | 'accepted'>([
    ['aboumall>lea_n', 'accepted'],
    ['aboumall>theok', 'accepted'],
    ['aboumall>jade', 'accepted'],
    ['aboumall>ines', 'accepted'],
    ['aboumall>nora', 'pending'],
    ['lea_n>aboumall', 'accepted'],
    ['mehdi>aboumall', 'accepted'],
    ['jade>aboumall', 'accepted'],
    ['ines>aboumall', 'accepted'],
    ['camille>aboumall', 'pending'],
    ['yanis>aboumall', 'pending'],
    ['hugo>aboumall', 'pending'],
    ['lea_n>jade', 'accepted'],
    ['jade>lea_n', 'accepted'],
    ['theok>lea_n', 'accepted'],
    ['mehdi>lea_n', 'accepted'],
  ]),
  followDates: new Map<string, string>([
    ['camille>aboumall', ago(5)],
    ['yanis>aboumall', ago(2 * H)],
    ['hugo>aboumall', ago(D)],
  ]),
  posts: new Map<number, PostRow>(),
  /** « user:postId » → date, du plus ancien au plus récent. */
  likes: new Map<string, string>(),
  reposts: new Map<string, string>(),
  nextPostId: 100,
  nextMediaId: 1000,
  /** Médias envoyés, pas encore attachés à un post. */
  uploads: new Map<number, Media>(),
};

// ---------------------------------------------------------------- Posts de départ

const RATIOS: Record<string, [number, number]> = {
  '16:9': [1600, 900],
  '4:3': [1600, 1200],
  '3:2': [1500, 1000],
  '3:4': [900, 1200],
  '4:5': [960, 1200],
  '9:16': [900, 1600],
};
function m(ar: string, type: Media['type'] = 'image', duration: number | null = null): Media {
  const [width, height] = RATIOS[ar] ?? [1600, 900];
  return { id: db.nextMediaId++, type, url: null, width, height, duration };
}

function post(
  id: number,
  author: string,
  minutesAgo: number,
  title: string | null,
  content: string,
  o: Partial<PostRow> & { likes?: number; reposts?: number } = {},
) {
  const { likes = 0, reposts = 0, ...rest } = o;
  db.posts.set(id, {
    id,
    author,
    title,
    content,
    media: [],
    parent: null,
    created_at: ago(minutesAgo),
    edited_at: null,
    deleted: null,
    replies: 0,
    extra_likes: likes,
    extra_reposts: reposts,
    ...rest,
  });
}

const LONG_MEHDI =
  'Bilan rapide de S1 pour ceux qui n’étaient pas à la rétro. Côté back, le modèle Post est en place avec le titre obligatoire, et la pagination par curseur fonctionne sur le fil. @theok a branché le WebSocket pour les notifications, il reste à gérer la reconnexion propre quand le token expire. Côté front, @lea_n a fini les maquettes flat lines et on attaque le setup Vite + Tailwind lundi. Points de vigilance : on a sous-estimé la partie médias (upload, progression, aperçu), il faudra sûrement la découper en deux tickets. Et on doit trancher sessions ou JWT avant mercredi, sinon le front et le back vont partir dans deux directions. Dernier point : pensez à remplir vos contributions individuelles dans le README au fil de l’eau, ce sera beaucoup plus simple qu’à la fin.';
const LONG_INES =
  'Compte privé : on peut aimer ce post, mais pas le republier. Deux photos horizontales : l’aperçu passe en grand (4:3 sur toute la largeur) et le post peut aller jusqu’à 65 % du fil. Départ à 19 h de la gare de l’Est, couchettes de six, réveil à Munich avec un café tiède et la brume sur les champs. Arrivée à Vienne vers 9 h, juste à temps pour le premier tram. Je referais le trajet sans hésiter, même si dormir dans un train reste un sport à part entière.';
const LONG_ME =
  'On a testé plusieurs règles de troncature. Couper à un nombre de lignes fixe ne marche pas : un post avec une image prend tout l’écran alors qu’un post texte reste minuscule. Avec un budget de hauteur, chaque post occupe au plus 45 % du fil visible, quel que soit l’écran. Le texte prend la place qui reste après l’en-tête, le titre, les médias et les actions. Sur un grand écran on lit plus de lignes, sur un portable un peu moins, et « Voir plus » apparaît seulement si le texte dépasse vraiment. Le minimum reste 3 lignes pour ne jamais afficher un post sans texte lisible.';

post(
  1,
  'aboumall',
  5,
  'Maquettes S3 et S4 terminées',
  'Profil, listes, demandes, paramètres, fil, rédaction, modification et suppression. Testez le menu « … » de ce post : vous pouvez le modifier ou le supprimer. @lea_n @mehdi vos retours sont les bienvenus.',
  { media: [m('16:9'), m('3:4')], replies: 2, likes: 8, reposts: 1 },
);
post(
  2,
  'lea_n',
  12,
  'Premier rendu du style « flat lines »',
  'Plus de verre : des aplats, des lignes grises et c’est tout. Une seule image horizontale : l’aperçu prend son format, sur toute la largeur. @aboumall tu valides avant que je pousse la branche ?',
  { media: [m('16:9')], replies: 12, likes: 85, reposts: 4 },
);
post(3, 'mehdi', 34, 'Retour sur la première semaine de sprint', LONG_MEHDI, {
  replies: 9,
  likes: 27,
  reposts: 2,
});
post(
  4,
  'theok',
  60,
  'WebSocket : uniquement pour pousser',
  'Toutes les actions passent par l’API REST. Le WebSocket ne fait que pousser les nouveautés. Une seule couche de permissions, moins de bugs.',
  { replies: 3, likes: 40, reposts: 9, edited_at: ago(50) },
);
post(5, 'theok', 80, 'Reconnexion', 'Post supprimé par son auteur.', { deleted: 'author' });
post(
  6,
  'jade',
  2 * H,
  'Un média vertical et deux horizontaux',
  'Il y a un média vertical : l’aperçu garde la hauteur fixe de 260 px, et les horizontaux se calent dessus.',
  { media: [m('9:16'), m('4:3'), m('16:9')], replies: 5, likes: 32, reposts: 6 },
);
post(7, 'ines', 4 * H, 'Train de nuit Paris → Vienne', LONG_INES, {
  media: [m('3:2'), m('3:2')],
  replies: 2,
  likes: 12,
});
post(8, 'jade', 5 * H, 'Spam', '', { deleted: 'moderation' });
post(
  9,
  'lea_n',
  6 * H,
  'Quatre captures du design system',
  'Quatre images horizontales : la grille entière passe en 4:3.',
  { media: [m('16:9'), m('16:9'), m('4:3'), m('16:9')], replies: 1, likes: 22, reposts: 3 },
);
post(
  10,
  'theok',
  8 * H,
  'Démo de la reconnexion WebSocket',
  'Une vidéo est toujours seule (MEDIA-02).',
  { media: [m('16:9', 'video', 72)], replies: 4, likes: 18, reposts: 2 },
);
post(
  11,
  'jade',
  9 * H,
  'Portrait seul',
  'Une image verticale seule garde la hauteur fixe et sa largeur naturelle.',
  { media: [m('4:5')], likes: 7, reposts: 1 },
);
post(
  12,
  'hugo',
  3,
  'Record battu sur le plugin Snake',
  'Quelqu’un a réussi à dépasser 240 ? Je partage la vidéo dès que le plugin est en ligne.',
  { media: [m('16:9', 'gif')], replies: 7, likes: 31, reposts: 2 },
);
post(
  13,
  'yanis',
  20,
  'Première semaine à 42 Lyon',
  'Je découvre transcendance. Les maquettes sont vraiment propres, bravo à l’équipe front.',
  { replies: 2, likes: 11 },
);
post(
  14,
  'sami',
  70,
  'MSW + TanStack Query : une config propre ?',
  'Je cherche une config propre pour mocker la pagination par curseur. Quelqu’un a déjà un handler qui renvoie next correctement ?',
  { replies: 8, likes: 19, reposts: 1 },
);
post(
  15,
  'aboumall',
  2 * H,
  'Design system v0.5 : des fonds plus sombres',
  'Fond #0D0F11 en sombre, blanc en clair, et les cartes gardent le même écart. Tous les textes restent au-dessus de 4,5:1. @lea_n tu peux relire la page design system ?',
  { media: [m('16:9'), m('4:3')], replies: 6, likes: 30, reposts: 2 },
);
post(
  16,
  'aboumall',
  D,
  'Les médias verticaux gardent la hauteur fixe',
  'Une image verticale seule garde sa largeur naturelle. Dès qu’il y a un média vertical, les horizontaux se calent sur la même hauteur.',
  { media: [m('3:4')], replies: 3, likes: 18, edited_at: ago(20 * H) },
);
post(17, 'aboumall', 3 * D, 'Pourquoi le post entier tient dans 45 % du fil', LONG_ME, {
  replies: 11,
  likes: 52,
  reposts: 4,
});
post(
  18,
  'aboumall',
  5 * D,
  'Vidéo de la démo du fil',
  'Deux minutes maximum, une vidéo toujours seule.',
  { media: [m('16:9', 'video', 108)], replies: 2, likes: 14, reposts: 1 },
);
post(
  19,
  'mehdi',
  D + 2 * H,
  'Visibilité : la règle du §3',
  'La visibilité d’un post dépend de l’état actuel du compte de son auteur, pas de son état au moment de la publication.',
  { replies: 6, likes: 24, reposts: 3 },
);
post(
  20,
  'lea_n',
  D + 5 * H,
  'Deux photos du hackathon',
  'Deux horizontales : aperçu en 4:3 sur toute la largeur.',
  { media: [m('3:2'), m('4:3')], replies: 3, likes: 17, reposts: 1 },
);
post(
  21,
  'jade',
  2 * D,
  'RGPD : ce qu’on exporte',
  'Profil, posts, J’aime, republications, abonnements et messages, dans un JSON lisible.',
  { replies: 1, likes: 8 },
);
post(
  22,
  'jade',
  8 * H,
  'Les pages légales, ce n’est pas qu’une formalité',
  'Il faut un vrai contenu pour la soutenance : données collectées, durée de conservation, droits RGPD, contact.',
  { replies: 5, likes: 32, reposts: 6 },
);
post(
  23,
  'nora',
  3 * H,
  'Redis en prod',
  'Compte privé : ce post n’est visible que par mes abonnés.',
  { likes: 4 },
);
post(
  24,
  'lea_n',
  D + 8 * H,
  'Trois photos du hackathon',
  'Une verticale, deux horizontales : les horizontales se calent sur la hauteur fixe.',
  { media: [m('3:4'), m('4:3'), m('16:9')], replies: 4, likes: 40, reposts: 2 },
);
post(
  25,
  'theok',
  3 * D,
  'nginx + ModSecurity',
  'Premier passage du WAF sur l’API : aucune fausse alerte sur les uploads de médias.',
  { replies: 2, likes: 15, reposts: 1 },
);
post(
  26,
  'mehdi',
  4 * D,
  'Les tests passent',
  'pytest + pytest-django branchés dans la CI. 62 tests, 4 secondes.',
  { likes: 9 },
);
// Réponses (POST-03) : pas de titre
post(40, 'aboumall', 40, null, 'Oui, et le « Voir plus » se recalcule au redimensionnement.', {
  parent: 2,
  likes: 4,
});
post(
  41,
  'aboumall',
  6 * H,
  null,
  'On garde la pagination par curseur côté fil, c’est plus simple pour le défilement infini.',
  { parent: 3, likes: 2 },
);
post(42, 'aboumall', 2 * D, null, 'Le WebSocket ne fait que pousser : ça me va très bien.', {
  parent: 4,
  media: [m('16:9')],
  likes: 9,
});
post(
  43,
  'lea_n',
  30,
  null,
  'Relu, c’est bon pour moi. Le blanc pur en clair rend vraiment mieux.',
  { parent: 15, likes: 3 },
);

// J'aime et republications de la maquette
for (const [u, p, min] of [
  ['aboumall', 2, 10],
  ['aboumall', 22, 7 * H],
  ['aboumall', 4, 50],
  ['lea_n', 1, 4],
  ['lea_n', 22, 7 * H],
  ['jade', 4, 55],
] as const)
  db.likes.set(`${u}:${p}`, ago(min));
for (const [u, p, min] of [
  ['jade', 4, 58],
  ['lea_n', 4, 59],
  ['aboumall', 22, 6 * H],
] as const)
  db.reposts.set(`${u}:${p}`, ago(min));

// ---------------------------------------------------------------- Règles et sérialisation

export const rel = (a: string, b: string) => db.follows.get(`${a}>${b}`);
const accepted = (a: string, b: string) => rel(a, b) === 'accepted';

export function getUser(username: string) {
  return db.users.get(username) ?? null;
}

/** §3.1 : le viewer voit-il les posts, réponses, médias et listes de `owner` ? */
export function canSeeContent(viewer: string | null, owner: UserRow) {
  return (
    !owner.is_private || viewer === owner.username || (!!viewer && accepted(viewer, owner.username))
  );
}

/** §3.2 */
function canSeeActivity(viewer: string | null, owner: UserRow, v: Visibility) {
  if (viewer === owner.username) return true;
  if (!canSeeContent(viewer, owner)) return false;
  if (v === 'public') return true;
  return v === 'followers' && !!viewer && accepted(viewer, owner.username);
}

const followersOf = (u: string) =>
  [...db.follows]
    .filter(([k, s]) => s === 'accepted' && k.endsWith(`>${u}`))
    .map(([k]) => k.split('>')[0]!);
const followingOf = (u: string) =>
  [...db.follows]
    .filter(([k, s]) => s === 'accepted' && k.startsWith(`${u}>`))
    .map(([k]) => k.split('>')[1]!);
export const friendsOf = (u: string) => followingOf(u).filter((f) => accepted(f, u));
export const lists = { followers: followersOf, following: followingOf, friends: friendsOf };

export function summary(viewer: string | null, u: UserRow): UserSummary {
  const r = viewer ? rel(viewer, u.username) : undefined;
  const relation: Relation =
    r === 'accepted' ? 'following' : r === 'pending' ? 'requested' : 'none';
  const isFriend = !!viewer && accepted(viewer, u.username) && accepted(u.username, viewer);
  return {
    id: u.id,
    username: u.username,
    display_name: u.display_name || u.username,
    avatar: u.avatar,
    bio: u.bio,
    is_private: u.is_private,
    relation,
    follows_me: !!viewer && accepted(u.username, viewer),
    is_online: viewer === u.username ? true : isFriend ? u.online : null,
  };
}

export function profile(viewer: string | null, u: UserRow): Profile {
  const posts = [...db.posts.values()].filter(
    (p) => p.author === u.username && !p.parent && !p.deleted,
  );
  return {
    ...summary(viewer, u),
    created_at: u.created_at,
    posts_count: posts.length + u.extra.posts,
    followers_count: followersOf(u.username).length + u.extra.followers,
    following_count: followingOf(u.username).length + u.extra.following,
    friends_count: friendsOf(u.username).length,
    likes_visibility: u.likes_visibility,
    reposts_visibility: u.reposts_visibility,
    can_see_content: canSeeContent(viewer, u),
    can_see_likes: canSeeActivity(viewer, u, u.likes_visibility),
    can_see_reposts: canSeeActivity(viewer, u, u.reposts_visibility),
  };
}

export function meProfile(): Me {
  const u = db.users.get(ME)!;
  return {
    ...profile(ME, u),
    email: db.email,
    role: 'user',
    pending_requests_count: pendingRequests().length,
  };
}

export const pendingRequests = () =>
  [...db.follows]
    .filter(([k, s]) => s === 'pending' && k.endsWith(`>${ME}`))
    .map(([k]) => k.split('>')[0]!);

const count = (map: Map<string, string>, id: number) =>
  [...map.keys()].filter((k) => k.endsWith(`:${id}`)).length;

/** Un post est-il visible par le viewer ? Auteur privé : seulement ses abonnés (§3.1). */
export function canSeePost(viewer: string | null, p: PostRow) {
  const a = db.users.get(p.author);
  return !!a && canSeeContent(viewer, a);
}

export function serialize(viewer: string | null, p: PostRow): Post {
  const parent = p.parent ? db.posts.get(p.parent) : null;
  const base = {
    id: p.id,
    parent: parent
      ? { id: parent.id, author_username: parent.deleted ? null : parent.author }
      : null,
    created_at: p.created_at,
    replies_count: p.replies,
  };
  if (p.deleted)
    return {
      ...base,
      author: null,
      title: null,
      content: '',
      media: [],
      mentions: [],
      edited_at: null,
      deleted: p.deleted,
      likes_count: 0,
      reposts_count: 0,
      liked: false,
      reposted: false,
    };
  const mentions = [...new Set([...p.content.matchAll(/@(\w{3,20})/g)].map((x) => x[1]!))]
    .filter((u) => db.users.has(u))
    .slice(0, 10);
  return {
    ...base,
    author: summary(viewer, db.users.get(p.author)!),
    title: p.title,
    content: p.content,
    media: p.media,
    mentions,
    edited_at: p.edited_at,
    deleted: null,
    likes_count: count(db.likes, p.id) + p.extra_likes,
    reposts_count: count(db.reposts, p.id) + p.extra_reposts,
    liked: !!viewer && db.likes.has(`${viewer}:${p.id}`),
    reposted: !!viewer && db.reposts.has(`${viewer}:${p.id}`),
  };
}

export const item = (viewer: string | null, p: PostRow, by?: string): FeedItem => ({
  key: by ? `r${p.id}-${by}` : `p${p.id}`,
  post: serialize(viewer, p),
  reposted_by: by ? summary(viewer, db.users.get(by)!) : null,
});

const byDate = <T extends { date: string }>(a: T, b: T) => b.date.localeCompare(a.date);

/** FEED-01 : posts et republications des comptes suivis et de soi-même. */
export function followingFeed(viewer: string) {
  const authors = new Set([viewer, ...followingOf(viewer)]);
  const own = [...db.posts.values()]
    .filter((p) => !p.parent && authors.has(p.author) && canSeePost(viewer, p))
    .map((p) => ({ date: p.created_at, it: item(viewer, p) }));
  const reposts = [...db.reposts]
    .map(([k, date]) => {
      const [u, id] = k.split(':');
      return { u: u!, p: db.posts.get(Number(id)), date };
    })
    .filter(
      (r) =>
        r.p &&
        !r.p.deleted &&
        authors.has(r.u) &&
        r.u !== r.p.author &&
        canSeePost(viewer, r.p) &&
        canSeeActivity(viewer, db.users.get(r.u)!, db.users.get(r.u)!.reposts_visibility),
    )
    .map((r) => ({ date: r.date, it: item(viewer, r.p!, r.u) }));
  // Une republication et le post d'origine : on garde le plus récent des deux.
  const seen = new Set<number>();
  return [...own, ...reposts]
    .sort(byDate)
    .filter(({ it }) => (seen.has(it.post.id) ? false : (seen.add(it.post.id), true)))
    .map((x) => x.it);
}

/** FEED-02 : posts récents des comptes publics. */
export function exploreFeed(viewer: string | null) {
  return [...db.posts.values()]
    .filter((p) => !p.parent && !p.deleted && !db.users.get(p.author)?.is_private)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((p) => item(viewer, p));
}

/** Onglets du profil (ACC-02). */
export function profileTab(viewer: string | null, owner: UserRow, tab: string): FeedItem[] {
  const all = [...db.posts.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const mine = all.filter((p) => p.author === owner.username);
  if (tab === 'posts') return mine.filter((p) => !p.parent).map((p) => item(viewer, p));
  if (tab === 'replies')
    return mine.filter((p) => p.parent && !p.deleted).map((p) => item(viewer, p));
  if (tab === 'media')
    return mine.filter((p) => !p.deleted && p.media.length).map((p) => item(viewer, p));
  const map = tab === 'likes' ? db.likes : db.reposts;
  return [...map]
    .filter(([k]) => k.startsWith(`${owner.username}:`))
    .map(([k, date]) => ({ date, p: db.posts.get(Number(k.split(':')[1]))! }))
    .filter((x) => x.p && !x.p.deleted && canSeePost(viewer, x.p))
    .sort(byDate)
    .map((x) => item(viewer, x.p));
}
