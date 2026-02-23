import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
