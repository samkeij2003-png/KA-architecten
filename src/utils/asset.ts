const withBase = (path: string) =>
  import.meta.env.BASE_URL.replace(/\/?$/, '/') + path.replace(/^\//, '');

/** Pad naar een bestand in public/ (favicon, scripts, afbeeldingen). */
export const pub = (path: string) => withBase(path);

/**
 * Interne paginalink. Altijd met trailing slash, zodat GitHub Pages
 * de pagina direct serveert in plaats van een 301 naar /pad/ te sturen.
 */
export const route = (path: string) => withBase(path).replace(/\/?$/, '/');
