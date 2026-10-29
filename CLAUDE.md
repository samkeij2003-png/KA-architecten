# KA Architecten — Astro Website

Statische marketing- en portfoliowebsite voor KA Architecten, omgezet vanuit een Claude design naar Astro.

## Stack

- **Astro** — SSG, geen server-side runtime nodig
- **TypeScript** — strict mode, geen `any`
- **Tailwind CSS** — utility-first styling

## Development

```bash
npm run dev        # lokale dev server (localhost:4321)
npm run build      # productie build naar dist/
npm run preview    # preview van de gebouwde output
npx astro check    # TypeScript typecheck
```

## Projectstructuur

```
src/
  components/   # Herbruikbare .astro componenten (PascalCase)
  layouts/      # Page layouts (BaseLayout.astro, etc.)
  pages/        # Bestandsgebaseerde routing
  assets/       # Afbeeldingen en fonts (verwerkt door Astro)
  styles/       # global.css met Tailwind base/components/utilities
public/         # Statische bestanden (favicon, OG images, robots.txt)
```

## Pagina's

| Route | Bestand | Doel |
|-------|---------|------|
| `/` | `pages/index.astro` | Home / Hero |
| `/projecten` | `pages/projecten/index.astro` | Portfolio overzicht |
| `/projecten/[slug]` | `pages/projecten/[slug].astro` | Individueel project |
| `/over-ons` | `pages/over-ons.astro` | Team en visie |
| `/contact` | `pages/contact.astro` | Contactinformatie |

## Codestandaarden

- Componentnamen in **PascalCase** (`HeroSection.astro`, niet `hero-section.astro`)
- Props altijd via een `interface Props` bovenaan het frontmatter blok
- Tailwind classes direct in de markup — geen extra CSS tenzij echt noodzakelijk
- Afbeeldingen via Astro's `<Image />` component uit `astro:assets` (automatische optimalisatie en lazy loading)
- `alt` tekst verplicht op elke afbeelding

```astro
---
interface Props {
  title: string;
  subtitle?: string;
}
const { title, subtitle } = Astro.props;
---
```

## Tailwind configuratie

Kleuren, typografie en spacing uit het originele design worden gedefinieerd in `tailwind.config.ts` als design tokens, zodat ze consistent hergebruikt kunnen worden:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: { ... },
    },
    fontFamily: {
      sans: [...],
      display: [...],
    },
  },
}
```

## Conversiestrategie (Claude design → Astro)

1. Elke visuele sectie uit het design wordt een zelfstandig `.astro` component in `src/components/`
2. Kleur- en typografiewaarden uit het design worden vertaald naar Tailwind config tokens
3. Animaties via Tailwind utilities of Astro View Transitions (`<ViewTransitions />`)
4. Herhalende content (projecten, teamleden) wordt als typed arrays in frontmatter of als `.md` collecties opgeslagen

## SEO

- Meta tags, canonical, Open Graph en Twitter in `src/layouts/BaseLayout.astro` (props per pagina)
- Structured data: `src/components/Schema.astro` (bureau, Peter, website, kruimelpad via `kruimels`-prop) met gegevens uit `src/data/seo.ts`; pagina's verwijzen met `@id` naar bureau en persoon in plaats van ze opnieuw te beschrijven
- Deelbeelden: `ogImage` is een foto in `public/images/`; die moet in `deelbeelden` in `src/data/seo.ts` staan, dan maakt `src/pages/og/[naam].jpg.ts` er bij de build een jpg van 1200 x 630 van
- Sitemap via `@astrojs/sitemap` met `lastmod` uit git (`src/laatst-gewijzigd.ts`); noindex-pagina's staan in `nietInSitemap` in `astro.config.mjs`
- Hosting is GitHub Pages: `_redirects`/`_headers` werken niet, de 301 van `/pad` naar `/pad/` doet GitHub zelf
- Eén H1 per pagina, geen sprongen in kopniveaus (footer gebruikt H2)

## Wat Claude moet doen bij een nieuw onderdeel

1. Controleer of een bestaand component hergebruikt of uitgebreid kan worden
2. Volg de bestaande Tailwind tokens uit `tailwind.config.ts`
3. Schrijf geen inline styles — gebruik Tailwind utilities
4. Test de build met `npm run build` na grotere wijzigingen

## Inhoud uit Mijn SASA (vanaf branch `mijn-sasa`)

Teksten, foto's, menu's en bedrijfsgegevens komen uit Mijn SASA (het CMS van SASA). Het ontwerp blijft hier in de code.

- `src/pages/[...path].astro` rendert alle pagina's uit Mijn SASA; `src/components/sections/` heeft per sectie uit de site-kit een component met dezelfde naam (contract-test in mijn-sasa).
- `src/lib/mijn-sasa/` is gekopieerd uit `mijn-sasa/packages/astro-client`: niet hier aanpassen.
- Build (echte site): `CMS_URL` en `CMS_TOKEN` (GitHub-geheim) nodig; zonder stopt de build bewust.
- Voorbeeld voor de editor: `SASA_PREVIEW=1 CMS_URL=http://localhost:3000 npm run dev:voorbeeld` (op aanvraag gerenderd, concepten, noindex, alleen in een iframe van Mijn SASA). Extra vertrouwde adressen van Mijn SASA: `CMS_FRAME_ORIGINS`.
- Nieuws en "meest gezocht" staan nog in de code (`src/data`), net als het contactformulier (Web3Forms).
