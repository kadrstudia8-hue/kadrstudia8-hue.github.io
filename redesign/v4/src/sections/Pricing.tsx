// PRICING (#pricing): trial → founder (centre monolith) → turnkey; honest line, 3-step payment, one quiet cloud line.
import { Check, Download, MousePointerClick, Wallet } from 'lucide-react'
import { useRef, type CSSProperties } from 'react'
import type { PagePlan } from '@kadr/shared/content/index.ts'
import { toH } from '../ui/copy'
import { Cta } from '../ui/cta'
import { useT } from '../ui/env'
import { Heading, useFit } from '../ui/Heading'
import { Reveal, Section, cx } from '../ui/kit'
import { emit } from '../ui/stage'
import { clean } from '../ui/text'

const TONE_LIGHT: Record<PagePlan['tone'], string> = { entry: 'var(--lime)', center: 'var(--lilac)', premium: 'var(--pink)' }
const PAY_ICONS = [Download, MousePointerClick, Wallet]

function Price({ plan }: { plan: PagePlan }) {
  const ref = useRef<HTMLSpanElement>(null)
  useFit(ref, plan.price.display)
  return (
    <span className="price-row">
      <span ref={ref} className="price tnum">{clean(plan.price.display)}</span>
      {plan.price.old && <s className="price-old tnum">{clean(plan.price.old)}</s>}
    </span>
  )
}

export function Pricing() {
  const { p } = useT()
  const k = p.pricing
  const plans = k.plans.slice(0, 3)
  return (
    <Section id="pricing" className="pricing">
      <div className="wrap">
        <div className="head head-copy pricing-head">
          <Heading h={toH(clean(k.title))} />
          <p className="lead head-sub" data-v4-safe>{clean(k.subtitle)}</p>
        </div>
        <ul className={cx('plans', `plans-${plans.length}`)}>
          {plans.map((plan, i) => (
            <Reveal as="li" key={plan.id} delay={i * 140} className={cx('plan', `plan-${plan.tone}`, plan.tone === 'center' && 'hot')}
              style={{ '--c': TONE_LIGHT[plan.tone] } as CSSProperties}>
              <div className="plan-card glass slot" data-v4-slot={`price-${i}`}
                onPointerEnter={() => emit({ type: 'pricing:hover', index: i })}
                onPointerLeave={() => emit({ type: 'pricing:hover', index: null })}>
                <i aria-hidden className="plan-glow fb" />
                <div className="plan-top" data-v4-safe>
                  <span className="hud plan-label">{clean(plan.label)}</span>
                </div>
                <h3 className="h3 plan-name">{clean(plan.name)}</h3>
                <Price plan={plan} />
                {plan.then && <p className="plan-then muted">{clean(plan.then)}</p>}
                <p className="plan-per">{clean(plan.per)}</p>
                <ul className="plan-items">
                  {plan.items.map((it) => <li key={it}><Check size={16} strokeWidth={2.4} aria-hidden /><span>{clean(it)}</span></li>)}
                </ul>
                <div className="plan-cta">
                  <Cta cta={plan.cta} kind={plan.tone === 'entry' ? 'primary' : 'glass'} full />
                  {plan.note && <p className="plan-note muted">{clean(plan.note)}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal className="honest" data-v4-safe="">
          <p className="honest-line">{clean(k.honest)}</p>
          <p className="muted honest-cur">{clean(k.currencyNote)}</p>
        </Reveal>
        <Reveal className="pay" data-v4-safe="">
          <p className="hud pay-t">{clean(k.pay.title)}</p>
          <ol className="pay-steps">
            {k.pay.steps.map((s, i) => {
              const I = PAY_ICONS[i] ?? Wallet
              return (
                <li key={s} className="pay-step edge">
                  <span className="pay-ic" aria-hidden><I size={20} strokeWidth={1.6} /></span>
                  <span className="pay-n hud tnum">{i + 1}</span>
                  <span>{clean(s)}</span>
                </li>
              )
            })}
          </ol>
          <p className="muted pay-help">{clean(k.pay.help)}</p>
        </Reveal>
        <p className="muted cloud-line" data-v4-safe>{clean(k.cloud)}</p>
      </div>
    </Section>
  )
}
