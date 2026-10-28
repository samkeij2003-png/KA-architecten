import { projects } from './projects';

/**
 * Bedrijfsgegevens voor de structured data (Schema.astro). Alleen echte
 * gegevens: wat onbekend is blijft weg (geen openingstijden, prijzen of reviews).
 */
export const bedrijf = {
  type: 'ProfessionalService',
  naam: 'KA.architecten',
  beschrijving:
    'Architectenbureau voor particuliere woningen, verbouwing en utiliteitsbouw, gevestigd in Tilburg en werkzaam in heel Noord-Brabant en Limburg.',
  telefoon: '+31621231821',
  email: 'p.keijsers@ka-architecten.nl',
  logo: { src: '/logo-512.png', breedte: 512, hoogte: 512 },
  adres: {
    straat: 'Ankeveenstraat 44',
    postcode: '5036 CB',
    plaats: 'Tilburg',
    regio: 'Noord-Brabant',
    land: 'NL',
  },
  geo: { lat: 51.5556, lng: 5.0913 },
  werkgebied: [
    { '@type': 'City', name: 'Tilburg' },
    { '@type': 'AdministrativeArea', name: 'Noord-Brabant' },
    { '@type': 'AdministrativeArea', name: 'Limburg' },
  ],
  // Google Bedrijfsprofiel en Instagram.
  profielen: ['https://share.google/GeBVXkBzydFJhEire', 'https://www.instagram.com/peter_keijsers_kaa/'],
  persoon: {
    naam: 'Peter Keijsers',
    functie: 'Architect',
    pagina: '/bureau/',
    foto: '/images/architect.webp',
    profielen: ['https://www.linkedin.com/in/peter-keijsers-07016813'],
  },
};

/** Vaste @id's, zodat schema's op een pagina naar het bedrijf en Peter verwijzen. */
export const schemaId = {
  bedrijf: '/#bedrijf',
  persoon: '/#persoon',
  website: '/#website',
} as const;

/** Stap in het kruimelpad na Home. */
export interface Kruimel {
  naam: string;
  pad: string;
}

/** Standaard-deelbeeld: de hero van de homepage. */
export const standaardDeelbeeld = '/images/zeist-2.webp';

/**
 * Alle foto's (in public/) die als deelbeeld gebruikt worden. Voor elk maakt
 * src/pages/og/[naam].jpg.ts bij de build een jpg van 1200 x 630.
 */
export const deelbeelden = [
  ...new Set([standaardDeelbeeld, '/images/warande-1.webp', ...projects.map((p) => p.cover)]),
];

/** /images/zeist-2.webp wordt /og/zeist-2.jpg. */
export const ogPad = (src: string) =>
  `/og/${src.split('/').pop()!.replace(/\.(webp|jpe?g|png|avif)$/, '')}.jpg`;
