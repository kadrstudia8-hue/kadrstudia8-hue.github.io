import { m, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Share2 } from 'lucide-react'
import type { SiteContent } from '@kadr/shared/content/index'
import { InflatedTitle } from './InflatedTitle'
import { FINE, GEN, GenImg, onPointer, playExclusive, useMediaQuery, usePrefersReducedMotion } from './lib'
import { ChromeStar, Heart, LimeAction, LimeButton, PlayButton, Sparkles } from './ui'
import { ReelDisc } from './three/ReelDisc'
import { HeroBadges } from './Sales'
import { useShare } from './actions'

const slap = (i: number, rot: number, reduced: boolean) => ({
  initial: reduced ? false as const : { scale: 1.4, rotate: rot + 8, opacity: 0 },
  animate: { scale: 1, rotate: rot, opacity: 1 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 20, delay: 0.75 + i * 0.09, opacity: { duration: 0.12, delay: 0.75 + i * 0.09 } },
})

/** Fallback drawing if gen/v2-hero-camera.webp is missing: lilac monitor-camera with a lime play. */
function CameraFallback() {
  return (
    <svg viewBox="0 0 1024 1280" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="cf-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D9CCFF" /><stop offset="1" stopColor="#A68BFF" /></linearGradient>
        <radialGradient id="cf-s" cx=".4" cy=".3" r=".9"><stop offset="0" stopColor="#3B3550" /><stop offset="1" stopColor="#16131F" /></radialGradient>
      </defs>
      <rect x="230" y="240" width="580" height="860" rx="90" fill="url(#cf-b)" />
      <rect x="300" y="310" width="440" height="400" rx="50" fill="url(#cf-s)" />
      <path d="M470 420v180l150-90z" fill="#C8F31D" />
      <rect x="400" y="630" width="240" height="10" fill="#C8F31D" />
      <path d="M230 330c60-70 520-70 580 0v60c-30 40-40 120-60 120s-20-90-50-90-30 160-60 160-30-130-60-130-40 60-70 60-40-90-80-90-60 200-90 200-30-170-60-170-50 80-50 80z" fill="#FF4FD8" />
      <path d="M140 1130c120-60 640-60 760 0 30 30-40 60-380 60s-410-30-380-60z" fill="#FF4FD8" opacity=".9" />
    </svg>
  )
}

/** Hero object: generated camera + code overlays (sticker, LCD, version), satellites, 3D reel. */
/** LCD: types the real prompts of the examples one after another (tail stays visible). */
function LcdTyper({ prompts, reduced }: { prompts: string[]; reduced: boolean }) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const text = prompts[i % prompts.length] ?? 'KADR studio'
  useEffect(() => {
    if (reduced) return
    const t = n < text.length ? setTimeout(() => setN(n + 1), 55) : setTimeout(() => { setN(0); setI(i + 1) }, 1800)
    return () => clearTimeout(t)
  }, [n, text, i, reduced])
  const shown = reduced ? 'KADR studio' : text.slice(0, n)
  return (
    <span className="flex w-full justify-end overflow-hidden px-[.5em]">
      <span className="whitespace-nowrap">{shown}<span className="blink">_</span></span>
    </span>
  )
}

/** The real hero video, masked into the camera screen (the pink drips stay on top). */
function ScreenVideo({ src, poster, label, reduced }: { src: string; poster: string; label: string; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v || reduced) return
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number }
    const start = () => { v.src = src; v.muted = true; playExclusive(v) }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!v.src) (w.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 300)))(start); else v.play().catch(() => {}) }
      else v.pause()
    }, { threshold: 0.2 })
    io.observe(v)
    return () => io.disconnect()
  }, [src, reduced])
  return (
    <video ref={ref} poster={poster} muted loop playsInline preload="none" aria-label={label}
      className="absolute left-[32.8%] top-[25.2%] h-[30.5%] w-[37.8%] object-cover"
      style={{ WebkitMaskImage: 'url(gen/v2-hero-screen-mask.png)', maskImage: 'url(gen/v2-hero-screen-mask.png)', WebkitMaskSize: '100% 100%', maskSize: '100% 100%' }} />
  )
}

