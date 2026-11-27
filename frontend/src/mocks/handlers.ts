import { http, HttpResponse } from 'msw';

// Handlers MSW : ils suivent le contrat de docs/SPEC_TECH.md (§2, §3) en attendant l'OpenAPI.
export const handlers = [
  http.get('/api/v1/auth/csrf', () => new HttpResponse(null, { status: 204 })),
  // Visiteur par défaut : pas de session.
  http.get('/api/v1/auth/me', () =>
    HttpResponse.json(
      { error: { code: 'not_authenticated', message: 'Vous n’êtes pas connecté.' } },
      { status: 401 },
    ),
  ),
];
