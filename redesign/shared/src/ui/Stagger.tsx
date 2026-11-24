import { motion } from 'motion/react'
import { Children, isValidElement, type CSSProperties, type ReactNode } from 'react'
import { revealVariants, type RevealVariant } from './revealVariants'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const TAGS = { div: motion.div, ul: motion.ul, ol: motion.ol, section: motion.section, span: motion.span }
const ITEM_TAGS = { div: motion.div, li: motion.li, span: motion.span, article: motion.article }

export type StaggerProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** Each direct child is wrapped in an item element with this class (grid cells, list items). */
  itemClassName?: string
  as?: keyof typeof TAGS
  itemAs?: keyof typeof ITEM_TAGS
  variant?: RevealVariant
  /** seconds between children */
  stagger?: number
  /** seconds before the first child */
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  amount?: number
  margin?: string
}

/** Reveals its direct children one after another when the group enters the viewport. */
export function Stagger({
  children, className, style, itemClassName, as = 'div', itemAs, variant = 'fade-up', stagger = 0.08, delay = 0,
  duration = 0.8, distance, once = true, amount = 0.2, margin = '0px 0px -8% 0px',
}: StaggerProps) {
  const reduced = usePrefersReducedMotion()
  const M = TAGS[as] as typeof motion.div
  const I = ITEM_TAGS[itemAs ?? (as === 'ul' || as === 'ol' ? 'li' : 'div')] as typeof motion.div
  const item = revealVariants(variant, { distance, duration, reduced })
  return (
    <M
      className={className}
      style={style}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount, margin: margin as never }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : delay } } }}
    >
      {Children.map(children, (child, i) =>
        child == null || child === false ? null : (
          <I key={isValidElement(child) && child.key != null ? child.key : i} className={itemClassName} variants={item}>
            {child}
          </I>
        ),
      )}
    </M>
  )
}

export default Stagger
