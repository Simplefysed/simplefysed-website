'use client'

import { useRef, useMemo, MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Constants ───────────────────────────────────────────
const START_ANGLE = -Math.PI / 3      // bottom-right (~5 o'clock)
const TOTAL_SWEEP = (4 * Math.PI) / 3 // 240° counter-clockwise
const ORBIT_RADIUS = 3.5

// ── Network sphere GLSL shaders (identical to hero NeuralNetwork) ──

const nodeVertexShader = /* glsl */ `
  attribute float size;
  attribute float depth;
  varying float vDepth;
  varying float vSize;

  void main() {
    vDepth = depth;
    vSize = size;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const nodeFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uGlow;
  uniform float uGlowRadius;
  varying float vDepth;
  varying float vSize;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    if (dist > uGlowRadius) discard;

    float alpha = 1.0 - smoothstep(0.0, uGlowRadius, dist);
    float core = 1.0 - smoothstep(0.0, uGlowRadius * 0.3, dist);
    float pulse = 0.85 + 0.15 * sin(uTime * 1.5 + vDepth * 3.0);
    float depthFade = 0.4 + vDepth * 0.6;

    vec3 color = uColor * (0.6 + core * 0.25) * uGlow;
    float finalAlpha = alpha * depthFade * pulse * 0.65 * uGlow;

    gl_FragColor = vec4(color, finalAlpha);
  }
`

const lineVertexShader = /* glsl */ `
  attribute float lineDepth;
  varying float vLineDepth;

  void main() {
    vLineDepth = lineDepth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const lineFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uGlow;
  varying float vLineDepth;

  void main() {
    float pulse = 0.7 + 0.3 * sin(uTime * 0.8 + vLineDepth * 2.0);
    float depthFade = 0.3 + vLineDepth * 0.7;
    float alpha = depthFade * pulse * 0.35 * uGlow;
    gl_FragColor = vec4(uColor * uGlow, alpha);
  }
`

// ── Orbit Ring shader ───────────────────────────────────

const orbitVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const orbitFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uElectronAngle;
  varying vec2 vUv;

  void main() {
    float torusAngle = vUv.x * 6.2831853;

    float diff = torusAngle - uElectronAngle;
    diff = mod(diff + 3.14159265, 6.2831853) - 3.14159265;
    float absDiff = abs(diff);

    float proximity = exp(-absDiff * 2.5);
    float trail = smoothstep(3.14159265, 0.0, absDiff) * 0.06;
    float base = 0.02;
    float shimmer = 0.01 * sin(uTime * 2.0 + torusAngle * 4.0);

    float alpha = base + proximity * 0.25 + trail + shimmer;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(uColor, alpha);
  }
`

// ── NetworkSphere - reusable Fibonacci node+line sphere ─

interface NetworkSphereProps {
  radius: number
  nodeCount: number
  connectionDistance: number
  color: string
  pointSizeBase?: number
  glowIntensity?: number
  glowRadius?: number
}

function NetworkSphere({
  radius,
  nodeCount,
  connectionDistance,
  color,
  pointSizeBase = 4,
  glowIntensity = 1.0,
  glowRadius = 0.5,
}: NetworkSphereProps) {
  const threeColor = useMemo(() => new THREE.Color(color), [color])

  const { pointsGeometry, linesGeometry } = useMemo(() => {
    const positions: number[] = []
    const sizes: number[] = []
    const depths: number[] = []
    const phi = Math.PI * (3 - Math.sqrt(5)) // golden angle

    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = phi * i

      const x = Math.cos(theta) * r * radius
      const z = Math.sin(theta) * r * radius
      positions.push(x, y * radius, z)

      const normalizedDepth = (z + radius) / (radius * 2)
      depths.push(normalizedDepth)

      const baseSize = pointSizeBase + Math.random() * (pointSizeBase * 0.5)
      sizes.push(baseSize * (0.6 + normalizedDepth * 0.4))
    }

    const connections: number[] = []
    const lineDepths: number[] = []
    const posArray = new Float32Array(positions)

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = posArray[i * 3] - posArray[j * 3]
        const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1]
        const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < connectionDistance) {
          connections.push(
            posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
            posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2],
          )
          const avgDepth = (depths[i] + depths[j]) / 2
          lineDepths.push(avgDepth, avgDepth)
        }
      }
    }

    const pointsGeo = new THREE.BufferGeometry()
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    pointsGeo.setAttribute('size', new THREE.BufferAttribute(new Float32Array(sizes), 1))
    pointsGeo.setAttribute('depth', new THREE.BufferAttribute(new Float32Array(depths), 1))

    const linesGeo = new THREE.BufferGeometry()
    linesGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connections), 3))
    linesGeo.setAttribute('lineDepth', new THREE.BufferAttribute(new Float32Array(lineDepths), 1))

    return { pointsGeometry: pointsGeo, linesGeometry: linesGeo }
  }, [radius, nodeCount, connectionDistance, pointSizeBase])

  const nodeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nodeVertexShader,
        fragmentShader: nodeFragmentShader,
        uniforms: {
          uColor: { value: threeColor },
          uTime: { value: 0 },
          uGlow: { value: glowIntensity },
          uGlowRadius: { value: glowRadius },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [threeColor, glowIntensity, glowRadius],
  )

  const lineMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: lineVertexShader,
        fragmentShader: lineFragmentShader,
        uniforms: {
          uColor: { value: threeColor },
          uTime: { value: 0 },
          uGlow: { value: glowIntensity },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [threeColor, glowIntensity],
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime
    nodeMaterial.uniforms.uTime.value = time
    lineMaterial.uniforms.uTime.value = time
  })

  return (
    <group>
      <lineSegments geometry={linesGeometry} material={lineMaterial} />
      <points geometry={pointsGeometry} material={nodeMaterial} />
    </group>
  )
}

// ── AtomScene ───────────────────────────────────────────

interface AtomSceneProps {
  scrollProgressRef: MutableRefObject<number>
}

export function AtomScene({ scrollProgressRef }: AtomSceneProps) {
  const sceneRef = useRef<THREE.Group>(null)
  const nucleusRef = useRef<THREE.Group>(null)
  const electronRef = useRef<THREE.Group>(null)
  const orbitMaterialRef = useRef<THREE.ShaderMaterial>(null)

  const orbitUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#00fff2') },
      uElectronAngle: { value: START_ANGLE },
    }),
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const progress = scrollProgressRef.current

    // ── Nucleus: slow rotation + scale pulsing ───────
    if (nucleusRef.current) {
      // Rotate around a 45° tilted axis
      const speed = t * 0.15
      nucleusRef.current.rotation.x = speed * Math.SQRT1_2
      nucleusRef.current.rotation.y = speed * Math.SQRT1_2
      const scale = 1 + Math.sin(t * 1.8) * 0.04
      nucleusRef.current.scale.setScalar(scale)
    }

    // ── Electron: orbit position + faster spin ───────
    const angle = START_ANGLE + progress * TOTAL_SWEEP
    if (electronRef.current) {
      electronRef.current.position.x = ORBIT_RADIUS * Math.cos(angle)
      electronRef.current.position.z = ORBIT_RADIUS * Math.sin(angle)
      electronRef.current.rotation.y = t * 0.15
      electronRef.current.rotation.x = 0
    }

    // ── Fade out entire atom when CTA appears (0.94→1.0) ──
    if (sceneRef.current) {
      const fade = progress < 0.88 ? 1 : 1 - (progress - 0.88) / 0.10
      const s = Math.max(0, fade)
      sceneRef.current.scale.setScalar(s)
      sceneRef.current.visible = s > 0.001
    }

    // ── Orbit ring uniforms ──────────────────────────
    if (orbitMaterialRef.current) {
      orbitMaterialRef.current.uniforms.uTime.value = t
      const normAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      orbitMaterialRef.current.uniforms.uElectronAngle.value = normAngle
    }
  })

  return (
    <group ref={sceneRef}>
      {/* ── Nucleus (network sphere) ───────────────── */}
      <group ref={nucleusRef}>
        <NetworkSphere
          radius={1.4}
          nodeCount={80}
          connectionDistance={0.9}
          color="#00fff2"
          pointSizeBase={4}
          glowIntensity={1.4}
          glowRadius={0.10}
        />
      </group>

      {/* ── Orbit ring + Electron ──────────────────── */}
      <group rotation={[0.15, 0, 0]}>
        {/* Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ORBIT_RADIUS, 0.02, 8, 128]} />
          <shaderMaterial
            ref={orbitMaterialRef}
            vertexShader={orbitVertexShader}
            fragmentShader={orbitFragmentShader}
            uniforms={orbitUniforms}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Electron (smaller network sphere) */}
        <group ref={electronRef}>
          <NetworkSphere
            radius={0.4}
            nodeCount={50}
            connectionDistance={0.3}
            color="#00fff2"
            pointSizeBase={2.5}
            glowIntensity={1.2}
          glowRadius={0.08}
          />
        </group>
      </group>
    </group>
  )
}
