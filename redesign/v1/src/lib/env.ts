import { useEffect, useState } from 'react'
import genFiles from 'virtual:v1-gen'
import { useMediaQuery } from '@kadr/shared/ui/useMediaQuery'
import { usePrefersReducedMotion } from '@kadr/shared/ui/usePrefersReducedMotion'
import { useHasFinePointer } from '@kadr/shared/ui/useIsTouch'

export { usePrefersReducedMotion as useReduced, useHasFinePointer as useFine }

const GEN = new Set<string>(genFiles)
/** URL of a generated decor file, or null when it is not in public/gen (then the caller draws a CSS stand-in). */
export function gen(file: string): string | null {
  return GEN.has(file) ? `gen/${file}` : null
}

export const usePhone = () => useMediaQuery('(max-width: 767px)')
export const useDesktop = () => useMediaQuery('(min-width: 1024px)')

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const SPLICE: [number, number, number, number] = [0.7, 0, 0.3, 1]

export type OS = 'windows' | 'mac' | 'other'
/** Desktop OS of the visitor (phones and tablets → other), as site.js does for the os-aware CTA. */
export function useOS(): OS {
  const [os, setOs] = useState<OS>('other')
  useEffect(() => {
    const ua = navigator.userAgent
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua))
    if (mobile) return
    if (/Windows/i.test(ua)) setOs('windows')
    else if (/Macintosh|Mac OS X/i.test(ua)) setOs('mac')
  }, [])
  return os
}

/** At most one inline video plays at a time: starting one pauses the previous. */
let playing: HTMLVideoElement | null = null
export function claimPlayback(v: HTMLVideoElement) {
  if (playing && playing !== v && !playing.paused) playing.pause()
  playing = v
}
