'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NeuralNetworkProps {
  nodeCount?: number
  connectionDistance?: number
}

// Vertex shader with depth-based sizing
const nodeVertexShader = `
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

// Fragment shader for soft, circular nodes with depth fade
const nodeFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  varying float vDepth;
  varying float vSize;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Discard pixels outside the glow radius
    if (dist > 0.08) discard;

    // Soft circular falloff
    float alpha = 1.0 - smoothstep(0.0, 0.08, dist);

    // Inner core brightness
    float core = 1.0 - smoothstep(0.0, 0.024, dist);

    // Subtle pulse based on depth (creates wave effect)
    float pulse = 0.85 + 0.15 * sin(uTime * 1.5 + vDepth * 3.0);

    // Depth-based fade (nodes further back are more transparent)
    float depthFade = 0.4 + vDepth * 0.6;

    // Final color with boosted glow
    vec3 color = uColor * (0.8 + core * 0.4);
    float finalAlpha = alpha * depthFade * pulse * 1.2;

    gl_FragColor = vec4(color, finalAlpha);
  }
`

// Line vertex shader with depth attribute
const lineVertexShader = `
  attribute float lineDepth;
  varying float vLineDepth;

  void main() {
    vLineDepth = lineDepth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Line fragment shader with depth fade and pulse
const lineFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  varying float vLineDepth;

  void main() {
    // Subtle pulse
    float pulse = 0.7 + 0.3 * sin(uTime * 0.8 + vLineDepth * 2.0);

    // Depth-based fade
    float depthFade = 0.3 + vLineDepth * 0.7;

    float alpha = depthFade * pulse * 0.35;

    gl_FragColor = vec4(uColor, alpha);
  }
`

export function NeuralNetwork({ nodeCount = 180, connectionDistance = 0.8 }: NeuralNetworkProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const nodeMatRef = useRef<THREE.ShaderMaterial>(null)
  const lineMatRef = useRef<THREE.ShaderMaterial>(null)

  const cyanColor = new THREE.Color('#00fff2')

  const { pointsGeometry, linesGeometry } = useMemo(() => {
    const positions: number[] = []
    const sizes: number[] = []
    const depths: number[] = []
    const phi = Math.PI * (3 - Math.sqrt(5)) // Golden angle

    // Generate nodes in a fibonacci sphere distribution
    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = phi * i

      const scale = 2.0 // Overall sphere size
      const x = Math.cos(theta) * radius * scale
      const z = Math.sin(theta) * radius * scale
      positions.push(x, y * scale, z)

      // Calculate depth (0 = front, 1 = back) for fade effect
      // Normalize z position to 0-1 range
      const normalizedDepth = (z + scale) / (scale * 2)
      depths.push(normalizedDepth)

      // Vary sizes - larger nodes in front, smaller in back
      const baseSize = 4 + Math.random() * 2
      const depthSize = baseSize * (0.6 + normalizedDepth * 0.4)
      sizes.push(depthSize)
    }

    // Generate connections
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
            posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
          )
          // Average depth of connected nodes
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

    return {
      pointsGeometry: pointsGeo,
      linesGeometry: linesGeo,
    }
  }, [nodeCount, connectionDistance])

  // Shader materials
  const nodeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: nodeVertexShader,
      fragmentShader: nodeFragmentShader,
      uniforms: {
        uColor: { value: cyanColor },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
  }, [cyanColor])

  const lineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: lineVertexShader,
      fragmentShader: lineFragmentShader,
      uniforms: {
        uColor: { value: cyanColor },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
  }, [cyanColor])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Update time uniforms for pulsing effect
    if (nodeMaterial.uniforms) {
      nodeMaterial.uniforms.uTime.value = time
    }
    if (lineMaterial.uniforms) {
      lineMaterial.uniforms.uTime.value = time
    }

    // Slow, elegant rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1
      pointsRef.current.rotation.x = Math.sin(time * 0.06) * 0.12
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.1
      linesRef.current.rotation.x = Math.sin(time * 0.06) * 0.12
    }
  })

  return (
    <group position={[-0.3, 0, 0]}>
      {/* Connection lines (render first, behind nodes) */}
      <lineSegments ref={linesRef} geometry={linesGeometry} material={lineMaterial} />

      {/* Nodes */}
      <points ref={pointsRef} geometry={pointsGeometry} material={nodeMaterial} />
    </group>
  )
}
