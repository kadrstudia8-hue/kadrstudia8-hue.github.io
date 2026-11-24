import { Play } from 'lucide-react'
import { m as motion } from 'motion/react'
import { useReducedMotion } from '../lib/motion'
import { useRef, useState } from 'react'
import type { Video } from '@kadr/shared/content/index.ts'
import { useLang } from '@kadr/shared/i18n'
import { COPY } from '../copy'
import { Btn } from '../lib/Btn'
import { useCtaLabel } from '../lib/os'
import { glareMove } from '../lib/useCursorVars'
import { cardItem, cardList, H2, Head, More, Rise } from '../lib/ui'

/** Inline player: poster + big play circle; plays with sound and native controls on click (one at a time). */
function Player({ video, className = '' }: { video: Video; className?: string }) {
  const { lang } = useLang()
  const ref = useRef<HTMLVideoElement>(null)
  const [on, setOn] = useState(false)
  const start = () => {
    const v = ref.current
    if (!v) return
    document.querySelectorAll('video').forEach((o) => { if (o !== v && !o.muted) o.pause() })
    setOn(true)
    v.src = video.src
    v.muted = false
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}) })
  }
  return (
    <div className={`media-card relative aspect-video w-full !rounded-[20px] ${className}`}>
      <video ref={ref} poster={video.poster} width={video.width} height={video.height} controls={on} playsInline preload="none" aria-label={video.label} aria-hidden={!on || undefined}
        className="absolute inset-0 h-full w-full object-cover" />
      {!on && (
        <button type="button" onClick={start} aria-label={`${COPY[lang].play}: ${video.label}`} className="play-link group absolute inset-0 grid place-items-center">
          <span aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(14,10,31,.05), rgba(14,10,31,.45))' }} />
          <span className="play-c relative !size-[72px] md:!size-[88px]"><Play size={26} fill="currentColor" strokeWidth={0} className="ml-1" aria-hidden /></span>
        </button>
      )}
    </div>
  )
}

export function Reel() {
  const { t } = useLang()
  const label = useCtaLabel(t)
  const r = t.reel
  return (
    <section id="reel" className="sec relative z-[2]">
      <div className="wrap">
        <Head tag={r.tag} title={r.title} lead={r.lead} />
        <Rise className="glass rim mt-8 !rounded-[28px] p-2 md:mt-10 md:p-3 lg:mt-[34px]">
          <span className="rivet" aria-hidden />
          <Player video={r.video} />
        </Rise>
        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="m-0 text-[13px] leading-[1.5] text-text-3">{r.captions[0]} <span className="whitespace-nowrap">· {r.captions[1]}</span></p>
          <div className="flex flex-wrap gap-3">
            {r.ctas.map((cta) => cta.variant === 'main'
              ? <Btn key={cta.href} href={cta.href} arrow magnetic>{label(cta)}</Btn>
              : <Btn key={cta.href} href={cta.href} variant="glass" className="!h-[52px]">{cta.label}</Btn>)}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Tutorial() {
  const { t } = useLang()
  const tu = t.tutorial
  return (
    <section id="tutorial" className="sec relative z-[2]">
      <div className="wrap">
        <Rise className="glass rim grid gap-6 !rounded-[28px] p-5 md:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-12 lg:p-10">
          <span className="rivet" aria-hidden />
          <div>
            <p className="eyebrow m-0 mb-3.5">{tu.tag}</p>
            <H2 title={tu.title} />
            <p className="lead m-0 mt-4">{tu.lead}</p>
            <p className="m-0 mt-5 text-[13px] leading-[1.5] text-text-3">{tu.captions[0]} · {tu.captions[1]}</p>
          </div>
          <Player video={tu.video} />
        </Rise>
      </div>
    </section>
  )
}

export function How() {
  const { t } = useLang()
  const h = t.how
  const reduced = useReducedMotion()
  return (
    <section id="how" className="sec relative z-[2]">
      <div className="wrap">
        <Head tag={h.tag} title={h.title} lead={h.lead} />
        <motion.ol className="m-0 mt-8 grid list-none gap-4 p-0 md:mt-10 md:grid-cols-3 md:gap-6 lg:mt-[34px]"
          initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: .25 }} variants={cardList}>
          {h.steps.map((s) => (
            <motion.li key={s.n} variants={cardItem} onPointerMove={glareMove} className="glass rim glare lift relative flex flex-col p-6 md:p-7">
              <span className="rivet" aria-hidden />
              <span className="flex items-center gap-3">
                <span className="text-[44px] font-semibold leading-none tracking-[-.03em] text-white md:text-[52px]">{s.n.padStart(2, '0')}</span>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-white/40 to-transparent" />
              </span>
              <h3 className="m-0 mt-6 text-[18px] font-semibold leading-[1.25] text-white">{s.title}</h3>
              <p className="m-0 mt-2 text-[14px] leading-[1.6] text-text-2">{s.text}</p>
              <More text={s.details} />
            </motion.li>
          ))}
        </motion.ol>
        <Rise className="glass rim mt-6 !rounded-[28px] p-2 md:p-3">
          <figure className="m-0">
            <img src={h.screenshot.src} alt={h.screenshot.alt} width={h.screenshot.width} height={h.screenshot.height} loading="lazy" decoding="async"
              className="h-auto w-full rounded-[20px] border border-white/15" />
            <figcaption className="px-2 pb-1 pt-3 text-[13px] leading-[1.5] text-text-2 md:px-3">{h.caption}</figcaption>
          </figure>
        </Rise>
        <p className="m-0 mt-5 max-w-[880px] text-[13px] leading-[1.6] text-text-3">{h.note}</p>
      </div>
    </section>
  )
}
