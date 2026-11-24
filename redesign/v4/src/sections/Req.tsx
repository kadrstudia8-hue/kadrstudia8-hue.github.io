// REQ (#req): three hardware columns, two lines each; «know in advance» opens a list.
import { Cpu, Laptop, MonitorSmartphone, Plus } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Reveal, Section, cx } from '../ui/kit'
import { clean } from '../ui/text'

const ICONS = [Cpu, Laptop, MonitorSmartphone]
const COLORS = ['var(--lime)', 'var(--pink)', 'var(--lilac)']

export function Req() {
  const { t, c } = useT()
  const [open, setOpen] = useState(false)
  return (
    <Section id="req" className="req">
      <div className="wrap">
        <Heading h={c.req.h} className="head" />
        <ul className="req-grid">
          {c.req.cols.map((col, i) => {
            const I = ICONS[i]
            return (
              <Reveal as="li" key={i} delay={i * 80} className="req-col edge" style={{ '--c': COLORS[i] } as CSSProperties} data-v4-safe="">
                <span className="req-ic" aria-hidden><I size={22} strokeWidth={1.6} /></span>
                <h3 className="h3">{col.t}</h3>
                <p className="muted">{col.l[0]}</p>
                <p className="req-l2">{col.l[1]}</p>
              </Reveal>
            )
          })}
        </ul>
        <div className="req-more">
          <button type="button" className={cx('more-btn', open && 'on')} aria-expanded={open} aria-controls="req-notes" onClick={() => setOpen(!open)}>
            <Plus size={18} aria-hidden className="more-plus" />
            <span>{clean(t.req.notes.title)}</span>
          </button>
          <div id="req-notes" className={cx('collapse', open && 'on')}>
            <div className="collapse-i">
              <ul className="req-notes">
                {t.req.notes.items.map((s, i) => <li key={i}>{clean(s)}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
