/** Vaste @id's, zodat schema's op een pagina naar het bedrijf en de architect verwijzen. */
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
