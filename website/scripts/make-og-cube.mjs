// Produces a transparent-background cube (scripts/.tmp/og-cube.png) for the OG
// card. The source logo sits on a gradient cream, so we key out cream by alpha
// (cream = all channels high) leaving only the ink + rust shapes, feathered at
// the edges. Placed on the flat brand cream it reads seamlessly.
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.resolve(__dirname, '..', '..', 'Simplefysed-Logo-1zu1.png')
const OUT = path.resolve(__dirname, '.tmp', 'og-cube.png')

const { data, info } = await sharp(SRC)
  .trim({ threshold: 30 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
for (let i = 0; i < data.length; i += channels) {
  const m = Math.min(data[i], data[i + 1], data[i + 2])
  // High min = cream (all channels bright) -> transparent. Ink and rust each
  // have at least one dark channel, so they stay opaque. Feather 150..190.
  let a = 255
  if (m >= 190) a = 0
  else if (m > 150) a = Math.round((255 * (190 - m)) / 40)
  data[i + 3] = a
}

const keyed = await sharp(data, { raw: { width, height, channels } }).png().toBuffer()
await sharp(keyed)
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(OUT)

console.log(`wrote ${OUT} (from ${width}x${height} trimmed source)`)
