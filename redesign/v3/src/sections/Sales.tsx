import {
  Clapperboard, Cloud as CloudIcon, Cpu, Film, Gift, Receipt, ShieldCheck, Smartphone, Sparkles, Timer, Zap, type LucideIcon,
} from 'lucide-react'
import { m as motion } from 'motion/react'
import { useLang } from '@kadr/shared/i18n'
import { Btn } from '../lib/Btn'
import { genUrl } from '../lib/gen'
import { useReducedMotion } from '../lib/motion'
import { glareMove } from '../lib/useCursorVars'
import { cardItem, cardList, H2, Head, Rise } from '../lib/ui'
import { Fireflies } from './World'

const ICONS: Record<string, LucideIcon> = { Clapperboard, Timer, Gift, Cloud: CloudIcon, Film, ShieldCheck }

/** «Why KADR»: six promises as compact glass cards with glowing icon circles (the fact-strip icon language). */
export function Promises() {
  const { t } = useLang()
  const p = t.promises
  const reduced = useReducedMotion()
  if (!p) return null
  return (
    <section id="promises" className="sec relative z-[2]">
      <div className="wrap">
        <Head tag={p.tag} title={p.title} />
        <motion.ul className="m-0 mt-8 grid list-none gap-3 p-0 sm:grid-cols-2 md:mt-10 md:gap-4 lg:mt-[34px] lg:grid-cols-3 lg:gap-6"
          initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: .2 }} variants={cardList}>
          {p.items.map((it, i) => {
            const I = ICONS[it.icon] ?? Sparkles
            return (
              <motion.li key={it.title} variants={cardItem} onPointerMove={glareMove} className="glass rim glare lift group relative flex items-start gap-4 !rounded-[24px] p-5 md:p-6">
                <span className="icon-c transition-transform duration-300 ease-out group-hover:scale-110" style={i === 3 ? { color: '#FFB56B' } : undefined}>
                  <I size={26} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0 pt-1">
                  <h3 className="m-0 text-[17px] font-semibold leading-[1.3] text-white">{it.title}</h3>
                  <p className="m-0 mt-1.5 text-[14px] leading-[1.55] text-text-2">{it.text}</p>
                </span>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}

/** KADR Cloud: the selling point. A sunset-lit panel (the hero world, the sun side), three bullets, white pill. */
export function CloudSection() {
  const { t } = useLang()
  const c = t.cloud
  const reduced = useReducedMotion()
  const scene = genUrl('v3-hero-scene.webp')
  if (!c) return null
  const bulletIcons = [Cpu, Receipt, Zap]
  return (
    <section id="cloud" className="sec relative z-[2]">
      <div className="wrap">
        <Rise className="relative isolate overflow-hidden rounded-[32px] border border-white/30 shadow-[0_1px_2px_rgba(5,2,20,.4),0_40px_80px_-30px_rgba(5,2,20,.9)]">
          {/* the sun side of the hero world */}
          <div aria-hidden className="absolute inset-0 -z-10">
            {scene
              ? <img src={scene} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-[96%_58%] max-md:object-[88%_60%]" />
              : <div className="h-full w-full" style={{ background: 'linear-gradient(180deg in oklch, oklch(30% .1 295) 0%, oklch(55% .13 330) 48%, oklch(80% .13 60) 66%, oklch(25% .08 295) 100%)' }} />}
            <div className="bloom absolute inset-0" />
            <div className="absolute inset-0 max-md:hidden" style={{ background: 'radial-gradient(70% 120% at 0% 50%, oklch(13% .045 288 / .62), transparent 70%), linear-gradient(90deg in oklch, oklch(13% .045 288 / .86) 0%, oklch(16% .06 295 / .7) 32%, oklch(22% .07 312 / .32) 56%, oklch(45% .1 45 / .05) 74%, transparent 88%)' }} />
            <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(180deg in oklch, oklch(13% .045 288 / .9) 0%, oklch(16% .06 295 / .78) 45%, oklch(22% .07 312 / .45) 75%, oklch(30% .08 320 / .25) 100%)' }} />
            <Fireflies />
          </div>
          {/* sun glint where the light falls on the glass rim */}
          <span aria-hidden className="pointer-events-none absolute -top-px right-[8%] h-px w-[46%]" style={{ background: 'linear-gradient(90deg in oklch, transparent 0%, oklch(85% .08 320 / .5) 30%, oklch(97% .05 80) 60%, oklch(88% .1 50 / .5) 80%, transparent 100%)' }} />
          <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)] lg:gap-12 lg:p-16">
            <div>
              <p className="chip eyebrow m-0 !h-7 !text-[11px]"><CloudIcon size={13} className="mr-2" aria-hidden />{c.tag}</p>
              <H2 title={c.title} className="mt-4 md:max-w-[560px]" />
              <p className="m-0 mt-4 max-w-[480px] text-[16px] leading-[1.55] text-white/85 lg:text-[18px]">{c.lead}</p>
              <div className="mt-7"><Btn href={c.cta.href} arrow magnetic>{c.cta.label}</Btn></div>
            </div>
            <motion.ul className="m-0 flex list-none flex-col gap-3 self-end p-0"
              initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: .4 }} variants={cardList}>
              {c.bullets.map((b, i) => {
                const I = bulletIcons[i] ?? Sparkles
                return (
                  <motion.li key={b} variants={cardItem} className="glass-dark flex items-center gap-4 rounded-[20px] p-4 md:p-5">
                    <span className="icon-c !size-11" style={i === 2 ? { color: '#FFB56B' } : undefined}><I size={20} strokeWidth={1.75} aria-hidden /></span>
                    <span className="text-[15px] leading-[1.5] text-white/90">{b}</span>
                  </motion.li>
                )
              })}
            </motion.ul>
          </div>
        </Rise>
      </div>
    </section>
  )
}

/** Phone version announcement: one quiet glass band. */
export function MobileSoon() {
  const { t } = useLang()
  const m = t.mobileSoon
  if (!m) return null
  return (
    <div className="wrap relative z-[2] mt-6">
      <Rise className="glass rim flex items-center gap-4 !rounded-[24px] p-5 md:gap-6 md:p-6 lg:!rounded-[999px] lg:py-4 lg:pl-5 lg:pr-8">
        <span className="icon-c relative">
          <Smartphone size={24} strokeWidth={1.75} aria-hidden />
          <span aria-hidden className="absolute right-1 top-1 size-2.5 rounded-full bg-sunset shadow-[0_0_10px_rgba(255,181,107,.9)]" />
        </span>
        <span className="min-w-0 lg:flex lg:items-center lg:gap-5">
          <span className="chip eyebrow !h-6 !px-2.5 !text-[10px]">{m.tag}</span>
          <span className="mt-2 block text-[17px] font-semibold leading-[1.3] text-white lg:mt-0">{m.title}</span>
          <span className="mt-1 block text-[14px] leading-[1.5] text-text-2 lg:mt-0">{m.text}</span>
        </span>
      </Rise>
    </div>
  )
}
