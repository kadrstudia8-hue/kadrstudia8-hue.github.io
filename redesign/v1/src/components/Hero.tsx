import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { Play } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { Backdrop, Btn, LoopVideo, Rich } from './ui'
import { EASE, gen, useFine, useOS, usePhone, useReduced } from '../lib/env'

/** Two <video>s, crossfade loop: the second starts 1.2 s before the first ends, opacity fade 1200 ms. */
function HeroLoop({ src, poster }: { src: string; poster: string }) {
  const a = useRef<HTMLVideoElement>(null), b = useRef<HTMLVideoElement>(null)
  const [on, setOn] = useState<0 | 1 | -1>(-1)
  useEffect(() => {
    const A = a.current!, B = b.current!
    const vids = [A, B]
    let cur = 0, raf = 0, swapping = false, disposed = false
    const start = () => {
      if (disposed) return
      A.src = src; B.src = src; B.preload = 'auto'
      A.play().catch(() => {})
      A.addEventListener('playing', () => setOn(0), { once: true })
      tick()
    }
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const v = vids[cur], d = v.duration
      if (!isFinite(d) || d <= 0 || swapping) return
      if (d - v.currentTime <= 1.2) {
        swapping = true
        const nx = vids[1 - cur]
        nx.currentTime = 0
        nx.play().catch(() => {})
        setOn((1 - cur) as 0 | 1)
        setTimeout(() => { v.pause(); cur = 1 - cur; swapping = false }, 1250)
      }
    }
    const vis = () => { if (document.hidden) vids[cur].pause(); else if (A.src) vids[cur].play().catch(() => {}) }
    document.addEventListener('visibilitychange', vis)
    // after LCP: wait for load + idle
    const go = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
      if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1200 })
      else setTimeout(start, 300)
    }
    if (document.readyState === 'complete') go()
    else window.addEventListener('load', go, { once: true })
    return () => { disposed = true; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', vis); window.removeEventListener('load', go); vids.forEach((v) => { v.pause(); v.removeAttribute('src'); v.load() }) }
  }, [src])
  return (
    <>
      <img className="hero-media" src={poster} alt="" width={1280} height={720} fetchPriority="high" />
      {[a, b].map((r, i) => (
        <video key={i} ref={r} className="hero-media hero-vid" style={{ opacity: on === i ? 1 : 0 }} muted playsInline preload="none" aria-hidden tabIndex={-1} disablePictureInPicture />
      ))}
    </>
  )
}

