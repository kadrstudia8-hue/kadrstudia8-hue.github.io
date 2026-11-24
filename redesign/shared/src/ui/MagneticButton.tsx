import { motion, useSpring } from 'motion/react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PointerEvent, ReactNode } from 'react'
import { cx, rel } from './cx'
import { useHasFinePointer } from './useIsTouch'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type Common = {
  children?: ReactNode
  className?: string
  /** Class of the inner label, which moves a bit further than the button (parallax). */
  innerClassName?: string
  /** 0..1, share of the pointer offset the button follows. */
  strength?: number
}
type Conflicts = 'children' | 'className' | 'style' | 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, Conflicts> & { href?: undefined }
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, Conflicts> & { href: string }
export type MagneticButtonProps = AsButton | AsLink

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 }

/** Button, or link when `href` is given, that is pulled towards the cursor. Only with a fine hover pointer and no reduced motion. */
export function MagneticButton(props: MagneticButtonProps) {
  const { children, className, innerClassName, strength = 0.35, ...rest } = props
  const fine = useHasFinePointer()
  const reduced = usePrefersReducedMotion()
  const off = !fine || reduced
  const x = useSpring(0, SPRING), y = useSpring(0, SPRING)
  const ix = useSpring(0, SPRING), iy = useSpring(0, SPRING)

  const move = (e: PointerEvent<HTMLElement>) => {
    if (off || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
    x.set(dx * strength); y.set(dy * strength)
    ix.set(dx * strength * 0.35); iy.set(dy * strength * 0.35)
  }
  const leave = () => { x.set(0); y.set(0); ix.set(0); iy.set(0) }
  const cls = cx(rel(className), 'inline-flex items-center justify-center select-none', className)
  const inner = (
    <motion.span className={cx('relative inline-flex items-center gap-2', innerClassName)} style={{ x: ix, y: iy }}>
      {children}
    </motion.span>
  )

  if (rest.href !== undefined) {
    return (
      <motion.a {...(rest as object)} className={cls} style={{ x, y }} onPointerMove={move} onPointerLeave={leave}>
        {inner}
      </motion.a>
    )
  }
  return (
    <motion.button type="button" {...(rest as object)} className={cls} style={{ x, y }} onPointerMove={move} onPointerLeave={leave}>
      {inner}
    </motion.button>
  )
}

export default MagneticButton
