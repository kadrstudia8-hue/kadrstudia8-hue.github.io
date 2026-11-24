import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { revealVariants, type RevealVariant } from './revealVariants'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type { RevealVariant }

const TAGS = { div: motion.div, section: motion.section, span: motion.span, li: motion.li, p: motion.p, figure: motion.figure, article: motion.article, header: motion.header }
export type RevealTag = keyof typeof TAGS

export type RevealProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  as?: RevealTag
  variant?: RevealVariant
  /** seconds */
  delay?: number
  /** seconds */
  duration?: number
  /** px for fade-up / blur-in */
  distance?: number
  /** animate only the first time it enters (default true) */
  once?: boolean
  /** share of the element that must be visible, 0..1 */
  amount?: number
  /** viewport margin, e.g. "0px 0px -10% 0px" */
  margin?: string
  id?: string
}

/** Appears when scrolled into view. Reduced motion: rendered visible, no transform. */
export function Reveal({
  children, className, style, as = 'div', variant = 'fade-up', delay = 0, duration = 0.8, distance, once = true,
  amount = 0.25, margin = '0px 0px -8% 0px', id,
}: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const M = TAGS[as] as typeof motion.div
  const base = revealVariants(variant, { distance, duration, reduced })
  const v = delay && !reduced ? withDelay(base, delay) : base
  return (
    <M
      id={id}
      className={className}
      style={style}
      variants={v}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount, margin: margin as never }}
    >
      {children}
    </M>
  )
}

function withDelay(v: ReturnType<typeof revealVariants>, delay: number) {
  const shown = v.shown as Record<string, unknown> & { transition?: object }
  return { ...v, shown: { ...shown, transition: { ...(shown.transition || {}), delay } } }
}

export default Reveal
