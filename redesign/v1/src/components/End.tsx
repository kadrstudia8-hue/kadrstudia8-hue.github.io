import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { Accordion } from '@kadr/shared/ui/Accordion'
import { Backdrop, Btn, Rich, Rv, SectionHead, Splice, accentTitle } from './ui'
import { Bokeh } from './Sales'
import { Logo } from './Nav'
import { LANGS } from '@kadr/shared/content/index'
import { gen, useOS } from '../lib/env'

export function Faq() {
  const { t, lang } = useLang()
  const f = t.faq
  const open = f.items.map((x, i) => (x.open ? i : -1)).filter((i) => i >= 0)
  return (
    <section id="faq" className="sec faq" aria-labelledby="faq-h" data-scene="dust" data-scene-alpha=".2">
      <Splice />
      <div className="wrap faq-grid">
        <SectionHead n={13} id="faq-h" tag={f.tag} title={f.title} />
        <Rv>
          <Accordion
            key={lang}
            items={f.items.map((x, i) => ({
              id: String(i),
              title: <span className="faq-q"><span className="faq-i" aria-hidden>{String(i + 1).padStart(2, '0')}</span>{x.q}</span>,
              content: <p className="faq-a"><Rich value={x.a} /></p>,
            }))}
            defaultOpen={open}
            className="acc"
            itemClassName="acc-item"
            buttonClassName="acc-btn"
            panelClassName="acc-panel"
            icon={<span className="acc-ic" aria-hidden><Plus size={18} /></span>}
          />
        </Rv>
      </div>
    </section>
  )
}

export function Contact() {
  const { t } = useLang()
  const c = t.contact
  const os = useOS()
  const ref = useRef<HTMLElement>(null)
  const hall = gen('v1-hall.webp')
  return (
    <section ref={ref} id="contact" className="sec contact" aria-labelledby="contact-h" data-scene="play" data-scene-y=".27" data-scene-scale=".46" data-scene-my=".22" data-scene-mscale=".5" data-scene-alpha=".9">
      <Backdrop target={ref} className="contact-bd">
        {hall ? <img className="hall" src={hall} alt="" loading="lazy" width={1536} height={864} /> : <div className="hall hall-css" />}
        <div className="hall-shade" />
        <div className="leak leak-contact" />
      </Backdrop>
      <Bokeh target={ref} n={8} />
      <Splice />
      <div className="wrap contact-in">
        <Rv><p className="eyebrow is-center"><span className="eyebrow-n">14</span>{c.tag}</p></Rv>
        <Rv><h2 id="contact-h" className="h2 contact-h">{accentTitle(c.title)}</h2></Rv>
        <Rv><p className="lead contact-lead">{c.lead}</p></Rv>
        <Rv className="cta-row is-center">
          {c.ctas.map((x) => (
            <Btn key={x.label} variant={x.variant === 'main' ? 'primary' : 'ghost'} href={x.href} arrow={x.variant === 'main'} magnetic={x.variant === 'main'}>
              {x.osAware && os !== 'other' ? (os === 'mac' ? t.ui.downloadMac : t.ui.downloadWindows) : x.label}
            </Btn>
          ))}
        </Rv>
      </div>
    </section>
  )
}

export function Footer() {
  const { t, lang, setLang } = useLang()
  const f = t.footer
  return (
    <footer className="foot" data-scene="dust" data-scene-alpha="0">
      <div className="wrap foot-in">
        <div className="foot-brand">
          <Logo />
          <p className="cap">{f.note}</p>
        </div>
        <nav className="foot-links" aria-label="Footer">
          {f.links.map((l) => <a key={l.href} href={l.href} {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noopener' } : null)}>{l.label}</a>)}
        </nav>
        <div className="foot-langs" role="group" aria-label={t.nav.langMenuLabel}>
          {LANGS.map((l, i) => (
            <span key={l.code}>
              {i > 0 && <span className="foot-dot" aria-hidden>·</span>}
              <button type="button" lang={l.code} aria-pressed={l.code === lang} aria-label={l.name} className="foot-lang" onClick={() => { setLang(l.code); window.scrollTo({ top: 0 }) }}>{l.short}</button>
            </span>
          ))}
        </div>
        <p className="foot-copy cap">{f.copyright}</p>
      </div>
    </footer>
  )
}

/** Phones: sticky call bar after the hero, hidden over #download (as site.js). */
export function MobileBar() {
  const { t } = useLang()
  const b = t.mobileBar
  const [show, setShow] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('top'), dl = document.getElementById('download')
    let pastHero = false, overDl = false
    const set = () => setShow(pastHero && !overDl)
    const io1 = new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; set() })
    const io2 = new IntersectionObserver(([e]) => { overDl = e.isIntersecting; set() })
    if (hero) io1.observe(hero)
    if (dl) io2.observe(dl)
    return () => { io1.disconnect(); io2.disconnect() }
  }, [])
  return (
    <div className={`mbar${show ? ' is-on' : ''}`} role="group" aria-label={b.label} inert={!show || undefined}>
      {b.ctas.map((c) => (
        <a key={c.label} className={`btn ${c.variant === 'main' ? 'btn-primary' : 'btn-ghost'} mbar-btn`} href={c.href}><span className="btn-label">{c.label}</span></a>
      ))}
    </div>
  )
}
