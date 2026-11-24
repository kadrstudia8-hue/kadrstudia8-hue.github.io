import { ArrowRight, Play } from 'lucide-react'
import { m } from 'motion/react'
import { useEffect, useMemo, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { ripple, useInViewOnce, useMagnetic, usePrefersReducedMotion } from './lib'

type AProps = AnchorHTMLAttributes<HTMLAnchorElement> & { arrow?: boolean; small?: boolean }
type BProps = ButtonHTMLAttributes<HTMLButtonElement> & { arrow?: boolean; small?: boolean }

const isExt = (href?: string) => !!href && /^https?:/.test(href)

/** Lime primary (radius 12, 1.5px ink border, pressed-in shadow). Renders <a> when href is given. */
export function LimeButton({ arrow = true, small, className = '', children, ...p }: AProps) {
  return (
    <a {...p} {...(isExt(p.href) ? { target: '_blank', rel: 'noopener' } : {})} className={`btn btn-lime ${small ? 'sm' : ''} ${className}`} onPointerDown={(e) => ripple(e)}>
      <span>{children}</span>{arrow && <ArrowRight className="arr" size={small ? 17 : 19} strokeWidth={2.4} aria-hidden />}
    </a>
  )
}
export function LimeAction({ arrow = true, small, className = '', children, ...p }: BProps) {
  return (
    <button type="button" {...p} className={`btn btn-lime ${small ? 'sm' : ''} ${className}`} onPointerDown={(e) => ripple(e)}>
      <span>{children}</span>{arrow && <ArrowRight className="arr" size={small ? 17 : 19} strokeWidth={2.4} aria-hidden />}
    </button>
  )
}
export function BlackButton({ arrow = true, className = '', children, ...p }: AProps) {
  return (
    <a {...p} {...(isExt(p.href) ? { target: '_blank', rel: 'noopener' } : {})} className={`btn btn-black ${className}`} onPointerDown={(e) => ripple(e, 'rgba(200,243,29,.25)')}>
      <span>{children}</span>{arrow && <ArrowRight className="arr" size={18} strokeWidth={2.4} aria-hidden />}
    </a>
  )
}
export function WhiteButton({ arrow = true, className = '', children, ...p }: AProps) {
  return (
    <a {...p} {...(isExt(p.href) ? { target: '_blank', rel: 'noopener' } : {})} className={`btn btn-white ${className}`} onPointerDown={(e) => ripple(e, 'rgba(255,255,255,.2)')}>
      <span>{children}</span>{arrow && <ArrowRight className="arr" size={18} strokeWidth={2.4} aria-hidden />}
    </a>
  )
}

/** Play circle + two-line caption (magnetic on desktop). */
export function PlayButton({ lines, onClick, label, dark }: { lines: string[]; onClick: () => void; label: string; dark?: boolean }) {
  const ref = useMagnetic<HTMLSpanElement>(60, 0.3)
  return (
    <button type="button" className="play-btn" onClick={onClick} aria-label={label} style={dark ? { color: '#fff' } : undefined}>
      <span ref={ref} className="circle" style={dark ? { borderColor: '#fff', color: '#fff' } : undefined}>
        <Play size={16} fill="currentColor" strokeWidth={0} style={{ marginLeft: 2 }} aria-hidden />
      </span>
      <span aria-hidden>{lines.map((l, i) => <span key={i} className="block">{l}</span>)}</span>
    </button>
  )
}

export function Tag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`tag ${className}`}>{children}</span>
}

