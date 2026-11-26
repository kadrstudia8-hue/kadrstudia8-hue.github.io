import { Play, Share2 } from 'lucide-react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { PageCta, SiteContent } from '@kadr/shared/content/index'
import { BlackButton, LimeAction, LimeButton, WhiteButton } from './ui'

/** Openers for the two video dialogs, shared by every section. */
export const Players = createContext<{ reel: () => void; tutorial: () => void }>({ reel: () => {}, tutorial: () => {} })

/** navigator.share on phones, otherwise copy the link; label switches to «link copied» for 2.4 s. */
export function useShare(t: SiteContent, label: string) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const url = location.href.split('#')[0]
    try {
      if (navigator.share) { await navigator.share({ url, title: t.meta.title }); return }
      await navigator.clipboard.writeText(url)
      setCopied(true); setTimeout(() => setCopied(false), 2400)
    } catch { /* cancelled or blocked */ }
  }
  return { share, label: copied ? t.ui.linkCopied : label }
}

export type Os = 'windows' | 'mac' | 'other'
export function useOs(): Os {
  const [os, setOs] = useState<Os>('other')
  useEffect(() => {
    const ua = navigator.userAgent
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) setOs('other')
    else if (/Mac/i.test(ua)) setOs('mac')
    else if (/Win/i.test(ua)) setOs('windows')
  }, [])
  return os
}

/** A page CTA rendered in the V2 button language. tone: lime (main), black, white (on dark cards). */
export function CtaButton({ cta, t, tone, className = '', onDisclose, expanded }: {
  cta: PageCta; t: SiteContent; tone?: 'lime' | 'black' | 'white'; className?: string; onDisclose?: () => void; expanded?: boolean
}) {
  const players = useContext(Players)
  const { share, label: shareLabel } = useShare(t, cta.label)
  const kind = tone ?? (cta.variant === 'main' ? 'lime' : 'black')
  if (cta.action) {
    const run = cta.action === 'share' ? share : cta.action === 'play-reel' ? players.reel : cta.action === 'play-tutorial' ? players.tutorial : (onDisclose ?? (() => {}))
    const label = cta.action === 'share' ? shareLabel : cta.label
    const icon = cta.action === 'share' ? <Share2 size={18} strokeWidth={2.4} aria-hidden /> : cta.action.startsWith('play') ? <Play size={16} fill="currentColor" strokeWidth={0} aria-hidden /> : null
    if (kind === 'lime') return <LimeAction className={className} onClick={run} arrow={!icon} aria-expanded={cta.action === 'disclose' ? !!expanded : undefined}>{icon}{label}</LimeAction>
    return (
      <button type="button" onClick={run} aria-expanded={cta.action === 'disclose' ? !!expanded : undefined}
        className={`btn ${kind === 'white' ? 'btn-white' : 'btn-black'} ${className}`}>
        {icon}<span>{label}</span>
      </button>
    )
  }
  if (kind === 'lime') return <LimeButton href={cta.href} className={className}>{cta.label}</LimeButton>
  if (kind === 'white') return <WhiteButton href={cta.href} className={className}>{cta.label}</WhiteButton>
  return <BlackButton href={cta.href} className={className}>{cta.label}</BlackButton>
}
