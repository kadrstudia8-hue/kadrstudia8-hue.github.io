import { useEffect, useState, type RefObject } from 'react'
import { useMediaQuery } from '../ui/useMediaQuery'
import { usePrefersReducedMotion } from '../ui/usePrefersReducedMotion'
import { useInViewport } from './progress'
import { hasWebGL, saveData } from './webgl'

export type GateOptions = {
  /** Do not mount below this viewport width (px); 0 = always. */
  minWidth?: number
  /** Keep the 3D scene with prefers-reduced-motion (rendered still). Default false: show the fallback. */
  allowReduced?: boolean
}

/**
 * Decides whether a lazy 3D scene may mount: WebGL available, no Save-Data, width ≥ minWidth, reduced motion
 * respected, and no perf failure. The chunk is requested only once the element is near the viewport and the
 * browser is idle (requestIdleCallback), so it never competes with LCP.
 */
export function use3DGate(ref: RefObject<HTMLElement | null>, { minWidth = 0, allowReduced = false }: GateOptions = {}) {
  const inView = useInViewport(ref)
  const reduced = usePrefersReducedMotion()
  const wide = useMediaQuery(`(min-width: ${minWidth}px)`, minWidth === 0)
  const [env, setEnv] = useState<boolean | null>(null)
  const [failed, setFailed] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setEnv(hasWebGL() && !saveData()), [])
  const allowed = env === true && wide && !failed && (allowReduced || !reduced)

  useEffect(() => {
    if (!allowed || !inView || mounted) return
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void }
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMounted(true), { timeout: 1500 })
      return () => w.cancelIdleCallback?.(id)
    }
    const t = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(t)
  }, [allowed, inView, mounted])

  return { show: allowed && mounted, inView, reduced, fail: () => setFailed(true) }
}
