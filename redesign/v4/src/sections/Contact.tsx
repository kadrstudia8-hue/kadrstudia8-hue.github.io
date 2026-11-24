// CONTACT (#contact), FOOTER and the phone action bar.
import { useEffect, useState } from 'react'
import { LANGS } from '@kadr/shared/content/index.ts'
import { useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Btn, Reveal, Section, cx } from '../ui/kit'
import { bare, clean } from '../ui/text'
import { PlayObject } from './Download'
import { useCtaLabel } from './Hero'
import { Logo } from './Nav'

export function Contact() {
  const { t, c } = useT()
  const ctaLabel = useCtaLabel()
  const [main, support] = [t.contact.ctas.find((x) => x.variant === 'main') ?? t.contact.ctas[0], t.contact.ctas.find((x) => x.variant === 'ghost')]
  return (
    <Section id="contact" className="contact">
      <div className="wrap contact-grid">
        <PlayObject slot="cta-play" className="contact-obj" />
        <div className="contact-copy">
          <Heading h={c.contact.h} className="head contact-h" />
          {t.ctaBand && <Reveal as="p" className="lead contact-lead" data-v4-safe="">{clean(t.ctaBand.subtitle)}</Reveal>}
          <Reveal className="contact-ctas" delay={120} data-v4-safe="">
            <Btn href={main.href} arrow>{ctaLabel(main.label, main.osAware)}</Btn>
            {support && <a className="ilink contact-sup" href={support.href} target="_blank" rel="noopener">{bare(support.label)}</a>}
          </Reveal>
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

/** Phones: sticky bar after the hero, hidden over #download and the footer. */
export function MobileBar() {
  const { t } = useT()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => {
      const over = (id: string) => { const r = document.getElementById(id)?.getBoundingClientRect(); return !!r && r.top < innerHeight && r.bottom > 0 }
      // one lime per screen: hide the bar while a section's primary button is in view
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
  const [a, b] = t.mobileBar.ctas
  return (
    <div role="region" aria-label={clean(t.mobileBar.label)} className={cx('mbar glass', show && 'on')} inert={!show}>
      <Btn href={a.href} className="mbar-a" arrow>{bare(a.label)}</Btn>
      {b && <Btn kind="glass" href={b.href} className="mbar-b">{bare(b.label)}</Btn>}
    </div>
  )
}
