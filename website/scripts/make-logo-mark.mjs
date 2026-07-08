// Produces public/logo-mark.png: the cube keyed to a transparent background and
// trimmed tight (no padding) so it sits flush next to the header wordmark with
// only the CSS gap between them. Same cream->alpha keying as the OG cube.
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.resolve(__dirname, '..', '..', 'Simplefysed-Logo-1zu1.png')
const OUT = path.resolve(__dirname, '..', 'public', 'logo-mark.png')

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

const keyed = await sharp(data, { raw: { width, height, channels } }).png().toBuffer()
const out = await sharp(keyed)
  .trim() // drop any fully transparent border -> tight bounding box
  .resize({ height: 256 }) // small, retina-crisp for a ~28px header mark
  .png()
  .toBuffer({ resolveWithObject: true })

await sharp(out.data).toFile(OUT)
console.log(`wrote ${OUT}  intrinsic ${out.info.width}x${out.info.height}`)
