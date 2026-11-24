import { useEffect, useRef } from 'react'
import { FINE, GEN, GenImg, useMediaQuery, usePrefersReducedMotion } from './lib'

/** Sky: page gradient + gen/v2-sky.webp (fades out by ~1100px) + 2 CSS cloud layers drifting (60 / 90 / 140 s). */
export function Sky() {
  const cloud = (x: number, y: number, w: number, o = 1) => (
    <span className="absolute rounded-full bg-white" style={{ left: `${x}%`, top: y, width: w, height: w * 0.42, opacity: o, filter: 'blur(30px)' }} />
  )
  return (
    <div className="page-bg" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-[1150px] overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(180deg,#000 0,#000 62%,transparent 100%)', maskImage: 'linear-gradient(180deg,#000 0,#000 62%,transparent 100%)' }}>
        <div className="cloud-layer drift-60">
          <GenImg src={GEN.sky} eager className="h-full w-full object-cover object-[0%_0%]" width={1536} height={864} />
        </div>
        <div className="cloud-layer drift-90 hidden w-[200%] md:block">
          {[0, 50].map(o => <span key={o}>{cloud(o + 30, 260, 360, 0.5)}{cloud(o + 6, 520, 420, 0.55)}{cloud(o + 40, 880, 520, 0.7)}</span>)}
        </div>
        <div className="cloud-layer drift-140 hidden w-[200%] md:block">
          {[0, 50].map(o => <span key={o}>{cloud(o + 20, 120, 260, 0.35)}{cloud(o + 2, 760, 600, 0.6)}{cloud(o + 34, 980, 700, 0.75)}</span>)}
        </div>
      </div>
    </div>
  )
}

/** Chrome arrow cursor (28px) + trail of up to 6 sparkles on fast moves. Desktop fine pointer only. */
export function Cursor() {
  const fine = useMediaQuery(FINE)
  const reduced = usePrefersReducedMotion()
  const on = fine && !reduced
  const ref = useRef<HTMLDivElement>(null)
  const trail = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!on) return
    const html = document.documentElement
    html.classList.add('has-cursor')
    let x = -100, y = -100, lx = 0, ly = 0, lt = 0, raf = 0, shown = false, last = 0
    const el = ref.current!, tr = trail.current!
    const draw = () => { raf = 0; el.style.transform = `translate3d(${x}px,${y}px,0)` }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX; y = e.clientY
      if (!shown) { shown = true; el.style.opacity = '1' }
      const target = e.target as Element | null
      el.dataset.hot = target?.closest('a,button,[role="tab"],summary,label') ? '1' : ''
      const now = performance.now()
      const v = Math.hypot(x - lx, y - ly) / Math.max(1, now - lt)
      if (v > 1.4 && now - last > 45 && tr.childElementCount < 6) {
        last = now
        const s = document.createElement('span')
        s.className = 'trail-star'
        s.style.left = `${x}px`; s.style.top = `${y}px`
        s.style.setProperty('--r', `${Math.round(Math.random() * 90)}deg`)
        s.style.setProperty('--c', ['#FF4FD8', '#C8F31D', '#B9A6FF', '#fff'][Math.floor(Math.random() * 4)])
        tr.appendChild(s)
        s.addEventListener('animationend', () => s.remove(), { once: true })
      }
      lx = x; ly = y; lt = now
      if (!raf) raf = requestAnimationFrame(draw)
    }
    const leave = () => { shown = false; el.style.opacity = '0' }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [on])
  if (!on) return null
  return (
    <>
      <div ref={trail} className="pointer-events-none fixed inset-0 z-[100]" aria-hidden />
      <div ref={ref} className="kcursor pointer-events-none fixed left-0 top-0 z-[101] opacity-0" aria-hidden>
        <svg width="28" height="28" viewBox="0 0 28 28">
          <defs>
            <linearGradient id="kc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor="#DDE6F5" /><stop offset=".55" stopColor="#8FA3C7" /><stop offset=".75" stopColor="#F4F8FF" /><stop offset="1" stopColor="#B7C3DD" />
            </linearGradient>
          </defs>
          <path d="M3 2.5 24 12.6c1.3.6 1.1 2.4-.3 2.8l-8.3 2.2-4.1 7.6c-.7 1.2-2.5 1-2.8-.4L2.5 4c-.3-1 .6-1.9 1.5-1.5Z" fill="url(#kc)" stroke="#0B0B12" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M6 6.5 9 19" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
        </svg>
      </div>
      <style>{`
        .kcursor svg{display:block;transform-origin:3px 2px;transition:transform .18s cubic-bezier(.3,1.6,.5,1);filter:drop-shadow(0 3px 4px rgba(40,20,120,.35))}
        .kcursor[data-hot="1"] svg{transform:scale(1.25) rotate(-8deg)}
        .trail-star{position:absolute;width:12px;height:12px;margin:-6px 0 0 -6px;background:var(--c);clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%);animation:trail .7s ease-out forwards}
        @keyframes trail{from{transform:rotate(var(--r)) scale(1);opacity:1}to{transform:rotate(calc(var(--r) + 90deg)) translateY(14px) scale(0);opacity:0}}
      `}</style>
    </>
  )
}
