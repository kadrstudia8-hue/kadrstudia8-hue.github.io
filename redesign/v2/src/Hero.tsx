import { Monitor } from 'lucide-react'
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { SiteContent } from '@kadr/shared/content/index'
import { InflatedTitle } from './InflatedTitle'
import { FINE, GEN, GenImg, RichText, derive, onPointer, useMediaQuery, useOsLabel, usePrefersReducedMotion } from './lib'
import { AppleIcon, ChromeStar, Heart, LimeButton, PlayButton, Sparkles, WinIcon } from './ui'
import { ReelDisc } from './three/ReelDisc'
import { HeroBadges } from './Sales'

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
function HeroObject({ t, d, compact }: { t: SiteContent; d: ReturnType<typeof derive>; compact: boolean }) {
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

          {/* 3D iridescent reel over the painted one (desktop) */}
          {!compact && <ReelDisc className="absolute left-[0.6%] top-[63.3%] aspect-square w-[31%]" />}

          {/* sticker on the device */}
          <m.div {...slap(0, 3, reduced)} className="sticker absolute left-[29.6%] top-[60.9%] h-[11.3%] w-[13.4%] !p-[.6cqw]" style={{ fontSize: 'clamp(11px, 2.35cqw, 20px)' }}>
            <span>{d.noKeys}</span>
            <span className="absolute left-1/2 top-[-6%] h-[9%] w-[34%] -translate-x-1/2 rotate-[-4deg] bg-white/70 shadow-sm" />
          </m.div>
          {/* LCD plate */}
          <div className="lcd absolute left-[49.8%] top-[63.2%] h-[4.5%] w-[18.6%]" style={{ fontSize: 'clamp(9px, 2.1cqw, 18px)' }} aria-hidden>
            <span className={reduced ? 'pl-[6%]' : 'lcd-run'}>
              {(reduced ? [0] : [0, 1]).map(k => <span key={k} className="pr-[2.2em] pl-[.6em]">KADR studio<span className="blink">_</span></span>)}
            </span>
          </div>
          {/* version label */}
          {d.version && (
            <m.span {...slap(1, -4, reduced)} className="hand absolute left-[69%] top-[68.6%] text-ink" style={{ fontSize: 'clamp(13px, 2.4cqw, 22px)' }}>
              {d.version}
            </m.span>
          )}
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
  const d = derive(t)
  const reduced = usePrefersReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)', true)
  const phone = useMediaQuery('(max-width: 767px)')
  const main = t.hero.ctas[0]
  const label = useOsLabel(main, t)
  const [copied, setCopied] = useState(false)
  const playLines = d.reelLabel.includes(', ') ? [d.reelLabel.split(', ')[0] + ',', d.reelLabel.split(', ').slice(1).join(', ')] : [d.reelLabel]
  const ref = useRef<HTMLElement>(null)

  const share = async () => {
    const url = location.href.split('#')[0]
    try {
      if (navigator.share) { await navigator.share({ url, title: t.meta.title }); return }
      await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2400)
    } catch { /* cancelled */ }
  }

  const lines = [
    { text: d.h1.pink, kind: 'pink' as const },
    { text: d.h1.chrome, kind: 'chrome' as const },
    { text: d.h1.lime, kind: 'lime' as const, wrap: true },
  ].filter(l => l.text)

  return (
    <section ref={ref} id="top" className="relative z-[1]" aria-labelledby="hero-h1">
      <div className="wrap relative lg:min-h-[880px]">
        {/* object */}
        <div className="pointer-events-none absolute z-0 hidden lg:block lg:left-[50%] lg:top-[40px] lg:h-[700px] lg:w-[560px] xl:left-[43.2%] xl:top-[26px] xl:h-[1025px] xl:w-[820px]">
          {desktop && <div className="pointer-events-auto h-full w-full"><HeroObject t={t} d={d} compact={false} /></div>}
        </div>

        {/* copy */}
        <div className="relative z-[2] pt-[92px] md:pt-[112px] lg:w-[470px] lg:pt-[136px] xl:w-[600px]">
          <InflatedTitle lines={lines} max={desktop ? 96 : phone ? 60 : 88} min={phone ? 40 : 56} maxLines={desktop ? 4 : 5} className="lg:max-w-[470px] xl:max-w-[600px]" />
          <span id="hero-h1" className="sr-only">{t.hero.title.map(p => p.text).join(' ')}</span>
          <m.p className="mt-6 max-w-[540px] text-[18px] font-semibold leading-[1.45] text-[#14143A] md:mt-7 md:text-[21px]"
            initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.5 }}>
            {t.hero.lead}
          </m.p>
          {phone && (
            <p className="mt-4 rounded-[14px] bg-white/55 p-3 text-[16px] leading-snug text-ink-2" aria-live="polite">
              <RichText r={t.hero.mobileHint} onShare={share} shareLabel={copied ? t.ui.linkCopied : undefined} />
            </p>
          )}
          <m.div className="mt-7 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-7 md:mt-8"
            initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.6 }}>
            <LimeButton href={main.href} className="max-sm:w-full">{label}</LimeButton>
            <PlayButton lines={playLines} label={t.hero.ctas[1].label.replace(/^▶\s*/, '')} onClick={onReel} />
          </m.div>
          <m.div className="relative mt-7 flex items-center gap-3 md:mt-8 xl:pb-[64px]"
            initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.4 }}>
            <span className={`flex -space-x-2.5 ${t.hero.badges?.length ? 'hidden' : ''}`} aria-hidden>
              {[{ bg: '#7A4DFF', c: '#fff', i: <WinIcon size={15} /> }, { bg: '#FF4FD8', c: '#fff', i: <AppleIcon size={16} /> }, { bg: '#C8F31D', c: '#0B0B12', i: <Monitor size={16} strokeWidth={2.4} /> }].map((o, k) => (
                <span key={k} className="grid size-9 place-items-center rounded-full border-2 border-white shadow-[0_4px_10px_-4px_rgba(60,40,160,.5)]" style={{ background: o.bg, color: o.c }}>{o.i}</span>
              ))}
            </span>
            {t.hero.badges?.length ? <HeroBadges items={t.hero.badges} /> : <span className="max-w-[230px] text-[13px] font-semibold leading-[1.3] text-ink-2">{d.downloadNow}</span>}
            {/* note: «без рекламы и телеметрии» */}
            <m.span {...slap(2, -12, reduced)} className="hand absolute left-[300px] top-[54px] z-[5] hidden w-[260px] text-[22px] uppercase leading-[.9] text-ink xl:block">
              {d.noAds}
            </m.span>
          </m.div>
        </div>

        {/* notes on the sky (desktop) */}
        <m.span {...slap(3, -8, reduced)} className="hand pointer-events-none absolute left-[34.5%] top-[92px] z-[3] hidden w-[170px] xl:block text-center text-[30px] uppercase text-white"
          style={{ textShadow: '0 2px 10px rgba(30,60,180,.35)' }}>
          {d.oneSentence}
          <svg viewBox="0 0 80 20" className="mx-auto mt-1 w-16" aria-hidden><path d="M4 12c14-8 30 6 44-2s20-6 28-2" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
        </m.span>

        {/* object under the text on tablets / phones */}
        {!desktop && (
          <>
            <div className="relative z-[1] mx-auto mt-6 h-[340px] w-full md:mt-4 md:h-[480px]">
              <HeroObject t={t} d={d} compact />
            </div>
            <div className="relative z-[5] mb-4 mt-2 flex items-start justify-center gap-6 md:gap-16">
              <m.span {...slap(2, -6, reduced)} className="hand block max-w-[150px] text-center text-[24px] uppercase leading-[.92] text-ink md:max-w-none md:text-[28px]">
                {d.noAds}
              </m.span>
              <m.span {...slap(3, 5, reduced)} className="hand block max-w-[150px] text-center text-[24px] uppercase leading-[.92] text-violet-deep md:max-w-none md:text-[28px]">
                {d.oneSentence}
              </m.span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
