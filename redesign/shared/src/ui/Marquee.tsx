import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cx, rel } from './cx'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type MarqueeProps = {
  children: ReactNode
  className?: string
  /** Class for each repeated track copy (spacing between items: use gap-* here). */
  trackClassName?: string
  direction?: 'left' | 'right'
  /** Pixels per second. */
  speed?: number
  pauseOnHover?: boolean
  /** Gap between copies, any CSS length. */
  gap?: string
  /** Fade the edges with a mask (no colour needed). */
  fadeEdges?: boolean
  'aria-label'?: string
  style?: CSSProperties
}

/**
 * Endless ticker. Repeats the content as many times as needed to fill the width and moves it with the Web
 * Animations API (no global CSS keyframes needed). The root clips (overflow: clip), so the page never
 * scrolls sideways. With reduced motion it stays still.
 */
export function Marquee({
  children, className, trackClassName, direction = 'left', speed = 60, pauseOnHover = true, gap = '2rem',
  fadeEdges = false, style, ...aria
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLDivElement>(null)
  const anim = useRef<Animation | null>(null)
  const reduced = usePrefersReducedMotion()
  const [copies, setCopies] = useState(2)
  const [unit, setUnit] = useState(0)

  useLayoutEffect(() => {
    const root = rootRef.current, first = firstRef.current
    if (!root || !first) return
    const measure = () => {
      const gapPx = parseFloat(getComputedStyle(rowRef.current!).columnGap) || 0
      const w = first.getBoundingClientRect().width + gapPx
      if (w < 1) return
      setUnit(w)
      setCopies(Math.max(2, Math.ceil(root.clientWidth / w) + 1))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root); ro.observe(first)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const row = rowRef.current
    if (!row || !unit || reduced) return
    const from = direction === 'left' ? 0 : -unit
    const to = direction === 'left' ? -unit : 0
    const a = row.animate(
      [{ transform: `translate3d(${from}px,0,0)` }, { transform: `translate3d(${to}px,0,0)` }],
      { duration: (unit / Math.max(1, speed)) * 1000, iterations: Infinity, easing: 'linear' },
    )
    anim.current = a
    return () => { a.cancel(); anim.current = null }
  }, [unit, speed, direction, reduced])

  const mask = fadeEdges ? 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' : undefined
  return (
    <div
      ref={rootRef}
      role={aria['aria-label'] ? 'marquee' : undefined}
      aria-label={aria['aria-label']}
      className={cx(rel(className), 'w-full max-w-full', className)}
      style={{ overflow: 'clip', contain: 'paint', maskImage: mask, WebkitMaskImage: mask, ...style }}
      onPointerEnter={pauseOnHover ? () => anim.current?.pause() : undefined}
      onPointerLeave={pauseOnHover ? () => anim.current?.play() : undefined}
      onFocusCapture={pauseOnHover ? () => anim.current?.pause() : undefined}
      onBlurCapture={pauseOnHover ? () => anim.current?.play() : undefined}
    >
      <div ref={rowRef} className="flex w-max will-change-transform" style={{ columnGap: gap }}>
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? firstRef : undefined}
            aria-hidden={i > 0 || undefined}
            inert={i > 0 || undefined}
            className={cx('flex shrink-0 items-center', trackClassName)}
            style={{ columnGap: gap }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marquee
