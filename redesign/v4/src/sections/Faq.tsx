// FAQ (#faq): 6 honest answers, first one open; «all questions» and «write to us».
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toH } from '../ui/copy'
import { Cta } from '../ui/cta'
import { useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Reveal, Rich, Section, cx } from '../ui/kit'
import { clean, cleanRich } from '../ui/text'

export function Faq() {
  const { p } = useT()
  const k = p.faq
  const items = k.items.slice(0, 6)
  const [open, setOpen] = useState<number | null>(Math.max(0, items.findIndex((x) => x.open)))
  return (
    <Section id="faq" className="faq">
      <div className="wrap faq-grid">
        <div className="faq-side">
          <div className="head head-copy">
            <Heading h={toH(clean(k.title))} />
            <p className="lead head-sub" data-v4-safe>{clean(k.subtitle)}</p>
          </div>
          <div className="faq-ctas" data-v4-safe>
            <Cta cta={k.cta} />
            <a className="ilink faq-all" href={k.all.href} target="_blank" rel="noopener">{clean(k.all.label)}</a>
          </div>
        </div>
        <Reveal as="div" className="faq-list">
          {items.map((it, i) => {
            const on = open === i
            return (
              <div key={i} className={cx('acc', on && 'on')}>
                <h3 className="acc-h">
                  <button type="button" className="acc-btn" aria-expanded={on} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(on ? null : i)}>
                    <span>{clean(it.q)}</span>
                    <Plus className="acc-plus" size={20} aria-hidden />
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={cx('collapse', on && 'on')}>
                  <div className="collapse-i"><p className="acc-a"><Rich value={cleanRich(it.a)} /></p></div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </Section>
  )
}
