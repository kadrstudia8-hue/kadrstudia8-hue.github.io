// FAQ (#faq): accordion, answers in full (dashes cleaned).
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Reveal, Rich, Section, cx } from '../ui/kit'
import { clean, cleanRich } from '../ui/text'

export function Faq() {
  const { t, c } = useT()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq" className="faq">
      <div className="wrap faq-grid">
        <div className="faq-side"><Heading h={c.faq.h} className="head" /></div>
        <Reveal as="div" className="faq-list">
          {t.faq.items.map((it, i) => {
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
                  <div className="collapse-i"><p className="acc-a">{<Rich value={cleanRich(it.a)} />}</p></div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </Section>
  )
}
