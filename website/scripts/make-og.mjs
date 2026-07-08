// Generates public/og-image.png: the brand logo centered on cream, nothing
// else. Kept minimal so social clients that crop the share card to 1:1
// (e.g. WhatsApp) still show the whole, centered logo. The logo sits inside the
// 630x630 centre square so it survives that crop.
// Run from website/: node scripts/make-og.mjs
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.resolve(__dirname, '..', '..', 'Simplefysed-Logo-1zu1.png')
const OUT = path.resolve(__dirname, '..', 'public', 'og-image.png')

const W = 1200
const H = 630
const PAPER = { r: 0xf3, g: 0xf0, b: 0xe9, alpha: 1 } // #F3F0E9
const LOGO = 400 // fits inside the 630x630 centre square WhatsApp crops to

// Key cream out to transparent (all channels bright = cream), leaving the
// ink + rust logo shapes, feathered 150..190 (same approach as make-og-cube.mjs).
const { data, info } = await sharp(SRC)
  .trim({ threshold: 30 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
for (let i = 0; i < data.length; i += channels) {
  const m = Math.min(data[i], data[i + 1], data[i + 2])
  let a = 255
  if (m >= 190) a = 0
  else if (m > 150) a = Math.round((255 * (190 - m)) / 40)
  data[i + 3] = a
}

const logo = await sharp(data, { raw: { width, height, channels } })
  .resize(LOGO, LOGO, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer()

await sharp({ create: { width: W, height: H, channels: 4, background: PAPER } })
  .composite([{ input: logo, gravity: 'center' }])
  .png()
  .toFile(OUT)

console.log(`wrote ${OUT} (${W}x${H}, centered logo only)`)