/** H1: line-by-line mask reveal from below after the font is ready (900 ms, stagger 90 ms) + chromatic fringe 120 ms. */
function HeroTitle({ lines }: { lines: { text: string; accent?: boolean; nowrap?: boolean }[] }) {
  const reduced = useReduced()
  const [ready, setReady] = useState(reduced)
  const [chroma, setChroma] = useState(!reduced)
  useEffect(() => {
    if (reduced) return
    let done = false
    const go = () => { if (!done) { done = true; setReady(true) } }
    document.fonts?.ready.then(go)
    const t = setTimeout(go, 700)
    return () => clearTimeout(t)
  }, [reduced])
  useEffect(() => {
    if (!ready || reduced) return
    const t = setTimeout(() => setChroma(false), 900 + 90 * lines.length)
    return () => clearTimeout(t)
  }, [ready, reduced, lines.length])
  const plain = lines.map((l) => l.text).join(' ')
  return (
    <h1 className={`h1${chroma ? ' is-chroma' : ''}`} aria-label={plain}>
      {lines.map((l, i) => (
        <span key={i} className="h1-line" aria-hidden>
          <motion.span className={`h1-in${l.accent ? ' accent' : ''}`}
            initial={reduced ? false : { y: '110%' }} animate={ready ? { y: '0%' } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: 0.09 * i }}>
            {l.text}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

function Flare({ shot }: { shot: number }) {
  return <div key={shot} className="flare" aria-hidden><i className="flare-line" /><i className="flare-dot" /><i className="flare-dot2" /></div>
}

/** Film frame with the site's hero video: tilt ±5° (perspective 1200) and a glare that follows the cursor. */
export function TiltFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  const fine = useFine(), reduced = useReduced()
  const rx = useSpring(0, { stiffness: 160, damping: 20 }), ry = useSpring(0, { stiffness: 160, damping: 20 })
  const gx = useMotionValue(50), gy = useMotionValue(30), go = useSpring(0, { stiffness: 140, damping: 22 })
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(242,211,155,.16), transparent 50%)`
  const on = fine && !reduced
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!on) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 10); rx.set(-(py - 0.5) * 10); gx.set(px * 100); gy.set(py * 100); go.set(1)
  }
  const leave = () => { rx.set(0); ry.set(0); go.set(0) }
  return (
    <motion.div className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}
      style={on ? { rotateX: rx, rotateY: ry, transformPerspective: 1200 } : undefined}>
      {children}
      {on && <motion.span className="tilt-glare" aria-hidden style={{ background: glare, opacity: go }} />}
    </motion.div>
  )
}

export function Hero() {
  const { lang, t } = useLang()
  const h = t.hero
  const ref = useRef<HTMLElement>(null)
  const phone = usePhone()
  const os = useOS()
  const reduced = useReduced()
  const [flare, setFlare] = useState(0)
  const [copied, setCopied] = useState(false)
  const loop = gen('v1-hero-loop.mp4')
  const still = gen('v1-hero-still.webp') ?? h.video.poster
  const mainLabel = os === 'mac' ? t.ui.downloadMac : os === 'windows' ? t.ui.downloadWindows : h.ctas[0].label
  const ghost = h.ctas[1]
  const share = async () => {
    const url = location.href
    try {
      if (navigator.share) { await navigator.share({ url, title: t.meta.title }); return }
      await navigator.clipboard.writeText(url); setCopied(true)
    } catch { /* cancelled */ }
  }
  useEffect(() => { setCopied(false) }, [lang])
  const lastFlare = useRef(0)
  const hoverFlare = () => { const n = Date.now(); if (n - lastFlare.current > 1000) { lastFlare.current = n; setFlare((f) => f + 1) } }

  return (
    <header ref={ref} id="top" className="hero" data-scene="reel" data-scene-x=".8" data-scene-y=".25" data-scene-scale=".4" data-scene-mx=".5" data-scene-my=".2" data-scene-mscale=".5" data-scene-alpha=".95">
      <Backdrop target={ref} className="hero-bd">
        <div className="hero-stage">
          {loop && !phone && !reduced ? <HeroLoop src={loop} poster={still} /> : <img className={`hero-media${!reduced ? ' drift' : ''}`} src={still} alt="" width={1280} height={720} fetchPriority="high" />}
          <div className="hero-shade" />
          <div className="beam beam-hero" />
          <div className="leak leak-hero" />
        </div>
      </Backdrop>
      <div className="hero-fold">
        {!reduced && <Flare shot={flare} />}
        <div className="wrap hero-body">
          <motion.p className="eyebrow hero-tag" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}>
            {h.tag}
          </motion.p>
          <HeroTitle lines={h.title} />
          <motion.div className="hero-rest" initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}>
            <p className="hero-lead">{h.lead}</p>
            <div className="cta-row">
              <Btn variant="primary" href={h.ctas[0].href} arrow magnetic onPointerEnter={hoverFlare}>{mainLabel}</Btn>
              <Btn variant="ghost" href={ghost.href} icon={<Play size={15} fill="currentColor" aria-hidden />}>{ghost.label.replace(/^▶\s*/, '')}</Btn>
            </div>
            {h.badges?.length ? (
              <ul className="hero-badges">
                {h.badges.map((b) => <li key={b}><span className="hb-dot" aria-hidden />{b}</li>)}
              </ul>
            ) : <p className="hero-note">{h.note}</p>}
            <p className="hero-mobile">
              <Rich value={h.mobileHint} onShare={share} shareLabel={copied ? t.ui.linkCopied : undefined} />
            </p>
          </motion.div>
        </div>
        <motion.ul className="hud-row wrap" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }}>
          {h.facts.map((f, i) => (
            <li key={i}><span className="hud-i">{String(i + 1).padStart(2, '0')}</span><span><Rich value={f} /></span></li>
          ))}
        </motion.ul>
      </div>
      <div className="wrap hero-credit">
        <TiltFrame className="credit-frame">
          <LoopVideo src={h.video.src} poster={h.video.poster} label={h.video.label} width={1280} height={720} />
        </TiltFrame>
        <p className="credit-cap"><span className="credit-mark" aria-hidden>◆</span>{h.caption}</p>
      </div>
    </header>
  )
}
