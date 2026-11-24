// V3-only micro-copy that the layout of the reference needs but the site has no single string for.
// Every word is taken from the same language page (hero lead, facts, how, looks) — nothing new is claimed:
// numbers come from the site's facts (15 s – 30 min, 4 formats, the voice list, 12 styles).
import type { Lang, SiteContent } from '@kadr/shared/content/index.ts'

export interface V3Copy {
  /** Hero chip (from «Программа для Windows и macOS»). */
  chip: string
  /** Handwritten note in the hero: words from the hero lead. */
  note: [string, string, string]
  /** Fact strip labels. `n` = big value, `l` = caption; voices are counted from the site's list. */
  facts: { len: [string, string]; formats: string; voices: (count: number) => string; styles: [string, string] }
  /** Format segment of the idea bar. */
  format: string
  open: string
  close: string
  more: string
  less: string
  prev: string
  next: string
  menu: string
  play: string
}

const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

export const COPY: Record<Lang, V3Copy> = {
  uk: {
    chip: 'Windows · macOS',
    note: ['сценарій', 'голос', 'кадри'],
    facts: { len: ['від 15 с до 30 хв', 'тривалість відео'], formats: 'формати', voices: (n) => plural(n, 'голос', 'голоси', 'голосів'), styles: ['стилів', 'картинки'] },
    format: 'Формат',
    open: 'Відкрити', close: 'Закрити', more: 'Докладніше', less: 'Згорнути', prev: 'Назад', next: 'Далі', menu: 'Меню', play: 'Відтворити',
  },
  ru: {
    chip: 'Windows · macOS',
    note: ['сценарий', 'голос', 'кадры'],
    facts: { len: ['от 15 с до 30 мин', 'длина видео'], formats: 'формата', voices: (n) => plural(n, 'голос', 'голоса', 'голосов'), styles: ['стилей', 'картинки'] },
    format: 'Формат',
    open: 'Открыть', close: 'Закрыть', more: 'Подробнее', less: 'Свернуть', prev: 'Назад', next: 'Дальше', menu: 'Меню', play: 'Воспроизвести',
  },
  en: {
    chip: 'Windows · macOS',
    note: ['script', 'voice', 'frames'],
    facts: { len: ['15 s to 30 min', 'video length'], formats: 'formats', voices: () => 'voices', styles: ['styles', 'picture'] },
    format: 'Format',
    open: 'Open', close: 'Close', more: 'More', less: 'Less', prev: 'Previous', next: 'Next', menu: 'Menu', play: 'Play',
  },
  es: {
    chip: 'Windows · macOS',
    note: ['guion', 'voz', 'imágenes'],
    facts: { len: ['de 15 s a 30 min', 'duración'], formats: 'formatos', voices: () => 'voces', styles: ['estilos', 'visuales'] },
    format: 'Formato',
    open: 'Abrir', close: 'Cerrar', more: 'Más', less: 'Menos', prev: 'Anterior', next: 'Siguiente', menu: 'Menú', play: 'Reproducir',
  },
  de: {
    chip: 'Windows · macOS',
    note: ['Drehbuch', 'Stimme', 'Bilder'],
    facts: { len: ['15 s bis 30 min', 'Videolänge'], formats: 'Formate', voices: () => 'Stimmen', styles: ['Stile', 'Bildstil'] },
    format: 'Format',
    open: 'Öffnen', close: 'Schließen', more: 'Mehr', less: 'Weniger', prev: 'Zurück', next: 'Weiter', menu: 'Menü', play: 'Abspielen',
  },
}

/** Plain text of a Rich value. */
export function richText(r: SiteContent['hero']['facts'][number]): string {
  return r.map((p) => (typeof p === 'string' ? p : 'b' in p ? p.b : 'a' in p ? p.a : p.button)).join('')
}

/** Bold part of a fact («UK · RU · EN»). */
export function richBold(r: SiteContent['hero']['facts'][number]): string {
  for (const p of r) if (typeof p !== 'string' && 'b' in p) return p.b
  return richText(r)
}

/**
 * Splits a heading into [white, lilac]: the part after the last «—», «–», «→» or «:» is lilac,
 * a trailing «KADR Studio» is lilac, otherwise the last word.
 */
export function splitAccent(title: string): [string, string] {
  const k = title.lastIndexOf('KADR Studio')
  if (k > 0 && k + 11 >= title.length - 1) return [title.slice(0, k), title.slice(k)]
  const m = title.match(/^(.*[—–→:?]\s*)(\S.*)$/)
  if (m && m[2].length < title.length * 0.75) return [m[1], m[2]]
  const i = title.lastIndexOf(' ')
  return i > 0 ? [title.slice(0, i + 1), title.slice(i + 1)] : ['', title]
}
