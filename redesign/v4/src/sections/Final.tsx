// FINAL (#download): «one phrase and ➤», OS-aware download, three OS buttons (own one lit), «which Mac», support.
// Also the footer and the phone action bar.
import { Apple, ArrowDown, Plus } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { LANGS, type DownloadPlatform } from '@kadr/shared/content/index.ts'
import { toH } from '../ui/copy'
import { Cta, useCtaLabel } from '../ui/cta'
import { gen, OS_NAME, useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Btn, Reveal, Section, cx } from '../ui/kit'
import { clean } from '../ui/text'
import { Logo } from './Nav'

function WinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <rect x="2" y="2" width="9.3" height="9.3" rx="1" /><rect x="12.7" y="2" width="9.3" height="9.3" rx="1" />
      <rect x="2" y="12.7" width="9.3" height="9.3" rx="1" /><rect x="12.7" y="12.7" width="9.3" height="9.3" rx="1" />
    </svg>
  )
}

const LIGHT: Record<DownloadPlatform['os'], string> = { windows: 'var(--lime)', 'mac-arm': 'var(--pink)', 'mac-intel': 'var(--lilac)' }

function PlayObject() {
  const src = gen('v4-obj-play.webp')
  return (
    <div className="obj slot final-obj" data-v4-slot="download-object" aria-hidden>
      <div className="fb obj-fb">{src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <i className="play-css" />}</div>
    </div>
  )
}

export function Final() {
  const { t, p, c } = useT()
  const k = p.final
  const label = useCtaLabel()
  const [mac, setMac] = useState(false)
  const win = t.download.platforms.find((x) => x.os === 'windows')
  const mine = (os: DownloadPlatform['os']) => (OS_NAME === 'win' && os === 'windows') || (OS_NAME === 'mac' && os !== 'windows')
  // Windows downloads right away; on a Mac the visitor picks M or Intel below
  const href = OS_NAME === 'win' && win ? win.href : '#dl-os'
  return (
    <Section id="download" className="final">
      <div className="wrap final-grid">
        <PlayObject />
        <div className="final-copy">
          <div className="head head-copy final-head">
            <Heading h={toH(clean(k.title))} className="final-h" />
            <p className="lead head-sub" data-v4-safe>{clean(k.subtitle)}</p>
          </div>
          <div className="final-cta" data-v4-safe>
            <Btn href={href} arrow download={href !== '#dl-os'}>{label(k.cta.label, k.cta.osAware)}</Btn>
          </div>
          <ul id="dl-os" className="os-row">
            {t.download.platforms.map((pl, i) => (
              <Reveal as="li" key={pl.os} delay={i * 80}>
                <a className={cx('os-btn', mine(pl.os) && 'mine')} href={pl.href} style={{ '--c': LIGHT[pl.os] } as CSSProperties} download>
                  <span className="os-ic">{pl.os === 'windows' ? <WinIcon /> : <Apple size={24} strokeWidth={1.6} />}</span>
                  <span className="os-t">
                    <span className="os-name">{clean(pl.name)}</span>
                    {mine(pl.os) && <span className="os-sub">{c.download.yours}</span>}
                  </span>
                  <ArrowDown className="os-arrow" size={18} aria-hidden />
                </a>
              </Reveal>
            ))}
          </ul>
          <p className="hud final-platforms">{clean(k.platforms)}</p>
          <div className="final-more">
            <button type="button" className={cx('more-btn', mac && 'on')} aria-expanded={mac} aria-controls="mac-note" onClick={() => setMac(!mac)}>
              <Plus size={18} aria-hidden className="more-plus" />
              <span>{clean(k.macHelp.label)}</span>
            </button>
            <div id="mac-note" className={cx('collapse', mac && 'on')}>
              <div className="collapse-i"><p className="muted mac-note">{clean(k.macHelp.text)}</p></div>
            </div>
            <a className="ilink final-sup" href={k.support.href} target="_blank" rel="noopener">{clean(k.support.label)}</a>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function Footer() {
  const { t, setLang, lang } = useT()
  return (
    <footer className="footer" id="footer">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Logo />
          <p className="muted foot-note">{clean(t.footer.note)}</p>
        </div>
        <ul className="foot-links">
          {t.footer.links.map((l) => (
            <li key={l.href}><a className="ilink" href={l.href} {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noopener' } : null)}>{clean(l.label)}</a></li>
          ))}
        </ul>
        <div className="foot-langs" role="group" aria-label={t.nav.langMenuLabel}>
          {LANGS.map((l) => (
            <button key={l.code} type="button" className={cx('lang-pill', l.code === lang && 'on')} aria-pressed={l.code === lang} onClick={() => setLang(l.code)} lang={l.code}>{l.short}</button>
          ))}
        </div>
        <p className="hud foot-copy">{clean(t.footer.copyright)}</p>
      </div>
    </footer>
  )
}

/** Phones: «send the link to yourself» + «prices» after the hero; hidden over the final section, the footer and any lit button. */
export function MobileBar() {
  const { t, p } = useT()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => {
      const over = (id: string) => { const r = document.getElementById(id)?.getBoundingClientRect(); return !!r && r.top < innerHeight && r.bottom > 0 }
      const lime = Array.from(document.querySelectorAll('main .btn-light')).some((b) => {
        const r = b.getBoundingClientRect()
        return r.height > 0 && r.top < innerHeight && r.bottom > 0
      })
      setShow(scrollY > innerHeight * 0.8 && !lime && !over('download') && !over('footer'))
    }
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  const [a, b] = p.mobileBar.ctas
  return (
    <div role="region" aria-label={clean(t.mobileBar.label)} className={cx('mbar glass', show && 'on')} inert={!show}>
      {a && <Cta cta={a} className="mbar-a" />}
      {b && <Cta cta={b} kind="glass" className="mbar-b" />}
    </div>
  )
}
