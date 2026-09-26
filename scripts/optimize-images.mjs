// image/ 원본 → public/img/<slug>-{1200,2400}.webp (긴 변 기준)
// 사용: npm run images
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'image';
const OUT = 'public/img';
const WIDTHS = [1200, 2400];
// 파일명이 지저분한 원본은 여기서 slug 지정. 없으면 파일명 기반 slug.
const ALIAS = {
  'main visual.jpg': 'panorama',
  '4591AEBD-0011-4A32-AD99-3591FDE751A8.jpeg': 'texture',
};

const slugify = (f) =>
  ALIAS[f] ??
  path.parse(f).name.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '');

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f));
const manifest = {};

for (const f of files) {
  const slug = slugify(f);
  const input = sharp(path.join(SRC, f)).rotate(); // EXIF 회전 반영
  const meta = await input.metadata();
  const entry = { src: f, width: meta.width, height: meta.height, sizes: {} };
  for (const w of WIDTHS) {
    const out = path.join(OUT, `${slug}-${w}.webp`);
    const info = await input
      .clone()
      .resize({ width: w, height: w, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(out);
    entry.sizes[w] = { width: info.width, height: info.height, bytes: info.size };
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
  }
  manifest[slug] = entry;
}
await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('\nmanifest → public/img/manifest.json');
