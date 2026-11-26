// Calls to action of the CRO page (`content.page`): one renderer for every PageCta, including its `action`.
import { useState } from 'react'
import type { PageCta } from '@kadr/shared/content/index.ts'
import { OS_NAME, useT } from './env'
import { Btn, PlayLink } from './kit'
import { bare, clean } from './text'

export const PLAY_REEL = 'v4:play-reel'
export const PLAY_TUTORIAL = 'v4:play-tutorial'

/** navigator.share on phones, clipboard elsewhere. Returns true when the link was copied (to show «link copied»). */
export async function shareLink(title: string): Promise<boolean> {
  const url = location.href.split('#')[0]
  try {
    if (navigator.share) { await navigator.share({ title, url }); return false }
    await navigator.clipboard.writeText(url)
    return true
  } catch { return false }
}

/** Label of an osAware CTA: «Скачать для Mac/Windows» on those desktops. */
export function useCtaLabel() {
  const { t } = useT()
  return (label: string, osAware?: boolean) =>
    bare(osAware && OS_NAME === 'mac' ? t.ui.downloadMac : osAware && OS_NAME === 'win' ? t.ui.downloadWindows : label)
}

/** Renders a PageCta: primary («Свет») for variant main, glass or play-link for ghost. */
export function Cta({ cta, kind, onDisclose, expanded, className, full }: {
  cta: PageCta
  /** Force a look; default: main → primary, ghost with play action → play link, other ghost → glass. */
  kind?: 'primary' | 'glass' | 'play'
  onDisclose?: () => void
  expanded?: boolean
  className?: string
  full?: boolean
}) {
  const { t } = useT()
  const label = useCtaLabel()(cta.label, cta.osAware)
  const [copied, setCopied] = useState(false)
  const look = kind ?? (cta.variant === 'main' ? 'primary' : cta.action === 'play-reel' || cta.action === 'play-tutorial' ? 'play' : 'glass')
  const run = () => {
    if (cta.action === 'share') { shareLink(t.meta.title).then((c) => { if (c) { setCopied(true); setTimeout(() => setCopied(false), 2400) } }); return }
    if (cta.action === 'play-reel') { dispatchEvent(new Event(PLAY_REEL)); return }
    if (cta.action === 'play-tutorial') { dispatchEvent(new Event(PLAY_TUTORIAL)); return }
    if (cta.action === 'disclose') { onDisclose?.(); return }
  }
  const text = copied ? clean(t.ui.linkCopied) : label
  const cls = [className, full && 'w-full'].filter(Boolean).join(' ')
  if (look === 'play') return <PlayLink onClick={run} className={cls}>{text}</PlayLink>
  if (cta.action) {
    return (
      <Btn kind={look === 'primary' ? 'primary' : 'glass'} onClick={run} className={cls} arrow={look === 'primary' && cta.action !== 'disclose'} expanded={cta.action === 'disclose' ? expanded : undefined}>
        {text}
      </Btn>
    )
  }
  return (
    <Btn kind={look === 'primary' ? 'primary' : 'glass'} href={cta.href} className={cls} arrow={look === 'primary'}>
      {text}
    </Btn>
  )
}
