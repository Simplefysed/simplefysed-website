'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function CoreSphere() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (outerRef.current) {
      outerRef.current.rotation.x = state.clock.elapsedTime * 0.2
      outerRef.current.rotation.y = state.clock.elapsedTime * 0.3
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      outerRef.current.scale.setScalar(scale)
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -state.clock.elapsedTime * 0.3
      innerRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group>
      {/* Outer distorted sphere */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[0.8, 4]} />
        <MeshDistortMaterial
          color="#00fff2"
          transparent
          opacity={0.15}
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </mesh>

      {/* Inner wireframe sphere */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshBasicMaterial
          color="#8000ff"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Core point light */}
      <pointLight color="#00fff2" intensity={2} distance={5} />
      <pointLight color="#8000ff" intensity={1} distance={3} />
    </group>
  )
}
