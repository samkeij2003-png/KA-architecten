/**
 * Alleen actief in het voorbeeld (SASA_PREVIEW=1):
 *  - ?sasa_preview=<sleutel> wordt een cookie, daarna weer een schoon adres;
 *  - zonder sleutel: geen toegang;
 *  - nooit in Google (noindex) en alleen in een iframe van Mijn SASA.
 */
import { defineMiddleware } from 'astro:middleware';
import { cmsOrigins, isPreview, PREVIEW_COOKIE } from './lib/site-content';

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isPreview) return next();

  const { url, cookies } = context;
  const token = url.searchParams.get(PREVIEW_COOKIE);
  if (token) {
    cookies.set(PREVIEW_COOKIE, token, {
      path: '/',
      httpOnly: true,
      secure: true,
      // Het voorbeeld staat in een iframe op een ander domein (Mijn SASA).
      sameSite: 'none',
      maxAge: 2 * 60 * 60,
    });
    url.searchParams.delete(PREVIEW_COOKIE);
    return context.redirect(`${url.pathname}${url.search}`, 302);
  }

  const isAsset = /^\/(_astro|_image|fonts|js|images|favicon|apple-touch|logo)/.test(url.pathname);
  if (!isAsset && !cookies.get(PREVIEW_COOKIE)?.value) {
    return new Response('Dit is het voorbeeld van de site. Open het vanuit Mijn SASA.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
    });
  }

  // Concept van de pagina uit de editor (via de voorbeeld-brug), alleen met een geldige sleutel.
  if (context.request.method === 'POST' && context.request.headers.get('content-type')?.includes('application/json')) {
    try {
      const body = (await context.request.clone().json()) as { pageId?: unknown; draft?: unknown };
      if (typeof body.pageId === 'string' && body.draft && typeof body.draft === 'object') {
        (context.locals as { sasaDraft?: unknown }).sasaDraft = { pageId: body.pageId, draft: body.draft };
      }
    } catch {
      // Geen geldig concept: gewoon de opgeslagen versie tonen.
    }
  }

  const response = await next();
  const ancestors = cmsOrigins().join(' ') || "'none'";
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Content-Security-Policy', `frame-ancestors ${ancestors}`);
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Cache-Control', 'no-store');
  return response;
});
