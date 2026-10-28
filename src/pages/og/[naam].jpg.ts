/**
 * Deelbeelden (og:image) als jpg van 1200 x 630. Jpg omdat niet elk platform
 * webp toont in een linkvoorbeeld; de uitsnede volgt het drukste deel van de foto.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { resolve } from 'node:path';
import { deelbeelden, ogPad } from '../../data/seo';

export const getStaticPaths = (() =>
  deelbeelden.map((src) => ({
    params: { naam: ogPad(src).replace(/^\/og\/|\.jpg$/g, '') },
    props: { src },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  // process.cwd(): Astro bundelt dit endpoint, import.meta.url wijst dan elders heen.
  const bestand = resolve(process.cwd(), `public${props.src}`);
  const jpg = await sharp(bestand)
    .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
