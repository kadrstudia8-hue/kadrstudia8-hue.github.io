// LOOKS (#looks): 6 style frames + switcher; the prism turns on every change.
import { useState } from 'react'
import { gen, useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Chip, LIGHTS, Reveal, Section, cx } from '../ui/kit'
import { emit } from '../ui/stage'
import { clean } from '../ui/text'

export function Looks() {
  const { t, c } = useT()
  const [i, setI] = useState(0)
  const styles = t.looks.styles.slice(0, 6)
  const prism = gen('v4-prism-macro.webp')
  const pick = (n: number) => { setI(n); emit({ type: 'looks:select', index: n }) }
  return (
    <Section id="looks" className="looks">
      <div className="wrap looks-grid">
        <div className="looks-side">
          <Heading h={c.looks.h} className="head" />
          <Reveal className="looks-switch" data-v4-safe="">
            <ul role="group" aria-label={c.looks.label}>
              {styles.map((s, n) => (
                <li key={s.image.src}><Chip onClick={() => pick(n)} active={n === i} color={LIGHTS[n % LIGHTS.length]}>{clean(s.name)}</Chip></li>
              ))}
            </ul>
          </Reveal>
          <div className="looks-prism slot" data-v4-slot="prism" aria-hidden>
            <div className="fb prism-fb" style={{ transform: `rotate(${i * 60}deg)` }}>
              {prism ? <img src={prism} alt="" loading="lazy" decoding="async" /> : <i className="prism-css" />}
            </div>
          </div>
        </div>
        <Reveal className="looks-frame screen">
          {styles.map((s, n) => (
            <img key={s.image.src} src={s.image.src} alt={clean(s.image.alt)} className={cx('vid looks-img', n === i && 'on')} loading="lazy" decoding="async" aria-hidden={n === i ? undefined : true} />
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
