import { Play } from 'lucide-react'
import { m as motion } from 'motion/react'
import { useReducedMotion } from '../lib/motion'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { use3DGate } from '@kadr/shared/three/gate'
import { saveData } from '@kadr/shared/three/webgl'
import { useMediaQuery } from '@kadr/shared/ui/useMediaQuery'
import { useHasFinePointer } from '@kadr/shared/ui/useIsTouch'
import { COPY } from '../copy'
import { Btn } from '../lib/Btn'
import { genUrl } from '../lib/gen'
import { noPlay, useCtaLabel } from '../lib/os'
import { Rich } from '../lib/Rich'
import { Fireflies } from './World'
import { IdeaBar } from './IdeaBar'

const Cubes = lazy(() => import('../three/Cubes'))
const EASE = [0.22, 1, 0.36, 1] as const
const HERO_LOOP = false

/** Crossfade loop of the generated hero video (fade 1000 ms at the seam). Desktop/tablet only, after load + idle. */
function LoopVideo({ src }: { src: string }) {
  const a = useRef<HTMLVideoElement>(null), b = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const busy = useRef(false)
  const activeRef = useRef(0)
  activeRef.current = active
  useEffect(() => {
    const vids = [a.current!, b.current!]
    let started = false
    const start = () => {
      if (started) return
      started = true
      vids.forEach((v) => { v.src = src; v.load() })
      vids[0].addEventListener('canplay', () => { vids[0].play().then(() => setReady(true)).catch(() => {}) }, { once: true })
    }
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    const kick = () => (w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 800))
    if (document.readyState === 'complete') kick(); else window.addEventListener('load', kick, { once: true })
    const io = new IntersectionObserver(([e]) => { const v = vids[activeRef.current]; if (!started) return; if (e.isIntersecting) v.play().catch(() => {}); else vids.forEach((x) => x.pause()) })
    io.observe(vids[0])
    return () => { io.disconnect(); vids.forEach((v) => { v.pause(); v.removeAttribute('src'); v.load() }) }
  }, [src])
  const onTime = (i: number) => () => {
    const vids = [a.current!, b.current!]
    const v = vids[i]
    if (i !== activeRef.current || busy.current || !v.duration) return
    if (v.duration - v.currentTime < 1.05) {
      busy.current = true
      const o = vids[1 - i]
      o.currentTime = 0
      o.play().catch(() => {})
      setActive(1 - i)
      setTimeout(() => { v.pause(); busy.current = false }, 1100)
    }
  }
  const cls = 'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-linear'
  return (
    <>
      <video ref={a} className={cls} style={{ opacity: ready && active === 0 ? 1 : 0 }} muted playsInline preload="none" onTimeUpdate={onTime(0)} aria-hidden />
      <video ref={b} className={cls} style={{ opacity: ready && active === 1 ? 1 : 0 }} muted playsInline preload="none" onTimeUpdate={onTime(1)} aria-hidden />
    </>
  )
}

function Scene() {
  const box = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px)')
  const fine = useHasFinePointer()
  const poster = genUrl('v3-hero-scene.webp')
  const loop = genUrl('v3-hero-loop.mp4')
  const [video, setVideo] = useState(false)
  // The generated loop (gen/v3-hero-loop.mp4) came out with a different composition than the poster (round arch behind
  // the headline), so it is off until a loop made from the poster exists. Flip HERO_LOOP to re-enable the crossfade.
  useEffect(() => setVideo(HERO_LOOP && !!loop && !mobile && !reduced && !saveData()), [loop, mobile, reduced])
  const gate = use3DGate(box, { minWidth: 1024 })

  // parallax .15 + cursor shift ±10px
  useEffect(() => {
    if (reduced || mobile) return
    let mx = 0, my = 0, cx = 0, cy = 0, raf = 0
    const tick = () => {
      cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08
      const y = Math.min(window.scrollY, 1200) * 0.15
      if (layer.current) layer.current.style.transform = `translate3d(${cx.toFixed(2)}px, ${(y + cy).toFixed(2)}px, 0) scale(1.04)`
      raf = Math.abs(mx - cx) + Math.abs(my - cy) > 0.05 ? requestAnimationFrame(tick) : 0
    }
    const go = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const move = (e: PointerEvent) => { if (!fine) return; mx = (e.clientX / innerWidth - 0.5) * -20; my = (e.clientY / innerHeight - 0.5) * -20; go() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', go, { passive: true })
    go()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); window.removeEventListener('scroll', go) }
  }, [reduced, mobile, fine])

  return (
    <div ref={box} aria-hidden className="scene-mask absolute inset-x-0 bottom-0 h-[min(48svh,380px)] overflow-hidden md:top-0 md:h-auto">
      <div ref={layer} className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.04)' }}>
        {poster ? (
          <img src={poster} alt="" width={1536} height={864} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[72%_60%] md:object-[60%_50%]" />
        ) : <ScenePlaceholder />}
        {video && loop && <LoopVideo src={loop} />}
        {/* bloom + glints on the water (poster) */}
        <div className="bloom absolute inset-0" />
        {!video && <div className="glint absolute inset-x-[30%] bottom-[10%] h-[12%]" style={{ background: 'repeating-linear-gradient(180deg, rgba(255,214,160,.0) 0 6px, rgba(255,214,160,.22) 6px 7px)', WebkitMaskImage: 'radial-gradient(closest-side, #000, transparent)', maskImage: 'radial-gradient(closest-side, #000, transparent)' }} />}
      </div>
      {/* text side shade (desktop): left 45% darker for the headline */}
      <div className="absolute inset-0 hidden md:block" style={{ background: 'radial-gradient(70% 90% at 12% 42%, oklch(14% .05 290 / .42), transparent 70%), linear-gradient(90deg in oklch, oklch(13% .045 288 / .64) 0%, oklch(16% .06 295 / .42) 26%, oklch(22% .07 310 / .16) 44%, transparent 58%)' }} />
      <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(180deg in oklch, oklch(14% .05 290 / .5) 0, oklch(18% .06 300 / .18) 11%, transparent 22%, transparent 66%, oklch(20% .06 320 / .22) 82%, oklch(13% .045 288 / .6) 100%)' }} />
      <Fireflies />
      {gate.show && (
        <Suspense fallback={null}>
          <div className="absolute inset-y-0 right-0 w-[58%]">
            <Cubes active={gate.inView} onFail={gate.fail} poster={poster} />
          </div>
        </Suspense>
      )}
    </div>
  )
}

