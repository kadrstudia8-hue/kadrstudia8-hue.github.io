// V4-only interface strings in 5 languages: labels the shared `content.page` does not carry (aria labels, menu, controls).
// Every visible heading, subtitle, CTA, price and fact comes from shared content (`content.page`, CRO.md).
// Rules: no «—»/«–», no word «ролик».
import type { Lang } from '@kadr/shared/content/index.ts'

export interface Copy {
  nav: { menu: string; close: string; lang: string }
  hero: { promptLabel: string; go: string }
  proof: { prev: string; next: string; play: string }
  who: { pick: string }
  download: { yours: string }
}

const ru: Copy = {
  nav: { menu: 'Меню', close: 'Закрыть', lang: 'Язык' },
  hero: { promptLabel: 'Пример запроса', go: 'Показать это видео' },
  proof: { prev: 'Предыдущий пример', next: 'Следующий пример', play: 'Включить со звуком' },
  who: { pick: 'Выберите, для чего вам видео' },
  download: { yours: 'ваш компьютер' },
}

const uk: Copy = {
  nav: { menu: 'Меню', close: 'Закрити', lang: 'Мова' },
  hero: { promptLabel: 'Приклад запиту', go: 'Показати це відео' },
  proof: { prev: 'Попередній приклад', next: 'Наступний приклад', play: 'Увімкнути зі звуком' },
  who: { pick: 'Оберіть, для чого вам відео' },
  download: { yours: "ваш комп'ютер" },
}

const en: Copy = {
  nav: { menu: 'Menu', close: 'Close', lang: 'Language' },
  hero: { promptLabel: 'Sample prompt', go: 'Show this video' },
  proof: { prev: 'Previous example', next: 'Next example', play: 'Play with sound' },
  who: { pick: 'Pick what you need video for' },
  download: { yours: 'your computer' },
}

const es: Copy = {
  nav: { menu: 'Menú', close: 'Cerrar', lang: 'Idioma' },
  hero: { promptLabel: 'Petición de ejemplo', go: 'Ver este vídeo' },
  proof: { prev: 'Ejemplo anterior', next: 'Ejemplo siguiente', play: 'Reproducir con sonido' },
  who: { pick: 'Elige para qué quieres el vídeo' },
  download: { yours: 'tu ordenador' },
}

const de: Copy = {
  nav: { menu: 'Menü', close: 'Schließen', lang: 'Sprache' },
  hero: { promptLabel: 'Beispiel-Anfrage', go: 'Dieses Video zeigen' },
  proof: { prev: 'Vorheriges Beispiel', next: 'Nächstes Beispiel', play: 'Mit Ton abspielen' },
  who: { pick: 'Wählen Sie, wofür Sie Videos brauchen' },
  download: { yours: 'Ihr Computer' },
}

export const COPY: Record<Lang, Copy> = { ru, uk, en, es, de }

/** Heading lines from one shared title: line 1 plain, line 2 «burnt by light». Splits at the first sentence end, else in half. */
export type H = [string, string]
export function toH(title: string): H {
  const s = title.trim()
  const dot = s.search(/[.!?]\s+\S/)
  if (dot > 0) return [s.slice(0, dot + 1), s.slice(dot + 1).trim()]
  const w = s.split(/\s+/)
  if (w.length === 1) return ['', s]
  const k = Math.ceil(w.length / 2)
  return [w.slice(0, k).join(' '), w.slice(k).join(' ')]
}
