import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import { laatstGewijzigd } from './src/laatst-gewijzigd.ts';
import { cmsLastmod } from './src/lib/cms-lastmod.ts';

/**
 * Twee standen:
 *  - gewoon (de echte site): statisch, inhoud uit Mijn SASA bij de build (CMS_URL + CMS_TOKEN);
 *  - SASA_PREVIEW=1 (het voorbeeld in Mijn SASA): op aanvraag gerenderd, concepten, noindex.
 */
const preview = process.env.SASA_PREVIEW === '1';

// Pagina's met noindex en de gegenereerde deelbeelden horen niet in de sitemap.
const nietInSitemap = ['/nieuws', '/meest-gezocht', '/algemene-voorwaarden', '/404', '/og/'];

// lastmod: voor pagina's uit Mijn SASA het moment van publiceren, anders uit git.
const lastmodUitCms = preview ? new Map() : await cmsLastmod();

export default defineConfig({
  site: 'https://www.ka-architecten.nl',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    ...(preview
      ? []
      : [
          sitemap({
            filter: (page) => !nietInSitemap.some((pad) => page.includes(pad)),
            serialize: (item) => ({
              ...item,
              lastmod: lastmodUitCms.get(new URL(item.url).pathname) ?? laatstGewijzigd(item.url),
            }),
          }),
        ]),
  ],
  output: preview ? 'server' : 'static',
  ...(preview ? { adapter: node({ mode: 'standalone' }) } : {}),
  // Foto's uit Mijn SASA (Supabase-opslag): bij de build ophalen en verkleinen tot webp.
  image: { remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }] },
  devToolbar: { enabled: false },
  // GitHub Pages serveert elke pagina op /pad/; zonder deze instelling
  // levert elke interne link een 301-redirect op.
  trailingSlash: 'always',
});
