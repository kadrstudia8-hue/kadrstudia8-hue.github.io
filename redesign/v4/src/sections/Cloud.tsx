// CLOUD (#cloud): «our GPUs work for you». Left: copy + one CTA. Right: render farm (scene or loop/poster/CSS).
import { useT, gen, CALM } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Btn, Chip, LIGHTS, Reveal, Section } from '../ui/kit'
import { AutoVideo } from '../ui/media'
import { bare, clean } from '../ui/text'

function FarmCSS() {
  return (
    <div className="farm" aria-hidden>
      {Array.from({ length: 24 }, (_, i) => (
        <i key={i} className="farm-card" style={{ ['--k' as string]: i % 6, ['--r' as string]: Math.floor(i / 6), ['--c' as string]: LIGHTS[i % 3] }} />
      ))}
    </div>
  )
}

export function Cloud() {
  const { t, c } = useT()
  // content bullets are full sentences; chips stay short (V4 copy)
  const chips = c.cloud.chips
  const cta = t.cloud?.cta ? bare(t.cloud.cta.label) : c.cloud.cta
  const href = t.cloud?.cta?.href ?? '#download'
  const loop = gen('v4-gpu-farm-loop.mp4')
  const poster = gen('v4-gpu-farm.webp')
  return (
    <Section id="cloud" className="cloud">
      <div className="wrap cloud-grid">
        <div className="cloud-copy">
          <Heading h={c.cloud.h} className="head" />
          <Reveal as="p" className="lead" data-v4-safe="">{c.cloud.lead}</Reveal>
          <Reveal className="cloud-chips" delay={80}>
            <ul>{chips.map((s, i) => <li key={s}><Chip color={LIGHTS[[0, 2, 1][i] ?? 0]}>{s}</Chip></li>)}</ul>
          </Reveal>
          <Reveal delay={160} data-v4-safe=""><Btn href={href} arrow>{cta}</Btn></Reveal>
        </div>
        <div className="cloud-stage slot" data-v4-slot="cloud-stage">
          <div className="screen fb cloud-fb" aria-label={c.cloud.stage} role="img">
            {loop && !CALM ? <AutoVideo src={loop} poster={poster ?? undefined} hidden />
              : poster ? <img src={poster} alt="" aria-hidden className="vid" loading="lazy" decoding="async" />
              : <FarmCSS />}
          </div>
        </div>
      </div>
    </Section>
  )
}
