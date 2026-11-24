// FEATURES (#features): 12 chips; a click opens one line of description under them.
import { useState } from 'react'
import { useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Chip, LIGHTS, Reveal, Section, cx } from '../ui/kit'
import { clean } from '../ui/text'

export function Features() {
  const { t, c } = useT()
  const [open, setOpen] = useState<number | null>(null)
  const items = t.features.items.slice(0, 12)
  const cur = open === null ? null : items[open]
  return (
    <Section id="features" className="features">
      <div className="wrap">
        <Heading h={c.features.h} className="head" />
        <Reveal className={cx('feat', open !== null && 'has-open')}>
          <ul className="feat-chips">
            {items.map((f, i) => (
              <li key={i} className={cx(open === i && 'cur')}>
                <Chip big onClick={() => setOpen(open === i ? null : i)} expanded={open === i} controls="feat-desc" color={LIGHTS[i % LIGHTS.length]} active={open === i}>
                  {clean(f.title)}
                </Chip>
              </li>
            ))}
          </ul>
          <div id="feat-desc" className={cx('feat-desc', cur && 'on')} aria-live="polite" data-v4-safe>
            <div className="feat-desc-i">{cur && <p>{clean(cur.text)}</p>}</div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
