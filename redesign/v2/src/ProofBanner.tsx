import { Car, Coffee, Lightbulb, Waves } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import type { SiteContent } from '@kadr/shared/content/index'
import { GEN, GenImg, playExclusive, useAutoVideo, usePrefersReducedMotion } from './lib'
import { BlackButton, PixelTitle, Sparkle, Tag } from './ui'

const ICONS = [Car, Lightbulb, Coffee, Waves]

function CassetteFallback() {
  return (
    <div className="absolute inset-[14%_8%_16%_12%] rotate-[-7deg] rounded-[26px] border-[3px] border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,.55),rgba(185,166,255,.55))] shadow-[0_20px_40px_-20px_rgba(75,43,214,.6)]">
      <div className="absolute inset-x-[8%] top-[10%] h-[22%] rounded-[8px] bg-white/90" />
    </div>
  )
}

/** Spool hub (CSS) laid over the painted spools; spins while the example video plays. */
function Spool({ x, y, on }: { x: string; y: string; on: boolean }) {
  return (
    <span className={`spool absolute aspect-square w-[11.4%] -translate-x-1/2 -translate-y-1/2 rounded-full ${on ? 'on' : ''}`}
      style={{ left: x, top: y, translate: '-50% -50%', background: 'radial-gradient(circle, #0B0B12 0 26%, transparent 27%), conic-gradient(from 0deg, #8F6BFF 0 10%, #B9A6FF 10% 20%, #8F6BFF 20% 30%, #B9A6FF 30% 40%, #8F6BFF 40% 50%, #B9A6FF 50% 60%, #8F6BFF 60% 70%, #B9A6FF 70% 80%, #8F6BFF 80% 90%, #B9A6FF 90% 100%)', WebkitMaskImage: 'radial-gradient(circle, #000 0 64%, transparent 65%)', maskImage: 'radial-gradient(circle, #000 0 64%, transparent 65%)', opacity: 0.92 }} aria-hidden />
  )
}

