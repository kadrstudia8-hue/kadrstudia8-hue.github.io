import {
  ArrowDown, Captions, Check, Clapperboard, Cpu, FileText, Gauge, ImageIcon, Info, KeyRound, Languages, Laptop, Mic, Monitor,
  Music, PenLine, Power, Scissors, ShieldCheck, Sparkles, UserRound, type LucideIcon,
} from 'lucide-react'
import { m as motion } from 'motion/react'
import { useReducedMotion } from '../lib/motion'
import { useId, useState } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { Btn } from '../lib/Btn'
import { Rich } from '../lib/Rich'
import { glareMove } from '../lib/useCursorVars'
import { cardItem, cardList, H2, Head, More, Rise } from '../lib/ui'

export function Req() {
  const { t } = useLang()
  const r = t.req
  const reduced = useReducedMotion()
  const tierIcons = [Cpu, Laptop, Monitor]
  const noteIcons: LucideIcon[] = [Gauge, Power, KeyRound, ShieldCheck, Info]
  return (
    <section id="req" className="sec relative z-[2]">
      <div className="wrap">
        <Head tag={r.tag} title={r.title} lead={r.lead} />
        <motion.ul className="m-0 mt-8 grid list-none gap-4 p-0 md:mt-10 md:grid-cols-3 md:gap-6 lg:mt-[34px]"
          initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: .25 }} variants={cardList}>
          {r.tiers.map((tier, i) => {
            const I = tierIcons[i] ?? Monitor
            return (
              <motion.li key={tier.who} variants={cardItem} onPointerMove={glareMove} className="glass rim glare lift relative flex flex-col p-6 md:p-7">
                <span className="rivet" aria-hidden />
                <span className="icon-c mb-6"><I size={26} strokeWidth={1.75} aria-hidden /></span>
                <p className="eyebrow m-0 !tracking-[.16em] text-white/60">{tier.who}</p>
                <h3 className="m-0 mt-2 text-[18px] font-semibold leading-[1.25] text-white">{tier.title}</h3>
                {tier.paragraphs.map((p) => <p key={p} className="m-0 mt-3 text-[14px] leading-[1.6] text-text-2">{p}</p>)}
                <More text={tier.details} />
              </motion.li>
            )
          })}
        </motion.ul>
        <Rise className="glass rim mt-6 !rounded-[24px] p-5 md:p-7 lg:!rounded-[32px] lg:p-8">
          <h3 className="m-0 text-[18px] font-semibold text-white">{r.notes.title}</h3>
          <ul className={`m-0 mt-5 grid list-none gap-5 p-0 md:grid-cols-2 ${r.notes.items.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} lg:gap-0`}>
            {r.notes.items.map((it, i) => {
              const I = noteIcons[i] ?? Info
              return (
                <li key={it} className="relative flex gap-4 lg:px-6 lg:first:pl-0">
                  {i > 0 && <span aria-hidden className="absolute left-0 top-1 hidden h-14 w-px bg-white/14 lg:block" />}
                  <span className="icon-c !size-11" style={i === 2 ? { color: '#FFB56B' } : undefined}><I size={20} strokeWidth={1.75} aria-hidden /></span>
                  <p className="m-0 text-[14px] leading-[1.6] text-text-2">{it}</p>
                </li>
              )
            })}
          </ul>
        </Rise>
      </div>
    </section>
  )
}

const FEATURE_ICONS: Record<string, LucideIcon> = {
  '✎': PenLine, '♪': Mic, '▣': ImageIcon, '▶': Clapperboard, '♫': Music, 'Aa': Captions, '✂': Scissors,
  '☺': UserRound, '文': Languages, '✉': FileText, '✦': Sparkles, '⚿': KeyRound,
}

