/**
 * De inhoud van de site uit Mijn SASA.
 *  - Bij de build (statisch): één keer de gepubliceerde inhoud (CMS_TOKEN).
 *  - In het voorbeeld (SASA_PREVIEW=1): per verzoek de concepten, met de
 *    voorbeeld-sleutel uit de cookie die src/middleware.ts zet.
 * Zonder CMS_URL/CMS_TOKEN stopt de build met een duidelijke melding: liever
 * geen build dan een lege site live.
 */
import type { AstroGlobal } from 'astro';
import { cms, CmsError, fetchBundle, withDraft, type Cms } from './mijn-sasa/client';
import type { ContentBundle } from './mijn-sasa/types';

export const isPreview = import.meta.env.SASA_PREVIEW === '1' || process.env.SASA_PREVIEW === '1';
const CMS_URL = import.meta.env.CMS_URL ?? process.env.CMS_URL;
const CMS_SITE = import.meta.env.CMS_SITE ?? process.env.CMS_SITE ?? 'ka-architecten';
const CMS_TOKEN = import.meta.env.CMS_TOKEN ?? process.env.CMS_TOKEN;

export const PREVIEW_COOKIE = 'sasa_preview';

/** Adressen van Mijn SASA die het voorbeeld in een iframe mogen tonen (CMS_URL + CMS_FRAME_ORIGINS). */
export function cmsOrigins(): string[] {
  const extra = (import.meta.env.CMS_FRAME_ORIGINS ?? process.env.CMS_FRAME_ORIGINS ?? '').split(/[\s,]+/);
  return [...new Set([CMS_URL, ...extra].filter(Boolean).map((u) => new URL(u as string).origin))];
}

let published: Promise<Cms> | null = null;

function requireUrl(): string {
  if (!CMS_URL) throw new CmsError('CMS_URL ontbreekt: waar staat Mijn SASA? (bijv. https://mijn.sasa.nl)');
  return CMS_URL;
}

/**
 * In het voorbeeld houden we de inhoud even vast (per sleutel), zodat typen in
 * de editor snel zichtbaar is. Het concept van de pagina zelf komt mee met het
 * verzoek (zie middleware: locals.sasaDraft).
 */
const PREVIEW_CACHE_MS = 4_000;
const previewCache = new Map<string, { at: number; bundle: Promise<ContentBundle> }>();

function previewBundle(token: string, fresh: boolean): Promise<ContentBundle> {
  const hit = previewCache.get(token);
  if (!fresh && hit && Date.now() - hit.at < PREVIEW_CACHE_MS) return hit.bundle;
  const bundle = fetchBundle({ cmsUrl: requireUrl(), site: CMS_SITE, token });
  previewCache.set(token, { at: Date.now(), bundle });
  if (previewCache.size > 50) previewCache.delete(previewCache.keys().next().value!);
  bundle.catch(() => previewCache.delete(token));
  return bundle;
}

/** Inhoud voor deze render: concept in het voorbeeld, anders gepubliceerd. */
export async function getCms(astro?: Pick<AstroGlobal, 'cookies' | 'locals'>): Promise<Cms> {
  if (isPreview) {
    const token = astro?.cookies.get(PREVIEW_COOKIE)?.value;
    if (!token) throw new CmsError('Geen voorbeeld-sleutel. Open het voorbeeld vanuit Mijn SASA.');
    const draft = (astro?.locals as { sasaDraft?: { pageId: string; draft: unknown } } | undefined)?.sasaDraft;
    // Met een concept uit de editor mag de rest even uit de cache komen; anders altijd vers.
    return cms(withDraft(await previewBundle(token, !draft), draft));
  }
  if (!CMS_TOKEN) throw new CmsError('CMS_TOKEN ontbreekt: de sleutel voor de gepubliceerde inhoud (GitHub-geheim).');
  published ??= fetchBundle({ cmsUrl: requireUrl(), site: CMS_SITE, token: CMS_TOKEN }).then(cms);
  return published;
}

/** Interne link zoals GitHub Pages hem zonder doorverwijzing serveert: altijd met / aan het eind. */
export const route = (path: string) => (path === '/' || /\.[a-z0-9]+$/i.test(path) ? path : `${path.replace(/\/+$/, '')}/`);

/** Alleen in het voorbeeld: attributen om op de pagina te kunnen klikken (fase 5). */
export function sasaField(sectionId: string, field: string, kind: 'text' | 'image' | 'richtext' = 'text') {
  return isPreview ? { 'data-sasa-field': `${sectionId}:${field}`, 'data-sasa-kind': kind } : {};
}

export function sasaSection(sectionId: string) {
  return isPreview ? { 'data-sasa-section': sectionId } : {};
}
