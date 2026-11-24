// HOW (#how): three steps over a pinned timeline. Playhead and tracks follow scroll (stageInput.pin.how).
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { stageInput } from '../engine/contract'
import { CALM, STILL, useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { PlayLink, Reveal, cx } from '../ui/kit'
import { VideoModal } from '../ui/media'
import { onFrame } from '../ui/stage'
import { clean } from '../ui/text'

/** Must match the CSS media query that pins .how-pin. */
const PIN_QUERY = '(min-width: 768px) and (min-height: 720px)'
const TRACK_COLORS =['var(--lilac)', 'var(--pink)', 'var(--cyan)', 'var(--amber)', 'var(--lime)']
/** Which step lights which track: 1 script+voice, 2 frames, 3 music+subtitles. */
const TRACK_STEP = [0, 0, 1, 2, 2]
/** Clips per track as [start%, width%]. */
const CLIPS: [number, number][][] = [
  [[0, 22], [24, 9]],
  [[3, 18], [23, 10]],
  [[34, 12], [47, 9], [57, 11]],
  [[68, 30]],
  [[70, 8], [79, 9], [89, 9]],
]

export function How() {
  const { t, c } = useT()
  const root = useRef<HTMLElement>(null)
  const [step, setStep] = useState(STILL ? 2 : 0)
  const [tut, setTut] = useState(false)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (STILL) { el.style.setProperty('--p', '1'); return }
    let last = -1, lastStep = -1
    const mq = matchMedia(PIN_QUERY)
    return onFrame(() => {
      const pinned = mq.matches
      let p: number
      if (pinned) p = stageInput.pin.how
      else {
        const r = el.getBoundingClientRect()
        p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / Math.max(1, r.height * 0.8)))
      }
      if (CALM) p = 1
      if (Math.abs(p - last) > 0.001) { last = p; el.style.setProperty('--p', p.toFixed(4)) }
      const s = p < 0.34 ? 0 : p < 0.67 ? 1 : 2
      if (s !== lastStep) { lastStep = s; setStep(s) }
    })
  }, [])

  return (
    <section id="how" data-v4-section ref={root} className="how" style={{ '--p': 0 } as CSSProperties}>
      <div className="how-pin">
        <div className="wrap how-inner">
          <div className="how-head head">
            <Heading h={c.how.h} />
            <PlayLink onClick={() => setTut(true)} className="how-tut">{c.how.tutorial}</PlayLink>
          </div>
          <ol className="how-steps">
            {c.how.steps.map((s, i) => (
              <Reveal as="li" key={i} delay={i * 80} className={cx('how-step', i <= step && 'on', i === step && 'now')} data-v4-safe="">
                <span className="hud tnum">0{i + 1}</span>
                <h3 className="h3">{s.t}</h3>
                <p className="muted">{s.s}</p>
                <div className="mini-track" aria-hidden>
                  {TRACK_STEP.map((st, k) => st === i && <i key={k} style={{ '--c': TRACK_COLORS[k] } as CSSProperties} />)}
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="tl slot" data-v4-slot="how-track" aria-hidden>
            {c.how.tracks.map((name, k) => (
              <div key={k} className={cx('tl-row', TRACK_STEP[k] <= step && 'lit')} style={{ '--c': TRACK_COLORS[k] } as CSSProperties}>
                <span className="tl-name hud">{name}</span>
                <span className="tl-lane">
                  {CLIPS[k].map(([s, w], j) => <i key={j} className="tl-clip" style={{ left: `${s}%`, width: `${w}%` }} />)}
                </span>
              </div>
            ))}
            <i className="tl-head" />
          </div>
        </div>
      </div>
      <VideoModal open={tut} onClose={() => setTut(false)} src={t.tutorial.video.src} poster={t.tutorial.video.poster} label={clean(t.tutorial.video.label)} closeLabel={c.how.close} />
    </section>
  )
}