export function Features() {
  const { t } = useLang()
  const f = t.features
  const reduced = useReducedMotion()
  return (
    <section id="features" className="sec relative z-[2]">
      <div className="wrap">
        <Head tag={f.tag} title={f.title} lead={f.lead} />
        <motion.ul className="m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 md:mt-10 md:gap-4 lg:mt-[34px] lg:grid-cols-4 lg:gap-6"
          initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: .1 }} variants={{ show: { transition: { staggerChildren: .05 } } }}>
          {f.items.map((it, i) => {
            const I = FEATURE_ICONS[it.icon] ?? Sparkles
            return (
              <motion.li key={it.title} variants={cardItem} onPointerMove={glareMove}
                className="glass glare lift group relative flex gap-4 !rounded-[20px] p-5 lg:flex-col lg:gap-0 lg:p-6">
                <span className="icon-c !size-12 transition-transform duration-300 ease-out group-hover:scale-110" style={i % 4 === 2 ? { color: '#FFB56B' } : undefined}>
                  <I size={22} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0">
                  <h3 className="m-0 text-[16px] font-semibold leading-[1.3] text-white lg:mt-5">{it.title}</h3>
                  <p className="m-0 mt-1.5 text-[14px] leading-[1.55] text-text-2">{it.text}</p>
                  <More text={it.details} />
                </span>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}

function WinMark() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden fill="currentColor"><path d="M3 5.5 10.5 4.4v7.1H3zM11.5 4.3 21 3v8.5h-9.5zM3 12.5h7.5v7.1L3 18.5zM11.5 12.5H21V21l-9.5-1.3z" /></svg>
  )
}

export function Download() {
  const { t } = useLang()
  const d = t.download
  const reduced = useReducedMotion()
  return (
    <section id="download" className="sec relative z-[2]">
      <div className="wrap">
        <Rise className="glass rim relative overflow-hidden !rounded-[28px] p-5 md:p-10 lg:!rounded-[32px] lg:p-14">
          <span className="rivet" aria-hidden />
          <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(255,181,107,.22), transparent)' }} />
          <span aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 size-[420px] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(139,92,246,.28), transparent)' }} />
          <div className="relative md:max-w-[640px]">
            <p className="eyebrow m-0 mb-3.5">{d.tag}</p>
            <H2 title={d.title} />
            <p className="lead m-0 mt-4">{d.lead}</p>
          </div>
          <motion.ul className="relative m-0 mt-8 grid list-none gap-3 p-0 md:mt-10 md:gap-4 lg:grid-cols-3 lg:gap-6"
            initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: .3 }} variants={cardList}>
            {d.platforms.map((p) => (
              <motion.li key={p.os} variants={cardItem} className="glass-dark flex flex-col gap-4 rounded-[20px] p-5 md:flex-row md:items-center md:justify-between lg:flex-col lg:items-stretch lg:p-6">
                <div className="flex items-start gap-4">
                  <span className="icon-c !size-12">{p.os === 'windows' ? <WinMark /> : <Laptop size={22} strokeWidth={1.75} aria-hidden />}</span>
                  <span>
                    <span className="block text-[17px] font-semibold leading-[1.3] text-white">{p.name}</span>
                    <span className="mt-1 block text-[13px] leading-[1.5] text-text-2">{p.details}</span>
                  </span>
                </div>
                <Btn href={p.href} className="w-full md:w-auto lg:w-full">
                  <span className="inline-flex items-center gap-2"><ArrowDown size={17} strokeWidth={1.75} aria-hidden />{p.cta}</span>
                </Btn>
              </motion.li>
            ))}
          </motion.ul>
          <p className="relative m-0 mt-6 text-[13px] leading-[1.6] text-text-3">{d.note}</p>
        </Rise>
      </div>
    </section>
  )
}

