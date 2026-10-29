// Gekopieerd uit mijn-sasa/packages/astro-client. Niet hier aanpassen: pas het daar aan en draai
// `npm run astro-client:sync` in mijn-sasa.
/**
 * Inhoud ophalen uit Mijn SASA en er makkelijk mee werken in een Astro-site.
 * Draait alleen op de server (bij de build of in het voorbeeld), nooit in de browser.
 */
import type { BundleMedia, BundlePage, ContentBundle, FieldValue, LinkValue, RepeaterItem, RichTextValue } from "./types";

export type FetchOptions = {
  /** Bijv. https://mijn.sasa.nl */
  cmsUrl: string;
  site: string;
  /** Inhoud-sleutel (ct1.…) voor de build, voorbeeld-sleutel (pv1.…) voor het voorbeeld. */
  token: string;
};

export class CmsError extends Error {}

export async function fetchBundle({ cmsUrl, site, token }: FetchOptions): Promise<ContentBundle> {
  const url = `${cmsUrl.replace(/\/+$/, "")}/api/content/v1/${encodeURIComponent(site)}`;
  let res: Response;
  try {
    res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  } catch (err) {
    throw new CmsError(`Mijn SASA niet bereikbaar op ${url}: ${String(err)}`);
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new CmsError(`Mijn SASA antwoordde ${res.status}: ${body.error ?? "onbekende fout"}`);
  }
  const bundle = (await res.json()) as ContentBundle;
  if (bundle.version !== 1) throw new CmsError(`Onbekende versie van de inhoud: ${bundle.version}`);
  return bundle;
}

/**
 * Voorbeeld: het concept van één pagina uit de editor in plaats van de
 * opgeslagen versie (verborgen secties vallen weg, zoals in de Inhoud-API).
 */
export function withDraft(bundle: ContentBundle, override: { pageId: string; draft: unknown } | null | undefined): ContentBundle {
  const d = override?.draft as { sections?: BundlePage["sections"]; seo?: BundlePage["seo"] } | undefined;
  if (!override || !d || !Array.isArray(d.sections)) return bundle;
  return {
    ...bundle,
    pages: bundle.pages.map((p) =>
      p.id === override.pageId
        ? { ...p, sections: d.sections!.filter((s) => s && typeof s.type === "string" && !s.hidden), seo: d.seo ?? p.seo }
        : p,
    ),
  };
}

/** Helpers rond één bundel: pagina's opzoeken, links en foto's oplossen. */
export function cms(bundle: ContentBundle) {
  const byId = new Map(bundle.pages.map((p) => [p.id, p]));
  const byPath = new Map(bundle.pages.map((p) => [p.path, p]));

  const pageById = (id: string | null | undefined) => (id ? byId.get(id) : undefined);

  return {
    bundle,
    pages: bundle.pages,
    page: (path: string) => byPath.get(path === "" ? "/" : path),
    pageById,
    pagesByTemplate: (template: string) =>
      bundle.pages.filter((p) => p.template === template).sort((a, b) => a.position - b.position),
    /** Waar een link heen gaat; null als de pagina niet (meer) bestaat. */
    href(link: Pick<LinkValue, "pageId" | "url"> | null | undefined): string | null {
      if (!link) return null;
      if (link.pageId) return pageById(link.pageId)?.path ?? null;
      return link.url || null;
    },
    media: (id: FieldValue | undefined): BundleMedia | undefined =>
      typeof id === "string" ? bundle.media[id] : undefined,
    settings: (group: string) => bundle.settings[group] ?? {},
    menu: (key: string) => bundle.menus[key] ?? { items: [], columns: [] },
  };
}

export type Cms = ReturnType<typeof cms>;
export type { BundlePage };

/** Veilige toegang tot velden van een sectie of groep. */
export const text = (v: FieldValue | undefined): string => (typeof v === "string" ? v : "");
export const bool = (v: FieldValue | undefined): boolean => v === true;
export const items = (v: FieldValue | undefined): RepeaterItem[] => (Array.isArray(v) ? v : []);
export const link = (v: FieldValue | undefined): LinkValue | null =>
  v && typeof v === "object" && !Array.isArray(v) && "label" in v ? (v as LinkValue) : null;
export const richText = (v: FieldValue | undefined): RichTextValue | null =>
  v && typeof v === "object" && !Array.isArray(v) && (v as RichTextValue).type === "doc" ? (v as RichTextValue) : null;
