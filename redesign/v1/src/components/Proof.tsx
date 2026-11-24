import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { LoopVideo, Rich, Rv, SectionHead, Splice } from './ui'
import { TiltFrame } from './Hero'
import { useReduced } from '../lib/env'

/** Facts ticker between hero and proof: 38 s per cycle, pauses on hover. */
export function FactsMarquee() {
  const { t } = useLang()
  const reduced = useReduced()
  const items = t.hero.facts
  const one = (
    <div className="mq-track" aria-hidden>
      {[0, 1].map((k) => items.map((f, i) => (
        <span key={`${k}-${i}`} className="mq-item"><Rich value={f} /><span className="mq-star">✦</span></span>
      )))}
    </div>
  )
  return (
    <div className="mq" aria-label={items.map((f) => f.map((p) => (typeof p === 'string' ? p : 'b' in p ? p.b : '')).join('')).join(' · ')} role="marquee">
      <div className={`mq-row${reduced ? '' : ' is-running'}`}>{one}{one}</div>
    </div>
  )
}

/** Typewriter: 22 ms per char (steps). */
function useTyped(text: string) {
  const reduced = useReduced()
  const [n, setN] = useState(reduced ? text.length : 0)
  useEffect(() => {
    if (reduced) { setN(text.length); return }
    setN(0)
    let i = 0
    const id = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(id) }, 22)
    return () => clearInterval(id)
  }, [text, reduced])
  return text.slice(0, n)
}

export function Proof() {
  const { t } = useLang()
  const p = t.proof
  const [i, setI] = useState(0)
  const [shot, setShot] = useState(0)
  const reduced = useReduced()
  const ex = p.examples[Math.min(i, p.examples.length - 1)]
  const typed = useTyped(ex.prompt)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const pick = (k: number) => { if (k === i) return; setI(k); setShot((s) => s + 1) }
  const onKey = (e: KeyboardEvent, k: number) => {
    const n = p.examples.length
    const nx = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (k + 1) % n : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (k - 1 + n) % n : -1
    if (nx < 0) return
    e.preventDefault(); pick(nx); tabs.current[nx]?.focus()
  }

  return (
    <section id="proof" className="sec" aria-labelledby="proof-h" data-scene="dust" data-scene-alpha=".3">
      <Splice />
      <div className="wrap">
        <SectionHead n={2} id="proof-h" tag={p.tag} title={p.title} lead={p.lead} />
        <div className="proof-grid">
          <Rv className="proof-side">
            <div className="missions" role="tablist" aria-label={p.tablistLabel} aria-orientation="vertical">
              {p.examples.map((e, k) => (
                <button key={e.video} ref={(el) => { tabs.current[k] = el }} type="button" role="tab" aria-selected={k === i} aria-controls="proof-panel"
                  tabIndex={k === i ? 0 : -1} className="mission" onClick={() => pick(k)} onKeyDown={(ev) => onKey(ev, k)}>
                  <span className="mission-mark" aria-hidden>◆</span>
                  <span className="mission-n" aria-hidden>{String(k + 1).padStart(2, '0')}</span>
                  <span className="mission-label">{e.label}</span>
                  <span className="mission-meta" aria-hidden>{e.meta[0]}</span>
                </button>
              ))}
            </div>
            <div className="prompt" aria-live="polite">
              <div className="prompt-bar" aria-hidden><span>➤</span><i /><i /><i /></div>
              <p className="prompt-text">
                <span className="sr-only">{ex.prompt}</span>
                <span aria-hidden>{typed}<span className="caret" /></span>
              </p>
              <ul className="prompt-meta">
                {ex.meta.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
          </Rv>
          <Rv className="proof-stage" delay={0.07}>
            <TiltFrame className="filmframe">
              <div id="proof-panel" role="tabpanel" className="filmframe-in">
                <img className="filmframe-blur" src={ex.poster} alt="" aria-hidden />
                <LoopVideo key="proof" src={ex.video} poster={ex.poster} label={ex.alt} fit="contain" className="filmframe-vid" />
                <AnimatePresence>
                  {!reduced && shot > 0 && (
                    <motion.div key={shot} className="chroma-layers" aria-hidden initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.12, ease: 'linear' }}>
                      <i style={{ backgroundImage: `url(${ex.poster})` }} className="ch-r" />
                      <i style={{ backgroundImage: `url(${ex.poster})` }} className="ch-c" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {!reduced && shot > 0 && <div key={`f${shot}`} className="shutter" aria-hidden />}
                <span className="frame-tc" aria-hidden>{String(i + 1).padStart(2, '0')} / {String(p.examples.length).padStart(2, '0')} · {ex.meta[0]}</span>
              </div>
            </TiltFrame>
            <p className="cap proof-note">{p.note}</p>
          </Rv>
        </div>
      </div>
    </section>
  )
}
