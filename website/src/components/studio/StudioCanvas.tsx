'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Backdrop } from '@react-three/drei'
import * as THREE from 'three'
import { FontLoader, Font, FontData } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import interFont from './inter-semibold.typeface.json'

// Brand tokens, mirrored from globals.css (a WebGL canvas cannot read CSS vars)
const PAPER = '#F3F0E9'
const INK = '#1B1A17'
const RUST = '#D6442F'

// TextGeometry has two material slots: 0 = front/back faces, 1 = extrusion
// walls + bevels. With one ink on every plane the walls blur into the faces
// (dark-on-dark) and each stroke reads as a ghosted double contour from the
// elevated camera. Faces keep the exact brand hex; only the walls get a
// half-step lift toward paper, which turns the murk into a machined plane.
const sideTint = (base: string, lift: number) =>
  new THREE.Color(base).lerp(new THREE.Color(PAPER), lift)

// Subset of Inter SemiBold converted to three.js typeface format by
// scripts/generate-typeface.mjs. The extra per-glyph `bb` field carries the
// glyph bounding box; three's FontLoader only reads `ha` and `o`.
// Parsed with three's own FontLoader and rendered with three's own
// TextGeometry: drei's Text3D goes through three-stdlib's TextGeometry,
// which hangs the GPU (Windows TDR context loss) against three r182.
// Cast: FontData's glyph type demands x_min/x_max, which the parser never
// reads; the emitted JSON carries everything the runtime actually uses.
const FONT: Font = new FontLoader().parse(interFont as unknown as FontData)

type GlyphInfo = {
  ha: number
  bb: { xMin: number; xMax: number; yMin: number; yMax: number }
}
const glyphs = interFont.glyphs as unknown as Record<string, GlyphInfo>

// ── Monument layout ──────────────────────────────────────
// Uppercase on purpose: caps have flat bottoms and stand on the floor like
// physical objects. Lowercase descenders (p, y) would either sink through the
// floor (a baseline-cut "y" reads as "v") or force the word to float.
const WORD = 'SIMPLEFYSED'
const EM = 1 // font size in world units
const UNITS = EM / interFont.resolution
const TRACKING = 0.024 * EM // monument spacing between letters
const DEPTH = 0.22
const BEVEL_SIZE = 0.006
const BEVEL_THICKNESS = 0.01
const CURVE_SEGMENTS = 28 // silhouette smoothness of S/D bowls at hero size
const BEVEL_SEGMENTS = 5

// ── Studio room ──────────────────────────────────────────
// drei's <Backdrop> bends a unit plane with an easeInExpo ramp, so its
// "floor" is not truly flat: at the word plane it already sits slightly
// above y = 0. The word rests on exactly that height, or letter feet get
// sheared off by the floor.
const BACKDROP_SCALE: [number, number, number] = [40, 9, 7]
const BACKDROP_Z = -3
const BACKDROP_FLOOR = 1.8
const BACKDROP_SEGMENTS = 64
const easeInExpo = (x: number) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10))
// Cove surface height at a world z: backdrop-local ramp parameter, scaled
// to world height. Zero on the flat lip (z > 0.5).
const floorHeightAt = (z: number) =>
  BACKDROP_SCALE[1] * easeInExpo(0.5 + (BACKDROP_Z - z) / BACKDROP_SCALE[2])
// The word sits back from the origin: perspective places it higher in the
// frame, which balances the button + caption stack in front of it.
const WORD_Z = -1.4
const FLOOR_AT_WORD = floorHeightAt(WORD_Z)
// Vertical composition knob: the camera pitches down toward this world-space
// target height, so a lower target rides the whole scene higher in the
// frame. Tuned empirically until the word→button→caption stack centers in
// the full-viewport stage (equal paper above the letters and below the
// caption words). Pitching down only lowers the frame top, so the letters'
// 5.6-unit spawn height stays safely off-frame.
const CAMERA_TARGET_Y = -0.08

