// HERO (#top): sticker, H1, subtitle, typing prompt, one CTA (phones: share), reel link, 3 chips, neon note, real hero video.
import { useEffect, useMemo, useRef, useState } from 'react'
import { CALM, gen, useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import type { H } from '../ui/copy'
import { Cta } from '../ui/cta'
import { Chip, LIGHTS, Scribble, cx } from '../ui/kit'
import { AutoVideo } from '../ui/media'
import { emit } from '../ui/stage'
import { clean } from '../ui/text'

export const PICK_EVENT = 'v4:proof-pick'
export function pickProof(i: number) {
  dispatchEvent(new CustomEvent(PICK_EVENT, { detail: i }))
}

let measureCtx: CanvasRenderingContext2D | null = null
/** The tail of `s` that fits into `w` px (prefixed with «…»), so the prompt never overflows its field. */
function fitTail(s: string, w: number, font: string) {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d')
  const ctx = measureCtx
  if (!ctx || !w) return s
  ctx.font = font
  if (ctx.measureText(s).width <= w) return s
  let lo = 0, hi = s.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (ctx.measureText('…' + s.slice(mid)).width <= w) hi = mid
    else lo = mid + 1
  }
  return '…' + s.slice(lo)
}

function PromptField({ phrases, label, go, onGo, onFirstDone }: { phrases: string[]; label: string; go: string; onGo: (i: number, s: string) => void; onFirstDone: () => void }) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(CALM ? phrases[0]?.length ?? 0 : 0)
  const [w, setW] = useState(0)
  const [font, setFont] = useState('500 16px "Onest Variable", system-ui')
  const box = useRef<HTMLSpanElement>(null)
  const first = useRef(true)
  const doneCb = useRef(onFirstDone)
  doneCb.current = onFirstDone

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setW(el.clientWidth - 4)
      const cs = getComputedStyle(el)
      setFont(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`)
    })
    ro.observe(el)
    document.fonts?.ready.then(() => setW(el.clientWidth - 3))
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (CALM) { doneCb.current(); return }
    const phrase = phrases[i] ?? ''
    let n0 = 0
    let timer = 0
    let dir: 'type' | 'hold' | 'erase' = 'type'
    const step = () => {
      if (dir === 'type') {
        n0++
        setN(n0)
        if (n0 >= phrase.length) {
          dir = 'hold'
          if (first.current) { first.current = false; doneCb.current() }
          timer = window.setTimeout(() => { dir = 'erase'; step() }, 1400)
          return
        }
        timer = window.setTimeout(step, 26)
      } else if (dir === 'erase') {
        n0 = Math.max(0, n0 - 2)
        setN(n0)
        if (n0 === 0) { timer = window.setTimeout(() => setI((x) => (x + 1) % phrases.length), 240); return }
        timer = window.setTimeout(step, 24)
      }
    }
    timer = window.setTimeout(step, i === 0 ? 450 : 200)
    return () => clearTimeout(timer)
  }, [i, phrases])

  const phrase = phrases[i] ?? ''
  const shown = fitTail(phrase.slice(0, n), w, font)
  return (
    <div className="prompt glass" data-v4-safe data-v4-slot="hero-prompt">
      <button type="button" className="prompt-go" aria-label={go} onClick={() => onGo(i, phrase)}>
        <span aria-hidden>➤</span>
      </button>
      <span className="sr-only">{label}: {phrase}</span>
      <span ref={box} className="prompt-txt" aria-hidden>
        <span className="prompt-s">{shown}</span><i className="caret" />
      </span>
    </div>
  )
}

export function Hero() {
  const { t, p, c, lang } = useT()
  const h = p.hero
  const phrases = useMemo(() => t.proof.examples.map((e) => clean(e.prompt)), [t])
  const [lit, setLit] = useState(CALM)
  const [played, setPlayed] = useState(false)
  const room = gen('v4-room.webp')
  const title: H = [clean(h.title[0]?.text ?? ''), clean(h.title.slice(1).map((x) => x.text).join(' '))]

  useEffect(() => {
    let alive = true
    const fire = () => { if (alive) { emit({ type: 'hero:play', phrase: phrases[0] ?? '' }); setPlayed(true) } }
    if (document.fonts?.ready) document.fonts.ready.then(() => requestAnimationFrame(fire)); else fire()
    // DOM story on tier ≤ 1: the screen develops within 2 s at most
    const tm = setTimeout(() => setLit(true), 1600)
    return () => { alive = false; clearTimeout(tm) }
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const onGo = (i: number, s: string) => {
    emit({ type: 'hero:play', phrase: s })
    setPlayed(true)
    pickProof(i)
  }

  return (
    <section id="top" data-v4-section className="hero">
      <div aria-hidden className="hero-beam fb">
        {room && <img className="hero-room" src={room} alt="" decoding="async" />}
        <i className="beam-cone" /><i className="beam-fan" />
      </div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="sticker hero-sticker">{clean(h.sticker)}</span>
          <Heading as="h1" h={title} className="hero-h1" />
          <p className="lead hero-sub" data-v4-safe>{clean(h.subtitle)}</p>
          <PromptField phrases={phrases} label={c.hero.promptLabel} go={c.hero.go} onGo={onGo} onFirstDone={() => setLit(true)} />
          <div className="hero-ctas hero-ctas-desk" data-v4-safe>
            <Cta cta={h.cta} />
            <Cta cta={h.secondary} kind="play" />
          </div>
          <div className="hero-ctas hero-ctas-phone" data-v4-safe>
            <Cta cta={h.mobile.cta} full />
            <p className="hero-cap muted">{clean(h.mobile.caption)}</p>
            <Cta cta={h.secondary} kind="play" />
          </div>
          <ul className="hero-chips">
            {h.chips.map((s, i) => <li key={s}><Chip color={LIGHTS[[0, 2, 1][i] ?? 1]}>{clean(s)}</Chip></li>)}
          </ul>
        </div>
        <div className="hero-side">
          <div className="hero-screen slot" data-v4-slot="hero-screen">
            <div className={cx('screen fb hero-fb', lit && 'lit')}>
              <AutoVideo src={t.hero.video.src} poster={t.hero.video.poster} label={clean(t.hero.video.label)} slot="hero" eager={played} />
            </div>
          </div>
          <div className="hero-note"><Scribble color="var(--pink)" rotate={-4}>{clean(h.note)}</Scribble></div>
        </div>
      </div>
    </section>
  )
}