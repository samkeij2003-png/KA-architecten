import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const ghPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: ghPages ? 'https://samkeij2003-png.github.io' : 'https://www.ka-architecten.nl',
  base: ghPages ? '/KA-architecten' : undefined,
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  output: 'static',
});
