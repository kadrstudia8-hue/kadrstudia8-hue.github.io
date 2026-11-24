// Text hygiene for V4 (DESIGN-V4 1.1): no long/short dashes and no word «ролик» in visible copy.
// Shared content is being rewritten by the copywriter; this keeps V4 clean whatever state it is in.
import type { Inline, Rich } from '@kadr/shared/content/index.ts'

const ROLIK = /(ролик|ролік)(ами|ах|ам|ом|ов|ів|а|у|и|і|е)?/giu

function fixRolik(s: string) {
  return s.replace(ROLIK, (m) => (m[0] === m[0].toUpperCase() ? 'Видео' : 'видео'))
}

/** Removes — and – from visible text: ranges become hyphens, spaced dashes become commas. */
export function clean(s: string): string {
  if (!s) return s
  let r = s
    // ranges without spaces: 3–8, M1–M4, $99–149
    .replace(/([\p{L}\p{N}$])[–—]([\p{L}\p{N}$])/gu, '$1-$2')
    // dash after a sentence-like start of the string ("⚡ — внутренняя")
    .replace(/^\s*([^\s]{1,3})\s+[—–]\s+/u, '$1: ')
    // spaced dash before the end or a closing punctuation
    .replace(/\s+[—–]\s*(?=[.,;:!?)»]|$)/gu, '')
    // dash right after a comma/colon
    .replace(/([,:;])\s*[—–]\s*/gu, '$1 ')
    // every other spaced dash
    .replace(/\s*[—–]\s*/gu, ', ')
  r = fixRolik(r)
  return r.replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ')
}

export function cleanRich(v: Rich): Rich {
  return v.map((p: Inline): Inline => {
    if (typeof p === 'string') return clean(p)
    if ('b' in p) return { b: clean(p.b) }
    if ('a' in p) return { a: clean(p.a), href: p.href }
    return { button: clean(p.button), action: p.action }
  })
}

export function richText(v: Rich): string {
  return v.map((p) => (typeof p === 'string' ? p : 'b' in p ? p.b : 'a' in p ? p.a : p.button)).join('')
}

/** Strips leading «▶ » and trailing arrows: V4 draws those as icons. */
export const bare = (s: string) => clean(s).replace(/^[▶►]\s*/u, '').replace(/\s*[→➜]\s*$/u, '')
