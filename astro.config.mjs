import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { laatstGewijzigd } from './src/laatst-gewijzigd.ts';

// Pagina's met noindex en de gegenereerde deelbeelden horen niet in de sitemap.
const nietInSitemap = ['/nieuws', '/meest-gezocht', '/algemene-voorwaarden', '/404', '/og/'];

export default defineConfig({
  site: 'https://www.ka-architecten.nl',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !nietInSitemap.some((pad) => page.includes(pad)),
      serialize: (item) => ({ ...item, lastmod: laatstGewijzigd(item.url) }),
    }),
  ],
  output: 'static',
  // GitHub Pages serveert elke pagina op /pad/; zonder deze instelling
  // levert elke interne link een 301-redirect op.
  trailingSlash: 'always',
});