function HeroObject({ t, sticker, compact }: { t: SiteContent; sticker: string; compact: boolean }) {
  const reduced = usePrefersReducedMotion()
  const fine = useMediaQuery(FINE)
  const live = fine && !reduced && !compact
  const { scrollY } = useScroll()
  const sy = useTransform(scrollY, [0, 600], [0, live ? -60 : 0], { clamp: true })
  const sr = useTransform(scrollY, [0, 600], [0, live ? -3 : 0], { clamp: true })
  const px = useMotionValue(0), py = useMotionValue(0)
  const tx = useSpring(useTransform(py, v => v * -7), { stiffness: 60, damping: 14 })
  const ty = useSpring(useTransform(px, v => v * 7), { stiffness: 60, damping: 14 })
  const p1x = useSpring(useTransform(px, v => v * 8), { stiffness: 60, damping: 14 })
  const p1y = useSpring(useTransform(py, v => v * 8), { stiffness: 60, damping: 14 })
  const p3x = useSpring(useTransform(px, v => v * 24), { stiffness: 60, damping: 14 })
  const p3y = useSpring(useTransform(py, v => v * 24), { stiffness: 60, damping: 14 })
  const p2x = useSpring(useTransform(px, v => v * -16), { stiffness: 60, damping: 14 })
  const p2y = useSpring(useTransform(py, v => v * -16), { stiffness: 60, damping: 14 })
  useEffect(() => (live ? onPointer((x, y) => { px.set(x); py.set(y) }) : undefined), [live, px, py])

  return (
    <m.div style={{ y: sy, rotate: sr }} className="relative h-full w-full" aria-hidden>
      <m.div style={{ rotateX: tx, rotateY: ty, transformPerspective: 1400 }} className="relative h-full w-full">
        <div className={`relative mx-auto aspect-[4/5] h-full max-w-full ${reduced ? '' : 'bob'}`} style={{ containerType: 'inline-size' }}>
          {/* living slime puddle under the camera (gooey SVG, separate layer) */}
          <svg className="breathe absolute left-[2%] top-[79%] h-[17%] w-[96%] overflow-visible" viewBox="0 0 400 70" aria-hidden>
            <defs>
              <filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" /><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" /></filter>
              <linearGradient id="slime" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF9BEA" /><stop offset=".5" stopColor="#FF4FD8" /><stop offset="1" stopColor="#E01FB8" /></linearGradient>
            </defs>
            <g filter="url(#goo)" fill="url(#slime)">
              <ellipse cx="90" cy="40" rx="70" ry="14" />
              <ellipse cx="300" cy="44" rx="90" ry="13" />
              {!reduced && <>
                <circle r="10" cy="52"><animate attributeName="cx" values="150;190;150" dur="5s" repeatCount="indefinite" /></circle>
                <circle r="8" cy="56"><animate attributeName="cx" values="230;260;230" dur="6.5s" repeatCount="indefinite" /><animate attributeName="cy" values="54;60;54" dur="4s" repeatCount="indefinite" /></circle>
                <circle r="7" cx="380" cy="50"><animate attributeName="cy" values="46;62;46" dur="3.6s" repeatCount="indefinite" /></circle>
              </>}
            </g>
          </svg>
          <GenImg src={GEN.camera} eager className="relative h-full w-full select-none object-contain drop-shadow-[0_30px_40px_rgba(75,43,214,.28)]" width={1024} height={1280} fallback={<CameraFallback />} />

          <ScreenVideo src={t.hero.video.src} poster={t.hero.video.poster} label={t.hero.video.label} reduced={reduced} />
          <span className="pointer-events-none absolute left-[32.8%] top-[25.2%] h-[30.5%] w-[37.8%] rounded-[12%] shadow-[inset_0_0_30px_rgba(11,11,18,.55)]" style={{ WebkitMaskImage: 'url(gen/v2-hero-screen-mask.png)', maskImage: 'url(gen/v2-hero-screen-mask.png)', WebkitMaskSize: '100% 100%', maskSize: '100% 100%', background: 'radial-gradient(120% 80% at 30% 10%, rgba(255,255,255,.14), transparent 50%)' }} />

          {/* 3D iridescent reel over the painted one (desktop) */}
          {!compact && <ReelDisc className="absolute left-[0.6%] top-[63.3%] aspect-square w-[31%]" />}

          {/* sticker on the device */}
          <m.div {...slap(0, 3, reduced)} className="sticker absolute left-[29.6%] top-[60.9%] h-[11.3%] w-[13.4%] !p-[.6cqw]" style={{ fontSize: 'clamp(11px, 2.35cqw, 20px)' }}>
            <span>{sticker}</span>
            <span className="absolute left-1/2 top-[-6%] h-[9%] w-[34%] -translate-x-1/2 rotate-[-4deg] bg-white/70 shadow-sm" />
          </m.div>
          {/* LCD plate: prompts being typed */}
          <div className="lcd absolute left-[49.8%] top-[63.2%] h-[4.5%] w-[18.6%]" style={{ fontSize: 'clamp(8px, 1.7cqw, 15px)' }} aria-hidden>
            <LcdTyper prompts={t.proof.examples.map(e => e.prompt)} reduced={reduced} />
          </div>
          {/* satellites (code) */}
          {!compact && <>
            <m.div style={{ x: p3x, y: p3y }} className="absolute left-[-6%] top-[30%]"><div className={reduced ? '' : 'bob'} style={{ animationDuration: '7s' }}><ChromeStar size={58} /></div></m.div>
            <m.div style={{ x: p2x, y: p2y }} className="absolute right-[2%] top-[12%]"><Heart size={34} /></m.div>
            <m.div style={{ x: p1x, y: p1y }} className="absolute left-[46%] top-[2%] rotate-[-14deg]"><Heart size={24} /></m.div>
          </>}
          <Sparkles items={[
            { x: '8%', y: '8%', s: 22, d: 0 }, { x: '92%', y: '30%', s: 16, d: 0.6 }, { x: '3%', y: '52%', s: 14, d: 1.1 },
            { x: '60%', y: '-2%', s: 18, d: 0.3 }, { x: '97%', y: '62%', s: 20, d: 1.4 }, { x: '40%', y: '96%', s: 14, d: 0.9 },
            { x: '75%', y: '8%', s: 12, d: 1.7 }, { x: '20%', y: '22%', s: 12, d: 0.4 }, { x: '86%', y: '88%', s: 16, d: 1.2 },
          ]} />
        </div>
      </m.div>
    </m.div>
  )
}


