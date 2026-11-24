// V4 UI kit: buttons (DESIGN-V4 6), chips, neon notes, reveal, rich text.
import { ArrowRight, Play } from 'lucide-react'
import { Fragment, useEffect, useRef, type ReactNode, type CSSProperties, type PointerEvent as RPE } from 'react'
import type { Rich as RichT } from '@kadr/shared/content/index.ts'
import { CALM, FINE, useInView } from './env'
import { emit } from './stage'

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

const isExt = (href: string) => /^https?:/.test(href)

// ---------------------------------------------------------------- buttons

type BtnProps = {
  kind?: 'primary' | 'glass'
  size?: 'md' | 'sm'
  href?: string
  onClick?: () => void
  children: ReactNode
  className?: string
  arrow?: boolean
  icon?: ReactNode
  disabled?: boolean
  label?: string
  download?: boolean
}

function ripple(e: RPE<HTMLElement>) {
  if (CALM) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const s = document.createElement('span')
  s.className = 'rip'
  s.setAttribute('aria-hidden', 'true')
  s.style.left = `${e.clientX - r.left}px`
  s.style.top = `${e.clientY - r.top}px`
  el.appendChild(s)
  setTimeout(() => s.remove(), 440)
}

/** Primary «Свет» (magnetic) and secondary «Стекло». */
export function Btn({ kind = 'primary', size = 'md', href, onClick, children, className, arrow, icon, disabled, label, download }: BtnProps) {
  const ref = useRef<HTMLElement>(null)
  useMagnetic(ref, kind === 'primary' && !disabled)
  const cls = cx('btn', kind === 'primary' ? 'btn-light' : 'btn-glass', size === 'sm' && 'btn-sm', className)
  const spot = (e: RPE<HTMLElement>) => {
    if (kind !== 'glass') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--bx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--by', `${e.clientY - r.top}px`)
  }
  const hover = kind === 'primary' ? { onPointerEnter: () => emit({ type: 'cta:hover', on: true }), onPointerLeave: () => emit({ type: 'cta:hover', on: false }) } : {}
  const inner = (
    <>
      {icon}
      <span className="btn-t">{children}</span>
      {arrow && <ArrowRight className="btn-arrow" size={18} strokeWidth={2.4} aria-hidden />}
    </>
  )
  if (href && !disabled) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} className={cls} aria-label={label} onPointerDown={ripple} onPointerMove={spot} onClick={onClick} {...hover}
        {...(isExt(href) && !download ? { target: '_blank', rel: 'noopener' } : null)}>
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} type="button" className={cls} aria-label={label} onPointerDown={ripple} onPointerMove={spot} onClick={onClick} disabled={disabled} {...hover}>
      {inner}
    </button>
  )
}

/** Magnetic pull for primary buttons and the play circle: radius 90, up to 8px. */
export function useMagnetic(ref: React.RefObject<HTMLElement | null>, on = true) {
  useEffect(() => {
    if (!on || !FINE || CALM) return
    const el = ref.current
    if (!el) return
    let active = false
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cxp = r.left + r.width / 2, cyp = r.top + r.height / 2
      const dx = e.clientX - cxp, dy = e.clientY - cyp
      const reach = 90 + Math.max(r.width, r.height) / 2
      if (Math.hypot(dx, dy) < reach) {
        active = true
        const k = 0.22
        const tx = Math.max(-8, Math.min(8, dx * k)), ty = Math.max(-8, Math.min(8, dy * k))
        el.style.setProperty('--mgx', `${tx.toFixed(1)}px`)
        el.style.setProperty('--mgy', `${ty.toFixed(1)}px`)
      } else if (active) {
        active = false
        el.style.setProperty('--mgx', '0px')
        el.style.setProperty('--mgy', '0px')
      }
    }
    addEventListener('pointermove', move, { passive: true })
    return () => removeEventListener('pointermove', move)
  }, [ref, on])
}