export function ProofBanner({ t }: { t: SiteContent }) {
  const p = t.proof
  const [i, setI] = useState(0)
  const ex = p.examples[i] ?? p.examples[0]
  const reduced = usePrefersReducedMotion()
  const [vref, playing] = useAutoVideo(true, 0.5)
  useEffect(() => {
    const v = vref.current
    if (!v) return
    v.load()
    const r = v.getBoundingClientRect()
    if (!reduced && r.bottom > 0 && r.top < innerHeight) playExclusive(v)
  }, [ex.video, vref, reduced])
  const vertical = ex.shape === 'v'

  const toolbar = (
    <div role="tablist" aria-label={p.tablistLabel}
      className="relative flex gap-2 rounded-[12px] bg-white p-1.5 shadow-[0_8px_24px_-8px_rgba(40,20,120,.35)] max-lg:w-fit lg:w-[44px] lg:flex-col lg:gap-[14px] lg:py-[14px]">
      {p.examples.map((e, k) => {
        const I = ICONS[k % ICONS.length]
        const active = k === i
        return (
          <button key={e.label} type="button" role="tab" aria-selected={active} aria-label={e.label} title={e.label} onClick={() => setI(k)}
            className={`relative grid size-11 place-items-center rounded-[8px] transition-colors lg:size-8 focus-visible:outline-3 focus-visible:outline-lime ${active ? 'text-lime' : 'text-ink hover:bg-[#EEF0FB]'}`}>
            {active && <m.span layoutId="tb-ind" className="absolute inset-0 rounded-[8px] bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <I size={17} strokeWidth={2.3} className="relative" aria-hidden />
          </button>
        )
      })}
    </div>
  )

  return (
    <section id="proof" className="wrap relative z-[3] mt-[30px] lg:mt-11" aria-labelledby="proof-h">
      <div className="banner-lime px-5 py-6 md:p-8 lg:min-h-[380px] lg:p-10">
        <div className="relative z-[2] lg:w-[46%]">
          <Tag>{p.tag}</Tag>
          <PixelTitle id="proof-h" text={p.title} className="mt-4" />
          <p className="mt-4 max-w-[480px] text-[16px] font-medium leading-[1.45] text-ink md:text-[17px]">{p.lead}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <BlackButton href="#reel">{t.reel.tag}</BlackButton>
            <span className="max-w-[300px] text-[13px] font-medium leading-snug text-ink/70">{p.note}</span>
          </div>
        </div>

        {/* right: cassette + player + prompt + toolbar */}
        <div className="relative mt-8 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[56%]">
          <div className="pointer-events-none absolute right-[-4%] top-[-14%] hidden aspect-[4/3] w-[78%] lg:block" aria-hidden>
            <m.div className="relative h-full w-full" initial={reduced ? false : { x: 80, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
              <GenImg src={GEN.cassette} className="h-full w-full object-contain drop-shadow-[0_24px_30px_rgba(75,43,214,.35)]" width={1344} height={1008} fallback={<CassetteFallback />} />
              <Spool x="35.7%" y="51.1%" on={playing} />
              <Spool x="56.7%" y="46.6%" on={playing} />
              <span className="hand absolute left-[45.6%] top-[34%] w-[44%] -translate-x-1/2 -translate-y-1/2 rotate-[-7deg] text-center text-[30px] uppercase text-ink">{ex.label}</span>
            </m.div>
          </div>

          <div className="relative flex flex-col items-start gap-5 lg:absolute lg:inset-0 lg:block">
            {/* player 9:16 / 16:9 + meta line under it */}
            <m.figure layout className={`relative m-0 lg:absolute ${vertical ? 'w-[176px] lg:left-[2%] lg:top-[22px] lg:w-[160px]' : 'w-full max-w-[420px] lg:left-[-2%] lg:top-[64px] lg:w-[340px]'}`}
              style={{ rotate: reduced ? 0 : -3 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
              <div className={`overflow-hidden rounded-[16px] border-[3px] border-white bg-ink shadow-[0_24px_40px_-16px_rgba(40,20,120,.6)] ${vertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
                <video ref={vref} className="h-full w-full object-cover" poster={ex.poster} muted loop playsInline preload="none" aria-label={ex.alt}>
                  <source src={ex.video} type="video/mp4" />
                </video>
              </div>
              <figcaption className="mt-2 flex flex-wrap gap-1">
                {ex.meta.slice(0, 2).map(m => <span key={m} className="rounded-[6px] bg-ink px-1.5 py-0.5 text-[11px] font-bold leading-[1.3] text-white">{m}</span>)}
              </figcaption>
            </m.figure>

            {/* handwritten prompt of the active example */}
            <div className="relative mb-3 mt-4 lg:absolute lg:bottom-[26px] lg:right-[84px] lg:m-0 lg:w-[250px] lg:rounded-[14px] lg:bg-white/60 lg:px-4 lg:py-3 lg:shadow-[0_8px_24px_-12px_rgba(40,20,120,.35),inset_0_1px_0_rgba(255,255,255,.8)] lg:backdrop-blur-[6px]">
              <AnimatePresence mode="wait">
                <m.p key={ex.prompt} className="hand m-0 max-w-[320px] rotate-[-5deg] text-[23px] leading-[1] text-ink lg:rotate-[-2deg] lg:text-[21px]"
                  initial={reduced ? false : { opacity: 0, y: 8, rotate: -7 }} animate={{ opacity: 1, y: 0, rotate: -3 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                  «{ex.prompt}»
                </m.p>
              </AnimatePresence>
              <Sparkle size={22} color="#0B0B12" className="absolute -right-2 -top-5 hidden lg:block" />
            </div>

            <div className="lg:absolute lg:right-[24px] lg:top-1/2 lg:-translate-y-1/2">{toolbar}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
