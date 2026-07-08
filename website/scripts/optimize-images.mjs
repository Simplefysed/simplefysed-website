// One-off image optimizer. next/image already optimizes *delivery* (resize +
// AVIF/WebP), so this only trims the heavy SOURCE files to cut repo size and
// build-time image processing. Run from website/: `node scripts/optimize-images.mjs`.
import sharp from 'sharp'
import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')

async function sizeKb(p) {
  return Math.round((await stat(p)).size / 1024)
}

// Reads into a buffer first so the write can safely overwrite the same path.
async function optimize(rel, transform) {
  const file = path.join(publicDir, rel)
  const before = await sizeKb(file)
  const input = await readFile(file)
  const output = await transform(sharp(input)).toBuffer()
  await writeFile(file, output)
  console.log(`${rel}: ${before} KB -> ${Math.round(output.length / 1024)} KB`)
}

// Founder portrait: renders into a <=384px (768px @2x) grayscale frame in
// AboutFounder, so a 900px-wide q80 JPEG is plenty and cuts ~2.6 MB to ~150 KB.
await optimize('founder-vin-mangelsdorf.jpg', (img) =>
  img.resize({ width: 900, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true })
)

// Desktop LCP graphic (1448x1086): lossless recompress only (max compression/
// effort). No resize or palette quantization, to avoid any banding on the hero.
await optimize('hero-software-architecture.png', (img) =>
  img.png({ compressionLevel: 9, effort: 10 })
)

console.log('Image optimization complete.')
