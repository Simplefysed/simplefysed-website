// Regenerates src/components/studio/inter-semibold.typeface.json, the Inter
// SemiBold subset used by the 3D studio nameplate (StudioCanvas.tsx).
//
// Usage (one-time; opentype.js is not a project dependency):
//   1. Download the OFFICIAL Inter release zip (https://github.com/rsms/inter/
//      releases, e.g. Inter-4.1.zip) and place extras/otf/Inter-SemiBold.otf
//      next to this script as inter-semibold.ttf.
//      IMPORTANT: do NOT use Google Fonts' instanced TTFs. They keep
//      overlapping (self-intersecting) contours, which three.js cannot
//      triangulate; the resulting degenerate extrusions hang the GPU and
//      Windows TDR kills the WebGL context. The official static OTFs ship
//      with overlaps removed.
//   2. npm i --no-save opentype.js
//   3. node scripts/generate-typeface.mjs
//
// Output grammar matches three/examples FontLoader exactly:
//   m x y | l x y | q endX endY cpX cpY | b endX endY cp1X cp1Y cp2X cp2Y
// Coordinates are raw font units (y-up); resolution = unitsPerEm. The extra
// per-glyph `bb` bounding box is consumed by StudioCanvas for floor contact;
// FontLoader ignores it. Inter is licensed under the SIL OFL.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'

const here = dirname(fileURLToPath(import.meta.url))
// Full caps + space for the 3D button block labels; lowercase kept for a
// possible mixed-case variant of the nameplate.
const SUBSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ simplefysed.?'
const ttf = readFileSync(join(here, 'inter-semibold.ttf'))
const font = opentype.parse(
  ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength),
)

const r = (n) => Math.round(n)

// three's ShapePath.toShapes() classifies CLOCKWISE contours (in y-up font
// space) as solids and counter-clockwise ones as holes. CFF/PostScript fonts
// use the opposite convention (TrueType matches), so every contour is
// normalized here: containment parity decides solid vs hole, then the
// winding is flipped to what three expects.
function splitContours(commands) {
  const contours = []
  let cur = null
  for (const c of commands) {
    if (c.type === 'M') {
      if (cur) contours.push(cur)
      cur = { start: { x: c.x, y: c.y }, segs: [] }
    } else if (c.type === 'Z') {
      if (cur) contours.push(cur)
      cur = null
    } else if (cur) {
      cur.segs.push({
        type: c.type,
        end: { x: c.x, y: c.y },
        c1: c.x1 !== undefined ? { x: c.x1, y: c.y1 } : null,
        c2: c.x2 !== undefined ? { x: c.x2, y: c.y2 } : null,
      })
    }
  }
  if (cur) contours.push(cur)
  return contours
}

// Flattened sample points (on-curve + control points; plenty for parity
// and orientation on well-formed font outlines).
function samplePoints(k) {
  const pts = [k.start]
  for (const s of k.segs) {
    if (s.c1) pts.push(s.c1)
    if (s.c2) pts.push(s.c2)
    pts.push(s.end)
  }
  return pts
}

function signedArea(pts) {
  let a = 0
  for (let i = 0, n = pts.length; i < n; i++) {
    const p = pts[i]
    const q = pts[(i + 1) % n]
    a += p.x * q.y - q.x * p.y
  }
  return a / 2 // positive = counter-clockwise in y-up space
}

function pointInPolygon(pt, pts) {
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i]
    const b = pts[j]
    if (
      a.y > pt.y !== b.y > pt.y &&
      pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x
    ) {
      inside = !inside
    }
  }
  return inside
}

function reverseContour(k) {
  // Materialize the implicit closing line so reversal keeps the shape.
  const chain = [k.start, ...k.segs.map((s) => s.end)]
  const last = chain[chain.length - 1]
  if (last.x !== k.start.x || last.y !== k.start.y) {
    k.segs.push({ type: 'L', end: { ...k.start }, c1: null, c2: null })
    chain.push(k.start)
  }
  const segs = []
  for (let i = k.segs.length - 1; i >= 0; i--) {
    const s = k.segs[i]
    const end = chain[i]
    if (s.type === 'L') segs.push({ type: 'L', end, c1: null, c2: null })
    else if (s.type === 'Q') segs.push({ type: 'Q', end, c1: s.c1, c2: null })
    else segs.push({ type: 'C', end, c1: s.c2, c2: s.c1 })
  }
  return { start: chain[chain.length - 1], segs }
}

function glyphToO(glyph) {
  let contours = splitContours(glyph.path.commands)
  const samples = contours.map(samplePoints)
  contours = contours.map((k, i) => {
    let depth = 0
    for (let j = 0; j < contours.length; j++) {
      if (j !== i && pointInPolygon(samples[i][0], samples[j])) depth++
    }
    const isHole = depth % 2 === 1
    const ccw = signedArea(samples[i]) > 0
    // solids must be clockwise (ccw -> reverse); holes counter-clockwise
    const needsReverse = isHole ? !ccw : ccw
    return needsReverse ? reverseContour(k) : k
  })

  const parts = []
  for (const k of contours) {
    parts.push('m', r(k.start.x), r(k.start.y))
    for (const s of k.segs) {
      if (s.type === 'L') parts.push('l', r(s.end.x), r(s.end.y))
      else if (s.type === 'Q')
        parts.push('q', r(s.end.x), r(s.end.y), r(s.c1.x), r(s.c1.y))
      else
        parts.push('b', r(s.end.x), r(s.end.y), r(s.c1.x), r(s.c1.y), r(s.c2.x), r(s.c2.y))
    }
  }
  return parts.join(' ')
}

const glyphsOut = {}
for (const ch of new Set(SUBSET)) {
  const glyph = font.charToGlyph(ch)
  if (!glyph || (glyph.index === 0 && ch !== ' ')) {
    throw new Error(`missing glyph for "${ch}"`)
  }
  // Outline-less glyphs (space) get zeroed boxes; their bb is never used.
  const empty = glyph.path.commands.length === 0
  const bb = empty
    ? { x1: 0, x2: 0, y1: 0, y2: 0 }
    : glyph.getBoundingBox()
  glyphsOut[ch] = {
    ha: r(glyph.advanceWidth),
    o: glyphToO(glyph),
    bb: { xMin: r(bb.x1), xMax: r(bb.x2), yMin: r(bb.y1), yMax: r(bb.y2) },
  }
}

const out = {
  familyName: font.names.fontFamily?.en ?? 'Inter',
  resolution: font.unitsPerEm,
  boundingBox: { yMin: font.tables.head.yMin, yMax: font.tables.head.yMax },
  ascender: font.tables.hhea.ascender,
  descender: font.tables.hhea.descender,
  underlinePosition: font.tables.post.underlinePosition,
  underlineThickness: font.tables.post.underlineThickness,
  original_font_information: {
    fontFamily: font.names.fontFamily?.en ?? 'Inter',
    fontSubfamily: font.names.fontSubfamily?.en ?? 'SemiBold',
    licence: 'SIL Open Font License 1.1',
  },
  glyphs: glyphsOut,
}

const target = join(here, '../src/components/studio/inter-semibold.typeface.json')
writeFileSync(target, JSON.stringify(out))
console.log(`wrote ${target} (${JSON.stringify(out).length} bytes)`)
