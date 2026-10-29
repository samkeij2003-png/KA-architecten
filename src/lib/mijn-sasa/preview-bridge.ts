// Gekopieerd uit mijn-sasa/packages/astro-client. Niet hier aanpassen: pas het daar aan en draai
// `npm run astro-client:sync` in mijn-sasa.
/**
 * Draait alleen in het voorbeeld (in de browser, in het iframe van Mijn SASA).
 *  - "sasa:refresh": de pagina opnieuw ophalen en de inhoud wisselen, zonder
 *    te knipperen en zonder de scrollpositie kwijt te raken.
 *  - "sasa:draft": hetzelfde, met het concept van deze pagina uit de editor
 *    (POST naar het voorbeeld, dat het in plaats van de opgeslagen versie toont).
 *  - "sasa:select": een sectie of veld laten oplichten (fase 5).
 *  - klik op [data-sasa-field]: Mijn SASA laten weten welk veld je bedoelt (fase 5).
 * Berichten komen alleen van en gaan alleen naar de adressen van Mijn SASA op de lijst.
 */
export function startPreviewBridge(allowedOrigins: string[]) {
  if (window.parent === window) return;
  // Het adres van Mijn SASA waarin we nu staan, alleen als het op de lijst staat.
  // Firefox kent ancestorOrigins niet; na doorklikken is de referrer leeg, dus onthouden we het.
  const remembered = sessionStorage.getItem("sasa-cms-origin") ?? "";
  const ancestor =
    (location as Location & { ancestorOrigins?: DOMStringList }).ancestorOrigins?.[0] ??
    (document.referrer && new URL(document.referrer).origin !== location.origin ? new URL(document.referrer).origin : remembered);
  if (!allowedOrigins.includes(ancestor)) return;
  sessionStorage.setItem("sasa-cms-origin", ancestor);
  const cmsOrigin = ancestor;
  const post = (msg: Record<string, unknown>) => window.parent.postMessage(msg, cmsOrigin);

  let refreshing = false;
  let again = false;
  /** Laatste concept van deze pagina uit de editor (nog niet per se opgeslagen). */
  let pending: { pageId: string; draft: unknown } | null = null;
  async function refresh() {
    if (refreshing) {
      again = true;
      return;
    }
    refreshing = true;
    try {
      const res = pending
        ? await fetch(location.href, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Sasa-Preview": "1" },
            body: JSON.stringify(pending),
            cache: "no-store",
          })
        : await fetch(location.href, { headers: { "X-Sasa-Preview": "1" }, cache: "no-store" });
      const html = await res.text();
      const next = new DOMParser().parseFromString(html, "text/html");
      const x = window.scrollX;
      const y = window.scrollY;
      document.title = next.title;
      document.body.replaceWith(next.body);
      window.scrollTo(x, y);
      document.dispatchEvent(new CustomEvent("sasa:refreshed"));
      post({ type: "sasa:refreshed", path: location.pathname });
    } finally {
      refreshing = false;
      if (again) {
        again = false;
        void refresh();
      }
    }
  }

  function highlight(selector: string) {
    document.querySelectorAll("[data-sasa-active]").forEach((el) => el.removeAttribute("data-sasa-active"));
    const el = document.querySelector(selector);
    if (!el) return;
    el.setAttribute("data-sasa-active", "");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  window.addEventListener("message", (e) => {
    if (e.origin !== cmsOrigin || typeof e.data !== "object" || !e.data) return;
    const data = e.data as { type?: string; sectionId?: string; field?: string; pageId?: string; draft?: unknown };
    if (data.type === "sasa:refresh") void refresh();
    // Concept van de pagina meteen tonen, zonder op het opslaan te wachten (PLAN.md fase 3: binnen 2 seconden).
    if (data.type === "sasa:draft" && data.pageId && data.draft) {
      pending = { pageId: data.pageId, draft: data.draft };
      void refresh();
    }
    if (data.type === "sasa:select" && data.sectionId) {
      const sel = data.field
        ? `[data-sasa-field="${CSS.escape(`${data.sectionId}:${data.field}`)}"]`
        : `[data-sasa-section="${CSS.escape(data.sectionId)}"]`;
      highlight(sel);
    }
  });

  // Klikken op een tekst of foto in het voorbeeld: het veld in Mijn SASA openen.
  document.addEventListener(
    "click",
    (e) => {
      const target = (e.target as Element).closest("[data-sasa-field]");
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      const [sectionId, ...field] = (target.getAttribute("data-sasa-field") ?? "").split(":");
      post({ type: "sasa:select", sectionId, field: field.join(":"), kind: target.getAttribute("data-sasa-kind") ?? "text" });
    },
    true,
  );

  // Links binnen de site volgen, maar binnen het voorbeeld blijven.
  post({ type: "sasa:ready", path: location.pathname });
}
