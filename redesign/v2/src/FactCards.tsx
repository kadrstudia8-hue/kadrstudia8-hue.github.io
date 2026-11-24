import { Clapperboard, Film, Mic, Play } from 'lucide-react'
import { m, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState, type PointerEvent } from 'react'
import type { SiteContent } from '@kadr/shared/content/index'
import { FINE, GEN, derive, useMediaQuery, usePrefersReducedMotion } from './lib'

const POS = ['0% 0%', '100% 0%', '0% 100%', '100% 100%']
const FALLBACK = [
  { I: Film, g: 'radial-gradient(circle at 35% 30%,#D9C8FF,#8B5CF6 60%,#5B2BD6)' },
  { I: Clapperboard, g: 'radial-gradient(circle at 35% 30%,#FFC2F2,#FF4FD8 60%,#C0139B)' },
  { I: Mic, g: 'radial-gradient(circle at 35% 30%,#BFE0FF,#3B7BFF 60%,#1F45C9)' },
  { I: Play, g: 'radial-gradient(circle at 35% 30%,#E2D4FF,#8F5BFF 60%,#5B2BD6)' },
]

let spriteOk: boolean | null = null

/** Sprite cell of gen/v2-icons.webp (2×2), with a glossy code-drawn fallback if the sprite is missing. */
export function SpriteIcon({ i, size, className = '' }: { i: number; size: number; className?: string }) {
  const [ok, setOk] = useState<boolean | null>(spriteOk)
  useEffect(() => {
    if (spriteOk !== null) { setOk(spriteOk); return }
    const img = new Image()
    img.onload = () => { spriteOk = true; setOk(true) }
    img.onerror = () => { spriteOk = false; setOk(false) }
    img.src = GEN.icons
  }, [])
  if (ok === false) {
    const F = FALLBACK[i]
    return (
      <span className={`grid place-items-center rounded-[28%] ${className}`} style={{ width: size, height: size, background: F.g, boxShadow: 'inset 0 -6px 12px rgba(0,0,0,.2), inset 0 6px 10px rgba(255,255,255,.55), 0 10px 18px -8px rgba(60,40,160,.5)' }}>
        <F.I size={size * 0.48} color="#fff" strokeWidth={2.4} />
      </span>
    )
  }
  return <span className={`block ${className}`} style={{ width: size, height: size, backgroundImage: `url(${GEN.icons})`, backgroundSize: '200% 200%', backgroundPosition: POS[i], filter: 'drop-shadow(0 12px 12px rgba(60,40,160,.28))' }} />
}

function Card({ i, title, text }: { i: number; title: string; text: string }) {
  const reduced = usePrefersReducedMotion()
  const fine = useMediaQuery(FINE)
  const md = useMediaQuery('(min-width: 768px)', true)
  const rx = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 })
  const ry = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 })
  const [hover, setHover] = useState(false)
  const move = (e: PointerEvent<HTMLElement>) => {
    if (!fine || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12)
  }
  return (
    <m.li className="list-none" style={{ perspective: 900 }}
      initial={reduced ? false : { opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: i * 0.08 }}>
      <m.div onPointerMove={move} onPointerEnter={() => setHover(true)} onPointerLeave={() => { setHover(false); rx.set(0); ry.set(0) }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="glass relative flex h-full min-h-[148px] flex-col p-4 md:min-h-[230px] md:p-6 xl:h-[250px] xl:p-7">
        <m.span className="relative block w-fit" style={{ transformStyle: 'preserve-3d' }}
          animate={hover && !reduced ? { y: -6, scale: 1.08, z: 30 } : { y: 0, scale: 1, z: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
          <SpriteIcon i={i} size={md ? 92 : 64} className="-ml-2 -mt-2 md:-ml-3 md:-mt-3" />
          <span className="absolute -bottom-1 left-1/2 h-2.5 w-[60%] -translate-x-1/2 rounded-full bg-[rgba(60,40,160,.18)] blur-[5px] transition-transform duration-200" style={{ transform: `translateX(-50%) scale(${hover ? 0.75 : 1})` }} />
        </m.span>
        <h3 className="mt-2 text-[16px] font-extrabold leading-[1.15] tracking-[-.01em] md:mt-3 md:text-[20px]" style={{ transform: 'translateZ(14px)' }}>{title}</h3>
        <p className="card-text mt-1.5 md:mt-2">{text}</p>
      </m.div>
    </m.li>
  )
}

export function FactCards({ t }: { t: SiteContent }) {
  const d = derive(t)
  return (
    <div className="wrap relative z-[4] mt-[30px] md:mt-10 lg:-mt-10">
      <ul className="m-0 grid grid-cols-2 gap-3 p-0 md:gap-6 lg:grid-cols-4">
        {d.facts.map((f, i) => <Card key={i} i={i} title={f.title} text={f.text} />)}
      </ul>
    </div>
  )
}
