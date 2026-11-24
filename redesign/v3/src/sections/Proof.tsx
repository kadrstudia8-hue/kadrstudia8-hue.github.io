import { ArrowLeft, ArrowRight, ArrowUpRight, Quote, X } from 'lucide-react'
import { AnimatePresence, m as motion } from 'motion/react'
import { useReducedMotion } from '../lib/motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { DemoExample } from '@kadr/shared/content/index.ts'
import { useLang } from '@kadr/shared/i18n'
import { useHasFinePointer } from '@kadr/shared/ui/useIsTouch'
import { useOverlay } from '@kadr/shared/ui/useOverlay'
import { COPY } from '../copy'
import { Btn } from '../lib/Btn'
import { cardItem, cardList, Head, useDragScroll } from '../lib/ui'

/** Player for one example: video + the prompt it was made from + its tags. */
function ExampleModal({ ex, onClose }: { ex: DemoExample | null; onClose: () => void }) {
  const { lang } = useLang()
  const c = COPY[lang]
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useOverlay(!!ex, ref, onClose)
  return createPortal(
    <AnimatePresence>
      {ex && (
        <motion.div ref={ref} role="dialog" aria-modal="true" aria-label={ex.label}
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto p-4 md:p-8"
          style={{ background: 'rgba(8,5,20,.82)', WebkitBackdropFilter: 'blur(14px)', backdropFilter: 'blur(14px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .22 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div
            initial={reduced ? false : { y: 24, scale: .97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className={`glass rim relative grid w-full gap-5 p-3 md:gap-8 md:p-4 ${ex.shape === 'v' ? 'max-w-[860px] md:grid-cols-[minmax(0,340px)_1fr]' : 'max-w-[1100px] lg:grid-cols-[minmax(0,1fr)_340px]'}`}>
            <div className={`overflow-hidden rounded-[18px] bg-black ${ex.shape === 'v' ? 'mx-auto aspect-[9/16] max-h-[72vh] w-full max-w-[340px]' : 'aspect-video w-full'}`}>
              <video key={ex.video} src={ex.video} poster={ex.poster} className="h-full w-full object-cover" controls autoPlay muted playsInline loop data-autofocus aria-label={ex.alt} />
            </div>
            <div className="flex flex-col gap-4 px-2 pb-3 md:py-4 md:pr-6">
              <p className="eyebrow m-0">{ex.label}</p>
              <p className="m-0 flex gap-3 text-[18px] font-normal leading-[1.5] text-white md:text-[20px]">
                <Quote size={20} className="mt-1 flex-none text-lilac" aria-hidden />{ex.prompt}
              </p>
              <ul className="m-0 mt-auto flex list-none flex-wrap gap-2 p-0">
                {ex.meta.map((m) => <li key={m} className="pill-cap !h-8 !text-[13px]">{m}</li>)}
              </ul>
            </div>
            <button type="button" onClick={onClose} aria-label={c.close} className="circle-btn absolute -right-2 -top-2 !bg-white !text-night md:-right-4 md:-top-4"><X size={18} aria-hidden /></button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/** Media card of «Recent Projects»: poster, video on hover/tap (crossfade 200 ms), pill caption, ↗. */
export function MediaCard({ img, alt, video, label, extra, onOpen, highlight, className = '', pos }: {
  pos?: string; img: string; alt: string; video?: string; label: string; extra?: string; onOpen?: () => void; highlight?: boolean; className?: string
}) {
  const fine = useHasFinePointer()
  const reduced = useReducedMotion()
  const vref = useRef<HTMLVideoElement>(null)
  const [hot, setHot] = useState(false)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const v = vref.current
    if (!v || !video) return
    if (hot && !reduced) {
      if (!v.src) v.src = video
      v.play().then(() => setPlaying(true)).catch(() => {})
    } else { v.pause(); setPlaying(false) }
  }, [hot, video, reduced])
  return (
    <motion.li variants={cardItem} className={`relative ${className}`}>
      <div
        className={`media-card group h-full w-full transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-white/45 ${highlight ? 'ring-2 ring-lilac ring-offset-4 ring-offset-transparent' : ''}`}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHot(true) }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHot(false) }}
        onClick={() => { if (!fine && video) setHot((h) => !h) }}
      >
        <img src={img} alt="" aria-hidden loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ objectPosition: pos }} />
        {video && <video ref={vref} muted loop playsInline preload="none" aria-hidden className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ease-out" style={{ opacity: playing ? 1 : 0, objectPosition: pos }} />}
        <span aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 0%, oklch(100% 0 0 / .08), transparent 60%), linear-gradient(180deg in oklch, oklch(14% .05 290 / .28) 0%, transparent 28%, transparent 56%, oklch(20% .06 315 / .3) 78%, oklch(13% .045 288 / .62) 100%)' }} />
        <span className="rivet" aria-hidden />
        <span className="pill-cap absolute bottom-4 left-4 max-w-[calc(100%-32px)] overflow-hidden transition-[padding] duration-200 ease-out">
          <span className="truncate">{label}</span>
          {extra && (
            <span className="grid transition-[grid-template-columns,opacity] duration-200 ease-out" style={{ gridTemplateColumns: hot ? '1fr' : '0fr', opacity: hot ? 1 : 0 }}>
              <span className="overflow-hidden whitespace-nowrap text-white/65">· {extra}</span>
            </span>
          )}
        </span>
        {onOpen && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onOpen() }} aria-label={`${label}: ${alt}`}
            className="hit44 group/open absolute right-3 top-3">
            <span aria-hidden className="arrow-c !rounded-[10px] !bg-[rgba(18,12,40,.45)] backdrop-blur-md group-hover/open:!bg-white group-hover/open:!text-night"><ArrowUpRight size={16} strokeWidth={1.75} /></span>
          </button>
        )}
      </div>
    </motion.li>
  )
}

