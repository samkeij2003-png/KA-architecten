/**
 * lastmod voor de sitemap: wanneer een pagina in Mijn SASA voor het laatst
 * gepubliceerd is. Draait in astro.config.mjs, vóór de build.
 */
import { fetchBundle } from './mijn-sasa/client';

export async function cmsLastmod(): Promise<Map<string, string>> {
  const { CMS_URL, CMS_TOKEN, CMS_SITE = 'ka-architecten' } = process.env;
  if (!CMS_URL || !CMS_TOKEN) return new Map();
  const bundle = await fetchBundle({ cmsUrl: CMS_URL, site: CMS_SITE, token: CMS_TOKEN });
  return new Map(bundle.pages.map((p) => [p.path === '/' ? '/' : `${p.path}/`, p.updatedAt]));
}