export function Hero({ t, onReel }: { t: SiteContent; onReel: () => void }) {
  const p = t.page!.hero
  const reduced = usePrefersReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)', true)
  const phone = useMediaQuery('(max-width: 767px)')
  const { share, label: shareLabel } = useShare(t, p.mobile.cta.label)
  const sec = p.secondary.label
  const playLines = sec.includes(', ') ? [sec.split(', ')[0] + ',', sec.split(', ').slice(1).join(', ')] : [sec]
  const [first, ...rest] = p.title[0].text.split(' ')
  const lines = [
    { text: first, kind: 'pink' as const },
    { text: rest.join(' '), kind: 'chrome' as const },
    { text: p.title[1]?.text ?? '', kind: 'lime' as const, wrap: true },
  ].filter(l => l.text)
  const topNote = t.page!.final.title

  return (
    <section id="top" className="relative z-[1]" aria-labelledby="hero-h1">
      <div className="wrap relative lg:min-h-[860px]">
        <div className="pointer-events-none absolute z-0 hidden lg:block lg:left-[50%] lg:top-[40px] lg:h-[700px] lg:w-[560px] xl:left-[43.2%] xl:top-[26px] xl:h-[1025px] xl:w-[820px]">
          {desktop && <div className="pointer-events-auto h-full w-full"><HeroObject t={t} sticker={p.sticker} compact={false} /></div>}
        </div>

        <div className="relative z-[2] pt-[88px] md:pt-[112px] lg:w-[470px] lg:pt-[136px] xl:w-[600px]">
          <InflatedTitle lines={lines} max={desktop ? 96 : phone ? 58 : 88} min={phone ? 40 : 56} maxLines={desktop ? 4 : 5} className="lg:max-w-[470px] xl:max-w-[600px]" />
          <span id="hero-h1" className="sr-only">{p.title.map(x => x.text).join(' ')}</span>
          <m.p className="mt-5 max-w-[520px] text-[18px] font-semibold leading-[1.45] text-[#14143A] md:mt-7 md:text-[21px]"
            initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.5 }}>
            {p.subtitle}
          </m.p>
          <m.div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-7 md:mt-8"
            initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.6 }}>
            {phone
              ? <LimeAction arrow={false} className="w-full" onClick={share}><Share2 size={18} strokeWidth={2.4} aria-hidden />{shareLabel}</LimeAction>
              : <LimeButton href={p.cta.href}>{p.cta.label}</LimeButton>}
            {phone
              ? <p className="m-0 text-center text-[14px] leading-snug text-ink-2">{p.mobile.caption}</p>
              : <PlayButton lines={playLines} label={sec} onClick={onReel} />}
          </m.div>
          <m.div className="relative mt-6 md:mt-7 xl:pb-[56px]"
            initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.4 }}>
            <HeroBadges items={p.chips} />
            {phone && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <PlayButton lines={playLines} label={sec} onClick={onReel} />
                <a href={p.cta.href} className="text-link text-[15px] font-semibold">{p.cta.label}</a>
              </div>
            )}
            <m.span {...slap(2, -10, reduced)} className="hand absolute left-[330px] top-[46px] z-[5] hidden w-[230px] text-[24px] uppercase leading-[.9] text-ink xl:block">
              {p.note}
            </m.span>
          </m.div>
        </div>

        <m.span {...slap(3, -8, reduced)} className="hand pointer-events-none absolute left-[34.5%] top-[92px] z-[3] hidden w-[170px] text-center text-[30px] uppercase text-white xl:block"
          style={{ textShadow: '0 2px 10px rgba(30,60,180,.35)' }}>
          {topNote}
          <svg viewBox="0 0 80 20" className="mx-auto mt-1 w-16" aria-hidden><path d="M4 12c14-8 30 6 44-2s20-6 28-2" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
        </m.span>

        {!desktop && (
          <>
            <div className="relative z-[1] mx-auto mt-5 h-[300px] w-full md:mt-4 md:h-[460px]">
              <HeroObject t={t} sticker={p.sticker} compact />
            </div>
            <div className="relative z-[5] mt-1 flex justify-center">
              <m.span {...slap(2, -6, reduced)} className="hand block text-center text-[24px] uppercase leading-[.92] text-ink md:text-[28px]">{p.note}</m.span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
