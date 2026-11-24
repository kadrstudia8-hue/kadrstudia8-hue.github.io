import { ArrowRight, Check, Globe, Menu, X } from 'lucide-react'
import { AnimatePresence, m as motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { LANGS } from '@kadr/shared/content/index.ts'
import { useLang } from '@kadr/shared/i18n'
import { useOverlay } from '@kadr/shared/ui/useOverlay'
import { usePrefersReducedMotion } from '@kadr/shared/ui/usePrefersReducedMotion'
import { COPY } from '../copy'
import { Btn } from '../lib/Btn'

export function Logo({ href = '#top' }: { href?: string }) {
  const { t } = useLang()
  return (
    <a href={href} className="group inline-flex flex-none items-center gap-2.5 whitespace-nowrap text-white no-underline" aria-label={`${t.nav.logo.text} ${t.nav.logo.em}`}>
      <span aria-hidden className="relative grid size-9 place-items-center rounded-[11px] bg-white text-night shadow-[0_8px_24px_-8px_rgba(200,166,255,.7)] transition-transform duration-300 group-hover:rotate-[-8deg]">
        <span className="absolute inset-[7px] rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #fff 0, #E3D0FF 22%, #8B5CF6 62%, #241A4D 100%)', boxShadow: '0 0 10px rgba(139,92,246,.7)' }} />
        <span className="absolute size-[6px] translate-x-[-3px] translate-y-[-3px] rounded-full bg-white/90" />
      </span>
      <span className="text-[22px] leading-none tracking-[-.02em]">
        <span className="font-semibold">{t.nav.logo.text}</span> <span className="font-light text-white/85">{t.nav.logo.em}</span>
      </span>
    </a>
  )
}

/** Language circle + popover (UK/RU/EN/ES/DE). */
function LangSwitch() {
  const { t, lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const off = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', off); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', esc) }
  }, [open])
  return (
    <div ref={box} className="relative">
      <button type="button" className="circle-btn text-[12px] font-medium tracking-[.06em]" aria-haspopup="menu" aria-expanded={open} aria-label={`${t.nav.langMenuLabel}: ${t.nav.langCurrent.full}`} onClick={() => setOpen((o) => !o)}>
        {t.nav.langCurrent.short}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: .98 }}
            transition={{ duration: .18, ease: [.22, 1, .36, 1] }}
            className="glass-dark absolute right-0 top-[calc(100%+10px)] z-10 m-0 w-48 origin-top-right list-none rounded-2xl p-1.5"
          >
            {LANGS.map((l) => (
              <li key={l.code}>
                <button type="button" role="menuitemradio" aria-checked={l.code === lang} onClick={() => { setLang(l.code); setOpen(false) }}
                  className="flex h-11 w-full items-center justify-between rounded-xl px-3 text-left text-[14px] text-white/85 transition-colors hover:bg-white/10 hover:text-white">
                  <span>{l.name}</span>
                  <span className="flex items-center gap-2 text-[11px] tracking-[.12em] text-white/50">{l.short}{l.code === lang && <Check size={14} className="text-lilac" aria-hidden />}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Nav() {
  const { t, lang, setLang } = useLang()
  const c = COPY[lang]
  const reduced = usePrefersReducedMotion()
  const links = t.nav.links.filter((l) => l.href !== '#req')
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)
  useOverlay(open, sheet, () => setOpen(false))

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1))
    const on = () => {
      setScrolled(window.scrollY > 80)
      const y = window.innerHeight * 0.35
      let cur = '', best = -Infinity
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top < y && top > best) { best = top; cur = id }
      }
      // sections between anchors (reel, tutorial…) keep the last passed link
      setActive(cur)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          aria-hidden
          className="glass-dark absolute inset-0 transition-opacity duration-300"
          style={{ opacity: scrolled ? 1 : 0, borderWidth: '0 0 1px', borderRadius: 0, boxShadow: 'none' }}
        />
        <nav className="wrap relative flex h-[60px] items-center justify-between md:h-[72px] lg:h-[96px]" aria-label="KADR Studio">
          <Logo />
          <ul className="m-0 hidden list-none items-center gap-7 p-0 lg:flex xl:absolute xl:left-[calc(480px-var(--pad))] xl:gap-14">
            {links.map((l) => (
              <li key={l.href}>
                <a className="nav-link" href={l.href} aria-current={active === l.href.slice(1) ? 'true' : undefined}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden lg:block"><LangSwitch /></div>
            <Btn href={t.nav.cta.href} size="sm" arrow className="max-md:!h-11 max-md:!px-4 max-md:text-[14px] max-md:[&_.arr]:hidden">{t.nav.cta.label}</Btn>
            <button type="button" className="circle-btn lg:hidden" aria-label={c.menu} aria-expanded={open} onClick={() => setOpen(true)}>
              <Menu size={20} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={sheet}
            role="dialog" aria-modal="true" aria-label={c.menu}
            className="fixed inset-0 z-[80] flex flex-col overflow-y-auto"
            style={{ background: 'radial-gradient(90% 50% at 100% 100%, oklch(55% .12 45 / .25), transparent 65%), radial-gradient(80% 40% at 0% 0%, oklch(45% .14 300 / .3), transparent 60%), linear-gradient(180deg in oklch, oklch(13% .045 288 / .97) 0%, oklch(18% .06 295 / .97) 55%, oklch(24% .08 300 / .97) 100%)', WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .22 }}
          >
            <div className="wrap flex h-[60px] items-center justify-between md:h-[72px]">
              <Logo />
              <button type="button" className="circle-btn" aria-label={c.close} onClick={() => setOpen(false)} data-autofocus><X size={20} aria-hidden /></button>
            </div>
            <ul className="wrap mb-0 mt-6 flex list-none flex-col p-0">
              {t.nav.links.map((l, i) => (
                <motion.li key={l.href} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .04 * i, type: 'spring', stiffness: 260, damping: 22 }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-14 items-center justify-between border-b border-white/10 text-[24px] font-medium tracking-[-.01em] text-white no-underline">
                    {l.label}<ArrowRight size={20} strokeWidth={1.5} className="text-white/50" aria-hidden />
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="wrap mt-8">
              <p className="eyebrow mb-3 flex items-center gap-2"><Globe size={14} aria-hidden />{t.nav.langMenuLabel}</p>
              <div className="flex flex-wrap gap-2">
                {LANGS.map((l) => (
                  <button key={l.code} type="button" onClick={() => setLang(l.code)} aria-pressed={l.code === lang}
                    className={`h-11 rounded-full border px-4 text-[15px] transition-colors ${l.code === lang ? 'border-white bg-white text-night' : 'border-white/30 bg-white/5 text-white'}`}>
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="wrap mb-8 mt-auto pt-10">
              <Btn href={t.nav.cta.href} arrow onClick={() => setOpen(false)} className="w-full">{t.hero.ctas[0].label}</Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
