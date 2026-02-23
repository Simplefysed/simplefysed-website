'use client'

import { Suspense, MutableRefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import { AtomScene } from './AtomScene'

interface AtomCanvasProps {
  scrollProgressRef: MutableRefObject<number>
}

export default function AtomCanvas({ scrollProgressRef }: AtomCanvasProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 3, 10], fov: 55 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <AtomScene scrollProgressRef={scrollProgressRef} />
        </Suspense>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  )
}
