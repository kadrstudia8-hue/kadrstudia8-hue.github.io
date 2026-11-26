// PC (#pc): «your computer» tile and the «KADR Cloud, soon» tile with the GPU farm; technical answer in a disclosure.
import { Apple, Laptop } from 'lucide-react'
import { useState } from 'react'
import { toH } from '../ui/copy'
import { Cta } from '../ui/cta'
import { CALM, gen, useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Chip, LIGHTS, Reveal, Section, cx } from '../ui/kit'
import { AutoVideo } from '../ui/media'
import { clean } from '../ui/text'

function FarmCSS() {
  return (
    <div className="farm" aria-hidden>
      {Array.from({ length: 24 }, (_, i) => (
        <i key={i} className="farm-card" style={{ ['--k' as string]: i % 6, ['--r' as string]: Math.floor(i / 6), ['--c' as string]: LIGHTS[i % 3] }} />
      ))}
    </div>
  )
}

export function Pc() {
  const { p } = useT()
  const k = p.pc
  const [open, setOpen] = useState(false)
  const loop = gen('v4-gpu-farm-loop.mp4')
  const poster = gen('v4-gpu-farm.webp')
  const [own, cloud] = k.tiles
  return (
    <Section id="pc" className="pc">
      <div className="wrap">
        <div className="head head-copy">
          <Heading h={toH(clean(k.title))} />
          <p className="lead head-sub" data-v4-safe>{clean(k.subtitle)}</p>
        </div>
        <div className="pc-grid">
          {own && (
            <Reveal className="pc-tile glass pc-own" data-v4-safe="">
              <span className="pc-ic" aria-hidden><Laptop size={30} strokeWidth={1.4} /><Apple size={26} strokeWidth={1.4} /></span>
              <h3 className="h3">{clean(own.title)}</h3>
              <p className="muted">{clean(own.text)}</p>
            </Reveal>
          )}
          {cloud && (
            <Reveal className="pc-tile glass pc-cloud" delay={100}>
              <div className="pc-cloud-copy" data-v4-safe>
                <div className="pc-cloud-top">
                  <h3 className="h3">{clean(cloud.title)}</h3>
                  {cloud.badge && <span className="sticker">{clean(cloud.badge)}</span>}
                </div>
                <p className="muted">{clean(cloud.text)}</p>
              </div>
              <div className="cloud-stage slot" data-v4-slot="cloud-stage">
                <div className="screen cloud-fb" aria-hidden>
                  {loop && !CALM ? <AutoVideo src={loop} poster={poster ?? undefined} hidden />
                    : poster ? <img src={poster} alt="" aria-hidden className="vid" loading="lazy" decoding="async" />
                    : <FarmCSS />}
                </div>
              </div>
            </Reveal>
          )}
        </div>
        <div className="pc-foot" data-v4-safe>
          <Chip color="var(--pink)">{clean(k.mobileChip)}</Chip>
          <Cta cta={k.cta} onDisclose={() => setOpen(!open)} expanded={open} />
        </div>
        <div id="pc-details" className={cx('collapse', open && 'on')}>
          <div className="collapse-i">
            <ul className="req-notes pc-details">{k.details.map((s) => <li key={s}>{clean(s)}</li>)}</ul>
          </div>
        </div>
      </div>
    </Section>
  )
}