/** Shown only while gen/v3-hero-scene.webp does not exist yet: a sunset painted in CSS/SVG. */
function ScenePlaceholder() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1b5c" /><stop offset=".45" stopColor="#6b3f98" /><stop offset=".62" stopColor="#d9799a" /><stop offset=".7" stopColor="#ffb56b" /><stop offset="1" stopColor="#2b1d55" /></linearGradient>
        <radialGradient id="sun" cx=".82" cy=".62" r=".35"><stop offset="0" stopColor="#ffe3b0" /><stop offset=".25" stopColor="rgba(255,181,107,.7)" /><stop offset="1" stopColor="rgba(255,181,107,0)" /></radialGradient>
        <linearGradient id="arch" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c8a6ff" /><stop offset=".5" stopColor="#5ed3e6" /><stop offset="1" stopColor="#ffc977" /></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sky)" />
      <rect width="1600" height="900" fill="url(#sun)" />
      <path d="M0 560 L220 470 L420 540 L640 480 L900 560 L1200 500 L1600 560 L1600 900 L0 900Z" fill="#2c1f55" opacity=".8" />
      <rect y="590" width="1600" height="310" fill="#251a4c" opacity=".85" />
      <path d="M1000 640 V300 a170 170 0 0 1 340 0 V640" fill="none" stroke="url(#arch)" strokeWidth="46" opacity=".55" />
      <path d="M1000 640 V300 a170 170 0 0 1 340 0 V640" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="10 16" opacity=".35" />
      <circle cx="1390" cy="610" r="44" fill="rgba(227,208,255,.5)" />
      <ellipse cx="1150" cy="660" rx="260" ry="34" fill="#3b2a6a" />
    </svg>
  )
}

