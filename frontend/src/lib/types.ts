// Contrat de l'API côté front, en attendant les types générés depuis l'OpenAPI (SPEC_TECH §11.1).
// Les noms suivent le backend : JSON en snake_case (SPEC_TECH §3).

export type Visibility = 'public' | 'followers' | 'private';
/** Ma relation avec un compte : je ne le suis pas, je le suis, ou ma demande est en attente. */
export type Relation = 'none' | 'following' | 'requested';

/** Un compte dans une liste, un en-tête de post, une suggestion. */
export type UserSummary = {
  id: number;
  username: string;
  display_name: string;
  avatar: string | null;
  bio: string;
  is_private: boolean;
  relation: Relation;
  follows_me: boolean;
  /** null si je n'ai pas le droit de le savoir (ACC-07 : visible seulement par les amis). */
  is_online: boolean | null;
};

/** Page profil (ACC-01). */
export type Profile = UserSummary & {
  created_at: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  friends_count: number;
  likes_visibility: Visibility;
  reposts_visibility: Visibility;
  /** Posts, réponses, médias et listes visibles par moi (§3.1). */
  can_see_content: boolean;
  can_see_likes: boolean;
  can_see_reposts: boolean;
};

/** L'user connecté. */
export type Me = Profile & {
  email: string;
  role: 'user' | 'admin';
  pending_requests_count: number;
};

export type Media = {
  id: number;
  type: 'image' | 'gif' | 'video';
  /** null : pas encore de fichier (maquettes) ; le front affiche un dégradé. */
  url: string | null;
  /** Dimensions renvoyées par l'API : le front calcule l'aperçu avant le chargement (DESIGN_SYSTEM §4.7). */
  width: number;
  height: number;
  /** Durée en secondes (vidéos). */
  duration: number | null;
};

export type Post = {
  id: number;
  /** null si le post est supprimé : ni auteur ni contenu (§4.4.1). */
  author: UserSummary | null;
  /** Obligatoire sur un post, null sur une réponse (POST-01, POST-03). */
  title: string | null;
  content: string;
  media: Media[];
  /** Usernames mentionnés qui existent : seuls ceux-là deviennent des liens (POST-05). */
  mentions: string[];
  parent: { id: number; author_username: string | null } | null;
  created_at: string;
  edited_at: string | null;
  deleted: null | 'author' | 'moderation';
  replies_count: number;
  likes_count: number;
  reposts_count: number;
  liked: boolean;
  reposted: boolean;
};

/** Élément d'un fil : un post, éventuellement republié par quelqu'un (REPOST-02). */
export type FeedItem = {
  /** Unique dans le fil : `p<id>` ou `r<id>-<user>`. */
  key: string;
  post: Post;
  reposted_by: UserSummary | null;
};

/** Pagination par curseur (SPEC_TECH §3). */
export type CursorPage<T> = { next: string | null; previous: string | null; results: T[] };

export type FollowRequest = { user: UserSummary; created_at: string };

/** Format d'erreur unique de l'API (SPEC_TECH §3). */
export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
    /** Données en plus selon le code, ex. `retry_after` (secondes) pour `too_many_attempts`. */
    details?: Record<string, unknown>;
  };
};
