'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DNAHelixProps {
  height?: number
  radius?: number
  turns?: number
  strandPoints?: number
  rungCount?: number
  particleCount?: number
}

const cyanColor = new THREE.Color('#00fff2')
const purpleColor = new THREE.Color('#8000ff')
const greenColor = new THREE.Color('#39ff14')

// Compute a point on a helix strand
function getHelixPoint(
  t: number,
  strandOffset: number,
  height: number,
  radius: number,
  turns: number
): [number, number, number] {
  const halfHeight = height / 2
  const y = -halfHeight + t * height
  const angle = t * turns * Math.PI * 2 + strandOffset
  const x = radius * Math.cos(angle)
  const z = radius * Math.sin(angle)
  return [x, y, z]
}

// --- Strand shaders ---
const strandVertexShader = `
  attribute float depth;
  varying float vDepth;

  void main() {
    vDepth = depth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const strandFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  varying float vDepth;

  void main() {
    float pulse = 0.75 + 0.25 * sin(uTime * 1.0 + vDepth * 8.0);
    float depthFade = 0.4 + vDepth * 0.6;
    float alpha = depthFade * pulse * 0.7;
    gl_FragColor = vec4(uColor, alpha);
  }
`

// --- Rung shaders ---
const rungVertexShader = `
  attribute float rungProgress;
  attribute float depth;
  varying float vProgress;
  varying float vDepth;

  void main() {
    vProgress = rungProgress;
    vDepth = depth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const rungFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;
  varying float vProgress;
  varying float vDepth;

  void main() {
    vec3 color = mix(uColor1, uColor2, vProgress);
    float pulse = 0.6 + 0.4 * sin(uTime * 0.8 + vDepth * 5.0);
    float depthFade = 0.3 + vDepth * 0.7;
    float alpha = depthFade * pulse * 0.35;
    gl_FragColor = vec4(color, alpha);
  }
`

// --- Particle shaders ---
const particleVertexShader = `
  attribute float size;
  attribute float depth;
  varying float vDepth;

  void main() {
    vDepth = depth;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (150.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const particleFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  varying float vDepth;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float core = 1.0 - smoothstep(0.0, 0.2, dist);
    float pulse = 0.8 + 0.2 * sin(uTime * 2.0 + vDepth * 6.0);
    float depthFade = 0.5 + vDepth * 0.5;

    vec3 color = uColor * (0.5 + core * 0.5);
    gl_FragColor = vec4(color, alpha * depthFade * pulse * 0.7);
  }
`

