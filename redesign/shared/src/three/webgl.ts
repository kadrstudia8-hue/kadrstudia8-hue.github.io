let cached: boolean | undefined

/** true when a WebGL context can be created (checked once, the probe context is released). */
export function hasWebGL(): boolean {
  if (cached !== undefined) return cached
  if (typeof document === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null
    cached = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}

/** Data-saver mode (Chrome / Android). */
export function saveData(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
}

/** Rough device class for quality settings. `phone` = coarse pointer and narrow screen (≤ 767px viewport). */
export function deviceTier(): { phone: boolean; weak: boolean } {
  if (typeof window === 'undefined') return { phone: false, weak: false }
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const phone = (coarse && Math.min(screen.width, screen.height) < 820) || window.innerWidth < 768
  const nav = navigator as Navigator & { deviceMemory?: number }
  const weak = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4
  return { phone, weak }
}
