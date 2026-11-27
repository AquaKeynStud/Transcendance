import type { ApiErrorBody } from '@/lib/types';

/** Erreur de l'API, au format du §3 de SPEC_TECH. */
export class ApiError extends Error {
  status: number;
  code: string;
  fields: Record<string, string[]>;
  details: Record<string, unknown>;

  constructor(status: number, body: Partial<ApiErrorBody> | null) {
    super(body?.error?.message ?? 'Une erreur est survenue. Réessayez dans un instant.');
    this.name = 'ApiError';
    this.status = status;
    this.code = body?.error?.code ?? 'unknown_error';
    this.fields = body?.error?.fields ?? {};
    this.details = body?.error?.details ?? {};
  }

  /** Premier message d'erreur d'un champ, pour l'afficher sous le champ. */
  field(name: string) {
    return this.fields[name]?.[0] ?? null;
  }
}

const PREFIX = '/api/v1';

function csrfToken() {
  return document.cookie.match(/(?:^|; )csrftoken=([^;]*)/)?.[1] ?? '';
}

type Options = Omit<RequestInit, 'body'> & { body?: unknown };

/**
 * Client API unique (SPEC_TECH §11.3) : préfixe /api/v1, cookie de session, X-CSRFToken
 * sur les écritures, erreurs converties en ApiError. Accepte un chemin ou une URL complète (curseurs `next`).
 */
export async function api<T>(path: string, { body, headers, ...init }: Options = {}): Promise<T> {
  const url = path.startsWith('http') || path.startsWith(PREFIX) ? path : PREFIX + path;
  const method = (init.method ?? 'GET').toUpperCase();
  const isForm = body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...(method !== 'GET' ? { 'X-CSRFToken': csrfToken() } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });
  if (res.status === 204) return undefined as T;
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data as ApiErrorBody | null);
  return data as T;
}

/**
 * Envoi d'un fichier avec la progression (MEDIA-05). fetch ne donne pas la progression de l'envoi,
 * d'où XMLHttpRequest.
 */
export function upload<T>(
  path: string,
  form: FormData,
  onProgress: (percent: number) => void,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', PREFIX + path);
    xhr.withCredentials = true;
    xhr.setRequestHeader('X-CSRFToken', csrfToken());
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
    };
    xhr.onload = () => {
      let data: unknown = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // réponse vide
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data as T);
      else reject(new ApiError(xhr.status, data as ApiErrorBody | null));
    };
    xhr.onerror = () => reject(new ApiError(0, null));
    signal?.addEventListener('abort', () => xhr.abort());
    xhr.onabort = () => reject(new DOMException('Envoi annulé', 'AbortError'));
    xhr.send(form);
  });
}
