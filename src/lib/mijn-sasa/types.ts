// Gekopieerd uit mijn-sasa/packages/astro-client. Niet hier aanpassen: pas het daar aan en draai
// `npm run astro-client:sync` in mijn-sasa.
/**
 * Vorm van de inhoud uit Mijn SASA (Inhoud-API, versie 1).
 * Zelfstandig bestand: geen imports, zodat het in elke Astro-site past.
 * tests/unit/astro-client.test.ts bewaakt dat het gelijk blijft aan de app.
 */

export type RichTextNode = {
  type: string;
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
};
export type RichTextValue = { type: "doc"; content?: RichTextNode[] };
export type LinkValue = { label: string; pageId: string | null; url: string };
export type RepeaterItem = { id: string } & Record<string, FieldValue>;
export type FieldValue = string | boolean | null | RichTextValue | LinkValue | RepeaterItem[];

export type SectionInstance = { id: string; type: string; hidden: boolean; data: Record<string, FieldValue> };
export type SeoValue = { title: string; description: string; ogImage: string | null; noindex: boolean };

export type MenuItem = { id: string } & LinkValue;
export type MenuColumn = { id: string; title: string; items: MenuItem[] };
export type MenuDraft = { items: MenuItem[]; columns: MenuColumn[] };
export type SettingsDraft = Record<string, Record<string, FieldValue>>;

export type BundleMedia = {
  id: string;
  url: string;
  filename: string;
  alt: string;
  isDecorative: boolean;
  width: number | null;
  height: number | null;
  focalX: number;
  focalY: number;
  credit: string | null;
};

export type BundlePage = {
  id: string;
  path: string;
  template: string;
  title: string;
  position: number;
  sections: SectionInstance[];
  seo: SeoValue;
  updatedAt: string;
};

export type ContentBundle = {
  version: 1;
  mode: "published" | "draft";
  generatedAt: string;
  site: { slug: string; name: string; domain: string | null; kit: string };
  settings: SettingsDraft;
  menus: Record<string, MenuDraft>;
  pages: BundlePage[];
  media: Record<string, BundleMedia>;
  redirects: { from: string; to: string; status: number }[];
};
