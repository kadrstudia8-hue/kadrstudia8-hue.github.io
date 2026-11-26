// WHO (#who): 4 glass switch cards (each with a chrome object) change one big example; 6 style frames below; one CTA.
import { Clapperboard, Disc3, Mic, Video as Cam, type LucideIcon } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { WhoMedia } from '@kadr/shared/content/index.ts'
import { toH } from '../ui/copy'
import { Cta } from '../ui/cta'
import { gen, useT, type GenId } from '../ui/env'
import { Heading } from '../ui/Heading'
import { LIGHTS, Reveal, Section, cx } from '../ui/kit'
import { AutoVideo } from '../ui/media'
import { emit } from '../ui/stage'
import { clean } from '../ui/text'

const OBJ: { id: GenId; Icon: LucideIcon }[] = [
  { id: 'v4-obj-camera.webp', Icon: Cam },
  { id: 'v4-obj-clapper.webp', Icon: Clapperboard },
  { id: 'v4-obj-reel.webp', Icon: Disc3 },
  { id: 'v4-obj-mic.webp', Icon: Mic },
]

/** The big example: vertical clips side by side, a vertical still centred, a film full frame, two subtitle frames. */
function Stage({ m }: { m: WhoMedia }) {
  if (m.kind === 'trio') {
    return (
      <span className="who-trio">
        {m.videos.slice(0, 3).map((v) => <span key={v.src} className="who-cell"><AutoVideo src={v.src} poster={v.poster} label={clean(v.label)} /></span>)}
      </span>
    )
  }
  if (m.kind === 'video') return <AutoVideo src={m.video.src} poster={m.video.poster} label={clean(m.video.label)} />
  if (m.kind === 'solo') {
    return (
      <span className="who-solo">
        <img className="vid who-solo-bg" src={m.image.src} alt="" aria-hidden loading="lazy" decoding="async" />
        <img className="vid vid-contain who-solo-fg" src={m.image.src} alt={clean(m.image.alt)} loading="lazy" decoding="async" />
      </span>
    )
  }
  return (
    <span className="who-pair">
      {m.items.slice(0, 2).map((it) => (
        <span key={it.badge} className="who-cell">
          <img className="vid" src={it.image.src} alt={clean(it.image.alt)} loading="lazy" decoding="async" />
        </span>
      ))}
    </span>
  )
}

export function Who() {
  const { t, p, c } = useT()
  const [i, setI] = useState(0)
  const cards = t.who.cards.slice(0, 4)
  const styles = t.looks.styles.slice(0, 6)
  const prism = gen('v4-prism-macro.webp')
  return (
    <Section id="who" className="who">
      <div className="wrap">
        <div className="head head-copy">
          <Heading h={toH(clean(p.who.title))} />
          <p className="lead head-sub" data-v4-safe>{clean(p.who.subtitle)}</p>
        </div>
        <div className="who-grid">
          <ul className="who-list" role="group" aria-label={c.who.pick}>
            {p.who.cards.slice(0, 4).map((card, n) => {
              const o = OBJ[n]
              const src = gen(o.id)
              return (
                <Reveal as="li" key={n} delay={n * 70}>
                  <button type="button" className={cx('who-tile glass', n === i && 'on')} aria-pressed={n === i}
                    style={{ '--c': LIGHTS[n % LIGHTS.length] } as CSSProperties} onClick={() => setI(n)}>
                    <span className="who-obj" aria-hidden>
                      {src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <o.Icon size={40} strokeWidth={1.25} />}
                    </span>
                    <span className="who-text">
                      <span className="h3">{clean(card.title)}</span>
                      <span className="muted">{clean(card.text)}</span>
                    </span>
                  </button>
                </Reveal>
              )
            })}
          </ul>
          <Reveal className="who-stage screen" key={i}>
            {cards[i] && <Stage m={cards[i].media} />}
          </Reveal>
        </div>
        <div className="looks">
          <div className="looks-head">
            <div className="looks-prism slot" data-v4-slot="prism" aria-hidden>
              <div className="prism-fb">{prism ? <img src={prism} alt="" loading="lazy" decoding="async" /> : <i className="prism-css" />}</div>
            </div>
            <p className="h3 looks-title" data-v4-safe>{clean(p.who.stylesTitle)}</p>
          </div>
          <ul className="polaroids">
            {styles.map((s, n) => (
              <Reveal as="li" key={s.image.src} delay={n * 50} className="polaroid">
                <button type="button" className="polaroid-b" onClick={() => emit({ type: 'looks:select', index: n })}>
                  <span className="polaroid-img"><img className="vid" src={s.image.src} alt={clean(s.image.alt)} loading="lazy" decoding="async" /></span>
                  <span className="polaroid-cap">{clean(s.name)}</span>
                </button>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="sec-cta" data-v4-safe><Cta cta={p.who.cta} /></div>
      </div>
    </Section>
  )
}
