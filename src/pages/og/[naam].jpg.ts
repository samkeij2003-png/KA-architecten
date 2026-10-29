/**
 * Deelbeelden (og:image) als jpg van 1200 x 630. Jpg omdat niet elk platform
 * webp toont in een linkvoorbeeld; de uitsnede volgt het drukste deel van de foto.
 * De foto's komen uit Mijn SASA; het adres blijft /og/<bestandsnaam>.jpg.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { allShareImages, ogPath } from '../../lib/ka';
import { getCms } from '../../lib/site-content';

const naam = (path: string) => path.replace(/^\/og\/|\.jpg$/g, '');

export const getStaticPaths = (async () => {
  const cms = await getCms();
  return allShareImages(cms).map((media) => ({ params: { naam: naam(ogPath(media)) }, props: { url: media.url } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async (context) => {
  let url = context.props.url as string | undefined;
  if (!url) {
    // Voorbeeld (op aanvraag): zelf de foto zoeken.
    const cms = await getCms(context);
    url = allShareImages(cms).find((m) => naam(ogPath(m)) === context.params.naam)?.url;
    if (!url) return new Response('Niet gevonden', { status: 404 });
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Foto voor deelbeeld niet op te halen (${res.status})`);
  const jpg = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
