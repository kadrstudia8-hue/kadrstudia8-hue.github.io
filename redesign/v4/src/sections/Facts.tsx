// FACTS (#facts): one marquee of fact chips, each with its own colour of light.
import { useT } from '../ui/env'
import { Chip, LIGHTS } from '../ui/kit'
import { clean } from '../ui/text'

export function Facts() {
  const { t, c } = useT()
  const seen = new Set<string>()
  const items = [...c.facts, ...(t.hero.badges ?? []).map(clean)].filter((s) => {
    const k = s.toLowerCase().trim()
    if (!k || seen.has(k)) return false
    seen.add(k); return true
  })
  const row = (hidden: boolean) => (
    <ul className="mq-row" aria-hidden={hidden || undefined}>
      {items.map((f, i) => <li key={i}><Chip big color={LIGHTS[i % LIGHTS.length]}>{f}</Chip></li>)}
    </ul>
  )
  return (
    <section id="facts" data-v4-section className="facts" aria-label={c.hero.chip}>
      <div className="mq">
        <div className="mq-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <div aria-hidden className="floor-spectrum fb" />
    </section>
  )
}
