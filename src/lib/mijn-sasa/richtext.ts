// Gekopieerd uit mijn-sasa/packages/astro-client. Niet hier aanpassen: pas het daar aan en draai
// `npm run astro-client:sync` in mijn-sasa.
/**
 * Opgemaakte tekst (JSON uit Mijn SASA) naar HTML. Kent alleen de opmaak die
 * het CMS toestaat: alinea, regeleinde, vet, schuin, link, lijst. Al het
 * andere wordt gewone tekst. Alle tekst wordt ge-escaped (PLAN.md §8).
 */
import type { RichTextNode, RichTextValue } from "./types";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Alleen gewone links: https, http, mailto, tel of een pad binnen de site. */
export function safeHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  const h = href.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(h)) return h;
  if (h.startsWith("/") && !h.startsWith("//")) return h;
  return null;
}

export type RichTextOptions = {
  /** Interne paden aanpassen, bijv. een trailing slash toevoegen. */
  internalHref?: (path: string) => string;
  /** Extra class op links. */
  linkClass?: string;
};

function inline(node: RichTextNode, o: RichTextOptions): string {
  if (node.type === "hardBreak") return "<br>";
  if (node.type !== "text") return (node.content ?? []).map((c) => inline(c, o)).join("");
  let html = escape(node.text ?? "");
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") html = `<strong>${html}</strong>`;
    else if (mark.type === "italic") html = `<em>${html}</em>`;
    else if (mark.type === "link") {
      const href = safeHref(mark.attrs?.href);
      if (!href) continue;
      const internal = href.startsWith("/");
      const final = internal && o.internalHref ? o.internalHref(href) : href;
      const extra = internal || /^(mailto|tel):/i.test(href) ? "" : ' rel="noopener noreferrer"';
      const cls = o.linkClass ? ` class="${escape(o.linkClass)}"` : "";
      html = `<a href="${escape(final)}"${cls}${extra}>${html}</a>`;
    }
  }
  return html;
}

function block(node: RichTextNode, o: RichTextOptions): string {
  switch (node.type) {
    case "paragraph": {
      const inner = (node.content ?? []).map((c) => inline(c, o)).join("");
      return inner ? `<p>${inner}</p>` : "";
    }
    case "bulletList":
    case "orderedList": {
      const tag = node.type === "bulletList" ? "ul" : "ol";
      const lis = (node.content ?? [])
        .filter((c) => c.type === "listItem")
        .map((li) => `<li>${(li.content ?? []).map((c) => (c.type === "paragraph" ? (c.content ?? []).map((x) => inline(x, o)).join("") : block(c, o))).join("")}</li>`)
        .join("");
      return lis ? `<${tag}>${lis}</${tag}>` : "";
    }
    default:
      // Onbekend blok: alleen de tekst, als alinea.
      return (node.content ?? []).length ? `<p>${(node.content ?? []).map((c) => inline(c, o)).join("")}</p>` : "";
  }
}

export function richTextToHtml(value: RichTextValue | null | undefined, options: RichTextOptions = {}): string {
  if (!value || value.type !== "doc") return "";
  return (value.content ?? []).map((n) => block(n, options)).join("");
}

/** Platte tekst, bijv. voor een meta-omschrijving. */
export function richTextToPlain(value: RichTextValue | null | undefined): string {
  const walk = (nodes: RichTextNode[] = []): string =>
    nodes.map((n) => (n.type === "text" ? (n.text ?? "") : walk(n.content)) + (n.type === "paragraph" ? " " : "")).join("");
  return walk(value?.content).replace(/\s+/g, " ").trim();
}
