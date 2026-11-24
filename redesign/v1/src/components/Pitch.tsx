// Sales blocks of the rewrite: promises after the hero, the KADR Cloud section (main selling point) with the
// phone-version teaser, and the final CTA band before the footer. All copy comes from shared/content.
import { Clapperboard, Cloud as CloudIcon, Film, Gift, ShieldCheck, Smartphone, Sparkles, Timer, Zap, type LucideIcon } from 'lucide-react'
import { useLang } from '@kadr/shared/i18n'
import { Btn, Hud, Rv, RvGroup, SectionHead, Splice } from './ui'

const PROMISE_ICONS: Record<string, LucideIcon> = { Clapperboard, Cloud: CloudIcon, Film, Gift, ShieldCheck, Timer, Zap, Sparkles }

export function Promises() {
  const { t } = useLang()
  const p = t.promises
  if (!p) return null
  return (
    <section id="promises" className="sec promises" aria-labelledby="prom-h" data-scene="dust" data-scene-alpha=".3">
      <div className="wrap">
        <SectionHead n={1} id="prom-h" tag={p.tag} title={p.title} center />
        <RvGroup as="ul" className="prom-grid" amount={0.15} stagger={0.06}>
          {p.items.map((it) => {
            const I = PROMISE_ICONS[it.icon] ?? Sparkles
            return (
              <Rv key={it.title} as="li" className="prom glass">
                <span className="prom-ic" aria-hidden><I size={22} strokeWidth={1.6} /></span>
                <h3 className="prom-h">{it.title}</h3>
                <p className="prom-p">{it.text}</p>
              </Rv>
            )
          })}
        </RvGroup>
      </div>
    </section>
  )
}

/** Three GPU boards in perspective: spinning fans, gold PCIe edge, heat light rising (CSS only, decorative). */
function GpuRig() {
  return (
    <div className="rig" aria-hidden>
      <div className="rig-glow" />
      <div className="rig-beams"><i /><i /><i /></div>
      <div className="rig-stack">
        {[0, 1, 2].map((k) => (
          <div key={k} className={`gpu gpu-${k}`}>
            <div className="gpu-shroud">
              <span className="fan"><i /></span>
              <span className="fan"><i /></span>
              <span className="gpu-led" />
            </div>
            <div className="gpu-pcie" />
          </div>
        ))}
      </div>
      <div className="rig-floor" />
    </div>
  )
}

export function CloudSec() {
  const { t } = useLang()
  const c = t.cloud
  const m = t.mobileSoon
  if (!c) return null
  return (
    <section id="cloud" className="sec cloud" aria-labelledby="cloud-h" data-scene="dust" data-scene-x=".72" data-scene-alpha=".45">
      <Splice />
      <div className="wrap cloud-grid">
        <div className="cloud-text">
          <SectionHead n={9} id="cloud-h" tag={c.tag} title={c.title} lead={c.lead} />
          <RvGroup as="ol" className="cloud-list" amount={0.2}>
            {c.bullets.map((b, i) => (
              <Rv key={b} as="li"><span className="cloud-n" aria-hidden>{String(i + 1).padStart(2, '0')}</span><span>{b}</span></Rv>
            ))}
          </RvGroup>
          <Rv className="cloud-cta">
            <Btn variant="primary" href={c.cta.href} arrow magnetic icon={<Zap size={16} aria-hidden />}>{c.cta.label}</Btn>
          </Rv>
        </div>
        <Rv className="cloud-visual" delay={0.1}>
          <GpuRig />
          {m && (
            <aside className="soon glass" aria-label={m.title}>
              <Hud />
              <span className="soon-ic" aria-hidden><Smartphone size={20} strokeWidth={1.6} /></span>
              <div>
                <p className="soon-tag">{m.tag}</p>
                <h3 className="soon-h">{m.title}</h3>
                <p className="soon-p">{m.text}</p>
              </div>
            </aside>
          )}
        </Rv>
      </div>
    </section>
  )
}

export function CtaBand() {
  const { t } = useLang()
  const b = t.ctaBand
  if (!b) return null
  return (
    <section className="band" aria-labelledby="band-h">
      <div className="wrap">
        <Rv className="band-in">
          <div className="band-perf" aria-hidden />
          <div className="band-body">
            <div>
              <h2 id="band-h" className="band-h">{b.title}</h2>
              <p className="band-sub">{b.subtitle}</p>
            </div>
            <Btn variant="primary" href={b.cta.href} arrow magnetic>{b.cta.label}</Btn>
          </div>
          <div className="band-perf" aria-hidden />
        </Rv>
      </div>
    </section>
  )
}
