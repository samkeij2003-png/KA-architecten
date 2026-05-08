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

- Globale `<head>` meta tags via `src/components/BaseHead.astro`
- Open Graph en Twitter card meta tags per pagina via props
- `robots.txt` en `sitemap.xml` via `@astrojs/sitemap` integratie

## Wat Claude moet doen bij een nieuw onderdeel

1. Controleer of een bestaand component hergebruikt of uitgebreid kan worden
2. Volg de bestaande Tailwind tokens uit `tailwind.config.ts`
3. Schrijf geen inline styles — gebruik Tailwind utilities
4. Test de build met `npm run build` na grotere wijzigingen
