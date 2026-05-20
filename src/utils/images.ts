import type { ImageMetadata } from 'astro';

const allImages = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.{jpg,jpeg,png,webp}'
);

export async function getImg(path: string): Promise<ImageMetadata> {
  const filename = path.split('/').pop()!;
  const key = `../assets/images/${filename}`;
  const load = allImages[key];
  if (!load) throw new Error(`Image not found: ${path}`);
  return (await load()).default;
}
