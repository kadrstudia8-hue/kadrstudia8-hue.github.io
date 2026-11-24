import { useEffect, useRef } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { More, Rv, RvGroup, SectionHead, Splice } from './ui'
import { useDesktop, useReduced } from '../lib/env'

/** 3 steps = 3 film frames. Desktop: pinned horizontal pass (GSAP ScrollTrigger, scrub .5). Else a vertical stack. */
export function How() {
  const { t, lang } = useLang()
  const h = t.how
  const desktop = useDesktop()
  const reduced = useReduced()
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const pinned = desktop && !reduced

  useEffect(() => {
    if (!pinned) return
    let killed = false
    let revert: (() => void) | undefined
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (killed || !pin.current || !track.current) return
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        const el = track.current!
        const dist = () => Math.max(0, el.scrollWidth - pin.current!.clientWidth)
        gsap.to(el, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: pin.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1 },
        })
      })
      revert = () => ctx.revert()
      // fonts / images change widths
      setTimeout(() => ScrollTrigger.refresh(), 400)
    })
    return () => { killed = true; revert?.() }
  }, [pinned, lang])

  return (
    <section id="how" className={`sec how${pinned ? ' is-pinned' : ''}`} aria-labelledby="how-h" data-scene="film" data-scene-y=".62" data-scene-scale="1.1" data-scene-alpha=".6">
      <Splice />
      <div ref={pin} className="how-pin">
        <div className="wrap">
          <SectionHead n={6} id="how-h" tag={h.tag} title={h.title} lead={h.lead} />
        </div>
        <div className="how-viewport">
          <RvGroup className="how-track" amount={0.1}>
            <div ref={track} className="how-row">
              {h.steps.map((s) => (
                <Rv key={s.n} as="article" className="step">
                  <div className="perf-band" aria-hidden />
                  <div className="step-in">
                    <span className="step-n" aria-hidden>{s.n.padStart(2, '0')}</span>
                    <h3 className="h3">{s.title}</h3>
                    <p>{s.text}</p>
                    <More text={s.details} lang={lang} />
                  </div>
                  <div className="perf-band" aria-hidden />
                </Rv>
              ))}
              <Rv as="figure" className="step step-shot">
                <div className="perf-band" aria-hidden />
                <div className="shot">
                  <img src={h.screenshot.src} alt={h.screenshot.alt} width={h.screenshot.width} height={h.screenshot.height} loading="lazy" />
                </div>
                <figcaption className="shot-cap">
                  <span>{h.caption}</span>
                  <span className="cap">{h.note}</span>
                </figcaption>
                <div className="perf-band" aria-hidden />
              </Rv>
            </div>
          </RvGroup>
        </div>
      </div>
    </section>
  )
}
