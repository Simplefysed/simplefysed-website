'use client'

import { useState, useEffect } from 'react'

interface MousePosition {
  x: number
  y: number
  normalizedX: number
  normalizedY: number
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX
      const y = event.clientY
      const normalizedX = (x / window.innerWidth) * 2 - 1
      const normalizedY = -(y / window.innerHeight) * 2 + 1

      setMousePosition({ x, y, normalizedX, normalizedY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return mousePosition
}
