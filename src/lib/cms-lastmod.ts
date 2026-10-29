/**
 * lastmod voor de sitemap: wanneer een pagina in Mijn SASA voor het laatst
 * gepubliceerd is. Draait in astro.config.mjs, vóór de build.
 */
import { fetchBundle } from './mijn-sasa/client';

export async function cmsLastmod(): Promise<Map<string, string>> {
  const { MIJN_SASA_URL, MIJN_SASA_TOKEN, MIJN_SASA_SITE = 'ka-architecten' } = process.env;
  if (!MIJN_SASA_URL || !MIJN_SASA_TOKEN) return new Map();
  const bundle = await fetchBundle({ cmsUrl: MIJN_SASA_URL, site: MIJN_SASA_SITE, token: MIJN_SASA_TOKEN });
  return new Map(bundle.pages.map((p) => [p.path === '/' ? '/' : `${p.path}/`, p.updatedAt]));
}
