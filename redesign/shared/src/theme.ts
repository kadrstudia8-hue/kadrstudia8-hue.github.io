// Site theme = which design is shown: dark (V4, the default) or light (V2).
// The two designs are separate pages. The toggle remembers the choice and opens the matching page in the same language.
// Published pages carry <html data-site data-theme="dark|light" data-page-lang="uk|ru|en|es|de"> (see tools/publish.mjs);
// in dev and standalone builds those attributes are absent and nothing navigates.
import type { Lang } from './content/index.ts'

export type Theme = 'dark' | 'light'
export const THEME_KEY = 'kadr-theme'

/** Page file per theme and language, relative to the site folder ('' = the folder index). */
export const PAGES: Record<Theme, Record<Lang, string>> = {
  dark: { uk: '', ru: 'landing.html', en: 'landing-en.html', es: 'landing-es.html', de: 'landing-de.html' },
  light: { uk: 'light.html', ru: 'light-ru.html', en: 'light-en.html', es: 'light-es.html', de: 'light-de.html' },
}

/** Button label: the theme the button switches to. */
export const THEME_LABEL: Record<Theme, Record<Lang, string>> = {
  light: { uk: 'Світла тема', ru: 'Светлая тема', en: 'Light theme', es: 'Tema claro', de: 'Helles Design' },
  dark: { uk: 'Темна тема', ru: 'Тёмная тема', en: 'Dark theme', es: 'Tema oscuro', de: 'Dunkles Design' },
}

const root = () => (typeof document !== 'undefined' ? document.documentElement : null)

/** True on the published site pages; false in dev and standalone previews. */
export function onSite(): boolean {
  return root()?.dataset.site !== undefined
}

/** Theme of the page that is open. */
export function pageTheme(fallback: Theme = 'dark'): Theme {
  const v = root()?.dataset.theme
  return v === 'light' || v === 'dark' ? v : fallback
}

/** Language the published page was built for (undefined in dev). */
export function pageLang(): string | undefined {
  return onSite() ? root()?.dataset.pageLang : undefined
}

export function pageUrl(theme: Theme, lang: Lang): string {
  return new URL(PAGES[theme][lang], new URL('.', window.location.href)).href
}

/** '#id' of the section the visitor is looking at, so the other page opens at the same place. */
function currentAnchor(): string {
  let id = ''
  const line = window.innerHeight * 0.4
  document.querySelectorAll<HTMLElement>('section[id]').forEach(s => {
    if (s.getBoundingClientRect().top <= line) id = s.id
  })
  if (window.scrollY < window.innerHeight * 0.5) return ''
  return id ? `#${id}` : ''
}

/** Open the page for a theme and language (published site only). */
export function openPage(theme: Theme, lang: Lang) {
  if (!onSite()) return
  window.location.assign(pageUrl(theme, lang) + currentAnchor())
}

/** Remember the theme and open its page. */
export function switchTheme(to: Theme, lang: Lang) {
  try { window.localStorage.setItem(THEME_KEY, to) } catch { /* storage unavailable: the choice lasts for this visit only */ }
  openPage(to, lang)
}
