'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { NeuralNetwork } from './NeuralNetwork'

function CameraController() {
  const cameraRef = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    // Get normalized mouse position from pointer
    const targetX = state.pointer.x * 0.5
    const targetY = state.pointer.y * 0.3

    // Smooth lerp
    cameraRef.current.x += (targetX - cameraRef.current.x) * 0.02
    cameraRef.current.y += (targetY - cameraRef.current.y) * 0.02

    state.camera.position.x = cameraRef.current.x
    state.camera.position.y = cameraRef.current.y
    state.camera.lookAt(0, 0, 0)
  })

  return null
}

function Scene() {
  return (
    <>
      <CameraController />
      <ambientLight intensity={0.3} />
      <NeuralNetwork />
    </>
  )
}

export function HeroCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ background: '#0a0a0f' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  )
}
