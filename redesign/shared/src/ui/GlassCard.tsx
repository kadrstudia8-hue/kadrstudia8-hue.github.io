import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { cx, rel } from './cx'
import { useHasFinePointer } from './useIsTouch'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type GlassCardProps = {
  children?: ReactNode
  className?: string
  /** Class for the content wrapper (padding etc.). */
  contentClassName?: string
  style?: CSSProperties
  /** Max tilt in degrees (0 disables). Never on touch devices or with reduced motion. */
  tilt?: number
  /** Cursor-following highlight. */
  glare?: boolean
  as?: 'div' | 'article' | 'li' | 'a'
  href?: string
  onClick?: () => void
}

/**
 * Frosted glass panel with a cursor-following highlight and a gentle 3D tilt.
 * Colours come from CSS variables (set them per version, e.g. class `[--glass-bg:rgb(255_255_255/0.05)]`):
 *   --glass-bg      panel fill          (default rgb(255 255 255 / 0.06))
 *   --glass-border  1px border colour   (default rgb(255 255 255 / 0.14))
 *   --glass-glare   highlight colour    (default rgb(255 255 255 / 0.18))
 *   --glass-blur    backdrop blur       (default 18px)
 *   --glass-radius  corner radius       (default 1.25rem)
 */
export function GlassCard({
  children, className, contentClassName, style, tilt = 7, glare = true, as = 'div', href, onClick,
}: GlassCardProps) {
  const touch = !useHasFinePointer()
  const reduced = usePrefersReducedMotion()
  const canTilt = !touch && !reduced && tilt > 0
  const rx = useSpring(0, { stiffness: 160, damping: 18 })
  const ry = useSpring(0, { stiffness: 160, damping: 18 })
  const mx = useMotionValue(50), my = useMotionValue(0)
  const glow = useSpring(0, { stiffness: 120, damping: 20 })
  const glareBg = useMotionTemplate`radial-gradient(520px circle at ${mx}% ${my}%, var(--glass-glare, rgb(255 255 255 / 0.18)), transparent 45%)`

  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    mx.set(px * 100); my.set(py * 100); glow.set(1)
    if (canTilt) { ry.set((px - 0.5) * 2 * tilt); rx.set(-(py - 0.5) * 2 * tilt) }
  }
  const leave = () => { rx.set(0); ry.set(0); glow.set(0) }

  const M = (as === 'article' ? motion.article : as === 'li' ? motion.li : as === 'a' ? motion.a : motion.div) as typeof motion.div
  return (
    <M
      {...(as === 'a' ? { href } : null)}
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cx(rel(className), 'isolate', className)}
      style={{
        borderRadius: 'var(--glass-radius, 1.25rem)',
        background: 'var(--glass-bg, rgb(255 255 255 / 0.06))',
        border: '1px solid var(--glass-border, rgb(255 255 255 / 0.14))',
        backdropFilter: 'blur(var(--glass-blur, 18px)) saturate(140%)',
        WebkitBackdropFilter: 'blur(var(--glass-blur, 18px)) saturate(140%)',
        transformPerspective: 900,
        rotateX: canTilt ? rx : 0,
        rotateY: canTilt ? ry : 0,
        ...style,
      }}
    >
      {/* static top sheen: reads as glass even without a pointer (touch) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ borderRadius: 'inherit', background: 'linear-gradient(180deg, var(--glass-glare, rgb(255 255 255 / 0.18)) 0%, transparent 40%)', opacity: 0.4 }}
      />
      {glare && !touch && !reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ borderRadius: 'inherit', background: glareBg, opacity: glow }}
        />
      )}
      <div className={cx('relative', contentClassName)}>{children}</div>
    </M>
  )
}

export default GlassCard
