import { ArrowUpRight, AudioLines, Clock3, Palette, Ratio, X } from 'lucide-react'
import { AnimatePresence, m as motion, useSpring } from 'motion/react'
import { useReducedMotion } from '../lib/motion'
import { useState, type PointerEvent } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { useHasFinePointer } from '@kadr/shared/ui/useIsTouch'
import { COPY, richBold } from '../copy'
import { Btn } from '../lib/Btn'
import { genUrl } from '../lib/gen'
import { glareMove } from '../lib/useCursorVars'
import { cardItem, cardList, Count, Head } from '../lib/ui'

const SPRITE_POS = ['0% 0%', '100% 0%', '0% 100%', '100% 100%']

/** 3D icon from the 2×2 sprite (gen/v3-icons.webp); a glassy stand-in while the file is missing. */
function Icon3D({ i, size = 150, fill }: { i: number; size?: number; fill?: boolean }) {
  const url = genUrl('v3-icons.webp')
  if (url) {
    return <span aria-hidden className="block" style={{ width: fill ? '100%' : size, height: fill ? '100%' : size, backgroundImage: `url(${url})`, backgroundSize: '200% 200%', backgroundPosition: SPRITE_POS[i], filter: 'drop-shadow(0 18px 24px rgba(5,2,20,.55)) drop-shadow(0 0 28px rgba(200,166,255,.35))' }} />
  }
  return (
    <span aria-hidden className="grid place-items-center rounded-[28px]" style={{ width: size * .7, height: size * .7, background: 'linear-gradient(145deg,#C8A6FF,#8B5CF6 55%,#FFB56B)', boxShadow: '0 0 40px rgba(200,166,255,.45), inset 0 2px 0 rgba(255,255,255,.6)' }}>
      <span className="size-1/2 rounded-full bg-white/50" />
    </span>
  )
}

function firstSentence(s: string) {
  const m = s.match(/^.*?[.!?](\s|$)/)
  return (m ? m[0] : s).trim()
}

function WhoCard({ i, card }: { i: number; card: ReturnType<typeof useLang>['t']['who']['cards'][number] }) {
  const { lang } = useLang()
  const c = COPY[lang]
  const [open, setOpen] = useState(false)
  const fine = useHasFinePointer()
  const reduced = useReducedMotion()
  const tilt = fine && !reduced
  const rx = useSpring(0, { stiffness: 200, damping: 20 }), ry = useSpring(0, { stiffness: 200, damping: 20 })
  const move = (e: PointerEvent<HTMLElement>) => {
    glareMove(e)
    if (!tilt) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - .5) * 12)
    rx.set(-((e.clientY - r.top) / r.height - .5) * 8)
  }
  const leave = () => { rx.set(0); ry.set(0) }
  const panel = `who-${i}`
  return (
    <motion.li variants={cardItem} className="flex w-[260px] flex-col md:w-auto" style={{ perspective: 1000 }}>
      <motion.article
        onPointerMove={move} onPointerLeave={leave}
        whileHover={reduced ? undefined : { y: -6 }}
        transition={{ duration: .22, ease: 'easeOut' }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="glass rim glare lift group relative flex h-[300px] flex-col overflow-hidden p-5 md:h-[394px] md:p-7 lg:h-[350px]"
      >
        <span className="rivet" aria-hidden />
        {/* icon box sized per breakpoint so icon, title, 2 lines and arrow fill the card without voids */}
        <motion.div className="mx-auto -mt-1 grid size-[150px] flex-none place-items-center md:size-[200px] lg:size-[176px]" style={{ transform: 'translateZ(24px)' }}>
          <div className="size-full transition-transform duration-300 ease-out group-hover:[transform:rotateY(12deg)_scale(1.04)]"><Icon3D i={i} fill /></div>
        </motion.div>
        <div className="relative mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="m-0 text-[18px] font-semibold leading-[1.25] tracking-[-.01em] text-white">{card.title}</h3>
            <p className="m-0 mt-2 line-clamp-2 text-ellipsis text-[14px] leading-[1.6] text-text-2">{firstSentence(card.text)}</p>
          </div>
          <button type="button" className="hit44 relative z-[3] -m-1" aria-expanded={open} aria-controls={panel} aria-label={`${open ? c.less : c.more}: ${card.title}`} onClick={() => setOpen((o) => !o)}>
            <span className="arrow-c" aria-hidden><ArrowUpRight size={16} strokeWidth={1.75} /></span>
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div id={panel} role="region" aria-label={card.title}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              transition={{ duration: .26, ease: [.22, 1, .36, 1] }}
              className="absolute inset-0 z-[2] flex flex-col overflow-y-auto rounded-[inherit] p-5 md:p-7"
              style={{ background: 'radial-gradient(100% 60% at 0% 0%, oklch(40% .1 300 / .35), transparent 60%), radial-gradient(80% 50% at 100% 100%, oklch(45% .1 45 / .2), transparent 60%), linear-gradient(180deg in oklch, oklch(20% .06 292 / .95) 0%, oklch(16% .05 290 / .97) 60%, oklch(15% .045 300 / .98) 100%)' }}>
              <h3 className="m-0 pr-10 text-[18px] font-semibold leading-[1.25] text-white">{card.title}</h3>
              <p className="m-0 mt-3 text-[14px] leading-[1.6] text-text-2">{card.text}</p>
              {card.details && <p className="m-0 mt-2 text-[14px] leading-[1.6] text-text-2">{card.details}</p>}
              <p className="m-0 mt-auto pt-4 text-[13px] leading-[1.5] text-lilac-hi">{card.source}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label={c.close} className="hit44 absolute right-3 top-3 md:right-4 md:top-4"><span className="arrow-c !bg-white !text-night" aria-hidden><X size={16} /></span></button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </motion.li>
  )
}

