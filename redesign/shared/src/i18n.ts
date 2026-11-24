// Language state for the redesigned site: one global store + a React hook.
// Initial language: ?lang= → localStorage 'kadr-lang' → browser language → 'uk'.
// Storage access is always wrapped in try/catch (private mode, blocked site data, sandboxed iframes).
import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { content, DEFAULT_LANG, isLang, type Lang, type SiteContent } from './content/index.ts'

export const STORAGE_KEY = 'kadr-lang'
const hasWindow = typeof window !== 'undefined'

function readStorage(): string | null {
  try { return hasWindow ? window.localStorage.getItem(STORAGE_KEY) : null } catch { return null }
}
function writeStorage(lang: Lang) {
  try { if (hasWindow) window.localStorage.setItem(STORAGE_KEY, lang) } catch { /* storage unavailable — keep in memory only */ }
}

function fromQuery(): Lang | null {
  if (!hasWindow) return null
  try {
    const v = new URLSearchParams(window.location.search).get('lang')?.toLowerCase()
    return isLang(v) ? v : null
  } catch { return null }
}

function fromBrowser(): Lang | null {
  if (typeof navigator === 'undefined') return null
  const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean)
  for (const tag of list) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLang(base)) return base
  }
  return null
}

export function getInitialLang(): Lang {
  const q = fromQuery()
  if (q) return q
  const s = readStorage()?.toLowerCase()
  if (isLang(s)) return s
  return fromBrowser() ?? DEFAULT_LANG
}

// ---------------------------------------------------------------- store

let current: Lang = hasWindow ? getInitialLang() : DEFAULT_LANG
const listeners = new Set<() => void>()

/** Reflect the language in the document: <html lang>, <title>, meta description. */
export function applyToDocument(lang: Lang) {
  if (typeof document === 'undefined') return
  const meta = content[lang].meta
  document.documentElement.lang = meta.htmlLang
  document.title = meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
}

export function getLang(): Lang {
  return current
}

export function setLang(lang: Lang) {
  if (!isLang(lang)) return
  writeStorage(lang)
  // keep an explicit ?lang= in the address in sync, so a reload doesn't switch back
  if (hasWindow) {
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.has('lang')) {
        url.searchParams.set('lang', lang)
        window.history.replaceState(window.history.state, '', url)
      }
    } catch { /* ignore */ }
  }
  if (lang === current) return
  current = lang
  applyToDocument(lang)
  listeners.forEach(l => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

const getServerSnapshot = (): Lang => DEFAULT_LANG

/** Current language, its content and a setter. Re-renders every subscriber on change. */
export function useLang(): { lang: Lang; t: SiteContent; setLang: (lang: Lang) => void } {
  const lang = useSyncExternalStore(subscribe, getLang, getServerSnapshot)
  useEffect(() => { applyToDocument(lang) }, [lang])
  const set = useCallback((l: Lang) => setLang(l), [])
  return { lang, t: content[lang], setLang: set }
}