/** «Ссылка-действие»: circle with a triangle + label, spectrum underline on hover. */
export function PlayLink({ href, onClick, children, className }: { href?: string; onClick?: () => void; children: ReactNode; className?: string }) {
  const inner = (
    <>
      <span className="pl-dot" aria-hidden><Play size={15} fill="currentColor" strokeWidth={0} /></span>
      <span className="pl-t">{children}</span>
    </>
  )
  return href
    ? <a href={href} className={cx('playlink', className)} onClick={onClick}>{inner}</a>
    : <button type="button" className={cx('playlink', className)} onClick={onClick}>{inner}</button>
}

// ---------------------------------------------------------------- chips

export const LIGHTS = ['var(--lime)', 'var(--pink)', 'var(--lilac)', 'var(--cyan)', 'var(--amber)'] as const

export function Chip({ children, color = 'var(--lilac)', className, active, onClick, big, expanded, controls }: {
  children: ReactNode; color?: string; className?: string; active?: boolean; onClick?: () => void; big?: boolean; expanded?: boolean; controls?: string
}) {
  const style = { '--c': color } as CSSProperties
  if (onClick) {
    return (
      <button type="button" className={cx('chip', big && 'chip-big', active && 'chip-on', className)} style={style} onClick={onClick}
        aria-pressed={expanded === undefined ? active : undefined} aria-expanded={expanded} aria-controls={controls}>
        <i className="chip-dot" aria-hidden />{children}
      </button>
    )
  }
  return <span className={cx('chip', big && 'chip-big', className)} style={style}><i className="chip-dot" aria-hidden />{children}</span>
}

// ---------------------------------------------------------------- neon handwritten note

export function Scribble({ children, color = 'var(--pink)', rotate = -4, className }: { children: ReactNode; color?: string; rotate?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref)
  return (
    <span ref={ref} className={cx('scribble', seen && 'is-in', className)} style={{ '--c': color, '--rot': `${rotate}deg` } as CSSProperties}>
      <span className="scribble-t">{children}</span>
      <svg className="scribble-u" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
        <path d="M2 9 C 40 3, 80 12, 120 6 S 180 4, 198 8" pathLength={1} />
      </svg>
    </span>
  )
}

// ---------------------------------------------------------------- reveal (opacity + y, once)

export function Reveal({ children, className, delay = 0, as: Tag = 'div', style, ...rest }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'p' | 'span'; id?: string; style?: CSSProperties } & Record<`data-${string}`, string | boolean | undefined>) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref)
  const T = Tag as 'div'
  return (
    <T ref={ref as React.RefObject<HTMLDivElement>} className={cx('rv', seen && 'is-in', className)} style={{ ...style, '--d': `${delay}ms` } as CSSProperties} {...rest}>
      {children}
    </T>
  )
}

// ---------------------------------------------------------------- rich text

export function Rich({ value, onShare, shareLabel }: { value: RichT; onShare?: () => void; shareLabel?: string }) {
  return (
    <>
      {value.map((p, i) => {
        if (typeof p === 'string') return <Fragment key={i}>{p}</Fragment>
        if ('b' in p) return <b key={i}>{p.b}</b>
        if ('a' in p) return <a key={i} className="ilink" href={p.href} {...(isExt(p.href) ? { target: '_blank', rel: 'noopener' } : null)}>{p.a}</a>
        return <button key={i} type="button" className="ilink" onClick={onShare}>{shareLabel ?? p.button}</button>
      })}
    </>
  )
}

/** Section shell: id, data-v4-section, vertical rhythm. */
export function Section({ id, children, className, label }: { id: string; children: ReactNode; className?: string; label?: string }) {
  return (
    <section id={id} data-v4-section className={cx('sec', className)} aria-label={label}>
      {children}
    </section>
  )
}

/** A thin spectrum line between sections, grows from the centre. */
export function Divider() {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref)
  return <div ref={ref} aria-hidden className={cx('divider', seen && 'is-in')} />
}
