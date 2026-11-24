// REEL (#reel): 25 s showreel with sound, played only on click.
import { Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useOnScreen } from '../ui/media'
import { useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Reveal, Section, useMagnetic } from '../ui/kit'
import { emit, useSceneOwns } from '../ui/stage'
import { clean } from '../ui/text'

export function Reel() {
  const { t, c } = useT()
  const v = t.reel.video
  const ref = useRef<HTMLVideoElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  useMagnetic(btn)
  const [started, setStarted] = useState(false)
  const owns = useSceneOwns()
  const onScreen = useOnScreen(ref)
  // the scene shows the reel as a texture: before the click it runs as a muted loop while on screen
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
    el.loop = false
    el.muted = false
    el.currentTime = 0
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
              src={started || armed ? v.src : undefined}
              muted={!started}
              loop={!started}
              poster={v.poster}
              preload="none"
              playsInline
              controls={started}
              aria-label={clean(v.label)}
              aria-hidden={started ? undefined : true}
              data-v4-video="reel"
              onPlay={() => { if (started) emit({ type: 'reel:play' }) }}
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
