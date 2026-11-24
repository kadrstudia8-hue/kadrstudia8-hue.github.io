import { Play } from 'lucide-react'
import { useRef, useState } from 'react'
import { useLang } from '@kadr/shared/i18n'
import type { Video } from '@kadr/shared/content/types'
import { Btn, Rv, SectionHead, Splice } from './ui'
import { claimPlayback } from '../lib/env'

/** Poster + play circle; click loads the real file with sound and native controls (inline, not a modal). */
function Screen({ video, className = '', timecode }: { video: Video; className?: string; timecode?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [on, setOn] = useState(false)
  const start = () => {
    const v = ref.current
    if (!v) return
    setOn(true)
    v.src = video.src
    v.muted = false
    claimPlayback(v)
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}) })
  }
  return (
    <div className={`screen ${className}${on ? ' is-on' : ''}`}>
      <video ref={ref} poster={video.poster} width={video.width} height={video.height} playsInline preload="none" controls={on} aria-label={video.label} hidden={!on} />
      {!on && (
        <button type="button" className="screen-hit" onClick={start} aria-label={video.label}>
          <img className="screen-poster" src={video.poster} alt="" width={video.width} height={video.height} loading="lazy" />
          <span className="play-circle"><Play size={20} fill="currentColor" aria-hidden /></span>
        </button>
      )}
      {timecode && !on && <span className="screen-tc" aria-hidden><i className="rec" />00:00 / {timecode}</span>}
      <span className="screen-corner tl" aria-hidden /><span className="screen-corner tr" aria-hidden /><span className="screen-corner bl" aria-hidden /><span className="screen-corner br" aria-hidden />
    </div>
  )
}

export function Reel() {
  const { t } = useLang()
  const r = t.reel
  return (
    <section id="reel" className="sec reel" aria-labelledby="reel-h" data-scene="frame" data-scene-y=".52" data-scene-scale="1.55" data-scene-mscale="1.1" data-scene-alpha=".8">
      <Splice />
      <div className="beam beam-reel" aria-hidden />
      <div className="wrap">
        <SectionHead n={3} id="reel-h" tag={r.tag} title={r.title} lead={r.lead} center />
        <Rv className="reel-stage">
          <Screen video={r.video} className="screen-reel" />
          <div className="screen-caps cap"><span>{r.captions[0]}</span><span className="mono-label">{r.captions[1]}</span></div>
        </Rv>
        <Rv className="cta-row is-center reel-ctas">
          {r.ctas.map((c) => <Btn key={c.label} variant={c.variant === 'main' ? 'primary' : 'ghost'} href={c.href} arrow={c.variant === 'main'}>{c.label}</Btn>)}
        </Rv>
      </div>
    </section>
  )
}

export function Tutorial() {
  const { t } = useLang()
  const r = t.tutorial
  const tc = r.captions[0].match(/\d+:\d\d/)?.[0]
  return (
    <section id="tutorial" className="sec" aria-labelledby="tut-h" data-scene="dust" data-scene-x=".3" data-scene-alpha=".3">
      <Splice />
      <div className="wrap tut-grid">
        <SectionHead n={4} id="tut-h" tag={r.tag} title={r.title} lead={r.lead} />
        <Rv className="tut-stage" delay={0.07}>
          <Screen video={r.video} className="screen-tut" timecode={tc} />
          <div className="screen-caps cap"><span>{r.captions[0]}</span><span className="mono-label">{r.captions[1]}</span></div>
        </Rv>
      </div>
    </section>
  )
}
