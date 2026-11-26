// PROOF (#proof): 4 real examples as a ribbon of screens; the active one shows its prompt and 3 tags.
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { CALM, FINE, useMedia, useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Chip, LIGHTS, Reveal, Section, cx } from '../ui/kit'
import { AutoVideo } from '../ui/media'
import { emit, scrollToHash } from '../ui/stage'
import { clean } from '../ui/text'
import { PICK_EVENT } from './Hero'
import { toH } from '../ui/copy'
import { Cta, PLAY_REEL } from '../ui/cta'
import { Play } from 'lucide-react'
import { useMagnetic } from '../ui/kit'
import { emit as emitStage, useSceneOwns } from '../ui/stage'
import { useOnScreen } from '../ui/media'

const QUOTES = { ru: ['«', '»'], uk: ['«', '»'], es: ['«', '»'], en: ['“', '”'], de: ['„', '“'] } as const

export function Proof() {
  const { t, c, p, lang } = useT()
  const ex = t.proof.examples
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const wide = useMedia('(min-width: 1280px)')
  const rail = useRef<HTMLDivElement>(null)
  const hoverT = useRef(0)

  const select = (i: number, scroll = true) => {
    const n = (i + ex.length) % ex.length
    setActive(n)
    emit({ type: 'proof:select', index: n })
    if (scroll && !wide) {
      const card = rail.current?.children[n] as HTMLElement | undefined
      const r = rail.current
      if (card && r) r.scrollTo({ left: card.offsetLeft - (r.clientWidth - card.clientWidth) / 2, behavior: CALM ? 'auto' : 'smooth' })
    }
  }

  // picks coming from the hero prompt
  useEffect(() => {
    const on = (e: Event) => { select((e as CustomEvent<number>).detail); scrollToHash('#proof') }
    addEventListener(PICK_EVENT, on)
    return () => removeEventListener(PICK_EVENT, on)
  })

  // phones/tablets: the card in the centre of the snap rail is the active one
  useEffect(() => {
    const r = rail.current
    if (!r || wide) return
    let tm = 0
    const on = () => {
      clearTimeout(tm)
      tm = window.setTimeout(() => {
        const mid = r.scrollLeft + r.clientWidth / 2
        let best = 0, bd = Infinity
        Array.from(r.children).forEach((el, i) => {
          const h = el as HTMLElement
          const d = Math.abs(h.offsetLeft + h.clientWidth / 2 - mid)
          if (d < bd) { bd = d; best = i }
        })
        setActive((a) => { if (a !== best) emit({ type: 'proof:select', index: best }); return best })
      }, 90)
    }
    r.addEventListener('scroll', on, { passive: true })
    return () => { r.removeEventListener('scroll', on); clearTimeout(tm) }
  }, [wide])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); select(active + 1); focusTab(active + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); select(active - 1); focusTab(active - 1) }
  }
  const focusTab = (i: number) => {
    const n = (i + ex.length) % ex.length
    requestAnimationFrame(() => (rail.current?.querySelectorAll<HTMLElement>('[role=tab]')[n])?.focus({ preventScroll: true }))
  }
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (!FINE || CALM) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`)
    e.currentTarget.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`)
  }
  const untilt = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--ry', '0deg'); e.currentTarget.style.setProperty('--rx', '0deg')
  }

  const a = ex[active]
  return (
    <Section id="proof" className="proof">
      <div className="wrap">
        <div className="head proof-head">
          <div className="head-copy">
            {p.proof.tag && <p className="hud head-tag">{clean(p.proof.tag)}</p>}
            <Heading h={toH(clean(p.proof.title))} />
            <p className="lead head-sub" data-v4-safe>{clean(p.proof.subtitle)}</p>
          </div>
          <div className="proof-arrows" data-v4-safe>
            <button type="button" className="round-btn prev" aria-label={c.proof.prev} onClick={() => select(active - 1)}><ChevronLeft size={22} /></button>
            <button type="button" className="round-btn next" aria-label={c.proof.next} onClick={() => select(active + 1)}><ChevronRight size={22} /></button>
          </div>
        </div>
        <div ref={rail} className="proof-rail" role="tablist" aria-label={clean(t.proof.tablistLabel)} onKeyDown={onKey}>
          {ex.map((e, i) => {
            const on = i === active
            return (
              <button
                key={e.video}
                type="button" role="tab" aria-selected={on} aria-controls="proof-panel" tabIndex={on ? 0 : -1}
                className={cx('pcard', on && 'on')}
                style={{ '--c': LIGHTS[(i + 1) % LIGHTS.length] } as CSSProperties}
                onClick={() => select(i)}
                onPointerEnter={() => { clearTimeout(hoverT.current); hoverT.current = window.setTimeout(() => { setHover(i); emit({ type: 'proof:hover', index: i }) }, 120) }}
                onPointerLeave={(ev) => { clearTimeout(hoverT.current); setHover(null); emit({ type: 'proof:hover', index: null }); untilt(ev) }}
                onPointerMove={tilt}
              >
                <span className="pcard-screen slot" data-v4-slot={`proof-${i}`}>
                  <span className="screen fb pcard-fb">
                    <AutoVideo src={e.video} poster={e.poster} label={clean(e.alt)} slot={`proof-${i}`} play={on || hover === i} />
                  </span>
                </span>
                <span className="pcard-label">{clean(e.label)}</span>
              </button>
            )
          })}
        </div>
        <Reveal className="proof-panel" id="proof-panel" data-v4-safe="">
          <div role="tabpanel" aria-live="polite">
            <p className="hud">{clean(p.proof.promptLabel)}</p>
            <p key={active} className="proof-q">{QUOTES[lang][0]}{clean(a.prompt)}{QUOTES[lang][1]}</p>
            <ul className="proof-tags">
              {a.meta.slice(0, 3).map((m, i) => <li key={m}><Chip color={LIGHTS[(i + 2) % LIGHTS.length]}>{clean(m)}</Chip></li>)}
            </ul>
          </div>
        </Reveal>
        <ReelCard />
        <div className="sec-cta" data-v4-safe><Cta cta={p.proof.cta} /></div>
      </div>
    </Section>
  )
}

