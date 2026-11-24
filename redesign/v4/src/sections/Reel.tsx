// REEL (#reel): 25 s showreel with sound, played only on click.
import { Play } from 'lucide-react'
import { useRef, useState } from 'react'
import { useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Reveal, Section, useMagnetic } from '../ui/kit'
import { emit } from '../ui/stage'
import { clean } from '../ui/text'

export function Reel() {
  const { t, c } = useT()
  const v = t.reel.video
  const ref = useRef<HTMLVideoElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  useMagnetic(btn)
  const [started, setStarted] = useState(false)
  const start = () => {
    const el = ref.current
    if (!el) return
    setStarted(true)
    el.muted = false
    el.play().catch(() => {})
  }
  return (
    <Section id="reel" className="reel">
      <div className="wrap">
        <Heading h={c.reel.h} className="head reel-h" />
        <Reveal className="reel-frame slot" data-v4-slot="reel-screen">
          <div className="screen reel-screen">
            <video
              ref={ref}
              className="vid"
              src={started ? v.src : undefined}
              poster={v.poster}
              preload="none"
              playsInline
              controls={started}
              aria-label={clean(v.label)}
              aria-hidden={started ? undefined : true}
              data-v4-video="reel"
              onPlay={() => emit({ type: 'reel:play' })}
              onPause={() => emit({ type: 'reel:pause' })}
              onEnded={() => emit({ type: 'reel:pause' })}
            />
            {!started && (
              <button ref={btn} type="button" className="reel-play" onClick={start} aria-label={c.reel.play}>
                <span className="reel-play-c" aria-hidden><Play size={30} fill="currentColor" strokeWidth={0} /></span>
              </button>
            )}
          </div>
        </Reveal>
        <Reveal className="reel-cap" data-v4-safe="">
          <span className="hud">{clean(t.reel.captions[1])}</span>
          <span className="muted">{c.reel.play}</span>
        </Reveal>
      </div>
    </Section>
  )
}
