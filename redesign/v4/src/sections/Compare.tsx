// COMPARE (#compare): «before» is six dim struck-out jobs, «with KADR» is one line lit by the beam. Done with light, not paint.
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toH } from '../ui/copy'
import { Cta } from '../ui/cta'
import { useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Reveal, Section, cx } from '../ui/kit'
import { clean } from '../ui/text'

export function Compare() {
  const { p } = useT()
  const k = p.compare
  const [more, setMore] = useState(false)
  return (
    <Section id="compare" className="compare">
      <div className="wrap">
        <div className="head head-copy">
          <Heading h={toH(clean(k.title))} />
          <p className="lead head-sub" data-v4-safe>{clean(k.subtitle)}</p>
        </div>
        <div className="cmp-grid">
          <Reveal className="cmp-before edge" data-v4-safe="">
            <p className="hud">{clean(k.before.title)}</p>
            <ul className="cmp-jobs">
              {k.before.items.map((s) => <li key={s}><s>{clean(s)}</s></li>)}
            </ul>
          </Reveal>
          <Reveal className="cmp-after" delay={120}>
            <div className="cmp-after-in" data-v4-safe>
              <p className="hud cmp-after-t">{clean(k.after.title)}</p>
              <p className="cmp-line">{clean(k.after.text)}</p>
              <p className="muted cmp-note">{clean(k.note)}</p>
              <Cta cta={k.cta} />
            </div>
          </Reveal>
        </div>
        <div className="req-more">
          <button type="button" className={cx('more-btn', more && 'on')} aria-expanded={more} aria-controls="cmp-more" onClick={() => setMore(!more)}>
            <Plus size={18} aria-hidden className="more-plus" />
            <span>{clean(k.more.label)}</span>
          </button>
          <div id="cmp-more" className={cx('collapse', more && 'on')}>
            <div className="collapse-i">
              <ul className="req-notes cmp-more">{k.more.items.map((s) => <li key={s}>{clean(s)}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
