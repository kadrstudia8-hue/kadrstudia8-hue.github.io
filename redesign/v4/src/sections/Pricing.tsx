// PRICING (#pricing): three glass monoliths, extras in one line, legal links.
import { Check } from 'lucide-react'
import { useRef, type CSSProperties } from 'react'
import type { Plan } from '@kadr/shared/content/index.ts'
import { useT } from '../ui/env'
import { Heading, useFit } from '../ui/Heading'
import { Btn, Reveal, Section, cx } from '../ui/kit'
import { emit } from '../ui/stage'
import { bare, clean } from '../ui/text'

const COLORS = ['var(--lilac)', 'var(--lime)', 'var(--pink)']

function Price({ p }: { p: Plan }) {
  const ref = useRef<HTMLSpanElement>(null)
  useFit(ref, p.price.display)
  const long = p.price.display.length > 4
  return (
    <span className="price-row">
      <span ref={ref} className={cx('price tnum', long && 'price-word')}>{clean(p.price.display)}</span>
      {p.price.old && <s className="price-old tnum">{p.price.old}</s>}
    </span>
  )
}

export function Pricing() {
  const { t, c } = useT()
  const plans = t.pricing.plans.slice(0, 3)
  const extras = t.pricing.extras.map((e) => clean(e.title)).join(' · ')
  return (
    <Section id="pricing" className="pricing">
      <div className="wrap">
        <Heading h={c.pricing.h} className="head pricing-h" />
        <ul className={cx('plans', `plans-${plans.length}`)}>
          {plans.map((p, i) => (
            <Reveal as="li" key={p.name} delay={i * 140}
              className={cx('plan', p.highlight && 'hot')}
              style={{ '--c': COLORS[i % 3] } as CSSProperties}>
              <div className="plan-card glass slot" data-v4-slot={`price-${i}`}
                onPointerEnter={() => emit({ type: 'pricing:hover', index: i })}
                onPointerLeave={() => emit({ type: 'pricing:hover', index: null })}>
                <i aria-hidden className="plan-glow fb" />
                <div className="plan-top" data-v4-safe>
                  <span className="hud plan-name">{clean(p.name)}</span>
                  {p.badge && <span className="sticker tnum" aria-hidden>{p.badge}</span>}
                </div>
                {p.highlight && t.pricing.highlight && <p className="plan-hl">{clean(t.pricing.highlight)}</p>}
                <Price p={p} />
                <p className="plan-per muted">{clean(p.per)}</p>
                <ul className="plan-items">
                  {p.items.slice(0, 3).map((it) => <li key={it}><Check size={16} strokeWidth={2.4} aria-hidden /><span>{clean(it)}</span></li>)}
                </ul>
                <div className="plan-cta">
                  <Btn kind={p.highlight ? 'primary' : 'glass'} href={p.cta.href} className="w-full" arrow={p.highlight}>{bare(p.cta.label)}</Btn>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal className="plans-foot" data-v4-safe="">
          <p className="muted"><span className="hud">{c.pricing.extras}</span> {extras}</p>
          <p className="plans-legal">
            {t.pricing.legal.map((l) => <a key={l.href} className="ilink" href={l.href} target="_blank" rel="noopener">{clean(l.label)}</a>)}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
