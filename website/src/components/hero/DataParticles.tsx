'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DataParticlesProps {
  count?: number
}

function generateParticleData(count: number) {
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const radius = 2 + Math.random() * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const speed = 0.005 + Math.random() * 0.01
    velocities[i * 3] = -positions[i * 3] * speed
    velocities[i * 3 + 1] = -positions[i * 3 + 1] * speed
    velocities[i * 3 + 2] = -positions[i * 3 + 2] * speed
  }

  return { positions, velocities }
}

export function DataParticles({ count = 500 }: DataParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const velocitiesRef = useRef<Float32Array | null>(null)

  const [{ positions, velocities }] = useState(() => generateParticleData(count))

  if (velocitiesRef.current === null) {
    velocitiesRef.current = velocities
  }

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame(() => {
    if (!pointsRef.current || !velocitiesRef.current) return

    const positionAttr = pointsRef.current.geometry.attributes.position
    const posArray = positionAttr.array as Float32Array
    const velArray = velocitiesRef.current

    for (let i = 0; i < count; i++) {
      posArray[i * 3] += velArray[i * 3]
      posArray[i * 3 + 1] += velArray[i * 3 + 1]
      posArray[i * 3 + 2] += velArray[i * 3 + 2]

      const dist = Math.sqrt(
        posArray[i * 3] ** 2 +
        posArray[i * 3 + 1] ** 2 +
        posArray[i * 3 + 2] ** 2
      )

      if (dist < 0.5) {
        const radius = 2 + Math.random() * 3
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)

        posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        posArray[i * 3 + 2] = radius * Math.cos(phi)

        const speed = 0.005 + Math.random() * 0.01
        velArray[i * 3] = -posArray[i * 3] * speed
        velArray[i * 3 + 1] = -posArray[i * 3 + 1] * speed
        velArray[i * 3 + 2] = -posArray[i * 3 + 2] * speed
      }
    }

    positionAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#39ff14"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