/** Pixel heading that types itself in (30 ms / char) when it enters the viewport; layout never shifts. */
export function PixelTitle({ text, as: As = 'h2', className = '', id }: { text: string; as?: 'h2' | 'h3'; className?: string; id?: string }) {
  const [ref, seen] = useInViewOnce<HTMLHeadingElement>(0.4)
  const reduced = usePrefersReducedMotion()
  const chars = useMemo(() => Array.from(text.toUpperCase()), [text])
  const [n, setN] = useState(0)
  useEffect(() => { setN(0) }, [text])
  useEffect(() => {
    if (!seen) return
    if (reduced) { setN(chars.length); return }
    if (n >= chars.length) return
    const t = setTimeout(() => setN(v => v + 1), 30)
    return () => clearTimeout(t)
  }, [seen, n, chars.length, reduced])
  const words = useMemo(() => {
    // keep words unbreakable while typing
    const out: { ch: string; i: number }[][] = [[]]
    chars.forEach((ch, i) => { if (ch === ' ') { out.push([]); } else out[out.length - 1].push({ ch, i }) })
    return out
  }, [chars])
  return (
    <As ref={ref} id={id} className={`h-pixel ${className}`} aria-label={text}>
      <span aria-hidden>
        {words.map((w, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {w.map(({ ch, i }) => <span key={i} style={{ opacity: i < n ? 1 : 0 }}>{ch}</span>)}
            {wi < words.length - 1 && <span style={{ opacity: w.length && w[w.length - 1].i < n ? 1 : 0 }}>&nbsp;</span>}
          </span>
        ))}
        {seen && n < chars.length && <span className="blink inline-block w-[.5em] translate-y-[.08em] bg-ink" style={{ height: '.8em', marginLeft: '-.5em' }} />}
      </span>
    </As>
  )
}

/** Neon handwriting on black: the stroke is drawn (dashoffset), then the fill flickers on twice. */
export function NeonScript({ text, size = 46, className = '', rotate = -6, maxChars = 14 }: { text: string; size?: number; className?: string; rotate?: number; maxChars?: number }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>(0.4)
  const reduced = usePrefersReducedMotion()
  const lines = useMemo(() => {
    const out: string[] = []
    for (const w of text.split(' ')) {
      const last = out[out.length - 1]
      if (last && (last + ' ' + w).length <= maxChars) out[out.length - 1] = last + ' ' + w
      else out.push(w)
    }
    return out
  }, [text, maxChars])
  const lh = size * 0.95
  const h = lh * lines.length + size * 0.35
  const w = Math.max(...lines.map(l => l.length)) * size * 0.46 + 20
  const show = seen || reduced
  return (
    <div ref={ref} className={className} style={{ transform: `rotate(${rotate}deg)` }} aria-label={text} role="img">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ overflow: 'visible', filter: 'drop-shadow(0 0 8px rgba(200,243,29,.55))', maxWidth: w }} aria-hidden>
        {lines.map((l, i) => (
          <text key={l + i} x={i % 2 ? 18 : 4} y={size * 0.85 + i * lh} fontFamily="'Caveat Variable', Caveat, cursive" fontWeight={700} fontSize={size}
            fill="#C8F31D" stroke="#C8F31D" strokeWidth={1.2} strokeLinejoin="round"
            style={{
              strokeDasharray: 900, strokeDashoffset: show ? 0 : 900,
              fillOpacity: show ? 1 : 0,
              transition: reduced ? 'none' : `stroke-dashoffset 1.1s ease-in-out ${i * 0.25}s`,
              animation: show && !reduced ? `neon-on 1.1s ${0.9 + i * 0.25}s both` : undefined,
            }}>{l}</text>
        ))}
      </svg>
      <style>{`@keyframes neon-on{0%{fill-opacity:0}30%{fill-opacity:1}40%{fill-opacity:.2}55%{fill-opacity:1}65%{fill-opacity:.35}80%,100%{fill-opacity:1}}`}</style>
    </div>
  )
}

/** 4-point sparkle star. */
export function Sparkle({ size = 18, color = '#fff', className = '', style }: { size?: number; color?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 0c.9 6.2 5.3 10.9 12 12-6.7 1.1-11.1 5.8-12 12-.9-6.2-5.3-10.9-12-12C6.7 10.9 11.1 6.2 12 0Z" fill={color} />
    </svg>
  )
}

