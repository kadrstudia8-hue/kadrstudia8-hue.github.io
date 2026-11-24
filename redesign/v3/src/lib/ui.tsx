import { m as motion, type Variants } from 'motion/react'
import { useReducedMotion } from './motion'
import { Plus } from 'lucide-react'
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { COPY, splitAccent } from '../copy'

export const TEXT_SPRING = { type: 'spring', stiffness: 120, damping: 20 } as const
export const CARD_SPRING = { type: 'spring', stiffness: 260, damping: 22 } as const

/** H2 with the last part lilac (§3.5: every heading has a lilac part). */
export function H2({ title, className = '', id }: { title: string; className?: string; id?: string }) {
  const [a, b] = splitAccent(title)
  return <h2 id={id} className={`h2 m-0 ${className}`}>{a}<span className="lilac">{b}</span></h2>
}

/** Section header of the reference: eyebrow + H2 left, lead + pill (and extras) right. */
export function Head({ tag, title, lead, right, className = '', narrow }: { tag: string; title: string; lead?: ReactNode; right?: ReactNode; className?: string; narrow?: boolean }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`}
      initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: 0.3 }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      <div className={narrow ? 'md:max-w-[560px]' : 'md:max-w-[640px]'}>
        <motion.p variants={item} transition={TEXT_SPRING} className="eyebrow m-0 mb-3.5">{tag}</motion.p>
        <motion.div variants={item} transition={TEXT_SPRING}><H2 title={title} /></motion.div>
      </div>
      {(lead || right) && (
        <motion.div variants={item} transition={TEXT_SPRING} className="flex flex-col gap-4 md:max-w-[520px] md:flex-row md:items-center md:gap-8 lg:mb-1.5">
          {lead && <p className="lead m-0 !text-[14px] md:max-w-[300px] lg:max-w-[340px]">{lead}</p>}
          {right && <div className="flex flex-none items-center gap-3">{right}</div>}
        </motion.div>
      )}
    </motion.div>
  )
}

const item: Variants = { hide: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

/** Cards: y 40, opacity 0, scale .96 → 1, one by one (spring 260/22, stagger 90 ms). */
export const cardList: Variants = { show: { transition: { staggerChildren: 0.09 } } }
export const cardItem: Variants = { hide: { opacity: 0, y: 40, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: CARD_SPRING } }

export function Rise({ children, className = '', delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) {
  const reduced = useReducedMotion()
  return (
    <motion.div className={className} style={style} initial={reduced ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} transition={{ ...TEXT_SPRING, delay }}>
      {children}
    </motion.div>
  )
}

/** Number that «winds up» once when visible (900 ms, cubic-bezier(.16,1,.3,1)). */
export function Count({ from = 0, to }: { from?: number; to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const [v, setV] = useState(reduced ? to : from)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) { setV(to); return }
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const ease = (x: number) => 1 - Math.pow(1 - x, 4)
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 900)
        setV(Math.round(from + (to - from) * ease(k)))
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [from, to, reduced])
  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}><span className="sr-only">{to}</span><span aria-hidden>{v}</span></span>
}

/** Drag-to-scroll for horizontal snap rows with a mouse (touch scrolls natively). */
export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let down = false, sx = 0, sl = 0, moved = false
    const d = (e: PointerEvent) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft }
    const m = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - sx
      if (!moved && Math.abs(dx) > 6) { moved = true; el.style.scrollSnapType = 'none'; el.style.cursor = 'grabbing' }
      if (moved) el.scrollLeft = sl - dx
    }
    const u = () => {
      if (!down) return
      down = false; el.style.cursor = ''
      if (moved) {
        const kids = Array.from(el.children) as HTMLElement[]
        const near = kids.reduce((a, k) => (Math.abs(k.offsetLeft - el.scrollLeft - el.offsetLeft * 0) < Math.abs(a.offsetLeft - el.scrollLeft) ? k : a), kids[0])
        el.scrollTo({ left: near.offsetLeft - kids[0].offsetLeft, behavior: 'smooth' })
        setTimeout(() => { el.style.scrollSnapType = '' }, 400)
      }
    }
    const c = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }
    el.addEventListener('pointerdown', d); window.addEventListener('pointermove', m); window.addEventListener('pointerup', u)
    el.addEventListener('click', c, true)
    return () => { el.removeEventListener('pointerdown', d); window.removeEventListener('pointermove', m); window.removeEventListener('pointerup', u); el.removeEventListener('click', c, true) }
  }, [])
  return ref
}

/** «More» toggle: long explanations (content `details`) stay folded; grid 0fr → 1fr, folded text is inert. */
export function More({ text, className = '' }: { text?: string; className?: string }) {
  const { lang } = useLang()
  const c = COPY[lang]
  const [open, setOpen] = useState(false)
  const id = useId()
  if (!text) return null
  return (
    <div className={className}>
      <div id={id} inert={!open || undefined} className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="min-h-0 overflow-hidden"><p className="m-0 pt-2 text-[14px] leading-[1.6] text-text-2">{text}</p></div>
      </div>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}
        className="group/more -ml-1 mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-[13px] font-medium text-lilac-hi transition-colors hover:text-white">
        {open ? c.less : c.more}
        <Plus size={14} strokeWidth={2} aria-hidden className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
      </button>
    </div>
  )
}
