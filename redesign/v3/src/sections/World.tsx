import { useEffect, useRef } from 'react'
import { useHasFinePointer } from '@kadr/shared/ui/useIsTouch'
import { useMediaQuery } from '@kadr/shared/ui/useMediaQuery'
import { usePrefersReducedMotion } from '@kadr/shared/ui/usePrefersReducedMotion'
import { genUrl } from '../lib/gen'

/**
 * The one continuous scene behind the page (§3.5: never a flat background):
 * far = the sunset scene, blurred (parallax .15) · mid = warm/violet glows (.3) · near = bokeh «flowers» at the edges (.5),
 * plus the time-of-day tint: sunset at the top → night indigo in the middle → back to sunset at the CTA.
 */
export function World() {
  const far = useRef<HTMLDivElement>(null)
  const mid = useRef<HTMLDivElement>(null)
  const tint = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px)')
  const scene = genUrl('v3-hero-scene.webp')

  useEffect(() => {
    let raf = 0
    const run = () => {
      raf = 0
      const y = window.scrollY
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = y / max
      // night peaks in the middle of the page, sunset returns for the CTA
      const night = p < 0.12 ? p / 0.12 : p > 0.8 ? Math.max(0, 1 - (p - 0.8) / 0.2) : 1
      if (tint.current) tint.current.style.opacity = (0.15 + 0.55 * night).toFixed(3)
      if (reduced || mobile) return
      const vh = window.innerHeight
      // layers are mapped to page progress (bounded), speeds ≈ .15 / .3 / .5 of the first screens
      if (far.current) far.current.style.transform = `translate3d(0, ${(-Math.min(y * 0.15, vh * 0.08)).toFixed(1)}px, 0) scale(1.25)`
      if (mid.current) mid.current.style.transform = `translate3d(0, ${(-p * vh * 1.6).toFixed(1)}px, 0)`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [reduced, mobile])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* far: the sunset itself */}
      <div ref={far} className="absolute inset-[-10%] will-change-transform" style={{ transform: 'scale(1.25)' }}>
        {scene ? (
          <img src={scene} alt="" className="h-full w-full object-cover" style={{ filter: 'blur(26px) saturate(1.15)', objectPosition: '70% 60%' }} decoding="async" />
        ) : (
          <div className="h-full w-full" style={{ background: 'linear-gradient(180deg,#2a1a5e 0%,#5b3a8e 40%,#c46d8a 62%,#ffb56b 72%,#3a2463 78%,#171033 100%)', filter: 'blur(20px)' }} />
        )}
      </div>
      {/* time of day */}
      <div ref={tint} className="absolute inset-0" style={{ background: 'radial-gradient(80% 50% at 50% 110%, oklch(30% .09 300 / .9), transparent 70%), linear-gradient(180deg in oklch, oklch(13% .045 288) 0%, oklch(16% .06 292) 38%, oklch(19% .075 296) 72%, oklch(24% .085 300) 100%)', opacity: .15 }} />
      {/* mid: glows from the shores */}
      <div ref={mid} className="absolute inset-x-0 top-0 h-[260vh] will-change-transform">
        <div className="absolute left-[-12%] top-[40vh] h-[60vh] w-[40vw] rounded-full opacity-60" style={{ background: 'radial-gradient(closest-side, rgba(245,143,192,.35), transparent)', filter: 'blur(30px)' }} />
        <div className="absolute right-[-10%] top-[90vh] h-[70vh] w-[45vw] rounded-full opacity-60" style={{ background: 'radial-gradient(closest-side, rgba(255,181,107,.28), transparent)', filter: 'blur(30px)' }} />
        <div className="absolute left-[-8%] top-[170vh] h-[60vh] w-[40vw] rounded-full opacity-60" style={{ background: 'radial-gradient(closest-side, rgba(139,92,246,.4), transparent)', filter: 'blur(30px)' }} />
      </div>
    </div>
  )
}

/**
 * Near layer (above the page shade, under the content): out-of-focus flowers at the page edges — crops of the
 * hero scene's foreground flowers, blurred — plus soft bokeh discs. Parallax ≈ .5 (mapped to page progress).
 */
export function Bokeh() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px)')
  const scene = genUrl('v3-hero-scene.webp')
  useEffect(() => {
    if (reduced || mobile) return
    let raf = 0
    const run = () => {
      raf = 0
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
      if (ref.current) ref.current.style.transform = `translate3d(0, ${(-(scrollY / max) * innerHeight * 2).toFixed(1)}px, 0)`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    addEventListener('scroll', on, { passive: true })
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', on) }
  }, [reduced, mobile])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div ref={ref} className="absolute inset-x-0 top-0 h-[300vh] will-change-transform">
        {scene && FLOWERS.map((f, i) => (
          <span key={i} className="absolute" style={{
            left: f.l, right: f.r, top: f.y, width: f.s, height: f.s,
            backgroundImage: `url(${scene})`, backgroundSize: '1700px auto', backgroundPosition: f.pos,
            filter: 'blur(14px) saturate(1.2)', opacity: f.o,
            WebkitMaskImage: 'radial-gradient(closest-side, #000 35%, transparent)', maskImage: 'radial-gradient(closest-side, #000 35%, transparent)',
          }} />
        ))}
        {BOKEH.map((b, i) => (
          <span key={i} className="absolute rounded-full" style={{
            left: b.x, top: b.y, width: b.s, height: b.s,
            background: `radial-gradient(circle at 40% 40%, ${b.c}, transparent 68%)`,
            filter: 'blur(40px)', opacity: b.o,
          }} />
        ))}
      </div>
    </div>
  )
}

