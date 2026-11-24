import { Check, Clapperboard, Cloud as CloudIcon, Film, Gift, ShieldCheck, Smartphone, Sparkles as SparklesIcon, Timer, Zap, type LucideIcon } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import type { Lang, SiteContent } from '@kadr/shared/content/index'
import { BlackButton, LimeButton, PixelTitle, Rise, SectionHead, Sparkle, Tag } from './ui'

/* ------------------------------------------------------------------ "more" disclosure for long `details` */
const MORE: Record<Lang, string> = { uk: 'Детальніше', ru: 'Подробнее', en: 'More', es: 'Más', de: 'Mehr' }

export function More({ lang, details, dark }: { lang: Lang; details?: string; dark?: boolean }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  if (!details) return null
  return (
    <div className="mt-3">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(v => !v)}
        className={`group inline-flex min-h-11 items-center gap-2 rounded-[10px] text-[14px] font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-violet ${dark ? 'text-white' : 'text-ink'}`}>
        <span className="grid size-6 place-items-center rounded-full border-[1.5px] border-ink bg-[linear-gradient(in_oklch_180deg,#E8FF7A,#C8F31D_70%,#B9E512)] text-ink transition-transform duration-300 [transition-timing-function:cubic-bezier(.3,1.5,.5,1)] group-aria-expanded:rotate-45" aria-hidden>
          <svg viewBox="0 0 12 12" className="size-3"><path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </span>
        <span className="underline decoration-ink/25 underline-offset-4 group-hover:decoration-violet">{MORE[lang]}</span>
      </button>
      <div id={id} className={`acc-body ${open ? 'open' : ''}`} inert={!open}>
        <div><p className={`m-0 pt-2 text-[14px] leading-[1.5] max-md:text-[16px] ${dark ? 'text-white/75' : 'text-ink-2'}`}>{details}</p></div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ hero badges */
export function HeroBadges({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return (
    <ul className="m-0 flex flex-1 list-none flex-wrap gap-2 p-0" aria-label="KADR Studio">
      {items.map(b => (
        <li key={b} className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-white/80 bg-white/65 pl-1.5 pr-3 text-[13px] font-bold text-ink shadow-[0_1px_2px_rgba(60,40,160,.1),0_6px_16px_-8px_rgba(60,40,160,.35),inset_0_1px_0_#fff] max-md:text-[14px]">
          <span className="grid size-6 place-items-center rounded-[7px] bg-ink text-lime" aria-hidden><Check size={14} strokeWidth={3} /></span>
          {b}
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ promises */
const ICONS: Record<string, LucideIcon> = { Clapperboard, Timer, Gift, Cloud: CloudIcon, Film, ShieldCheck }
const BUBBLE = ['bubble-pink', 'bubble-lime', 'bubble-lilac']

export function Promises({ t }: { t: SiteContent }) {
  const p = t.promises
  if (!p) return null
  return (
    <section id="promises" className="wrap section-gap" aria-labelledby="prom-h">
      <SectionHead tag={p.tag} title={p.title} id="prom-h" />
      <ul className="m-0 mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 md:gap-6 lg:mt-14 lg:grid-cols-3">
        {p.items.map((it, i) => {
          const I = ICONS[it.icon] ?? SparklesIcon
          return (
            <Rise as="li" key={it.title} i={i % 3} className="glass-flat group relative flex gap-4 p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6">
              <span className={`bubble grid size-14 flex-none place-items-center rounded-[18px] transition-transform duration-300 [transition-timing-function:cubic-bezier(.3,1.6,.5,1)] group-hover:rotate-[-8deg] group-hover:scale-110 ${BUBBLE[i % 3]}`}>
                <I size={26} strokeWidth={2.2} aria-hidden />
              </span>
              <span className="min-w-0">
                <h3 className="card-title m-0 !text-[18px] md:!text-[19px]">{it.title}</h3>
                <p className="card-text mt-1.5">{it.text}</p>
              </span>
            </Rise>
          )
        })}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ cloud: bright feature banner */
export function CloudBanner({ t }: { t: SiteContent }) {
  const c = t.cloud
  if (!c) return null
  return (
    <section id="cloud" className="wrap section-gap" aria-labelledby="cloud-h">
      <Rise className="cloud-banner relative overflow-hidden rounded-[24px] p-6 text-white md:p-10 xl:p-12">
        <span className="pointer-events-none absolute -right-16 -top-20 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(200,243,29,.35),transparent_62%)]" aria-hidden />
        <div aria-hidden className="pointer-events-none absolute right-[4%] top-1/2 hidden -translate-y-1/2 lg:block">
          <span className="bubble bubble-lilac grid size-[220px] place-items-center rounded-[64px] rotate-[-8deg]">
            <CloudIcon size={120} strokeWidth={1.6} />
          </span>
          <span className="absolute -left-6 bottom-2 grid size-20 rotate-[10deg] place-items-center rounded-[22px] border-[1.5px] border-ink bg-lime text-ink shadow-[0_4px_0_#0B0B12]"><Zap size={40} fill="currentColor" /></span>
          <Sparkle size={28} color="#fff" className="absolute -top-4 right-2" />
          <Sparkle size={16} color="#C8F31D" className="absolute bottom-10 -right-4" />
        </div>
        <div className="relative max-w-[700px]">
          <Tag className="!bg-lime !text-ink">{c.tag}</Tag>
          <PixelTitle id="cloud-h" text={c.title} className="mt-4 !text-white" />
          <p className="mt-4 max-w-[560px] text-[17px] font-medium leading-[1.45] text-white/90 md:text-[18px]">{c.lead}</p>
          <ul className="m-0 mt-6 list-none space-y-3 p-0">
            {c.bullets.map(b => (
              <li key={b} className="flex gap-3 text-[15px] leading-[1.45] text-white/90 max-md:text-[16px]">
                <span className="mt-0.5 grid size-6 flex-none place-items-center rounded-full bg-lime text-ink" aria-hidden><Zap size={13} fill="currentColor" strokeWidth={0} /></span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7"><LimeButton href={c.cta.href}>{c.cta.label}</LimeButton></div>
        </div>
      </Rise>
    </section>
  )
}

/* ------------------------------------------------------------------ mobile version teaser (sticker) */
export function MobileSoon({ t }: { t: SiteContent }) {
  const s = t.mobileSoon
  if (!s) return null
  return (
    <div className="relative mt-6 flex items-center gap-4 rounded-[18px] border-[1.5px] border-dashed border-ink/30 bg-white/55 p-4 pr-6 md:p-5">
      <span className="bubble bubble-pink grid size-12 flex-none place-items-center rounded-[14px]" aria-hidden><Smartphone size={24} strokeWidth={2.2} /></span>
      <div className="min-w-0">
        <p className="m-0 text-[17px] font-extrabold leading-tight">{s.title}</p>
        <p className="m-0 mt-1 text-[14px] leading-snug text-ink-2 max-md:text-[16px]">{s.text}</p>
      </div>
      <span className="sticker hand absolute -right-2 -top-4 !h-auto !w-auto rotate-[6deg] !px-3 !py-1.5 !text-[20px]">{s.tag}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ CTA band before the footer */
export function CtaBand({ t }: { t: SiteContent }) {
  const c = t.ctaBand
  if (!c) return null
  return (
    <section className="wrap section-gap" aria-labelledby="band-h">
      <Rise className="banner-lime relative flex flex-col gap-5 overflow-hidden p-6 md:flex-row md:items-center md:justify-between md:p-8 xl:px-12">
        <div className="relative">
          <h2 id="band-h" className="h-sec m-0 !text-[clamp(26px,2.6vw,38px)]">{c.title}</h2>
          <p className="m-0 mt-2 text-[16px] font-semibold text-ink/80 md:text-[17px]">{c.subtitle}</p>
        </div>
        <div className="relative flex-none"><BlackButton href={c.cta.href} className="!h-[52px]">{c.cta.label}</BlackButton></div>
        <Sparkle size={22} color="#0B0B12" className="absolute right-[38%] top-4 hidden md:block" />
      </Rise>
    </section>
  )
}

export function Plaque({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 -mx-6 -mt-6 mb-5 rounded-t-[19px] bg-ink py-2.5 pl-6 pr-24 text-[13px] font-extrabold uppercase tracking-[.04em] text-lime md:-mx-8 md:-mt-8 md:pl-8 md:pr-24">
      {children}
    </p>
  )
}