/** Vertical pager 01·02·03 = the three steps of #how; the active dot rides the line every 4 s / on hover. */
function Pager() {
  const { t } = useLang()
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  useEffect(() => {
    if (reduced || hold) return
    const id = setInterval(() => setI((v) => (v + 1) % 3), 4000)
    return () => clearInterval(id)
  }, [reduced, hold])
  return (
    <nav aria-label={t.how.title} className="absolute right-[calc(var(--pad)-14px)] top-[400px] hidden lg:block" onMouseLeave={() => setHold(false)}>
      <ol className="relative m-0 flex list-none flex-col gap-1 p-0">
        <span aria-hidden className="absolute left-[7px] top-[14px] bottom-[14px] w-px bg-white/35" />
        {/* the active dot rides the line (spring 300/30) */}
        <motion.span aria-hidden className="absolute left-0 top-[6.5px] size-[15px] rounded-full border border-white bg-white/20 shadow-[0_0_12px_rgba(255,255,255,.6)]"
          initial={false} animate={{ y: i * 32 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
        {t.how.steps.map((s, k) => (
          <li key={k}>
            <a href="#how" onMouseEnter={() => { setHold(true); setI(k) }} onFocus={() => setI(k)} aria-label={`${s.n}. ${s.title}`}
              className={`relative flex h-7 items-center gap-3 pl-0 text-[12px] font-medium tracking-[.1em] no-underline transition-colors ${i === k ? 'text-white' : 'text-white/55 hover:text-white'}`}>
              <span className="relative grid size-[15px] place-items-center">
                <span className="size-[5px] rounded-full bg-white/50" />
              </span>
              {String(k + 1).padStart(2, '0')}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Hero({ onPick }: { onPick: (i: number) => void }) {
  const { t, lang } = useLang()
  const c = COPY[lang]
  const label = useCtaLabel(t)
  const reduced = useReducedMotion()
  const [white, lilac] = [t.hero.title.filter((p) => !p.accent), t.hero.title.filter((p) => p.accent)]
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const url = location.href.split('#')[0]
    try {
      if (navigator.share) { await navigator.share({ title: t.meta.title, url }); return }
      await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2400)
    } catch { /* cancelled */ }
  }

  let w = 0
  const word = (txt: string, extraDelay: number) =>
    txt.split(' ').filter(Boolean).map((s) => {
      const d = 0.15 + (w++) * 0.06 + extraDelay
      return (
        <motion.span key={`${lang}-${w}`} aria-hidden className="inline-block whitespace-pre"
          initial={reduced ? false : { y: 24, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: d, ease: EASE }}>
          {s}{' '}
        </motion.span>
      )
    })

  return (
    <section id="top" className="relative z-[2]">
      <div className="relative min-h-[max(700px,100svh)] md:min-h-[820px] lg:h-[900px] lg:min-h-0">
        <Scene />
        {/* phone: text sits on a darkening */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-[70%] md:hidden" style={{ background: 'linear-gradient(180deg in oklch, oklch(13% .045 288 / .78) 0%, oklch(16% .055 295 / .55) 34%, oklch(22% .065 315 / .2) 60%, transparent 100%)' }} />
        <div className="wrap relative pb-[calc(min(48svh,380px)-56px)] pt-[92px] md:pb-24 md:pt-[150px] lg:pb-0 lg:pt-[220px]">
          <motion.p className="chip eyebrow m-0 !text-[11px]" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: EASE }}>
            {c.chip.split(' · ').map((p, i) => <span key={p}>{i > 0 && <span className="mx-2 opacity-60">·</span>}{p}</span>)}
          </motion.p>
          <h1 className="h1 m-0 mt-[22px] max-w-[11.5ch] md:max-w-[12ch]">
            {/* words are animated one by one (aria-hidden); assistive tech reads the title once */}
            <span className="sr-only">{t.hero.title.map((p) => p.text).join(' ')}</span>
            {white.map((p) => <span key={p.text} className={p.nowrap ? 'whitespace-nowrap' : ''}>{word(p.text, 0)}</span>)}
            <br className="hidden sm:block" />
            {lilac.map((p) => <span key={p.text} className="lilac">{word(/[.!?…]$/.test(p.text) ? p.text : p.text + '.', 0.15)}</span>)}
          </h1>
          <motion.p className="lead lead-lg m-0 mt-5 max-w-[500px] !text-white/80" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .55, ease: EASE }}>
            {t.hero.lead}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .7, ease: EASE }}>
            <Btn href={t.hero.ctas[0].href} arrow magnetic>{label(t.hero.ctas[0])}</Btn>
            <a href={t.hero.ctas[1].href} className="play-link group inline-flex min-h-12 items-center gap-3 text-[14px] text-white/90 no-underline">
              <span className="play-c"><Play size={16} fill="currentColor" strokeWidth={0} className="ml-0.5" aria-hidden /></span>
              <span>{noPlay(t.hero.ctas[1].label)}</span>
            </a>
          </motion.div>
          <p className="m-0 mt-5 max-w-[360px] text-[16px] leading-[1.5] text-white/75 md:hidden rich">
            <Rich value={t.hero.mobileHint} onShare={share} shareLabel={copied ? t.ui.linkCopied : undefined} />
          </p>
          {t.hero.badges?.length ? (
            <ul className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0" aria-label={t.hero.note}>
              {t.hero.badges.map((b, i) => (
                <motion.li key={b} className="chip !h-8 !px-3.5 text-[13px] font-medium text-white/90"
                  initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .85 + i * .06, ease: EASE }}>
                  <span aria-hidden className="mr-2 size-1.5 rounded-full" style={{ background: i % 2 ? '#FFB56B' : '#C8A6FF', boxShadow: `0 0 8px ${i % 2 ? 'rgba(255,181,107,.8)' : 'rgba(200,166,255,.8)'}` }} />{b}
                </motion.li>
              ))}
            </ul>
          ) : <p className="m-0 mt-5 hidden text-[13px] text-white/55 md:block">{t.hero.note}</p>}
        </div>

        {/* handwriting */}
        <motion.p aria-hidden className="pointer-events-none absolute right-[calc(var(--pad)+10px)] top-[186px] m-0 hidden rotate-[-12deg] font-hand text-[36px] leading-[1.05] text-white/95 lg:block"
          style={{ textShadow: '0 2px 18px rgba(139,92,246,.6)' }}
          initial={reduced ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 1, ease: EASE }}>
          {c.note.map((n, i) => <span key={n} className="block" style={{ marginLeft: i * 22 }}>{n}</span>)}
        </motion.p>
        <Pager />
      </div>
      <IdeaBar onPick={onPick} />
    </section>
  )
}
