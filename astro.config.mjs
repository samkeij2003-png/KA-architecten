import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ka-architecten.nl',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !page.includes('/nieuws') && !page.includes('/meest-gezocht'),
    }),
  ],
  output: 'static',
  // GitHub Pages serveert elke pagina op /pad/; zonder deze instelling
  // levert elke interne link een 301-redirect op.
  trailingSlash: 'always',
});
