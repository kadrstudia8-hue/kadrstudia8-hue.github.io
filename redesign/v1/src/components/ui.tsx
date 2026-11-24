import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import {
  createContext, useContext, useEffect, useRef, useState,
  type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode, type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import type { Rich as RichT } from '@kadr/shared/content/types'
import { claimPlayback, EASE, SPLICE, useFine, useReduced } from '../lib/env'

/* ───────── rich text ───────── */
export function Rich({ value, onShare, shareLabel }: { value: RichT; onShare?: () => void; shareLabel?: string }) {
  return (
    <>
      {value.map((p, i) => {
        if (typeof p === 'string') return <span key={i}>{p}</span>
        if ('b' in p) return <b key={i}>{p.b}</b>
        if ('a' in p) {
          const ext = /^https?:/.test(p.href)
          return <a key={i} href={p.href} {...(ext ? { target: '_blank', rel: 'noopener' } : null)}>{p.a}</a>
        }
        return <button key={i} type="button" className="share-link" onClick={onShare}>{shareLabel ?? p.button}</button>
      })}
    </>
  )
}

/* ───────── buttons ───────── */
type BtnProps = {
  variant?: 'primary' | 'ghost'
  href?: string
  children: ReactNode
  arrow?: boolean
  icon?: ReactNode
  magnetic?: boolean
  className?: string
  disabled?: boolean
  onClick?: (e: MouseEvent) => void
  onPointerEnter?: () => void
  ariaLabel?: string
}

/** Magnetic pull within `radius` px of the element's edge, `strength` share of the pointer offset. CSS vars → transform. */
function useMagnetic(ref: RefObject<HTMLElement | null>, on: boolean, radius = 80, strength = 0.25) {
  const fine = useFine()
  const reduced = useReduced()
  useEffect(() => {
    const el = ref.current
    if (!el || !on || !fine || reduced) return
    let raf = 0, x = 0, y = 0
    const move = (e: globalThis.PointerEvent) => {
      x = e.clientX; y = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const apply = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom)
      if (Math.hypot(dx, dy) > radius) { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); return }
      el.style.setProperty('--mx', `${((x - (r.left + r.width / 2)) * strength).toFixed(1)}px`)
      el.style.setProperty('--my', `${((y - (r.top + r.height / 2)) * strength).toFixed(1)}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); el.style.removeProperty('--mx'); el.style.removeProperty('--my') }
  }, [ref, on, fine, reduced, radius, strength])
}

function ripple(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const s = document.createElement('span')
  const d = Math.max(r.width, r.height) * 2
  s.className = 'ripple'
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`
  el.appendChild(s)
  setTimeout(() => s.remove(), 480)
}

export function Btn({ variant = 'primary', href, children, arrow, icon, magnetic, className = '', disabled, onClick, onPointerEnter, ariaLabel }: BtnProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  useMagnetic(ref, !!magnetic && !disabled)
  const cls = `btn btn-${variant} ${className}`
  const inner = (
    <>
      {icon}
      <span className="btn-label">{children}</span>
      {arrow && <ArrowRight className="btn-arrow" size={18} strokeWidth={2.2} aria-hidden />}
    </>
  )
  const common = { ref, className: cls, onPointerDown: disabled ? undefined : ripple, onPointerEnter, 'aria-label': ariaLabel }
  if (href && !disabled) {
    const ext = /^https?:/.test(href)
    return <a {...common} href={href} onClick={onClick} {...(ext ? { target: '_blank', rel: 'noopener' } : null)}>{inner}</a>
  }
  return <button {...common} type="button" disabled={disabled} onClick={onClick}>{inner}</button>
}

/* ───────── reveal: y 32 → 0, opacity, 700 ms, stagger 70 ms, once at 20 % ───────── */
const RvCtx = createContext(false)
export function Rv({ children, className, style, delay = 0, as = 'div', y = 32 }: { children: ReactNode; className?: string; style?: CSSProperties; delay?: number; as?: 'div' | 'li' | 'p' | 'article' | 'figure'; y?: number }) {
  const reduced = useReduced()
  const inGroup = useContext(RvCtx)
  const M = (as === 'li' ? motion.li : as === 'p' ? motion.p : as === 'article' ? motion.article : as === 'figure' ? motion.figure : motion.div) as typeof motion.div
  if (reduced) return <M className={className} style={style}>{children}</M>
  const variants = { hidden: { opacity: 0, y }, shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } } }
  return inGroup
    ? <M className={className} style={style} variants={variants}>{children}</M>
    : <M className={className} style={style} variants={variants} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>{children}</M>
}
/** Children Rv's appear one after another (70 ms). */
export function RvGroup({ children, className, style, as = 'div', amount = 0.2, stagger = 0.07 }: { children: ReactNode; className?: string; style?: CSSProperties; as?: 'div' | 'ul' | 'ol'; amount?: number; stagger?: number }) {
  const reduced = useReduced()
  const M = (as === 'ul' ? motion.ul : as === 'ol' ? motion.ol : motion.div) as typeof motion.div
  if (reduced) return <M className={className} style={style}>{children}</M>
  return (
    <RvCtx.Provider value>
      <M className={className} style={style} initial="hidden" whileInView="shown" viewport={{ once: true, amount }}
        variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}>
        {children}
      </M>
    </RvCtx.Provider>
  )
}