/** 5th, wide card: the 25 s showreel with sound (plays on click or on «watch the showreel» anywhere on the page). */
function ReelCard() {
  const { t, c, p } = useT()
  const v = t.reel.video
  const ref = useRef<HTMLVideoElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  useMagnetic(btn)
  const [started, setStarted] = useState(false)
  const owns = useSceneOwns()
  const onScreen = useOnScreen(ref)
  const preview = owns && !started
  const [armed, setArmed] = useState(false)
  useEffect(() => { if (preview && onScreen) setArmed(true) }, [preview, onScreen])
  useEffect(() => {
    const el = ref.current
    if (!el || !preview || !armed) return
    if (onScreen) { el.muted = true; el.play().catch(() => {}) } else el.pause()
  }, [preview, onScreen, armed])
  const start = () => {
    const el = ref.current
    if (!el) return
    setStarted(true)
    el.src = v.src
    el.loop = false
    el.muted = false
    el.currentTime = 0
    el.play().catch(() => {})
  }
  useEffect(() => {
    const on = () => { start(); ref.current?.closest('.reel-frame')?.scrollIntoView({ behavior: CALM ? 'auto' : 'smooth', block: 'center' }) }
    addEventListener(PLAY_REEL, on)
    return () => removeEventListener(PLAY_REEL, on)
  })
  return (
    <Reveal className="reel-frame slot" data-v4-slot="reel-screen">
      <div className="screen reel-screen">
        <video
          ref={ref}
          className="vid"
          src={started || armed ? v.src : undefined}
          poster={v.poster}
          preload="none"
          playsInline
          muted={!started}
          loop={!started}
          controls={started}
          aria-label={clean(v.label)}
          aria-hidden={started ? undefined : true}
          data-v4-video="reel"
          onPlay={() => { if (started) emitStage({ type: 'reel:play' }) }}
          onPause={() => emitStage({ type: 'reel:pause' })}
          onEnded={() => emitStage({ type: 'reel:pause' })}
        />
        {!started && (
          <button ref={btn} type="button" className="reel-play" onClick={start} aria-label={`${clean(p.proof.reelCard)}. ${c.proof.play}`}>
            <span className="reel-play-c" aria-hidden><Play size={30} fill="currentColor" strokeWidth={0} /></span>
          </button>
        )}
      </div>
      <p className="reel-cap muted">{clean(p.proof.reelCard)}</p>
    </Reveal>
  )
}