export function Pricing() {
  const { t } = useLang()
  const p = t.pricing
  const reduced = useReducedMotion()
  return (
    <section id="pricing" className="sec relative z-[2]">
      <div className="wrap">
        <Head tag={p.tag} title={p.title === p.tag ? p.title : p.title} lead={p.lead} />
        <motion.ul className="m-0 mt-8 grid list-none gap-4 p-0 md:mt-10 lg:mt-[34px] lg:grid-cols-3 lg:items-stretch lg:gap-6"
          initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: .2 }} variants={cardList}>
          {p.plans.map((plan) => (
            <motion.li key={plan.name} variants={cardItem} onPointerMove={glareMove}
              className={`glass glare lift relative flex flex-col p-6 md:p-8 ${plan.highlight ? 'sunset-rim max-lg:order-first' : 'rim'}`}>
              <span className="rivet" aria-hidden />
              {plan.highlight && p.highlight && (
                <p className="m-0 -mx-2 -mt-2 mb-5 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-medium text-night md:-mx-4 md:-mt-4"
                  style={{ background: 'radial-gradient(90% 140% at 15% 0%, oklch(97% .04 80 / .95), transparent 60%), linear-gradient(100deg in oklch, oklch(88% .1 75) 0%, oklch(82% .12 50) 45%, oklch(80% .11 15) 75%, oklch(80% .1 340) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.65), 0 10px 24px -12px oklch(70% .15 40 / .7)' }}>
                  <Sparkles size={15} strokeWidth={2} aria-hidden className="flex-none" />{p.highlight}
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                <h3 className="m-0 text-[18px] font-semibold text-white">{plan.name}</h3>
                {plan.badge && <span className="rounded-full px-3 py-1 text-[13px] font-semibold text-night" style={{ background: 'radial-gradient(80% 120% at 20% 0%, oklch(96% .05 80 / .9), transparent 60%), linear-gradient(120deg in oklch, oklch(86% .12 70) 0%, oklch(78% .14 40) 48%, oklch(77% .12 0) 78%, oklch(76% .11 340) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6), 0 6px 18px -6px oklch(70% .15 40 / .6)' }}>{plan.badge}</span>}
              </div>
              <p className="m-0 mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[40px] font-semibold leading-none tracking-[-.03em] text-white xl:text-[52px]">{plan.price.display}</span>
                {plan.price.old && <s className="text-[20px] text-text-3">{plan.price.old}</s>}
              </p>
              <p className="m-0 mt-2 text-[14px] text-text-2">{plan.per}</p>
              <ul className="m-0 mt-6 flex list-none flex-col gap-3 border-t border-white/12 p-0 pt-6">
                {plan.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[14px] leading-[1.5] text-text-2">
                    <Check size={16} strokeWidth={2} className={`mt-[3px] flex-none ${plan.highlight ? 'text-sunset' : 'text-lilac'}`} aria-hidden />{it}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                {plan.cta.variant === 'main'
                  ? <Btn href={plan.cta.href} className="w-full" magnetic>{plan.cta.label}</Btn>
                  : <Btn href={plan.cta.href} variant="glass" className="!h-[52px] w-full">{plan.cta.label}</Btn>}
              </div>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:mt-6 lg:gap-6">
          {p.extras.map((x) => (
            <Rise key={x.title} className="glass-dark rounded-[24px] p-6">
              <h3 className="m-0 text-[16px] font-semibold text-white">{x.title}</h3>
              <p className="m-0 mt-2 text-[14px] leading-[1.6] text-text-2">{x.text}</p>
            </Rise>
          ))}
        </div>
        <p className="m-0 mt-5 text-[13px] leading-[1.6] text-text-3">{p.note}</p>
        <Rise className="glass rim mt-6 flex flex-col gap-5 !rounded-[24px] p-6 md:flex-row md:items-center md:justify-between md:p-7 lg:!rounded-[999px] lg:py-5 lg:pl-9 lg:pr-5">
          <div>
            <p className="m-0 text-[15px] leading-[1.55] text-white">{p.buy.text}</p>
            <p className="m-0 mt-1 text-[13px] text-text-3">{p.buy.note}</p>
          </div>
          <Btn href={p.buy.cta.href} arrow className="flex-none">{p.buy.cta.label}</Btn>
        </Rise>
        <p className="m-0 mt-4 flex gap-4 text-[13px]">
          {p.legal.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener" className="text-text-2 underline decoration-white/30 underline-offset-4 hover:text-white">{l.label}</a>)}
        </p>
      </div>
    </section>
  )
}

export function Faq() {
  const { t } = useLang()
  const f = t.faq
  const uid = useId()
  const [open, setOpen] = useState<number>(() => f.items.findIndex((x) => x.open))
  const half = Math.ceil(f.items.length / 2)
  const cols = [f.items.slice(0, half).map((it, k) => ({ it, k })), f.items.slice(half).map((it, k) => ({ it, k: k + half }))]
  return (
    <section id="faq" className="sec relative z-[2]">
      <div className="wrap">
        <Head tag={f.tag} title={f.title} />
        <div className="mt-8 grid gap-3 md:mt-10 lg:mt-[34px] lg:grid-cols-2 lg:gap-4">
          {cols.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-3 lg:gap-4">
              {col.map(({ it, k }) => {
                const isOpen = open === k
                const b = `${uid}-b${k}`, pid = `${uid}-p${k}`
                return (
                  <div key={it.q} onPointerMove={glareMove} className={`glass glare group relative !rounded-[24px] transition-colors ${isOpen ? '!border-white/40' : ''}`}>
                    <h3 className="m-0">
                      <button id={b} type="button" aria-expanded={isOpen} aria-controls={pid} onClick={() => setOpen(isOpen ? -1 : k)}
                        className="flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[24px] px-5 py-4 text-left text-[16px] font-medium leading-[1.4] text-white md:px-6 md:text-[17px]">
                        <span>{it.q}</span>
                        <span className="arrow-c" aria-hidden style={isOpen ? { background: '#fff', color: '#0E0A1F' } : undefined}>
                          <ArrowDown size={16} strokeWidth={1.75} style={{ transform: isOpen ? 'rotate(180deg)' : undefined }} />
                        </span>
                      </button>
                    </h3>
                    <div id={pid} role="region" aria-labelledby={b} inert={!isOpen || undefined}
                      className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                      <div className="min-h-0 overflow-hidden">
                        <p className="rich m-0 px-5 pb-5 text-[15px] leading-[1.65] text-text-2 md:px-6 md:pb-6"><Rich value={it.a} /></p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
