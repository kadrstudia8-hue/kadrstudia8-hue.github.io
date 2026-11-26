// HOW (#how): three one-line steps with light tracks, the real app screenshot in a monitor, the video tutorial.
import { useEffect, useState, type CSSProperties } from 'react'
import { toH } from '../ui/copy'
import { Cta, PLAY_TUTORIAL } from '../ui/cta'
import { useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Reveal, Scribble, Section } from '../ui/kit'
import { VideoModal } from '../ui/media'
import { clean } from '../ui/text'

/** Step → tracks it lights (script+voice, frames, music+subtitles). */
const STEP_LIGHTS = [['var(--lilac)', 'var(--pink)'], ['var(--cyan)'], ['var(--amber)', 'var(--lime)']]

export function How() {
  const { t, p, c } = useT()
  const [tut, setTut] = useState(false)
  useEffect(() => {
    const on = () => setTut(true)
    addEventListener(PLAY_TUTORIAL, on)
    return () => removeEventListener(PLAY_TUTORIAL, on)
  }, [])
  const shot = t.how.screenshot
  return (
    <Section id="how" className="how">
      <div className="wrap how-grid">
        <div className="how-copy">
          <div className="head head-copy">
            <Heading h={toH(clean(p.how.title))} />
            <p className="lead head-sub" data-v4-safe>{clean(p.how.subtitle)}</p>
          </div>
          <ol className="how-steps slot" data-v4-slot="how-track">
            {p.how.steps.map((s, i) => (
              <Reveal as="li" key={i} delay={i * 80} className="how-step" data-v4-safe="">
                <span className="hud tnum">0{i + 1}</span>
                <span className="h3">{clean(s)}</span>
                <span className="mini-track" aria-hidden>
                  {STEP_LIGHTS[i]?.map((col, k) => <i key={k} style={{ '--c': col } as CSSProperties} />)}
                </span>
              </Reveal>
            ))}
          </ol>
          <div className="sec-cta" data-v4-safe><Cta cta={p.how.cta} /></div>
        </div>
        <Reveal className="how-shot">
          <figure className="monitor">
            <span className="monitor-screen screen">
              <img className="vid" src={shot.src} alt={clean(shot.alt)} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
            </span>
            <figcaption className="hud monitor-cap">{clean(p.how.screenshotCaption)}</figcaption>
          </figure>
          <div className="how-note"><Scribble color="var(--lilac)" rotate={3}>{clean(p.how.note)}</Scribble></div>
        </Reveal>
      </div>
      <VideoModal open={tut} onClose={() => setTut(false)} src={t.tutorial.video.src} poster={t.tutorial.video.poster} label={clean(t.tutorial.video.label)} closeLabel={c.nav.close} />
    </Section>
  )
}
