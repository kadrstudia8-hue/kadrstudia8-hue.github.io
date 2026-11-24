import { useEffect, useRef, useState, type RefObject } from 'react'

/** Anything with get(): number — a motion/react MotionValue fits. */
export type ProgressSource = { get(): number }

/**
 * Live 0..1 scroll progress of `track` without re-rendering (read `.current` in a frame loop).
 * Tall tracks (taller than 1.2 viewports, e.g. a section with a sticky canvas) map top-at-top → 0 and
 * bottom-at-bottom → 1. Short tracks map "entering from below" → 0 and "leaving at the top" → 1.
 */
export function useScrollProgress(track: RefObject<HTMLElement | null>, onChange?: () => void) {
  const p = useRef(0)
  const cb = useRef(onChange)
  cb.current = onChange
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const el = track.current
      if (!el) return
      const r = el.getBoundingClientRect(), vh = window.innerHeight || 1
      const v = r.height > vh * 1.2 ? -r.top / (r.height - vh) : (vh - r.top) / (r.height + vh)
      const next = Math.max(0, Math.min(1, v))
      if (next !== p.current) { p.current = next; cb.current?.() }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [track])
  return p
}

/** true while `el` is within (or within `margin` of) the viewport. Used to pause render loops off-screen. */
export function useInViewport(el: RefObject<HTMLElement | null>, margin = '150px'): boolean {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = el.current
    if (!node) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin })
    io.observe(node)
    return () => io.disconnect()
  }, [el, margin])
  return inView
}
