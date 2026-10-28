/**
 * lastmod voor de sitemap: de datum van de laatste commit van de bestanden
 * waaruit een pagina bestaat. Zo verandert de datum alleen als de pagina echt
 * is aangepast, niet bij elke build. Zonder git-geschiedenis blijft lastmod weg
 * (daarom fetch-depth: 0 in .github/workflows/deploy.yml).
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

/** Bronbestanden per pagina; projectpagina's komen uit projects.ts. */
function bronnen(pad: string): string[] {
  if (pad === '') return ['src/pages/index.astro'];
  if (pad === 'projecten') return ['src/pages/projecten/index.astro', 'src/data/projects.ts'];
  if (pad.startsWith('projecten/')) return ['src/pages/projecten/[slug].astro', 'src/data/projects.ts'];
  return [`src/pages/${pad}.astro`];
}

export function laatstGewijzigd(url: string): string | undefined {
  const pad = new URL(url).pathname.replace(/^\/|\/$/g, '');
  const bestanden = bronnen(pad).filter((b) => existsSync(b));
  if (!bestanden.length) return undefined;
  try {
    const datum = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...bestanden], { encoding: 'utf8' }).trim();
    return datum || undefined;
  } catch {
    return undefined;
  }
}