// ── Drop choreography (deterministic, closed-form) ───────
const DROP_HEIGHT = 5.6 // world-space spawn height, above the camera frame
const GRAVITY = 34 // world units / s²
const RESTITUTION = 0.16
const MIN_BOUNCE_V = 0.4 // rebound speeds below this settle to rest
const STAGGER = 0.15 // seconds between letters
const LEAD_IN = 0.35 // breath between the in-view trigger and the first letter
// Shared across all letters for the mesh lifetime; never disposed.
const LETTER_MATERIALS = [
  new THREE.MeshStandardMaterial({ color: INK, roughness: 0.34, metalness: 0.05 }),
  new THREE.MeshStandardMaterial({
    color: sideTint(INK, 0.16),
    roughness: 0.34,
    metalness: 0.05,
  }),
]
// Fixed per-letter tilt seeds (radians). Deterministic on purpose: no
// Math.random during render, and the word always lands identically.
const TILTS = [
  0.034, -0.026, 0.03, -0.034, 0.024, -0.03, 0.036, -0.023, 0.028, -0.032,
  0.026,
]

interface LetterSpec {
  ch: string
  x: number
  restY: number
  delay: number
  tilt: number
}

const LETTERS: LetterSpec[] = (() => {
  const out: LetterSpec[] = []
  let penX = 0
  Array.from(WORD).forEach((ch, i) => {
    const glyph = glyphs[ch]
    out.push({
      ch,
      x: penX,
      // Lift each glyph so its lowest point (including the bevel outset and
      // the optical overshoot of round letters like S) touches the floor.
      restY: -glyph.bb.yMin * UNITS + BEVEL_SIZE,
      delay: LEAD_IN + i * STAGGER,
      tilt: TILTS[i % TILTS.length],
    })
    penX += glyph.ha * UNITS + TRACKING
  })
  return out
})()

const WORD_WIDTH =
  LETTERS[LETTERS.length - 1].x +
  glyphs[LETTERS[LETTERS.length - 1].ch].ha * UNITS

// ── The big button + CTA caption ─────────────────────────
// A movie-style launch button (rust dome on an ink housing) is the pressable
// primary action. Its caption line sits in front of it, straight (no yaw),
// centered on x=0, and drops in one word at a time.
const LABEL_SIZE = 0.21 // em size of the CTA type
// Thin plate: at CTA size a deep extrusion's side walls blur into the
// letterforms from this camera angle.
const LABEL_DEPTH = 0.05
// The bevel must scale with the em size: the monument constants applied
// verbatim at 0.19 em outset Inter's stems by ~65% and turn every edge into
// a wide highlight-catching round (shiny balloon type, not machined ink).
const LABEL_BEVEL_THICKNESS = BEVEL_THICKNESS * LABEL_SIZE
const LABEL_BEVEL_SIZE = BEVEL_SIZE * LABEL_SIZE
// Easel pitch: leaned back on the baseline so the type faces the elevated
// camera nearly square-on; standing perpendicular it is only ever seen at a
// steep raking angle and reads poorly.
const LABEL_PITCH = -0.21

// Button geometry (its group origin sits on the floor)
const BUTTON_Z = 2.45
const BASE_RADIUS = 0.55
const BASE_HEIGHT = 0.17
const DOME_RADIUS = 0.4
const DOME_SCALE_Y = 0.62 // squashed hemisphere, the classic dome
const PRESS_DEPTH = 0.08 // dome travel when pressed
const HOVER_DIP = 0.022 // gentle preview of the press while hovering
// The real button is too squat to cast a visible shadow: under the ~47°
// key its shadow lands beneath its own base, and the rim's ~0.15 depth
// separation is erased by the radius-10 VSM blur (variance too small, the
// Chebyshev test resolves to lit). A taller invisible cylinder casts the
// floor pool instead.
const BUTTON_SHADOW_RADIUS = 0.5
const BUTTON_SHADOW_HEIGHT = 0.5

const LAST_LETTER_DELAY = LETTERS[LETTERS.length - 1].delay
const BIG_BUTTON_TILT = 0.02

const labelRestY = (label: string) => {
  // Lowest glyph point across the label (round caps overshoot the baseline),
  // plus the bevel outset, mirroring the monument letters' floor contact.
  const minY = Math.min(...Array.from(label).map((ch) => glyphs[ch].bb.yMin))
  return -minY * UNITS * LABEL_SIZE + LABEL_BEVEL_SIZE
}

interface ButtonSpec {
  key: string
  label: string
  x: number
  z: number
  restY: number
  color: string
  delay: number
  tilt: number
}

