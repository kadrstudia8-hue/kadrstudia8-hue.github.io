import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import type { Cta, Inline, Rich, SiteContent } from '@kadr/shared/content/index'
import { useMediaQuery } from '@kadr/shared/ui/useMediaQuery'
import { usePrefersReducedMotion as useReducedQuery } from '@kadr/shared/ui/usePrefersReducedMotion'

export { useMediaQuery }

/** `?still` in the address renders the final state of every entrance animation (review screenshots). */
const STILL = typeof location !== 'undefined' && new URLSearchParams(location.search).has('still')
export function usePrefersReducedMotion() {
  return useReducedQuery() || STILL
}

/** Generated decor objects (public/gen). Served next to index.html. */
export const GEN = {
  sky: 'gen/v2-sky.webp',
  camera: 'gen/v2-hero-camera.webp',
  icons: 'gen/v2-icons.webp',
  cassette: 'gen/v2-cassette.webp',
  devices: 'gen/v2-devices.webp',
} as const

export const FINE = '(hover: hover) and (pointer: fine)'

export const plain = (r: Rich): string => r.map(inlineText).join('')
function inlineText(i: Inline): string {
  if (typeof i === 'string') return i
  if ('b' in i) return i.b
  if ('a' in i) return i.a
  return i.button
}
export const firstSentence = (s: string) => s.split(/(?<=[.!?])\s+/)[0]
export const lastSentence = (s: string) => { const p = s.split(/(?<=[.!?])\s+/); return p[p.length - 1] }

/** Every line of decor copy the V2 layout needs, derived from the site content (nothing invented). */
export function derive(t: SiteContent) {
  const [first, ...rest] = t.hero.title[0].text.split(' ')
  const noteParts = t.hero.note.split(' · ')
  const dendy = t.how.steps[0].text.match(/«([^»]+)»/)?.[1]
  const formats = t.faq.items.find(i => /^9:16/.test(plain(i.a)))
  const win = t.download.platforms.find(p => p.os === 'windows')
  const reelLabel = t.hero.ctas[1]?.label.replace(/^▶\s*/, '') ?? t.reel.tag
  return {
    h1: { pink: first, chrome: rest.join(' '), lime: t.hero.title[1]?.text ?? '' },
    downloadNow: noteParts[0],
    noAds: noteParts[1] ?? '',
    oneSentence: t.contact.title,
    dendy: dendy ?? lastSentence(t.features.items[5].text),
    noKeys: plain(t.hero.facts[3]),
    version: win?.details.match(/v\d+\.\d+\.\d+/)?.[0] ?? '',
    reelLabel,
    mp4: lastSentence(t.features.items[5].text),
    facts: [
      { title: plain(t.hero.facts[0]), text: firstSentence(t.how.lead) },
      { title: plain(t.hero.facts[1]), text: formats ? firstSentence(plain(formats.a)) : '' },
      { title: plain(t.hero.facts[2]), text: t.features.items[8]?.text ?? '' },
      { title: plain(t.hero.facts[3]), text: t.req.tiers[2]?.title ?? '' },
    ],
    tutorialTime: t.tutorial.captions[0].match(/\d+:\d\d/)?.[0] ?? '',
  }
}