const FLOWERS = [
  { l: '-160px', y: '95vh', s: '440px', pos: '0% 100%', o: .7 },
  { r: '-170px', y: '140vh', s: '460px', pos: '100% 100%', o: .65 },
  { l: '-180px', y: '205vh', s: '420px', pos: '2% 85%', o: .6 },
  { r: '-160px', y: '250vh', s: '440px', pos: '100% 92%', o: .6 },
] as { l?: string; r?: string; y: string; s: string; pos: string; o: number }[]

const BOKEH = [
  { x: '-6vw', y: '78vh', s: '22vw', c: 'rgba(245,143,192,.9)', o: .55 },
  { x: '88vw', y: '112vh', s: '20vw', c: 'rgba(255,201,119,.85)', o: .45 },
  { x: '92vw', y: '150vh', s: '16vw', c: 'rgba(245,143,192,.8)', o: .45 },
  { x: '-8vw', y: '190vh', s: '24vw', c: 'rgba(255,181,107,.7)', o: .4 },
  { x: '86vw', y: '232vh', s: '22vw', c: 'rgba(200,166,255,.8)', o: .45 },
  { x: '-5vw', y: '262vh', s: '18vw', c: 'rgba(245,143,192,.8)', o: .45 },
]

/** Page-coordinate overlay (§3.6): transparent → .55 at 900px → .82 at 1400px; eases back towards the CTA sunset. */
export function PageShade() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{
      background: 'linear-gradient(180deg, rgba(14,10,31,0) 0, rgba(14,10,31,.55) 900px, rgba(14,10,31,.82) 1400px, rgba(14,10,31,.82) calc(100% - 1100px), rgba(14,10,31,.55) calc(100% - 420px), rgba(14,10,31,.7) 100%)',
    }} />
  )
}

/** Soft light spot under the glass that follows the cursor with lag (lerp .12). Desktop only. */
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useHasFinePointer()
  const reduced = usePrefersReducedMotion()
  const wide = useMediaQuery('(min-width: 768px)')
  const on = fine && !reduced && wide
  useEffect(() => {
    if (!on) return
    let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, raf = 0
    const tick = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12
      if (ref.current) ref.current.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; if (ref.current) ref.current.style.opacity = '1'; if (!raf) raf = requestAnimationFrame(tick) }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [on])
  if (!on) return null
  return <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[1] size-[320px] rounded-full opacity-0 transition-opacity duration-500" style={{ background: 'radial-gradient(closest-side, rgba(200,166,255,.10), transparent)' }} />
}

/** Fireflies / warm dust drifting up (2D canvas; 40 points, 16 on phones). Stops off-screen, when hidden and with reduced motion. */
export function Fireflies({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const c = ref.current
    if (!c || reduced) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const n = innerWidth < 768 ? 16 : 40
    const dpr = Math.min(devicePixelRatio || 1, innerWidth < 768 ? 1.5 : 2)
    let w = 0, h = 0, raf = 0, vis = false, last = performance.now()
    const pts = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2, v: .012 + Math.random() * .03, ph: Math.random() * 6.28, dx: (Math.random() - .5) * .01 }))
    const size = () => { const r = c.getBoundingClientRect(); w = r.width; h = r.height; c.width = w * dpr; c.height = h * dpr }
    size()
    const draw = (now: number) => {
      const dt = Math.min(.05, (now - last) / 1000); last = now
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        p.y -= p.v * dt; p.x += Math.sin(now / 1400 + p.ph) * p.dx * dt
        if (p.y < -.02) { p.y = 1.02; p.x = Math.random() }
        const a = .35 + .35 * Math.sin(now / 700 + p.ph)
        const g = ctx.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, p.r * 3)
        g.addColorStop(0, `rgba(255,220,180,${(.7 * a + .2).toFixed(3)})`)
        g.addColorStop(1, 'rgba(255,220,180,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r * 3, 0, 6.283); ctx.fill()
      }
      raf = vis && !document.hidden ? requestAnimationFrame(draw) : 0
    }
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) { last = performance.now(); raf = requestAnimationFrame(draw) } })
    io.observe(c)
    const onVis = () => { if (!document.hidden && vis && !raf) { last = performance.now(); raf = requestAnimationFrame(draw) } }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', size)
    return () => { io.disconnect(); cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', size) }
  }, [reduced])
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
