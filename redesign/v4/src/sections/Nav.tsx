// Floating capsule nav (DESIGN-V4 2 / 9).
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { LANGS } from '@kadr/shared/content/index.ts'
import { useOverlay } from '@kadr/shared/ui/useOverlay'
import { useT } from '../ui/env'
import { Btn, cx } from '../ui/kit'
import { bare } from '../ui/text'
import { lockScroll, onFrame } from '../ui/stage'
import { stageInput } from '../engine/contract'

export function Logo({ className }: { className?: string }) {
  const { t } = useT()
  return (
    <a href="#top" className={cx('logo', className)} aria-label="KADR Studio">
      <span className="logo-k">{t.nav.logo.text}</span>
      <span className="logo-s">{t.nav.logo.em}</span>
    </a>
  )
}

function LangMenu({ up }: { up?: boolean }) {
  const { lang, t, setLang, c } = useT()
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const off = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', off)
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', key) }
  }, [open])
  return (
    <div ref={box} className="lang">
      <button type="button" className="lang-btn" aria-haspopup="listbox" aria-expanded={open} aria-label={`${c.nav.lang}: ${t.nav.langCurrent.full}`} onClick={() => setOpen((o) => !o)}>
        {t.nav.langCurrent.short}
      </button>
      {open && (
        <ul className={cx('lang-list glass', up && 'lang-up')} role="listbox" aria-label={t.nav.langMenuLabel}>
          {LANGS.map((l) => (
            <li key={l.code}>
              <button type="button" role="option" aria-selected={l.code === lang} className={cx('lang-opt', l.code === lang && 'on')} onClick={() => { setLang(l.code); setOpen(false) }}>
                <span>{l.name}</span><span className="hud">{l.short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export { LangMenu }

export function Nav() {
  const { t, c } = useT()
  const [small, setSmall] = useState(false)
  const [active, setActive] = useState('')
  const [sheet, setSheet] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  useOverlay(sheet, sheetRef, () => setSheet(false))
  useEffect(() => { lockScroll(sheet) }, [sheet])
  useEffect(() => {
    let s = false, a = ''
    return onFrame(() => {
      const ns = stageInput.scrollY > 120
      if (ns !== s) { s = ns; setSmall(ns) }
      const na = stageInput.active
      if (na !== a) { a = na; setActive(na) }
    })
  }, [])
  const links = c.nav.links
  const dl = bare(t.nav.cta.label)
  return (
    <header className={cx('nav', small && 'nav-small')}>
      <nav className="nav-cap glass" aria-label="KADR Studio">
        <Logo />
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={cx('nav-a', active === l.href.slice(1) && 'on')} aria-current={active === l.href.slice(1) ? 'true' : undefined}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-lang"><LangMenu /></div>
        <Btn kind="glass" size="sm" href="#download" className="nav-dl">{dl}</Btn>
        <button type="button" className="nav-burger" aria-label={c.nav.menu} aria-expanded={sheet} onClick={() => setSheet(true)}>
          <Menu size={20} />
        </button>
      </nav>
      {sheet && (
        <div ref={sheetRef} className="sheet" role="dialog" aria-modal="true" aria-label={c.nav.menu}>
          <div className="sheet-top">
            <Logo />
            <button type="button" className="round-btn" aria-label={c.nav.close} onClick={() => setSheet(false)} data-autofocus><X size={20} /></button>
          </div>
          <ul className="sheet-links">
            {links.map((l) => <li key={l.href}><a href={l.href} onClick={() => setSheet(false)}>{l.label}</a></li>)}
            <li><a href="#faq" onClick={() => setSheet(false)}>FAQ</a></li>
          </ul>
          <div className="sheet-lang">
            <SheetLangs onPick={() => setSheet(false)} />
          </div>
          <Btn href="#download" onClick={() => setSheet(false)} className="w-full" arrow>{dl}</Btn>
        </div>
      )}
    </header>
  )
}

function SheetLangs({ onPick }: { onPick: () => void }) {
  const { lang, setLang } = useT()
  return (
    <>
      {LANGS.map((l) => (
        <button key={l.code} type="button" className={cx('lang-pill', l.code === lang && 'on')} aria-pressed={l.code === lang} onClick={() => { setLang(l.code); onPick() }}>
          {l.short}
        </button>
      ))}
    </>
  )
}
