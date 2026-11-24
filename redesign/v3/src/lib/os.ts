import { useEffect, useState } from 'react'
import type { Cta, SiteContent } from '@kadr/shared/content/index.ts'

type OS = 'mac' | 'win' | null
function detect(): OS {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return null
  if (/Mac/i.test(ua)) return 'mac'
  if (/Win/i.test(ua)) return 'win'
  return null
}

/** Like site.js: osAware CTAs say «Download for Mac/Windows» on those desktops. */
export function useCtaLabel(t: SiteContent) {
  const [os, setOs] = useState<OS>(null)
  useEffect(() => setOs(detect()), [])
  return (c: Cta) => (c.osAware && os === 'mac' ? t.ui.downloadMac : c.osAware && os === 'win' ? t.ui.downloadWindows : c.label)
}

/** Strips a leading «▶ » from labels whose play symbol is drawn as an icon. */
export const noPlay = (s: string) => s.replace(/^▶\s*/, '')