export function DNAHelix({
  height = 5,
  radius = 1.0,
  turns = 2.5,
  strandPoints = 300,
  rungCount = 60,
  particleCount = 200,
}: DNAHelixProps) {
  const groupRef = useRef<THREE.Group>(null)
  const particlePointsRef = useRef<THREE.Points>(null)
  const particleDataRef = useRef<{ t: number; strand: number; speed: number }[]>([])

  // Build all geometry
  const { strand1Geo, strand2Geo, rungsGeo, particlesGeo } = useMemo(() => {
    function generateStrand(strandOffset: number) {
      const segPositions: number[] = []
      const segDepths: number[] = []

      let prev = getHelixPoint(0, strandOffset, height, radius, turns)
      let prevDepth = (prev[2] + radius) / (radius * 2)

      for (let i = 1; i < strandPoints; i++) {
        const t = i / (strandPoints - 1)
        const cur = getHelixPoint(t, strandOffset, height, radius, turns)
        const curDepth = (cur[2] + radius) / (radius * 2)

        segPositions.push(prev[0], prev[1], prev[2], cur[0], cur[1], cur[2])
        const avgDepth = (prevDepth + curDepth) / 2
        segDepths.push(avgDepth, avgDepth)

        prev = cur
        prevDepth = curDepth
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segPositions), 3))
      geo.setAttribute('depth', new THREE.BufferAttribute(new Float32Array(segDepths), 1))
      return geo
    }

    const s1 = generateStrand(0)
    const s2 = generateStrand(Math.PI)

    // Rungs connecting the two strands
    const rungPositions: number[] = []
    const rungProgress: number[] = []
    const rungDepths: number[] = []

    for (let i = 0; i < rungCount; i++) {
      const t = i / (rungCount - 1)
      const p1 = getHelixPoint(t, 0, height, radius, turns)
      const p2 = getHelixPoint(t, Math.PI, height, radius, turns)

      rungPositions.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2])
      rungProgress.push(0, 1)

      const avgDepth = ((p1[2] + radius) / (radius * 2) + (p2[2] + radius) / (radius * 2)) / 2
      rungDepths.push(avgDepth, avgDepth)
    }

    const rGeo = new THREE.BufferGeometry()
    rGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(rungPositions), 3))
    rGeo.setAttribute('rungProgress', new THREE.BufferAttribute(new Float32Array(rungProgress), 1))
    rGeo.setAttribute('depth', new THREE.BufferAttribute(new Float32Array(rungDepths), 1))

    // Particles that flow along the strands
    const pPositions: number[] = []
    const pSizes: number[] = []
    const pDepths: number[] = []
    const pData: { t: number; strand: number; speed: number }[] = []

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random()
      const strand = Math.random() > 0.5 ? 0 : Math.PI
      const p = getHelixPoint(t, strand, height, radius, turns)

      pPositions.push(p[0], p[1], p[2])
      pSizes.push(2 + Math.random() * 3)
      pDepths.push((p[2] + radius) / (radius * 2))
      pData.push({ t, strand, speed: 0.02 + Math.random() * 0.03 })
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pPositions), 3))
    pGeo.setAttribute('size', new THREE.BufferAttribute(new Float32Array(pSizes), 1))
    pGeo.setAttribute('depth', new THREE.BufferAttribute(new Float32Array(pDepths), 1))

    particleDataRef.current = pData

    return { strand1Geo: s1, strand2Geo: s2, rungsGeo: rGeo, particlesGeo: pGeo }
  }, [height, radius, turns, strandPoints, rungCount, particleCount])

  // Shader materials
  const strand1Material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: strandVertexShader,
    fragmentShader: strandFragmentShader,
    uniforms: { uColor: { value: cyanColor }, uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
  }), [])

  const strand2Material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: strandVertexShader,
    fragmentShader: strandFragmentShader,
    uniforms: { uColor: { value: purpleColor }, uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
  }), [])

  const rungMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: rungVertexShader,
    fragmentShader: rungFragmentShader,
    uniforms: {
      uColor1: { value: cyanColor },
      uColor2: { value: purpleColor },
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
  }), [])

  const particleMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: { uColor: { value: greenColor }, uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Update all time uniforms
    strand1Material.uniforms.uTime.value = time
    strand2Material.uniforms.uTime.value = time
    rungMaterial.uniforms.uTime.value = time
    particleMaterial.uniforms.uTime.value = time

    // Slow rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.08
      groupRef.current.rotation.x = Math.sin(time * 0.03) * 0.1
    }

    // Animate particles flowing along the strands
    if (particlePointsRef.current) {
      const posAttr = particlePointsRef.current.geometry.attributes.position
      const depthAttr = particlePointsRef.current.geometry.attributes.depth
      const posArray = posAttr.array as Float32Array
      const depthArray = depthAttr.array as Float32Array
      const pData = particleDataRef.current

      for (let i = 0; i < particleCount; i++) {
        pData[i].t += pData[i].speed * 0.016
        if (pData[i].t > 1) pData[i].t -= 1

        const [x, y, z] = getHelixPoint(pData[i].t, pData[i].strand, height, radius, turns)
        posArray[i * 3] = x
        posArray[i * 3 + 1] = y
        posArray[i * 3 + 2] = z
        depthArray[i] = (z + radius) / (radius * 2)
      }

      posAttr.needsUpdate = true
      depthAttr.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[-0.3, 0, 0]} rotation={[0.15, 0, 0.1]}>
      {/* Strand 1: cyan */}
      <lineSegments geometry={strand1Geo} material={strand1Material} />

      {/* Strand 2: purple */}
      <lineSegments geometry={strand2Geo} material={strand2Material} />

      {/* Rungs connecting strands: gradient cyan to purple */}
      <lineSegments geometry={rungsGeo} material={rungMaterial} />

      {/* Flowing particles: green */}
      <points ref={particlePointsRef} geometry={particlesGeo} material={particleMaterial} />

      {/* Ambient glow lights */}
      <pointLight color="#00fff2" intensity={1.5} distance={6} position={[0, 1, 1]} />
      <pointLight color="#8000ff" intensity={1} distance={4} position={[0, -1, -1]} />
    </group>
  )
}