// The caption drops word by word, echoing the nameplate's letter-by-letter
// entrance: each word is its own falling object on a shared baseline.
// TextGeometry advances glyphs by `ha` from x = 0, so word geometries placed
// at these pen offsets reassemble into exactly the one-piece string, and the
// line is optically centered on x = 0 via the first and last glyphs' side
// bearings (the bevel outset is symmetric and cancels).
const CAPTION_WORDS = ['START', 'YOUR', 'PROJECT']
const CAPTION_Z = 3.85
const CAPTION_DELAY = LAST_LETTER_DELAY + 0.9
const WORD_STAGGER = 0.45 // a word is a bigger beat than a letter's 0.15
const WORD_TILTS = [0.024, -0.02, 0.028]
const LABEL_UNIT = UNITS * LABEL_SIZE
const wordAdvance = (word: string) =>
  Array.from(word).reduce((w, ch) => w + glyphs[ch].ha, 0) * LABEL_UNIT

const BUTTONS: ButtonSpec[] = (() => {
  const pens: number[] = []
  let pen = 0
  for (const word of CAPTION_WORDS) {
    pens.push(pen)
    pen += wordAdvance(word) + glyphs[' '].ha * LABEL_UNIT
  }
  const first = CAPTION_WORDS[0]
  const last = CAPTION_WORDS[CAPTION_WORDS.length - 1]
  const minX = pens[0] + glyphs[first[0]].bb.xMin * LABEL_UNIT
  const maxX =
    pens[pens.length - 1] +
    wordAdvance(last.slice(0, -1)) +
    glyphs[last[last.length - 1]].bb.xMax * LABEL_UNIT
  const startX = -(minX + maxX) / 2
  return CAPTION_WORDS.map((word, i) => ({
    key: word.toLowerCase(),
    label: word,
    x: startX + pens[i],
    z: CAPTION_Z,
    restY: labelRestY(word),
    color: RUST,
    delay: CAPTION_DELAY + i * WORD_STAGGER,
    tilt: WORD_TILTS[i % WORD_TILTS.length],
  }))
})()

// Drop order: the nameplate, then the caption words, then the button itself.
const BIG_BUTTON_DELAY = BUTTONS[BUTTONS.length - 1].delay + 0.4

// Height above the floor at time `t` after a letter starts falling: one
// gravity parabola, then successive restitution bounces until rest. All in
// the caller's units; the curve is scale-invariant when h, grav, and vMin
// are scaled together.
function dropY(
  t: number,
  h: number,
  grav: number,
  vMin: number,
): { y: number; done: boolean } {
  const fallT = Math.sqrt((2 * h) / grav)
  if (t < fallT) {
    return { y: h - 0.5 * grav * t * t, done: false }
  }
  let rem = t - fallT
  let v = grav * fallT * RESTITUTION
  while (v > vMin) {
    const bounceT = (2 * v) / grav
    if (rem < bounceT) {
      return { y: Math.max(0, rem * (v - 0.5 * grav * rem)), done: false }
    }
    rem -= bounceT
    v *= RESTITUTION
  }
  return { y: 0, done: true }
}

interface WordmarkProps {
  playing: boolean
  instant: boolean
  runId: number
  withButtons: boolean
  onSettled: () => void
  onStartProject: () => void
}

