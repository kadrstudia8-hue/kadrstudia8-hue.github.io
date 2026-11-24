import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Download, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { LANGS, type Lang } from '@kadr/shared/content/index'
import { useLang } from '@kadr/shared/i18n'
import { useOverlay } from '@kadr/shared/ui/useOverlay'
import { EASE, useReduced } from '../lib/env'

const NAV_ANCHORS = ['#proof', '#how', '#pricing']

export function Logo({ href = '#top' }: { href?: string }) {
  return (
    <a className="logo" href={href} aria-label="KADR Studio">
      <i aria-hidden />KADR <em>studio</em>
    </a>
  )
}

function LangMenu({ onPick }: { onPick?: () => void }) {
  const { lang, t, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: Event) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc) }
  }, [open])
  const pick = (l: Lang) => { setLang(l); setOpen(false); onPick?.() }
  return (
    <div className="lang" ref={ref}>
      <button type="button" className="lang-btn" aria-haspopup="listbox" aria-expanded={open} aria-label={`${t.nav.langMenuLabel}: ${t.nav.langCurrent.full}`} onClick={() => setOpen((o) => !o)}>
        <span>{t.nav.langCurrent.short}</span>
        <ChevronDown size={14} aria-hidden className={open ? 'rotate-180' : ''} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul className="lang-list" role="listbox" aria-label={t.nav.langMenuLabel}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            {LANGS.map((l) => (
              <li key={l.code}>
                <button type="button" role="option" aria-selected={l.code === lang} className="lang-opt" onClick={() => pick(l.code)} lang={l.code}>
                  <span className="lang-opt-short">{l.short}</span>{l.name}
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
  const { lang, t, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)
  const reduced = useReduced()
  useOverlay(menu, sheet, () => setMenu(false))
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 80)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const links = NAV_ANCHORS.map((h) => t.nav.links.find((l) => l.href === h)).filter(Boolean) as { label: string; href: string }[]

  return (
    <>
      <header className={`nav${scrolled ? ' is-glass' : ''}`}>
        <div className="wrap nav-row">
          <nav className="nav-left" aria-label="KADR Studio">
            <button type="button" className="burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(true)}>
              <Menu size={22} aria-hidden />
            </button>
            {links.map((l) => <a key={l.href} className="nav-link" href={l.href}>{l.label}</a>)}
          </nav>
          <Logo />
          <div className="nav-right">
            <LangMenu />
            <a className={`nav-cta${t.nav.cta.label.length > 9 ? ' is-long' : ''}`} href={t.nav.cta.href}><Download size={16} aria-hidden />{t.nav.cta.label}</a>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.div ref={sheet} className="sheet" role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.24, ease: EASE }}>
            <div className="wrap sheet-top">
              <span />
              <Logo />
              <button type="button" className="burger sheet-close" aria-label="×" onClick={() => setMenu(false)}><X size={22} aria-hidden /></button>
            </div>
            <nav className="wrap sheet-links">
              {links.map((l, i) => (
                <motion.a key={l.href} href={l.href} onClick={() => setMenu(false)}
                  initial={reduced ? false : { y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 + i * 0.07, duration: 0.5, ease: EASE }}>
                  <span className="sheet-n">{String(i + 1).padStart(2, '0')}</span>{l.label}
                </motion.a>
              ))}
            </nav>
            <div className="wrap sheet-langs" role="group" aria-label={t.nav.langMenuLabel}>
              {LANGS.map((l) => (
                <button key={l.code} type="button" aria-pressed={l.code === lang} className="sheet-lang" onClick={() => setLang(l.code)} lang={l.code}>{l.short}</button>
              ))}
            </div>
            <div className="wrap sheet-cta">
              <a className="btn btn-primary w-full" href={t.nav.cta.href} onClick={() => setMenu(false)}><span className="btn-label">{t.nav.cta.label}</span></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
