'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ImageLightboxProps {
  src: string | null
  alt: string
  onClose: () => void
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (src) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [src])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (src) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [src, onClose])

  return (
    <AnimatePresence>
      {src && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-bg-primary/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-[62] text-text-secondary hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-bg-tertiary bg-bg-primary/60 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image container */}
            <div className="relative w-full max-w-6xl max-h-[90vh] aspect-video">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 1152px) 100vw, 1152px"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