function FallingWordmark({
  playing,
  instant,
  runId,
  withButtons,
  onSettled,
  onStartProject,
}: WordmarkProps) {
  const groupRefs = useRef<(THREE.Group | null)[]>([])
  const buttonRefs = useRef<(THREE.Group | null)[]>([])
  const bigButtonRef = useRef<THREE.Group | null>(null)
  const domeRef = useRef<THREE.Mesh | null>(null)
  const hoverRef = useRef(false)
  const pressRef = useRef(false)
  const depthCurrent = useRef(0)
  // Own time accumulator: R3F restarts its clock when the frameloop prop
  // switches (always <-> demand), so clock.elapsedTime is not monotonic here.
  const timeRef = useRef(0)
  const settledRef = useRef(false)
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    timeRef.current = 0
    settledRef.current = false
  }, [runId])

  // Fit the word to narrow viewports; viewport is measured at the z=0 plane.
  const viewportWidth = useThree((s) => s.viewport.width)
  const fit = Math.max(0.2, Math.min(1, (viewportWidth * 0.84) / WORD_WIDTH))
  const invFit = 1 / fit

  useFrame((state, delta) => {
    // Rest pose first: idempotent and self-healing. It covers reduced
    // motion, every frame rendered after settling (prop changes, resizes),
    // and mid-run flips of either state. The big button's dome press eases
    // here too; while it moves we keep invalidating so the press animates
    // even though the frameloop has dropped to 'demand'.
    if (instant || settledRef.current) {
      for (let i = 0; i < LETTERS.length; i++) {
        const grp = groupRefs.current[i]
        if (!grp) continue
        grp.visible = true
        grp.position.y = LETTERS[i].restY
        grp.rotation.z = 0
      }
      for (let i = 0; i < BUTTONS.length; i++) {
        const grp = buttonRefs.current[i]
        if (!grp) continue
        grp.visible = true
        grp.position.y = BUTTONS[i].restY
        grp.rotation.z = 0
      }
      const big = bigButtonRef.current
      if (big) {
        big.visible = true
        big.position.y = 0
        big.rotation.z = 0
        const dome = domeRef.current
        if (dome) {
          // Hover previews the press with a slight dip; pressing takes the
          // dome all the way down. Down is snappy, back up is a softer
          // spring.
          const target = instant
            ? 0
            : pressRef.current
              ? PRESS_DEPTH
              : hoverRef.current
                ? HOVER_DIP
                : 0
          const rate = target > depthCurrent.current ? 22 : 9
          const eased =
            depthCurrent.current +
            (target - depthCurrent.current) * Math.min(1, delta * rate)
          depthCurrent.current = eased
          dome.position.y = BASE_HEIGHT - eased
          if (Math.abs(eased - target) > 0.0015) state.invalidate()
        }
      }
      return
    }
    if (!playing) return
    timeRef.current += Math.min(delta, 0.1)
    const t = timeRef.current
    // Physics runs in fit-scaled local units: spawn height, gravity, and
    // the settle cutoff all scale by 1/fit, so the on-screen (world) motion
    // is identical at every viewport width and letters always enter from
    // above the camera frame instead of popping in mid-air on phones.
    const h = DROP_HEIGHT * invFit
    const grav = GRAVITY * invFit
    const vMin = MIN_BOUNCE_V * invFit
    let allDone = true
    for (let i = 0; i < LETTERS.length; i++) {
      const grp = groupRefs.current[i]
      const letter = LETTERS[i]
      if (!grp) continue
      const lt = t - letter.delay
      if (lt <= 0) {
        grp.visible = false
        allDone = false
        continue
      }
      grp.visible = true
      const { y, done } = dropY(lt, h, grav, vMin)
      grp.position.y = letter.restY + y
      // A small tilt that decays with remaining height, so every letter
      // straightens exactly at touchdown.
      grp.rotation.z = letter.tilt * Math.min(1, y / h)
      if (!done) allDone = false
    }
    for (let i = 0; i < BUTTONS.length; i++) {
      const grp = buttonRefs.current[i]
      const button = BUTTONS[i]
      if (!grp) continue
      const bt = t - button.delay
      if (bt <= 0) {
        grp.visible = false
        allDone = false
        continue
      }
      grp.visible = true
      const { y, done } = dropY(bt, h, grav, vMin)
      grp.position.y = button.restY + y
      grp.rotation.z = button.tilt * Math.min(1, y / h)
      if (!done) allDone = false
    }
    const big = bigButtonRef.current
    if (big) {
      const bt = t - BIG_BUTTON_DELAY
      if (bt <= 0) {
        big.visible = false
        allDone = false
      } else {
        big.visible = true
        const { y, done } = dropY(bt, h, grav, vMin)
        big.position.y = y
        big.rotation.z = BIG_BUTTON_TILT * Math.min(1, y / h)
        if (!done) allDone = false
      }
    }
    if (allDone) {
      settledRef.current = true
      onSettled()
    }
  })

  const setPressed = (down: boolean) => {
    pressRef.current = down
    invalidate()
  }
  const setHovered = (over: boolean) => {
    hoverRef.current = over
    if (!over) pressRef.current = false
    invalidate()
  }

  return (
    <>
      {/* The floor lift stays outside the responsive scale so the word rests
          on the cove surface at every fit. */}
      <group position={[0, FLOOR_AT_WORD, WORD_Z]}>
        <group scale={fit}>
          <group position={[-WORD_WIDTH / 2, 0, 0]}>
            {LETTERS.map((letter, i) => (
              <Letter
                key={letter.ch + i}
                spec={letter}
                refCb={(el) => {
                  groupRefs.current[i] = el
                }}
              />
            ))}
          </group>
        </group>
      </group>
      {/* The button and its labels rest on the flat part of the cove (its
          ramp is zero at z > 0.5), so they need no floor lift. */}
      {withButtons && (
        <group scale={fit}>
          <BigButton
            onActivate={onStartProject}
            onPress={setPressed}
            onHoverChange={setHovered}
            refCb={(el) => {
              bigButtonRef.current = el
            }}
            domeRefCb={(el) => {
              domeRef.current = el
            }}
          />
          {BUTTONS.map((button, i) => (
            <ButtonLabel
              key={button.key}
              spec={button}
              refCb={(el) => {
                buttonRefs.current[i] = el
              }}
            />
          ))}
        </group>
      )}
    </>
  )
}

