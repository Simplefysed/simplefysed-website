// One-time brand-asset generator: turns the repo-root square logo into the
// favicon / app-icon set. Run from website/:  node scripts/generate-icons.mjs
//
// Source: ../Simplefysed-Logo-1zu1.png (1122x1122 cube on a paper field).
// The cream margin is trimmed off, then re-padded evenly so the cube reads well
// at small sizes, and the result is emitted at every size the app needs.
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')
const appDir = path.resolve(__dirname, '..', 'src', 'app')
const publicDir = path.resolve(__dirname, '..', 'public')

const SRC = path.join(repoRoot, 'Simplefysed-Logo-1zu1.png')
const PAPER = { r: 243, g: 240, b: 233, alpha: 1 } // #F3F0E9

async function buildMaster() {
  // Trim the uniform cream border down to the cube's bounding box.
  const trimmed = await sharp(SRC).trim({ threshold: 30 }).png().toBuffer({ resolveWithObject: true })
  const side = Math.max(trimmed.info.width, trimmed.info.height)
  const pad = Math.round(side * 0.11) // ~11% breathing room on every edge
  const canvas = side + pad * 2

  // Re-center the trimmed cube on an opaque paper square.
  return sharp({ create: { width: canvas, height: canvas, channels: 4, background: PAPER } })
    .composite([{ input: trimmed.data, gravity: 'center' }])
    .png()
    .toBuffer()
}

async function pngAt(master, size) {
  return sharp(master).resize(size, size, { fit: 'cover' }).png().toBuffer()
}

async function main() {
  const master = await buildMaster()

  const outputs = [
    [path.join(appDir, 'icon.png'), 96],
    [path.join(appDir, 'apple-icon.png'), 180],
    [path.join(publicDir, 'icon-192.png'), 192],
    [path.join(publicDir, 'icon-512.png'), 512],
  ]
  for (const [dest, size] of outputs) {
    await writeFile(dest, await pngAt(master, size))
    console.log(`  wrote ${path.relative(repoRoot, dest)} (${size}x${size})`)
  }

  // Multi-resolution favicon.ico (16/32/48) for classic tab / legacy support.
  const icoSizes = [16, 32, 48]
  const icoBuffers = await Promise.all(icoSizes.map((s) => pngAt(master, s)))
  const ico = await pngToIco(icoBuffers)
  const icoPath = path.join(appDir, 'favicon.ico')
  await writeFile(icoPath, ico)
  console.log(`  wrote ${path.relative(repoRoot, icoPath)} (${icoSizes.join('/')})`)

  console.log('Icon set generated.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
