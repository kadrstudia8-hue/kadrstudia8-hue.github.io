import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
import { useHasFinePointer } from '@kadr/shared/ui/useIsTouch'
import { usePrefersReducedMotion } from '@kadr/shared/ui/usePrefersReducedMotion'

type Props = {
  href?: string
  onClick?: () => void
  variant?: 'white' | 'glass'
  size?: 'md' | 'sm'
  arrow?: boolean
  children: ReactNode
  className?: string
  magnetic?: boolean
  disabled?: boolean
  ariaLabel?: string
  external?: boolean
}

function addRipple(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const d = Math.max(r.width, r.height) * 2.2
  const s = document.createElement('span')
  s.className = 'ripple'
  s.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${d}px;height:${d}px`
  el.appendChild(s)
  setTimeout(() => s.remove(), 480)
}

/** Pill button / link of V3: white primary or glass secondary; ripple on press; magnetic (80px, 0.25) on fine pointers. */
export function Btn({ href, onClick, variant = 'white', size = 'md', arrow, children, className = '', magnetic, disabled, ariaLabel, external }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const fine = useHasFinePointer()
  const reduced = usePrefersReducedMotion()
  const mag = magnetic && fine && !reduced && !disabled

  useEffect(() => {
    const el = ref.current
    if (!mag || !el) return
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0, px = -1e4, py = -1e4
    const tick = () => {
      const r = el.getBoundingClientRect()
      const mx = r.left + r.width / 2 - cx, my = r.top + r.height / 2 - cy
      const dx = px - mx, dy = py - my
      const inside = Math.abs(dx) < r.width / 2 + 80 && Math.abs(dy) < r.height / 2 + 80
      tx = inside ? dx * 0.25 : 0; ty = inside ? dy * 0.25 : 0
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2
      el.style.translate = `${cx.toFixed(2)}px ${cy.toFixed(2)}px`
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(tick) : 0
    }
    const move = (e: globalThis.PointerEvent) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(tick) }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); el.style.translate = '' }
  }, [mag])

  const cls = `btn ${variant === 'white' ? 'btn-white' : 'btn-glass'} ${size === 'sm' ? 'sm' : ''} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight className="arr" size={17} strokeWidth={1.75} aria-hidden />}
    </>
  )
  const down = (e: PointerEvent<HTMLElement>) => { if (!disabled && !reduced) addRipple(e) }
  if (href && !disabled) {
    return (
      <a
        ref={(n) => { ref.current = n }}
        href={href}
        className={cls}
        onPointerDown={down}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener' } : null)}
      >
        {inner}
      </a>
    )
  }
  return (
    <button ref={(n) => { ref.current = n }} type="button" className={cls} onPointerDown={down} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {inner}
    </button>
  )
}
