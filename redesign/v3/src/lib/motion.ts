import { useReducedMotion as useMotionReduced } from 'motion/react'

/** `?still` in the URL: static snapshot mode for screenshot QA (same as prefers-reduced-motion: every reveal is in its final state). */
export const STILL = typeof location !== 'undefined' && new URLSearchParams(location.search).has('still')

/** Reduced motion from the OS, or the `?still` QA mode. */
export function useReducedMotion(): boolean {
  return !!useMotionReduced() || STILL
}
