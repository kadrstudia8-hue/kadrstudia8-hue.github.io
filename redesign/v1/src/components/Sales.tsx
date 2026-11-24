import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import { useRef, type PointerEvent, type RefObject } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { Btn, Rv, RvGroup, SectionHead, Splice } from './ui'
import { OS_ICON } from './Info'
import { EASE, gen, useDesktop, useFine, useOS, useReduced } from '../lib/env'

/** Prism-play: gen loop (desktop) / still (else) / CSS prism stand-in, in a 520 px circle mask. Rotates ±8° after
 *  the cursor (spring 80/18), the prism glow strengthens; scale .9 → 1 on entry. */
function Prism() {
  const fine = useFine(), reduced = useReduced(), desktop = useDesktop()
  const on = fine && !reduced
  const rx = useSpring(0, { stiffness: 80, damping: 18 }), ry = useSpring(0, { stiffness: 80, damping: 18 })
  const glow = useSpring(0.55, { stiffness: 80, damping: 18 })
  const glowOp = useMotionTemplate`${glow}`
  const loop = gen('v1-prism-loop.mp4'), still = gen('v1-prism-play.webp')
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!on) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 16); rx.set(-py * 16); glow.set(0.55 + Math.min(0.45, Math.hypot(px, py) * 0.9))
  }
  const leave = () => { rx.set(0); ry.set(0); glow.set(0.55) }
  return (
    <motion.div className="prism-zone" onPointerMove={move} onPointerLeave={leave}
      initial={reduced ? false : { scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EASE }}>
      <motion.div className="prism" style={on ? { rotateX: rx, rotateY: ry, transformPerspective: 1000 } : undefined}>
        <motion.span className="prism-ring" aria-hidden style={{ opacity: glowOp }} />
        <div className="prism-disc">
          {loop && desktop && !reduced ? (
            <video className="prism-media" src={loop} poster={still ?? undefined} muted loop autoPlay playsInline preload="none" aria-hidden width={960} height={960} />
          ) : still ? (
            <img className="prism-media" src={still} alt="" aria-hidden width={1024} height={1024} loading="lazy" />
          ) : (
            <span className="prism-css" aria-hidden />
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function DownloadSec() {
  const { t } = useLang()
  const d = t.download
  const os = useOS()
  return (
    <section id="download" className="sec dl" aria-labelledby="dl-h" data-scene="dust" data-scene-alpha=".2">
      <Splice />
      <div className="wrap">
        <SectionHead n={11} id="dl-h" tag={d.tag} title={d.title} lead={d.lead} center />
        <Prism />
        <RvGroup className="os-grid" amount={0.2}>
          {d.platforms.map((p) => {
            const I = OS_ICON[p.os]
            const mine = (os === 'windows' && p.os === 'windows') || (os === 'mac' && p.os !== 'windows')
            return (
              <Rv key={p.os}>
                <a className={`os glass${mine ? ' is-mine' : ''}`} href={p.href} rel="noopener">
                  <span className="os-ic" aria-hidden><I size={22} strokeWidth={1.6} /></span>
                  <span className="os-name">{p.name}</span>
                  <span className="os-det">{p.details}</span>
                  <span className={`btn ${p.os === 'windows' || mine ? 'btn-primary' : 'btn-ghost'} os-cta`}>
                    <span className="btn-label">{p.cta}</span><ArrowRight className="btn-arrow" size={18} aria-hidden />
                  </span>
                </a>
              </Rv>
            )
          })}
        </RvGroup>
        <Rv><p className="cap dl-note">{d.note}</p></Rv>
      </div>
    </section>
  )
}

/** 8–10 soft gold circles, blur 30 px, parallax ±20 px from scroll. */
export function Bokeh({ target, n = 9 }: { target: RefObject<HTMLElement | null>; n?: number }) {
  const reduced = useReduced()
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [20, -20])
  const y2 = useTransform(scrollYProgress, [0, 1], [-20, 20])
  const dots = Array.from({ length: n }, (_, i) => {
    const r = ((i * 7919) % 97) / 97, q = ((i * 104729) % 89) / 89
    return { left: `${(r * 100).toFixed(1)}%`, top: `${(q * 100).toFixed(1)}%`, size: 60 + ((i * 37) % 120), o: 0.08 + ((i * 13) % 10) / 100 }
  })
  return (
    <div className="bokeh" aria-hidden>
      {dots.map((d, i) => (
        <motion.i key={i} style={{ left: d.left, top: d.top, width: d.size, height: d.size, opacity: d.o, y: reduced ? 0 : i % 2 ? y1 : y2 }} />
      ))}
    </div>
  )
}

export function Pricing() {
  const { t } = useLang()
  const p = t.pricing
  const ref = useRef<HTMLElement>(null)
  return (
    <section ref={ref} id="pricing" className="sec price" aria-labelledby="price-h" data-scene="dust" data-scene-alpha=".25">
      <Bokeh target={ref} />
      <Splice />
      <div className="wrap">
        <SectionHead n={12} id="price-h" tag={p.tag} title={p.title} lead={p.lead} />
        <RvGroup className="plans" amount={0.15}>
          {p.plans.map((pl) => (
            <Rv key={pl.name} as="article" className={`plan glass${pl.highlight ? ' is-hot' : ''}`}>
              {pl.highlight && <span className="plan-glint" aria-hidden />}
              {pl.highlight && p.highlight && <p className="plan-ribbon">{p.highlight}</p>}
              <div className="plan-top">
                <h3 className="plan-name">{pl.name}</h3>
                {pl.badge && <span className="plan-badge">{pl.badge}</span>}
              </div>
              <p className="plan-price">
                <span className="plan-num">{pl.price.display}</span>
                {pl.price.old && <s className="plan-old">{pl.price.old}</s>}
              </p>
              <p className="plan-per">{pl.per}</p>
              <ul className="plan-list">
                {pl.items.map((it) => <li key={it}><Check size={16} aria-hidden />{it}</li>)}
              </ul>
              <Btn variant={pl.cta.variant === 'main' ? 'primary' : 'ghost'} href={pl.cta.href} arrow={pl.cta.variant === 'main'} className="plan-cta">
                {pl.cta.label.replace(/\s*→$/, '')}
              </Btn>
            </Rv>
          ))}
        </RvGroup>
        <RvGroup className="extras" amount={0.2}>
          {p.extras.map((x) => (
            <Rv key={x.title} className="extra">
              <h3 className="extra-h">{x.title}</h3>
              <p>{x.text}</p>
            </Rv>
          ))}
        </RvGroup>
        <Rv><p className="cap price-note">{p.note}</p></Rv>
        <Rv className="buy glass">
          <p className="buy-text">{p.buy.text}</p>
          <Btn variant="primary" href={p.buy.cta.href} arrow>{p.buy.cta.label}</Btn>
          <p className="cap buy-note">{p.buy.note}</p>
          <p className="legal">{p.legal.map((l, i) => <span key={l.href}>{i > 0 && ' · '}<a href={l.href} target="_blank" rel="noopener">{l.label}</a></span>)}</p>
        </Rv>
      </div>
    </section>
  )
}