/** Rich text → React (b / a / share button). */
export function RichText({ r, onShare, shareLabel }: { r: Rich; onShare?: () => void; shareLabel?: string }) {
  return (
    <>
      {r.map((i, k) => {
        if (typeof i === 'string') return <span key={k}>{i}</span>
        if ('b' in i) return <b key={k} className="font-bold text-ink">{i.b}</b>
        if ('a' in i) {
          const ext = /^https?:/.test(i.href)
          return <a key={k} href={i.href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>{i.a}</a>
        }
        return (
          <button key={k} type="button" onClick={onShare} className="font-bold text-violet-deep underline underline-offset-3">
            {shareLabel ?? i.button}
          </button>
        )
      })}
    </>
  )
}

/** OS-aware label of the main download CTA (site.js behaviour). */
export function useOsLabel(cta: Cta, t: SiteContent) {
  const [label, setLabel] = useState(cta.label)
  useEffect(() => {
    if (!cta.osAware) { setLabel(cta.label); return }
    const ua = navigator.userAgent
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
    if (mobile) setLabel(cta.label)
    else if (/Mac/i.test(ua)) setLabel(t.ui.downloadMac)
    else if (/Win/i.test(ua)) setLabel(t.ui.downloadWindows)
    else setLabel(cta.label)
  }, [cta, t])
  return label
}

/** Click ripple from the pointer position (buttons). */
export function ripple(e: RPointerEvent<HTMLElement>, color = 'rgba(11,11,18,.15)') {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const s = document.createElement('span')
  const size = Math.max(r.width, r.height) * 2.2
  s.className = 'ripple'
  Object.assign(s.style, { left: `${e.clientX - r.left}px`, top: `${e.clientY - r.top}px`, width: `${size}px`, height: `${size}px`, background: color })
  el.appendChild(s)
  s.addEventListener('animationend', () => s.remove(), { once: true })
}

/** Magnetic pull towards the cursor (fine pointers only, off with reduced motion). */
export function useMagnetic<T extends HTMLElement>(radius = 60, strength = 0.3) {
  const ref = useRef<T>(null)
  const fine = useMediaQuery(FINE)
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || !fine || reduced) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2
        const dx = e.clientX - cx, dy = e.clientY - cy
        const d = Math.hypot(dx, dy)
        const reach = radius + Math.max(r.width, r.height) / 2
        if (d < reach) el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
        else el.style.transform = ''
      })
    }
    el.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1)'
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); el.style.transform = '' }
  }, [fine, reduced, radius, strength])
  return ref
}

/** true once the element has been at least `amount` visible. */
export function useInViewOnce<T extends Element>(amount = 0.25) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: amount })
    io.observe(el)
    return () => io.disconnect()
  }, [amount, seen])
  return [ref, seen] as const
}

/** <img> for a generated object: if the file is missing it renders `fallback` instead (no broken image). */
export function GenImg({ src, alt = '', className, style, fallback, eager, width, height }: {
  src: string; alt?: string; className?: string; style?: CSSProperties; fallback?: ReactNode; eager?: boolean; width?: number; height?: number
}) {
  const [failed, setFailed] = useState(false)
  if (failed) return <>{fallback ?? null}</>
  return (
    <img src={src} alt={alt} className={className} style={style} width={width} height={height} draggable={false}
      loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : undefined} onError={() => setFailed(true)} />
  )
}

/** Only one inline video plays at a time on the page. */
let playing: HTMLVideoElement | null = null
export function playExclusive(v: HTMLVideoElement) {
  if (playing && playing !== v) playing.pause()
  playing = v
  v.play().catch(() => {})
}

/** Muted loop that plays while visible (one at a time), poster otherwise. Off with reduced motion. */
export function useAutoVideo(enabled = true, amount = 0.6) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()
  const [isPlaying, setIsPlaying] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const on = () => setIsPlaying(true), off = () => setIsPlaying(false)
    v.addEventListener('playing', on); v.addEventListener('pause', off); v.addEventListener('ended', off)
    if (!enabled || reduced) { v.pause(); return () => { v.removeEventListener('playing', on); v.removeEventListener('pause', off); v.removeEventListener('ended', off) } }
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= amount) { v.muted = true; playExclusive(v) } else v.pause()
    }, { threshold: [0, amount] })
    io.observe(v)
    return () => { io.disconnect(); v.removeEventListener('playing', on); v.removeEventListener('pause', off); v.removeEventListener('ended', off) }
  }, [enabled, reduced, amount])
  return [ref, isPlaying] as const
}

/** Pointer position, normalised to -1..1 around the viewport centre (shared by parallax / holo effects). */
type PointerListener = (x: number, y: number) => void
const pointerListeners = new Set<PointerListener>()
let pointerBound = false
export function onPointer(fn: PointerListener) {
  if (!pointerBound && typeof window !== 'undefined') {
    pointerBound = true
    let raf = 0, lx = 0, ly = 0
    window.addEventListener('pointermove', (e) => {
      lx = (e.clientX / innerWidth) * 2 - 1; ly = (e.clientY / innerHeight) * 2 - 1
      if (raf) return
      raf = requestAnimationFrame(() => { raf = 0; pointerListeners.forEach(l => l(lx, ly)) })
    }, { passive: true })
  }
  pointerListeners.add(fn)
  return () => { pointerListeners.delete(fn) }
}