export function Proof({ pick }: { pick: { i: number; n: number } | null }) {
  const { t, lang } = useLang()
  const c = COPY[lang]
  const reduced = useReducedMotion()
  const [modal, setModal] = useState<DemoExample | null>(null)
  const [hl, setHl] = useState<number | null>(null)
  const row = useDragScroll()
  const scrollBy = (dir: number) => {
    const el = row.current
    if (!el) return
    const card = el.children[0] as HTMLElement
    el.scrollBy({ left: dir * (card.offsetWidth + 25), behavior: reduced ? 'auto' : 'smooth' })
  }
  // idea bar → this section with that example
  useEffect(() => {
    if (!pick) return
    const el = row.current
    const card = el?.children[pick.i] as HTMLElement | undefined
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.children[0] as HTMLElement).offsetLeft, behavior: reduced ? 'auto' : 'smooth' })
    setHl(pick.i)
    const id = setTimeout(() => setHl(null), 2400)
    return () => clearTimeout(id)
  }, [pick, row, reduced])

  return (
    <section id="proof" className="sec relative z-[2]">
      <div className="wrap">
        <Head tag={t.proof.tag} title={t.proof.title} lead={t.proof.lead}
          right={<>
            <Btn href="#reel" variant="glass" arrow>{t.reel.tag}</Btn>
            <span className="hidden gap-2 lg:flex">
              <button type="button" className="circle-btn" aria-label={c.prev} onClick={() => scrollBy(-1)}><ArrowLeft size={18} strokeWidth={1.75} aria-hidden /></button>
              <button type="button" className="circle-btn" aria-label={c.next} onClick={() => scrollBy(1)}><ArrowRight size={18} strokeWidth={1.75} aria-hidden /></button>
            </span>
          </>} />
      </div>
      <div className="wrap max-md:!w-full">
        <motion.ul ref={row as never} aria-label={t.proof.tablistLabel}
          className="snap-x m-0 mt-8 list-none gap-4 p-0 md:mt-10 md:gap-[25px] lg:mt-[34px] max-md:scroll-px-4 max-md:px-4 select-none"
          initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={cardList}>
          {t.proof.examples.map((ex, i) => (
            <MediaCard key={ex.video} img={ex.poster} alt={ex.alt} video={ex.video} label={ex.label} extra={ex.meta[1]}
              onOpen={() => setModal(ex)} highlight={hl === i} pos={ex.shape === 'v' ? '50% 28%' : undefined}
              className="h-[220px] w-[300px] md:h-[240px] md:w-[calc((100%-25px)/2)] lg:h-[284px] lg:w-[calc((100%-50px)/3)]" />
          ))}
        </motion.ul>
      </div>
      <p className="wrap mb-0 mt-5 text-[13px] text-text-3">{t.proof.note}</p>
      <ExampleModal ex={modal} onClose={() => setModal(null)} />
    </section>
  )
}

export function Looks() {
  const { t } = useLang()
  const reduced = useReducedMotion()
  return (
    <section id="looks" className="sec relative z-[2]">
      <div className="wrap"><Head tag={t.looks.tag} title={t.looks.title} lead={t.looks.lead} /></div>
      <div className="wrap max-md:!w-full">
        <motion.ul className="snap-x m-0 mt-8 list-none gap-4 p-0 md:mt-10 md:grid md:grid-cols-2 md:gap-[25px] lg:mt-[34px] lg:grid-cols-3 max-md:scroll-px-4 max-md:px-4"
          initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={cardList}>
          {t.looks.styles.map((s) => (
            <MediaCard key={s.image.src} img={s.image.src} alt={s.image.alt} label={s.name} className="h-[220px] w-[300px] md:h-[240px] md:w-auto lg:h-[284px]" />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
