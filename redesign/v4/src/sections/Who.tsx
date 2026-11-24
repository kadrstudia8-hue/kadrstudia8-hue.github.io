// WHO (#who): 4 glass tiles. Each: object cell (gen chrome object), title, one line, a mini video.
import { Clapperboard, Disc3, Mic, Video as Cam, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { WhoMedia } from '@kadr/shared/content/index.ts'
import { gen, useT, type GenId } from '../ui/env'
import { Heading } from '../ui/Heading'
import { LIGHTS, Reveal, Section } from '../ui/kit'
import { AutoVideo } from '../ui/media'
import { clean } from '../ui/text'

const OBJ: { id: GenId; Icon: LucideIcon }[] = [
  { id: 'v4-obj-camera.webp', Icon: Cam },
  { id: 'v4-obj-clapper.webp', Icon: Clapperboard },
  { id: 'v4-obj-reel.webp', Icon: Disc3 },
  { id: 'v4-obj-mic.webp', Icon: Mic },
]

function Media({ m }: { m: WhoMedia }) {
  if (m.kind === 'trio') {
    const v = m.videos[0]
    return <AutoVideo src={v.src} poster={v.poster} label={clean(v.label)} />
  }
  if (m.kind === 'video') return <AutoVideo src={m.video.src} poster={m.video.poster} label={clean(m.video.label)} />
  if (m.kind === 'solo') return <img className="vid" src={m.image.src} alt={clean(m.image.alt)} loading="lazy" decoding="async" />
  return (
    <span className="who-pair">
      {m.items.slice(0, 2).map((it) => (
        <span key={it.badge} className="who-pair-i">
          <img className="vid" src={it.image.src} alt={clean(it.image.alt)} loading="lazy" decoding="async" />
        </span>
      ))}
    </span>
  )
}

export function Who() {
  const { t, c } = useT()
  return (
    <Section id="who" className="who">
      <div className="wrap">
        <Heading h={c.who.h} className="head" />
        <ul className="who-grid">
          {t.who.cards.slice(0, 4).map((card, i) => {
            const o = OBJ[i]
            const src = gen(o.id)
            const tile = c.who.tiles[i]
            return (
              <Reveal as="li" key={i} delay={i * 70} className="who-tile glass" style={{ '--c': LIGHTS[[0, 1, 2, 3][i]] } as CSSProperties}>
                <span className="who-media screen">{<Media m={card.media} />}</span>
                <span className="who-obj" aria-hidden>
                  {src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <o.Icon size={52} strokeWidth={1.25} />}
                </span>
                <span className="who-text" data-v4-safe>
                  <span className="h3">{tile?.t ?? clean(card.title)}</span>
                  <span className="muted">{tile?.s ?? clean(card.text)}</span>
                </span>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
