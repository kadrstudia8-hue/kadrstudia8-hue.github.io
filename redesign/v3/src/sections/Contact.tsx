import { m as motion, useInView } from 'motion/react'
import { useReducedMotion } from '../lib/motion'
import { useEffect, useRef, useState } from 'react'
import { LANGS } from '@kadr/shared/content/index.ts'
import { useLang } from '@kadr/shared/i18n'
import { useHasFinePointer } from '@kadr/shared/ui/useIsTouch'
import { Btn } from '../lib/Btn'
import { genUrl } from '../lib/gen'
import { useCtaLabel } from '../lib/os'
import { H2 } from '../lib/ui'
import { Logo } from './Nav'
import { Fireflies } from './World'

/** CTA banner (block 14): the bridge scene, glowing lens sphere, lens flare on entry. */
export function Contact() {
  const { t } = useLang()
  const c = t.contact
  const band = t.ctaBand
  const label = useCtaLabel(t)
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()
  const fine = useHasFinePointer()
  const scene = genUrl('v3-cta-scene.webp')
  const [shift, setShift] = useState({ x: 0, y: 0 })
  useEffect(() => { if (!fine || reduced) setShift({ x: 0, y: 0 }) }, [fine, reduced])

  return (
    <section id="contact" className="sec relative z-[2]">
      <div className="wrap">
        <motion.div
          ref={box}
          onPointerMove={(e) => {
            if (!fine || reduced) return
            const r = e.currentTarget.getBoundingClientRect()
            setShift({ x: ((e.clientX - r.left) / r.width - .5) * -16, y: ((e.clientY - r.top) / r.height - .5) * -16 })
          }}
          onPointerLeave={() => setShift({ x: 0, y: 0 })}
          initial={reduced ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="relative isolate h-[420px] overflow-hidden rounded-[32px] border border-white/30 shadow-[0_40px_80px_-30px_rgba(5,2,20,.9)] md:h-[360px] lg:h-[380px]"
        >
          {/* scene */}
          <motion.div aria-hidden className="absolute -inset-3"
            initial={reduced ? false : { scale: 1.08 }} animate={inView ? { scale: 1 } : undefined} transition={{ duration: 1.6, ease: [.22, 1, .36, 1] }}>
            <div className="absolute inset-0 transition-transform duration-500 ease-out" style={{ transform: `translate3d(${shift.x / 2}px, ${shift.y / 2}px, 0)` }}>
              {scene
                ? <img src={scene} alt="" width={1600} height={688} loading="lazy" decoding="async" className="h-full w-full object-cover object-[72%_50%] md:object-[60%_50%]" />
                : <div className="h-full w-full" style={{ background: 'linear-gradient(180deg,#3a2470 0%,#8a4f9a 45%,#ffb56b 62%,#3a2463 70%,#171033 100%)' }} />}
              {/* glowing lens sphere + flare (sphere sits at ~65% / 67% of the image) */}
              <span className="orb-glow absolute left-[65%] top-[67%] size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full max-md:left-[78%] max-md:top-[72%]" style={{ background: 'radial-gradient(closest-side, rgba(255,214,160,.55), rgba(200,166,255,.25) 50%, transparent)', mixBlendMode: 'screen' }} />
              {inView && !reduced && (
                <span className="absolute left-[65%] top-[67%] max-md:left-[78%] max-md:top-[72%]" style={{ mixBlendMode: 'screen' }}>
                  <motion.span className="absolute left-[-320px] top-0 h-px w-[640px]" style={{ background: 'linear-gradient(90deg in oklch, transparent 0%, oklch(80% .1 300 / .35) 30%, oklch(96% .05 75 / .95) 50%, oklch(85% .1 40 / .4) 68%, transparent 100%)' }}
                    initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: [0, 1, .6], opacity: [0, 1, .5] }} transition={{ duration: .9, ease: 'easeOut', delay: .3 }} />
                  <motion.span className="absolute left-[-120px] top-[-14px] size-7 rounded-full border border-white/40" style={{ background: 'radial-gradient(closest-side, rgba(200,166,255,.35), transparent)' }}
                    initial={{ opacity: 0, scale: .4 }} animate={{ opacity: [0, .8, .35], scale: 1 }} transition={{ duration: .9, delay: .3 }} />
                  <motion.span className="absolute left-[-200px] top-[-6px] size-3 rounded-full bg-[rgba(255,214,160,.6)]"
                    initial={{ opacity: 0 }} animate={{ opacity: [0, .9, .3] }} transition={{ duration: .9, delay: .35 }} />
                </span>
              )}
              <span className="glint absolute bottom-[8%] left-[50%] h-[16%] w-[40%]" style={{ background: 'repeating-linear-gradient(180deg, transparent 0 7px, rgba(255,214,160,.22) 7px 8px)', WebkitMaskImage: 'radial-gradient(closest-side, #000, transparent)', maskImage: 'radial-gradient(closest-side, #000, transparent)' }} />
            </div>
          </motion.div>
          <div aria-hidden className="absolute inset-0 hidden md:block" style={{ background: 'radial-gradient(60% 110% at 8% 50%, oklch(13% .045 288 / .45), transparent 70%), linear-gradient(90deg in oklch, oklch(13% .045 288 / .78) 0%, oklch(17% .06 296 / .55) 24%, oklch(22% .07 312 / .3) 45%, oklch(40% .08 40 / .06) 62%, transparent 72%)' }} />
          <div aria-hidden className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(180deg in oklch, oklch(13% .045 288 / .84) 0%, oklch(16% .055 295 / .62) 34%, oklch(22% .065 315 / .3) 58%, transparent 82%)' }} />
          <Fireflies />
          <div className="relative flex h-full flex-col p-6 max-md:text-center md:justify-center md:p-10 lg:p-16">
            <p className="eyebrow m-0 mb-3.5">{c.tag}</p>
            <H2 title={band?.title ?? c.title} className="md:max-w-[520px]" />
            <p className="m-0 mt-3 text-[15px] leading-[1.55] text-white/80 md:max-w-[440px] md:text-[16px]">{band?.subtitle ?? c.lead}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 max-md:justify-center md:mt-7">
              {band ? <Btn href={band.cta.href} arrow magnetic>{band.cta.label}</Btn> : <Btn href={c.ctas[0].href} arrow magnetic>{label(c.ctas[0])}</Btn>}
              <Btn href={c.ctas[1].href} variant="glass" external className="!h-[52px] max-md:hidden">{c.ctas[1].label}</Btn>
            </div>
            <a href={c.ctas[1].href} target="_blank" rel="noopener" className="mx-auto mt-3 inline-flex min-h-11 items-center text-[14px] text-white/85 underline decoration-white/40 underline-offset-4 md:hidden">{c.ctas[1].label}</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t, lang, setLang } = useLang()
  const f = t.footer
  return (
    <footer className="relative z-[2] pb-24 pt-[var(--sec)] md:pb-10">
      <div className="wrap">
        <div className="glass-dark flex flex-col gap-6 rounded-[24px] p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:rounded-[999px] lg:px-8 lg:py-5">
          <Logo />
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0">
            {f.links.map((l) => (
              <li key={l.href}><a href={l.href} {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noopener' } : null)} className="nav-link inline-flex min-h-11 items-center !py-0">{l.label}</a></li>
            ))}
          </ul>
          <div className="flex gap-1" role="group" aria-label={t.nav.langMenuLabel}>
            {LANGS.map((l) => (
              <button key={l.code} type="button" onClick={() => { setLang(l.code); window.scrollTo({ top: 0 }) }} aria-pressed={l.code === lang} aria-label={l.name}
                className={`grid size-11 place-items-center rounded-full text-[12px] font-medium tracking-[.06em] transition-colors ${l.code === lang ? 'bg-white text-night' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>{l.short}</button>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-1 px-2 text-[13px] text-text-3 md:flex-row md:justify-between">
          <span>{f.copyright}</span>
          <span>{f.note}</span>
        </div>
      </div>
    </footer>
  )
}

/** Phones: sticky action bar after the hero, hidden over #download (like the site's .mcta). */
export function MobileBar() {
  const { t } = useLang()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => {
      const d = document.getElementById('download')?.getBoundingClientRect()
      const overDl = !!d && d.top < innerHeight && d.bottom > 0
      setShow(window.scrollY > innerHeight * 0.9 && !overDl)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const [a, b] = t.mobileBar.ctas
  return (
    <div aria-label={t.mobileBar.label} role="region"
      className={`fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-full p-1.5 transition-[transform,opacity] duration-300 md:hidden ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[140%] opacity-0'}`}
      style={{ background: 'rgba(18,12,40,.7)', border: '1px solid rgba(255,255,255,.18)', WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}>
      <Btn href={a.href} className="!h-12 flex-1" arrow>{a.label}</Btn>
      <Btn href={b.href} variant="glass" className="flex-1">{b.label}</Btn>
    </div>
  )
}
