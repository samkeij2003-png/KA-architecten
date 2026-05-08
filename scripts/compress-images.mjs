import sharp from 'sharp';
import { readdirSync, statSync, renameSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const dir = new URL('../public/images/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const files = readdirSync(dir).filter(f => /\.(jpe?g|png)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const src = join(dir, file);
  const ext = extname(file).toLowerCase();
  const sizeBefore = statSync(src).size;
  totalBefore += sizeBefore;

  const img = sharp(src);
  const meta = await img.metadata();

  let pipeline = img.rotate(); // auto-rotate from EXIF

  if (ext === '.png') {
    // Keep PNG but optimize
    pipeline = pipeline.png({ compressionLevel: 9, effort: 10 });
  } else {
    // JPEG: resize if wider than 1920px, then compress
    if ((meta.width ?? 0) > 1920) {
      pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
    }
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  }

  const buf = await pipeline.toBuffer();
  const sizeAfter = buf.length;
  totalAfter += sizeAfter;

  const pct = Math.round((1 - sizeAfter / sizeBefore) * 100);
  console.log(`${file}: ${(sizeBefore/1024).toFixed(0)}KB → ${(sizeAfter/1024).toFixed(0)}KB (−${pct}%)`);

  // Write to temp file, then replace original
  const tmp = src + '.tmp';
  writeFileSync(tmp, buf);
  renameSync(tmp, src);
}

console.log(`\nTotaal: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB (−${Math.round((1-totalAfter/totalBefore)*100)}%)`);