/* ───────── section head: counter · eyebrow, H2 with an italic accent tail ───────── */
export function accentTitle(t: string): ReactNode {
  const m = t.match(/^(.*?[→—–:])\s+(.+)$/)
  if (!m) return t
  return <>{m[1]} <em>{m[2]}</em></>
}

export function SectionHead({ n, tag, title, lead, center, children, id }: { n: number; tag: string; title: string; lead?: ReactNode; center?: boolean; children?: ReactNode; id?: string }) {
  return (
    <RvGroup className={`sec-head${center ? ' is-center' : ''}`}>
      <Rv><p className="eyebrow"><span className="eyebrow-n">{String(n).padStart(2, '0')}</span>{tag}</p></Rv>
      <Rv><h2 id={id} className="h2">{accentTitle(title)}</h2></Rv>
      {lead && <Rv><p className="lead">{lead}</p></Rv>}
      {children}
    </RvGroup>
  )
}

/** Golden «splice» hairline at the top of a section: grows 0 → 100 % on entry (800 ms). */
export function Splice() {
  const reduced = useReduced()
  return (
    <div className="wrap splice-wrap" aria-hidden>
      <motion.div className="splice" initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.8, ease: SPLICE }} />
    </div>
  )
}

/* ───────── HUD corner brackets (draw 0 → 12 px on appear / hover) ───────── */
export function Hud() {
  return (
    <span className="hud" aria-hidden>
      <i className="hud-tl" /><i className="hud-tr" /><i className="hud-bl" /><i className="hud-br" />
    </span>
  )
}

/* ───────── inline muted loop: preload none, plays only in view, one at a time ───────── */
export function LoopVideo({ src, poster, className, label, width, height, play = true, fit = 'cover' }: { src: string; poster: string; className?: string; label?: string; width?: number; height?: number; play?: boolean; fit?: 'cover' | 'contain' }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReduced()
  useEffect(() => {
    const v = ref.current
    if (!v || reduced || !play) return
    let vis = false
    const io = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting
      if (vis) { if (!v.getAttribute('src')) v.src = src; claimPlayback(v); v.play().catch(() => {}) }
      else v.pause()
    }, { threshold: 0.55 })
    io.observe(v)
    return () => { io.disconnect(); v.pause(); void vis }
  }, [src, reduced, play])
  // a new source on the same element (example switch): reset
  useEffect(() => {
    const v = ref.current
    if (!v || !v.getAttribute('src')) return
    v.src = src
    if (play && !reduced) { claimPlayback(v); v.play().catch(() => {}) }
  }, [src]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" aria-label={label}
      width={width} height={height} style={{ objectFit: fit }} disablePictureInPicture />
  )
}

/* ───────── backdrop layer: section backgrounds that must sit UNDER the particle canvas ───────── */
const BackdropCtx = createContext<HTMLElement | null>(null)
export const BackdropProvider = BackdropCtx.Provider

/** Renders children into the page backdrop (below the fixed particle canvas), aligned to the section `target`. */
export function Backdrop({ target, children, className = '' }: { target: RefObject<HTMLElement | null>; children: ReactNode; className?: string }) {
  const host = useContext(BackdropCtx)
  const [box, setBox] = useState<{ top: number; height: number } | null>(null)
  // useEffect, not layout: the parent's ref is attached after a child's layout effects run
  useEffect(() => {
    const el = target.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      const top = Math.round(r.top + window.scrollY), height = Math.round(r.height)
      setBox((b) => (b && b.top === top && b.height === height ? b : { top, height }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el); ro.observe(document.body)
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); window.removeEventListener('load', measure) }
  }, [target])
  if (!host || !box) return null
  return createPortal(<div className={`bd ${className}`} style={{ top: box.top, height: box.height }}>{children}</div>, host)
}

/* ───────── «more» disclosure for the long `details` texts (native <details>, keyboard and AT for free) ───────── */
const MORE: Record<string, string> = { uk: 'Детальніше', ru: 'Подробнее', en: 'More', es: 'Más', de: 'Mehr' }
export function More({ text, lang }: { text?: string; lang: string }) {
  if (!text) return null
  return (
    <details className="more">
      <summary><span className="more-ic" aria-hidden /> {MORE[lang] ?? MORE.en}</summary>
      <p className="more-text">{text}</p>
    </details>
  )
}
