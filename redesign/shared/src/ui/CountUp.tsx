import { animate, useInView } from 'motion/react'
import { useEffect, useMemo, useRef } from 'react'
import { EASE_OUT } from './revealVariants'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type CountUpProps = {
  to: number
  from?: number
  /** seconds */
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  /** BCP 47 locale for separators ("de" → 1.234,5; "uk" → 1 234,5). */
  locale?: string
  className?: string
  delay?: number
  once?: boolean
}

/** Number that counts up when it scrolls into view. Screen readers get the final value only. */
export function CountUp({
  to, from = 0, duration = 2, decimals = 0, prefix = '', suffix = '', locale, className, delay = 0, once = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once, amount: 0.6 })
  const reduced = usePrefersReducedMotion()
  const fmt = useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [locale, decimals],
  )
  const text = (n: number) => prefix + fmt.format(n) + suffix

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) { el.textContent = text(to); return }
    if (!inView) { el.textContent = text(from); return }
    const c = animate(from, to, { duration, delay, ease: EASE_OUT, onUpdate: (v) => { el.textContent = text(v) } })
    return () => c.stop()
    // text() depends only on the listed values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, to, from, duration, delay, fmt, prefix, suffix])

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span className="sr-only">{text(to)}</span>
      <span ref={ref} aria-hidden>{text(reduced ? to : from)}</span>
    </span>
  )
}

export default CountUp
