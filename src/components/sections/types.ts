import type { Cms } from '../../lib/mijn-sasa/client';
import type { BundlePage, SectionInstance } from '../../lib/mijn-sasa/types';

/**
 * Elke sectie uit de site-kit van Mijn SASA heeft hier een component met
 * dezelfde naam in PascalCase (hero → Hero.astro). Een contract-test in
 * Mijn SASA bewaakt dat.
 */
export interface SectionProps {
  section: SectionInstance;
  cms: Cms;
  page: BundlePage;
  /** Type van de sectie ervoor/erna, voor de witruimte tussen secties. */
  prevType?: string;
  nextType?: string;
}