export function Who() {
  const { t } = useLang()
  const reduced = useReducedMotion()
  return (
    <section id="who" className="relative z-[2] pt-[64px] md:pt-[88px] lg:pt-[100px]">
      <div className="wrap">
        <Head tag={t.who.tag} title={t.who.title} lead={t.how.lead}
          right={<Btn href="#proof" variant="glass" arrow>{t.nav.links.find((l) => l.href === '#proof')?.label}</Btn>} />
      </div>
      <motion.ul
        className="snap-x wrap mb-0 mt-8 list-none gap-4 p-0 md:mt-10 md:grid md:grid-cols-2 md:gap-6 lg:mt-[34px] lg:grid-cols-4 max-md:!w-full max-md:scroll-px-4 max-md:px-4"
        initial={reduced ? false : 'hide'} whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={cardList}
      >
        {t.who.cards.map((card, i) => <WhoCard key={card.title} i={i} card={card} />)}
      </motion.ul>
    </section>
  )
}

/** Fact strip (block 3): real facts only; numbers wind up once. */
export function Facts() {
  const { t, lang } = useLang()
  const c = COPY[lang]
  const reduced = useReducedMotion()
  const voices = richBold(t.hero.facts[2])
  const vn = voices.split('·').length
  const [pre, post] = c.facts.len[0].split('30')
  const items = [
    { icon: Clock3, big: <>{pre}<Count from={15} to={30} />{post}</>, label: c.facts.len[1] },
    { icon: Ratio, big: <><Count to={4} /> {c.facts.formats}</>, label: richBold(t.hero.facts[1]) },
    { icon: AudioLines, big: <><Count to={vn} /> {c.facts.voices(vn)}</>, label: voices, warm: true },
    { icon: Palette, big: <><Count to={12} /> {c.facts.styles[0]}</>, label: c.facts.styles[1] },
  ]
  return (
    <div className="wrap relative z-[2] mt-6 md:mt-8">
      <motion.ul
        initial={reduced ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="glass rim m-0 grid list-none grid-cols-2 overflow-hidden !rounded-[24px] p-0 lg:h-[136px] lg:grid-cols-4 lg:!rounded-[32px]"
      >
        {items.map((it, k) => (
          <li key={k} className={`relative flex items-center gap-3 p-5 max-md:flex-col max-md:items-start md:gap-4 md:px-8 md:py-6 lg:px-8 lg:py-0
            ${k % 2 === 0 ? 'max-lg:border-r max-lg:border-white/14' : ''} ${k < 2 ? 'max-lg:border-b max-lg:border-white/14' : ''}`}>
            {k > 0 && <span aria-hidden className="absolute left-0 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-white/14 lg:block" />}
            <span className="icon-c max-md:!size-11" style={it.warm ? { color: '#FFB56B' } : undefined}>
              <it.icon size={26} strokeWidth={1.75} aria-hidden className="max-md:size-[22px]" />
            </span>
            <span className="min-w-0">
              <span className="block whitespace-nowrap text-[18px] font-semibold leading-[1.15] tracking-[-.01em] text-white md:text-[24px] xl:text-[28px]">{it.big}</span>
              <span className="mt-1 block text-[13px] leading-[1.35] text-text-2 md:text-[14px]">{it.label}</span>
            </span>
          </li>
        ))}
      </motion.ul>
    </div>
  )
}
