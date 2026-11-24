import {
  AppWindow, Captions, Clapperboard, Cpu, FileText, Image as ImageIcon, KeyRound, Languages, Laptop, Mic,
  Music, PenLine, Scissors, Sparkles, UserRound, type LucideIcon,
} from 'lucide-react'
import { useLang } from '@kadr/shared/i18n'
import { Hud, More, Rv, RvGroup, SectionHead, Splice } from './ui'

export function Req() {
  const { t, lang } = useLang()
  const r = t.req
  return (
    <section id="req" className="sec" aria-labelledby="req-h" data-scene="dust" data-scene-alpha=".25">
      <Splice />
      <div className="wrap">
        <SectionHead n={8} id="req-h" tag={r.tag} title={r.title} lead={r.lead} />
        <RvGroup className="req-grid" amount={0.15}>
          {r.tiers.map((tier, i) => (
            <Rv key={tier.who} as="article" className="glass req-card">
              <Hud />
              <p className="req-who"><span>{String(i + 1).padStart(2, '0')}</span>{tier.who}</p>
              <h3 className="h3">{tier.title}</h3>
              {tier.paragraphs.map((p) => <p key={p} className="req-p">{p}</p>)}
              <More text={tier.details} lang={lang} />
            </Rv>
          ))}
        </RvGroup>
        <Rv className="notes">
          <h3 className="notes-h">{r.notes.title}</h3>
          <ol className="notes-list">
            {r.notes.items.map((n, i) => (
              <li key={n}><span className="notes-i" aria-hidden>{String(i + 1).padStart(2, '0')}</span><span>{n}</span></li>
            ))}
          </ol>
        </Rv>
      </div>
    </section>
  )
}

// site symbols → lucide equivalents (same order in every language)
const ICONS: Record<string, LucideIcon> = {
  '✎': PenLine, '♪': Mic, '▣': ImageIcon, '▶': Clapperboard, '♫': Music, 'Aa': Captions, '✂': Scissors,
  '☺': UserRound, '文': Languages, '✉': FileText, '✦': Sparkles, '⚿': KeyRound,
}

export function Features() {
  const { t, lang } = useLang()
  const f = t.features
  return (
    <section id="features" className="sec" aria-labelledby="feat-h" data-scene="dust" data-scene-alpha=".3">
      <Splice />
      <div className="wrap">
        <SectionHead n={10} id="feat-h" tag={f.tag} title={f.title} lead={f.lead} />
        <RvGroup as="ul" className="feat-grid" amount={0.08} stagger={0.05}>
          {f.items.map((it) => {
            const I = ICONS[it.icon] ?? Sparkles
            return (
              <Rv key={it.title} as="li" className="feat">
                <span className="feat-ic" aria-hidden><I size={20} strokeWidth={1.75} /></span>
                <h3 className="feat-h">{it.title}</h3>
                <p className="feat-p">{it.text}</p>
                <More text={it.details} lang={lang} />
              </Rv>
            )
          })}
        </RvGroup>
      </div>
    </section>
  )
}

export const OS_ICON: Record<string, LucideIcon> = { windows: AppWindow, 'mac-arm': Cpu, 'mac-intel': Laptop }