// The movie button: rust dome in an ink housing, pressed straight down.
function BigButton({
  onActivate,
  onPress,
  onHoverChange,
  refCb,
  domeRefCb,
}: {
  onActivate: () => void
  onPress: (down: boolean) => void
  onHoverChange: (over: boolean) => void
  refCb: (el: THREE.Group | null) => void
  domeRefCb: (el: THREE.Mesh | null) => void
}) {
  // The stage wrapper is no longer clickable, so the button manages its own
  // pointer cursor.
  const gl = useThree((s) => s.gl)
  return (
    <group ref={refCb} position={[0, 0, BUTTON_Z]} visible={false}>
      <mesh castShadow position={[0, BASE_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[BASE_RADIUS, BASE_RADIUS * 1.1, BASE_HEIGHT, 48]} />
        <meshStandardMaterial color={INK} roughness={0.34} metalness={0.05} />
      </mesh>
      <mesh
        ref={domeRefCb}
        castShadow
        position={[0, BASE_HEIGHT, 0]}
        scale={[1, DOME_SCALE_Y, 1]}
      >
        <sphereGeometry args={[DOME_RADIUS, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={RUST} roughness={0.38} metalness={0.05} />
      </mesh>
      {/* Shadow proxy: never drawn to the screen (colorWrite off), only into
          the shadow map, mirroring the caption labels' proxies. */}
      <mesh castShadow position={[0, BUTTON_SHADOW_HEIGHT / 2, 0]}>
        <cylinderGeometry
          args={[BUTTON_SHADOW_RADIUS, BUTTON_SHADOW_RADIUS, BUTTON_SHADOW_HEIGHT, 24]}
        />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
      {/* Invisible press target covering the whole button */}
      <mesh
        position={[0, 0.3, 0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          gl.domElement.style.cursor = 'pointer'
          onHoverChange(true)
        }}
        onPointerOut={() => {
          gl.domElement.style.cursor = ''
          onHoverChange(false)
        }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPress(true)
        }}
        onPointerUp={() => onPress(false)}
        onClick={(e) => {
          e.stopPropagation()
          onActivate()
        }}
      >
        <cylinderGeometry args={[BASE_RADIUS * 1.2, BASE_RADIUS * 1.2, 0.7, 24]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  )
}

// A plain caption line: not interactive, purely descriptive. Clicks on the
// letterforms fall through to the stage like any other studio click.
function ButtonLabel({
  spec,
  refCb,
}: {
  spec: ButtonSpec
  refCb: (el: THREE.Group | null) => void
}) {
  const { labelGeometry, shadowGeometry } = useMemo(() => {
    // One TextGeometry per caption word, rendered from its pen origin; the
    // spec.x offsets reassemble the words into the centered line.
    const geo = new TextGeometry(spec.label, {
      font: FONT,
      size: LABEL_SIZE,
      depth: LABEL_DEPTH,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: LABEL_BEVEL_THICKNESS,
      bevelSize: LABEL_BEVEL_SIZE,
      bevelSegments: 3,
    })
    // Shadow proxy: the crisp glyphs' stems are ~2 texels wide in the 2048
    // shadow map, and the radius-10 VSM blur washes a silhouette that thin
    // into patchy smears on the floor. The proxy re-extrudes the label with
    // the monument's absolute bevel (a fat, unreadable silhouette up close),
    // but only the blurred shadow ever sees it: under the blur it reads as
    // the type's one coherent soft shadow.
    const shadowGeo = new TextGeometry(spec.label, {
      font: FONT,
      size: LABEL_SIZE,
      depth: LABEL_DEPTH,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: BEVEL_THICKNESS,
      bevelSize: BEVEL_SIZE,
      bevelSegments: 2,
    })
    return { labelGeometry: geo, shadowGeometry: shadowGeo }
  }, [spec.label])
  // Same faces/walls split as the monument letters, in the label's color.
  const materials = useMemo(() => {
    const roughness = spec.color === RUST ? 0.42 : 0.34
    return [
      new THREE.MeshStandardMaterial({ color: spec.color, roughness, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({
        color: sideTint(spec.color, 0.12),
        roughness,
        metalness: 0.05,
      }),
    ]
  }, [spec.color])
  useEffect(
    () => () => {
      labelGeometry.dispose()
      shadowGeometry.dispose()
      materials.forEach((m) => m.dispose())
    },
    [labelGeometry, shadowGeometry, materials],
  )

  return (
    <group
      ref={refCb}
      position={[spec.x, spec.restY, spec.z]}
      rotation={[LABEL_PITCH, 0, 0]}
      visible={false}
    >
      <mesh geometry={labelGeometry} material={materials} />
      {/* Never drawn to the screen (colorWrite off), only into the shadow
          map; material.visible=false would skip the shadow pass too. */}
      <mesh geometry={shadowGeometry} castShadow>
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Letter({
  spec,
  refCb,
}: {
  spec: LetterSpec
  refCb: (el: THREE.Group | null) => void
}) {
  const geometry = useMemo(
    () =>
      new TextGeometry(spec.ch, {
        font: FONT,
        size: EM,
        depth: DEPTH,
        curveSegments: CURVE_SEGMENTS,
        bevelEnabled: true,
        bevelThickness: BEVEL_THICKNESS,
        bevelSize: BEVEL_SIZE,
        bevelSegments: BEVEL_SEGMENTS,
      }),
    [spec.ch],
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  // Pose (y, tilt, visibility) is owned entirely by the frame loop; the JSX
  // props stay constant so React re-renders can never snap a letter back.
  return (
    <group ref={refCb} position={[spec.x, spec.restY, 0]} visible={false}>
      <mesh geometry={geometry} material={LETTER_MATERIALS} castShadow />
    </group>
  )
}

function StudioScene(props: WordmarkProps) {
  const camera = useThree((s) => s.camera)
  useLayoutEffect(() => {
    camera.lookAt(0, CAMERA_TARGET_Y, 0)
  }, [camera])

  return (
    <>
      <fog attach="fog" args={[PAPER, 12, 24]} />

      {/* Studio lighting: soft VSM key (drei's PCSS SoftShadows is
          incompatible with three r182), quiet frontal fill */}
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[-3.5, 7, 5.5]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={10}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-radius={10}
        shadow-blurSamples={16}
        shadow-bias={-0.0002}
        shadow-normalBias={0.03}
      />
      <directionalLight position={[4.5, 3.5, 6]} intensity={0.55} />

      {/* Infinity cove: floor curving up into the back wall */}
      <Backdrop
        receiveShadow
        floor={BACKDROP_FLOOR}
        segments={BACKDROP_SEGMENTS}
        scale={BACKDROP_SCALE}
        position={[0, 0, BACKDROP_Z]}
      >
        <meshStandardMaterial color={PAPER} roughness={0.98} metalness={0} />
      </Backdrop>

      <FallingWordmark {...props} />
    </>
  )
}

export interface StudioCanvasProps extends WordmarkProps {
  settled: boolean
}

export default function StudioCanvas({
  playing,
  instant,
  settled,
  runId,
  withButtons,
  onSettled,
  onStartProject,
}: StudioCanvasProps) {
  return (
    <Canvas
      shadows="variance"
      flat // NoToneMapping, so the brand hex values render exactly
      // Always render at 2x CSS resolution: on standard-density displays the
      // 1x default reads visibly soft on the big ink-on-paper silhouettes.
      dpr={2}
      frameloop={instant || settled || !playing ? 'demand' : 'always'}
      camera={{ position: [0, 2.6, 9.6], fov: 34 }}
      gl={{ antialias: true }}
      style={{ touchAction: 'pan-y pinch-zoom', background: 'transparent' }}
    >
      <StudioScene
        playing={playing}
        instant={instant}
        runId={runId}
        withButtons={withButtons}
        onSettled={onSettled}
        onStartProject={onStartProject}
      />
    </Canvas>
  )
}