export function Sparkles({ items }: { items: { x: string; y: string; s: number; d: number; c?: string }[] }) {
  return (
    <>
      {items.map((p, i) => (
        <span key={i} className="spark" style={{ left: p.x, top: p.y, animationDelay: `${p.d}s` }}>
          <Sparkle size={p.s} color={p.c ?? '#fff'} style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,.9))' }} />
        </span>
      ))}
    </>
  )
}

/** Chrome 5-point star (satellite). */
export function ChromeStar({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs>
        <linearGradient id="cs-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" /><stop offset=".3" stopColor="#DDE6F5" /><stop offset=".52" stopColor="#8FA3C7" /><stop offset=".72" stopColor="#F4F8FF" /><stop offset="1" stopColor="#B7C3DD" />
        </linearGradient>
      </defs>
      <path d="M32 4c2 0 3 1.4 4 3.6l6 12.4 13.6 2c2.4.4 3.4 1.4 3.4 3s-.8 2.4-2.4 4L46.8 38.6l2.4 13.6c.4 2.4-.2 3.8-1.8 4.4-1.4.6-2.8.2-4.6-.8L32 49.4 19.2 55.8c-1.8 1-3.2 1.4-4.6.8-1.6-.6-2.2-2-1.8-4.4l2.4-13.6L5.4 29c-1.6-1.6-2.4-2.4-2.4-4s1-2.6 3.4-3L20 20l6-12.4C27 5.4 30 4 32 4Z"
        fill="url(#cs-g)" stroke="#6E7FA6" strokeWidth="1.5" />
      <path d="M24 22c3-6 5-10 8-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".9" />
    </svg>
  )
}

export function Heart({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <defs>
        <radialGradient id="hg" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#FFC2F2" /><stop offset=".45" stopColor="#FF4FD8" /><stop offset="1" stopColor="#C0139B" /></radialGradient>
      </defs>
      <path d="M20 36C8 27 2 20 2 12.5 2 7 6 3 11 3c4 0 7 2.5 9 6 2-3.5 5-6 9-6 5 0 9 4 9 9.5C38 20 32 27 20 36Z" fill="url(#hg)" />
      <ellipse cx="11" cy="10" rx="4" ry="2.4" fill="#fff" opacity=".8" transform="rotate(-30 11 10)" />
    </svg>
  )
}

/** OS glyphs (simple filled shapes). */
export function WinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M1 3.2 8.2 2.2v7H1zM9.2 2.1 19 .8v8.4H9.2zM1 10.2h7.2v7L1 16.2zM9.2 10.2H19v8.4l-9.8-1.3z" />
    </svg>
  )
}
export function AppleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M13.6 10.6c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.9-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.5 0 0-2.3-.9-2.3-3.6ZM11.4 4.1c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z" />
    </svg>
  )
}

/** Card entrance: y 48 → 0, spring 260/22, staggered. */
export function Rise({ children, i = 0, className = '', y = 48, as = 'div' }: { children: ReactNode; i?: number; className?: string; y?: number; as?: 'div' | 'li' | 'article' }) {
  const reduced = usePrefersReducedMotion()
  const M = as === 'li' ? m.li : as === 'article' ? m.article : m.div
  return (
    <M className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: i * 0.08 }}>
      {children}
    </M>
  )
}

/** Section head: tag + H2 (text first, then lead) — text spring without bounce. */
export function SectionHead({ tag, title, lead, id, className = '', dark, children }: { tag: string; title: string; lead?: string; id?: string; className?: string; dark?: boolean; children?: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const t = { type: 'spring' as const, stiffness: 120, damping: 20 }
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`}>
      <m.div initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={t} className="max-w-[760px]">
        <Tag>{tag}</Tag>
        <h2 id={id} className={`h-sec mt-4 ${dark ? 'text-white' : ''}`}>{title}</h2>
      </m.div>
      {(lead || children) && (
        <m.div initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ ...t, delay: 0.07 }} className="max-w-[460px] md:pb-1">
          {lead && <p className={`lead m-0 ${dark ? '!text-white/75' : ''}`}>{lead}</p>}
          {children}
        </m.div>
      )}
    </div>
  )
}

