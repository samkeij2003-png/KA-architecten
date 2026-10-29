/**
 * KA-specifieke hulpjes bovenop de inhoud uit Mijn SASA: projectgegevens,
 * deelbeelden en de vaste labels die bij het ontwerp horen.
 */
import type { Cms } from './mijn-sasa/client';
import { text } from './mijn-sasa/client';
import type { BundleMedia, BundlePage } from './mijn-sasa/types';

/** Types en statussen van projecten (keuzes in de site-kit van Mijn SASA). */
export const PROJECT_TYPE_LABELS: Record<string, string> = {
  'particuliere-woning': 'Particuliere woning',
  utiliteitsbouw: 'Utiliteitsbouw',
  woningbouw: 'Woningbouw',
  afstudeerproject: 'Afstudeerproject',
};
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  opgeleverd: 'Opgeleverd',
  'in-uitvoering': 'In uitvoering',
  ontwerp: 'Ontwerp',
};

const section = (page: BundlePage | undefined, type: string) => page?.sections.find((s) => s.type === type);

export function projectInfo(c: Cms, page: BundlePage) {
  const header = section(page, 'projectHeader');
  const body = section(page, 'projectBody');
  const d = body?.data ?? {};
  return {
    page,
    title: page.title,
    cover: c.media(header?.data.cover),
    location: text(d.location),
    province: text(d.province),
    year: text(d.year),
    type: PROJECT_TYPE_LABELS[text(d.projectType)] ?? '',
    status: PROJECT_STATUS_LABELS[text(d.status)] ?? '',
    intro: text(d.intro),
  };
}

export const projects = (c: Cms) => c.pagesByTemplate('project').map((p) => projectInfo(c, p));

/** /og/zeist-2.jpg voor de foto zeist-2.webp (zelfde adressen als vroeger). */
export const ogPath = (media: BundleMedia) => `/og/${media.filename.replace(/\.[a-z0-9]+$/i, '')}.jpg`;

/** Deelbeeld van de homepage: de openingsfoto. Geldt als standaard. */
export function defaultShareImage(c: Cms): BundleMedia | undefined {
  return c.media(section(c.page('/'), 'hero')?.data.image);
}

/** Deelbeeld van een pagina: ingesteld in Mijn SASA, anders coverfoto of openingsfoto, anders standaard. */
export function shareImage(c: Cms, page: BundlePage): BundleMedia | undefined {
  return (
    c.media(page.seo.ogImage) ??
    c.media(section(page, 'projectHeader')?.data.cover) ??
    c.media(section(page, 'hero')?.data.image) ??
    defaultShareImage(c)
  );
}

/** Alle foto's waarvan een deelbeeld (1200 x 630 jpg) gemaakt moet worden. */
export function allShareImages(c: Cms): BundleMedia[] {
  const list = [...c.pages.map((p) => shareImage(c, p)), c.media(c.settings('person').image)];
  return [...new Map(list.filter((m): m is BundleMedia => !!m).map((m) => [m.filename, m])).values()];
}

/** "06 21 23 18 21" → "+31621231821" (voor tel:-links en Google). */
export function phoneE164(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  if (digits.startsWith('0')) return `+31${digits.slice(1)}`;
  return digits;
}
