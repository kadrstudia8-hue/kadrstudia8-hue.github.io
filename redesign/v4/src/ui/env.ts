// Environment flags and small shared helpers for V4 INTERFACE.
import { useEffect, useState, useSyncExternalStore } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { COPY } from './copy'

const q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams()

/** ?still: every animation is rendered in its final frame (screenshots, layout QA). */
export const STILL = q.has('still')
/** ?noengine: never load the WebGL engine. */
export const NO_ENGINE = q.has('noengine')

const mm = (s: string) => typeof matchMedia !== 'undefined' && matchMedia(s).matches
export const REDUCED = mm('(prefers-reduced-motion: reduce)')
export const COARSE = mm('(pointer: coarse)')
export const FINE = mm('(hover: hover) and (pointer: fine)')
export const SAVE_DATA = typeof navigator !== 'undefined' && !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
/** No loops, no autoplay: reduced motion or still mode. */
export const CALM = REDUCED || STILL

export function isPhone() {
  return COARSE && typeof innerWidth !== 'undefined' && innerWidth < 768
}

/** Whether the WebGL engine may be loaded at all (DESIGN-V4 11.1). */
export const ENGINE_ALLOWED = !NO_ENGINE && !REDUCED && !SAVE_DATA && !isPhone()

// ---------------------------------------------------------------- OS
export type OS = 'mac' | 'win' | null
function detectOS(): OS {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return null
  if (/Mac/i.test(ua)) return 'mac'
  if (/Win/i.test(ua)) return 'win'
  return null
}
export const OS_NAME: OS = detectOS()

// ---------------------------------------------------------------- generated assets (public/gen)
// The list comes from the file system at build/dev time, so a missing file is never requested (no 404).
const GEN = import.meta.glob('../../public/gen/*.{webp,mp4,png,jpg}', { query: '?url', import: 'default', eager: true }) as Record<string, string>
const genByName: Record<string, string> = {}
for (const k of Object.keys(GEN)) genByName[k.split('/').pop()!] = `gen/${k.split('/').pop()}`

export type GenId =
  | 'v4-gpu-farm.webp' | 'v4-gpu-farm-loop.mp4' | 'v4-prism-macro.webp' | 'v4-obj-play.webp' | 'v4-room.webp'
  | 'v4-obj-camera.webp' | 'v4-obj-clapper.webp' | 'v4-obj-reel.webp' | 'v4-obj-mic.webp' | 'v4-prism-loop.mp4'

/** URL of a generated asset, or null while it does not exist yet. */
export function gen(id: GenId): string | null {
  return genByName[id] ?? null
}

// ---------------------------------------------------------------- copy
export function useT() {
  const { lang, t, setLang } = useLang()
  return { lang, t, c: COPY[lang], setLang }
}

// ---------------------------------------------------------------- media query hook
export function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => { const m = matchMedia(query); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) },
    () => matchMedia(query).matches,
    () => false,
  )
}

/** true once the element has been in view (reveal once). In ?still it is always true. */
export function useInView<T extends Element>(ref: React.RefObject<T | null>, margin = '0px 0px -12% 0px', once = true) {
  const [seen, setSeen] = useState(STILL)
  useEffect(() => {
    if (STILL) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); if (once) io.disconnect() } else if (!once) setSeen(false)
    }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin, once])
  return seen
}
