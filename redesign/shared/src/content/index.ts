// All five languages of the KADR Studio landing. Ukrainian is the default (index.html).
import type { Lang, SiteContent } from './types.ts'
import { uk } from './uk.ts'
import { ru } from './ru.ts'
import { en } from './en.ts'
import { es } from './es.ts'
import { de } from './de.ts'

export type * from './types.ts'

export const content: Record<Lang, SiteContent> = { uk, ru, en, es, de }

export const DEFAULT_LANG: Lang = 'uk'

export interface LangInfo {
  code: Lang
  /** Native name exactly as in the site's language menu. */
  name: string
  /** Short label of the menu button (lang-short). */
  short: string
  /** The language's page on the current live site. */
  page: string
}

/** Order and names as in the language menu of every page. */
export const LANGS: readonly LangInfo[] = [
  { code: 'uk', name: 'Українська', short: 'UK', page: 'https://kadrstudia8-hue.github.io/landing-uk.html' },
  { code: 'ru', name: 'Русский', short: 'RU', page: 'https://kadrstudia8-hue.github.io/landing.html' },
  { code: 'en', name: 'English', short: 'EN', page: 'https://kadrstudia8-hue.github.io/landing-en.html' },
  { code: 'es', name: 'Español', short: 'ES', page: 'https://kadrstudia8-hue.github.io/landing-es.html' },
  { code: 'de', name: 'Deutsch', short: 'DE', page: 'https://kadrstudia8-hue.github.io/landing-de.html' },
]

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && LANGS.some(l => l.code === v)
}
