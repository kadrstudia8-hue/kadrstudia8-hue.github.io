// DOWNLOAD (#download): three OS buttons (real release links), «which Mac do I have?», chrome play object.
import { Apple, ArrowDown, Plus } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { DownloadPlatform } from '@kadr/shared/content/index.ts'
import { gen, OS_NAME, useT } from '../ui/env'
import { Heading } from '../ui/Heading'
import { Reveal, Section, cx } from '../ui/kit'
import { clean } from '../ui/text'

function WinIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <rect x="2" y="2" width="9.3" height="9.3" rx="1" /><rect x="12.7" y="2" width="9.3" height="9.3" rx="1" />
      <rect x="2" y="12.7" width="9.3" height="9.3" rx="1" /><rect x="12.7" y="12.7" width="9.3" height="9.3" rx="1" />
    </svg>
  )
}

const LIGHT: Record<DownloadPlatform['os'], string> = { windows: 'var(--lime)', 'mac-arm': 'var(--pink)', 'mac-intel': 'var(--lilac)' }

export function PlayObject({ slot, className }: { slot: string; className?: string }) {
  const src = gen('v4-obj-play.webp')
  return (
    <div className={cx('obj slot', className)} data-v4-slot={slot} aria-hidden>
      <div className="fb obj-fb">
        {src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <i className="play-css" />}
      </div>
    </div>
  )
}

export function Download() {
  const { t, c } = useT()
  const [mac, setMac] = useState(false)
  const mine = (os: DownloadPlatform['os']) => (OS_NAME === 'win' && os === 'windows') || (OS_NAME === 'mac' && os !== 'windows')
  return (
    <Section id="download" className="download">
      <div className="wrap dl-grid">
        <div className="dl-copy">
          <Heading h={c.download.h} className="head" />
          <ul className="os-list">
            {t.download.platforms.map((p, i) => (
              <Reveal as="li" key={p.os} delay={i * 80}>
                <a className={cx('os-btn', mine(p.os) && 'mine')} href={p.href} style={{ '--c': LIGHT[p.os] } as CSSProperties} download>
                  <span className="os-ic">{p.os === 'windows' ? <WinIcon /> : <Apple size={28} strokeWidth={1.6} />}</span>
                  <span className="os-t">
                    <span className="os-name">{clean(p.cta)}</span>
                    <span className="os-sub">{clean(p.details)}</span>
                  </span>
                  <ArrowDown className="os-arrow" size={20} aria-hidden />
                </a>
              </Reveal>
            ))}
          </ul>
          <div className="req-more">
            <button type="button" className={cx('more-btn', mac && 'on')} aria-expanded={mac} aria-controls="mac-note" onClick={() => setMac(!mac)}>
              <Plus size={18} aria-hidden className="more-plus" />
              <span>{c.download.mac}</span>
            </button>
            <div id="mac-note" className={cx('collapse', mac && 'on')}>
              <div className="collapse-i"><p className="muted mac-note">{clean(t.download.note)}</p></div>
            </div>
          </div>
        </div>
        <PlayObject slot="download-object" className="dl-obj" />
      </div>
    </Section>
  )
}
