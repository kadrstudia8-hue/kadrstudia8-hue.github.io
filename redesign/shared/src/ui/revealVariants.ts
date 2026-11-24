import type { Variants } from 'motion/react'

export type RevealVariant = 'fade' | 'fade-up' | 'blur-in' | 'clip-reveal' | 'scale-in'

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** hidden / shown states for each reveal style. `distance` is the fade-up travel in px. */
export function revealVariants(variant: RevealVariant, opts: { distance?: number; duration?: number; reduced?: boolean } = {}): Variants {
  const { distance = 28, duration = 0.8, reduced = false } = opts
  const transition = { duration: reduced ? 0.01 : duration, ease: EASE_OUT }
  if (reduced) return { hidden: { opacity: 1 }, shown: { opacity: 1, transition } }
  switch (variant) {
    case 'fade':
      return { hidden: { opacity: 0 }, shown: { opacity: 1, transition } }
    case 'fade-up':
      return { hidden: { opacity: 0, y: distance }, shown: { opacity: 1, y: 0, transition } }
    case 'blur-in':
      return {
        hidden: { opacity: 0, filter: 'blur(14px)', y: distance * 0.4 },
        shown: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { ...transition, duration: duration * 1.15 } },
      }
    case 'clip-reveal':
      return {
        hidden: { clipPath: 'inset(0% 0% 100% 0%)', y: distance * 0.5 },
        shown: { clipPath: 'inset(0% 0% 0% 0%)', y: 0, transition: { ...transition, duration: duration * 1.25 } },
      }
    case 'scale-in':
      return { hidden: { opacity: 0, scale: 0.94 }, shown: { opacity: 1, scale: 1, transition } }
  }
}
