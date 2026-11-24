import { Globe, Menu, Moon, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { LANGS, type Lang, type SiteContent } from '@kadr/shared/content/index'
import { useOverlay } from '@kadr/shared/ui/useOverlay'
import { switchTheme, THEME_LABEL } from '@kadr/shared/theme'
import { LimeButton } from './ui'
import { usePrefersReducedMotion } from './lib'

const MENU: Record<Lang, string> = { uk: 'Меню', ru: 'Меню', en: 'Menu', es: 'Menú', de: 'Menü' }

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <span className="inline-flex items-start leading-none" style={{ fontSize: size }}>
      <span className="font-ui font-extrabold tracking-[-.035em] text-ink">
        KADR<span className="ml-[.16em] font-medium tracking-[-.02em]">studio</span>
      </span>
      <svg width=".62em" height=".62em" viewBox="0 0 24 24" className="-mt-[.12em] ml-[.06em]" aria-hidden>
        <path d="M12 0c.9 6.2 5.3 10.9 12 12-6.7 1.1-11.1 5.8-12 12-.9-6.2-5.3-10.9-12-12C6.7 10.9 11.1 6.2 12 0Z" fill="#0B0B12" />
      </svg>
    </span>
  )
}

function Marker() {
  return <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden><path d="M2 6.5C20 3.5 45 3 98 5.5" /></svg>
}

export function Navbar({ t, lang, setLang }: { t: SiteContent; lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [sheet, setSheet] = useState(false)
  const reduced = usePrefersReducedMotion()
  const langRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  useOverlay(sheet, sheetRef, () => setSheet(false))

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (!langOpen) return
    const close = (e: MouseEvent) => { if (!langRef.current?.contains(e.target as Node)) setLangOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setLangOpen(false) }
    document.addEventListener('mousedown', close); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [langOpen])

  const want = ['#proof', '#how', '#pricing', '#faq']
  const links = want.map(h => t.nav.links.find(l => l.href === h)).filter(Boolean) as { label: string; href: string }[]
  const cur = LANGS.find(l => l.code === lang)!

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300"
        style={scrolled ? { background: 'rgba(238,240,251,.62)', backdropFilter: 'blur(18px) saturate(150%)', WebkitBackdropFilter: 'blur(18px) saturate(150%)', boxShadow: '0 1px 0 rgba(255,255,255,.7), 0 10px 30px -20px rgba(60,40,160,.35)' } : undefined}>
        <div className={`wrap flex items-center transition-[height] duration-300 ${scrolled ? 'h-[60px] md:h-[64px] xl:h-[72px]' : 'h-[60px] md:h-[72px] xl:h-[88px]'}`}>
          <a href="#top" className="rounded-md focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-violet" aria-label="KADR Studio">
            <Logo size={24} />
          </a>
          <nav className="ml-[172px] hidden items-center gap-10 xl:flex" aria-label="primary">
            {links.map(l => <a key={l.href} href={l.href} className="nav-link"><Marker /><span>{l.label}</span></a>)}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <button type="button" className="round-btn max-md:!hidden" aria-label={THEME_LABEL.dark[lang]} title={THEME_LABEL.dark[lang]} onClick={() => switchTheme('dark', lang)}>
              <Moon size={20} strokeWidth={2} aria-hidden />
            </button>
            <div ref={langRef} className="relative hidden md:block">
              <button type="button" className="round-btn" aria-label={`${t.nav.langMenuLabel}: ${cur.name}`} aria-expanded={langOpen} aria-haspopup="menu" onClick={() => setLangOpen(v => !v)}>
                <Globe size={20} strokeWidth={2} aria-hidden />
                <span className="absolute -bottom-0.5 -right-1 rounded-[5px] bg-ink px-1 py-[1px] text-[9px] font-extrabold leading-none text-lime">{cur.short}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <m.ul role="menu" aria-label={t.nav.langMenuLabel}
                    initial={reduced ? false : { opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="glass-flat absolute right-0 top-12 z-10 m-0 w-48 list-none origin-top-right p-1.5 !rounded-[14px]">
                    {LANGS.map(l => (
                      <li key={l.code} role="none">
                        <button type="button" role="menuitemradio" aria-checked={l.code === lang} onClick={() => { setLang(l.code); setLangOpen(false) }}
                          className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[15px] font-semibold transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-violet ${l.code === lang ? 'bg-ink text-white hover:!bg-ink' : 'text-ink'}`}>
                          {l.name}<span className={`text-xs font-extrabold ${l.code === lang ? 'text-lime' : 'text-ink/40'}`}>{l.short}</span>
                        </button>
                      </li>
                    ))}
                  </m.ul>
                )}
              </AnimatePresence>
            </div>
            <LimeButton href={t.nav.cta.href} small className="!h-[44px] max-md:!px-3.5">{t.nav.cta.label}</LimeButton>
            <button type="button" className="round-btn !size-11 xl:!hidden" aria-label={MENU[lang]} aria-expanded={sheet} onClick={() => setSheet(true)}>
              <Menu size={24} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {sheet && (
          <m.div ref={sheetRef} role="dialog" aria-modal="true" aria-label={MENU[lang]}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto"
            style={{ background: 'radial-gradient(60% 40% at 15% 0%, rgba(255,255,255,.35), transparent 70%), linear-gradient(in oklch 180deg,#3A9FFF 0%,#57B4FF 14%,#A9D8FF 38%,#D2D9FF 56%,#E6E4FF 72%,#EEF0FB 100%)' }}
            initial={reduced ? false : { opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="wrap flex h-[60px] items-center md:h-[72px]">
              <Logo size={24} />
              <button type="button" className="round-btn ml-auto !size-11" aria-label={t.ui.langHint.close} onClick={() => setSheet(false)} data-autofocus>
                <X size={26} aria-hidden />
              </button>
            </div>
            <nav className="wrap mt-6 flex flex-col gap-1" aria-label="mobile">
              {t.nav.links.map((l, i) => (
                <m.a key={l.href} href={l.href} onClick={() => setSheet(false)}
                  initial={reduced ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i + 0.05, type: 'spring', stiffness: 300, damping: 26 }}
                  className="font-puffy flex min-h-[52px] items-center text-[34px] font-black uppercase leading-none text-ink focus-visible:outline-3 focus-visible:outline-violet">
                  {l.label}
                </m.a>
              ))}
            </nav>
            <div className="wrap mt-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[.08em] text-ink/60">{t.nav.langMenuLabel}</p>
              <div className="flex flex-wrap gap-2">
                {LANGS.map(l => (
                  <button key={l.code} type="button" onClick={() => setLang(l.code)} aria-pressed={l.code === lang}
                    className={`min-h-11 rounded-[12px] border-[1.5px] border-ink px-4 text-[15px] font-bold ${l.code === lang ? 'bg-ink text-lime' : 'bg-white/60 text-ink'}`}>
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="wrap mt-6">
              <button type="button" onClick={() => switchTheme('dark', lang)}
                className="inline-flex min-h-11 items-center gap-2 rounded-[12px] border-[1.5px] border-ink bg-ink px-4 text-[15px] font-bold text-white focus-visible:outline-3 focus-visible:outline-violet">
                <Moon size={18} aria-hidden />{THEME_LABEL.dark[lang]}
              </button>
            </div>
            <div className="wrap mb-10 mt-auto pt-10">
              <LimeButton href={t.nav.cta.href} className="w-full" onClick={() => setSheet(false)}>{t.nav.cta.label}</LimeButton>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
