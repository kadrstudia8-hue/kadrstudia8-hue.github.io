// HERO (#top): chip, H1, typing prompt, one CTA, showreel link, neon note, screen slot with the real hero video.
import { useEffect, useMemo, useRef, useState } from 'react'
import { CALM, OS_NAME, useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Btn, Chip, PlayLink, Rich, Scribble, cx } from '../ui/kit'
import { AutoVideo } from '../ui/media'
import { emit } from '../ui/stage'
import { bare, clean, cleanRich } from '../ui/text'

export const PICK_EVENT = 'v4:proof-pick'
export function pickProof(i: number) {
  dispatchEvent(new CustomEvent(PICK_EVENT, { detail: i }))
}

/** Label of an osAware CTA: «Скачать для Mac/Windows» on those desktops. */
export function useCtaLabel() {
  const { t } = useT()
  return (label: string, osAware?: boolean) =>
    bare(osAware && OS_NAME === 'mac' ? t.ui.downloadMac : osAware && OS_NAME === 'win' ? t.ui.downloadWindows : label)
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
    <div className="prompt glass" data-v4-safe>
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
  const { t, c, lang } = useT()
  const ctaLabel = useCtaLabel()
  const phrases = useMemo(() => t.proof.examples.map((e) => clean(e.prompt)), [t])
  const [lit, setLit] = useState(CALM)
  const [copied, setCopied] = useState(false)
  const main = t.hero.ctas.find((x) => x.variant === 'main') ?? t.hero.ctas[0]

  useEffect(() => {
    let alive = true
    const fire = () => { if (alive) emit({ type: 'hero:play', phrase: phrases[0] ?? '' }) }
    if (document.fonts?.ready) document.fonts.ready.then(() => requestAnimationFrame(fire)); else fire()
    // DOM story on tier ≤ 1: the screen develops within 2 s at most
    const tm = setTimeout(() => setLit(true), 1600)
    return () => { alive = false; clearTimeout(tm) }
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const onGo = (i: number, s: string) => {
    emit({ type: 'hero:play', phrase: s })
    pickProof(i)
  }
  const share = async () => {
    const url = location.href.split('#')[0]
    try {
      if (navigator.share) { await navigator.share({ title: t.meta.title, url }); return }
      await navigator.clipboard.writeText(url)
      setCopied(true); setTimeout(() => setCopied(false), 2400)
    } catch { /* cancelled */ }
  }

  return (
    <section id="top" data-v4-section className="hero">
      <div aria-hidden className="hero-beam fb"><i className="beam-cone" /><i className="beam-fan" /></div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <Chip color="var(--lilac)" className="hero-chip">{c.hero.chip}</Chip>
          <Heading as="h1" h={c.hero.h1} className="hero-h1" />
          <PromptField phrases={phrases} label={c.hero.promptLabel} go={c.hero.go} onGo={onGo} onFirstDone={() => setLit(true)} />
          <div className="hero-ctas" data-v4-safe>
            <Btn href={main.href} arrow>{ctaLabel(main.label, main.osAware)}</Btn>
            <PlayLink href="#reel">{c.hero.reel}</PlayLink>
          </div>
          <p className="hero-mobile muted"><Rich value={cleanRich(t.hero.mobileHint)} onShare={share} shareLabel={copied ? clean(t.ui.linkCopied) : undefined} /></p>
        </div>
        <div className="hero-side">
          <div className="hero-screen slot" data-v4-slot="hero-screen">
            <div className={cx('screen fb hero-fb', lit && 'lit')}>
              <AutoVideo src={t.hero.video.src} poster={t.hero.video.poster} label={clean(t.hero.video.label)} slot="hero" />
            </div>
          </div>
          <div className="hero-note"><Scribble color="var(--pink)" rotate={-4}>{c.hero.note}</Scribble></div>
        </div>
      </div>
    </section>
  )
}
