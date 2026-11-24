// V4-only short copy in 5 languages (DESIGN-V4 1.1).
// Rules: no «—»/«–», no word «ролик», headings ≤ 5 words, leads ≤ 16 words.
// Facts, prices and links are NOT here: they come from shared content.
import type { Lang } from '@kadr/shared/content/index.ts'

/** Heading: line `a` is plain, line `b` is «burnt by light» (spectrum). Either may be empty. */
export type H = [string, string]

export interface Copy {
  nav: { links: { label: string; href: string }[]; menu: string; close: string; lang: string }
  hero: { chip: string; h1: H; reel: string; note: string; promptLabel: string; go: string }
  facts: string[]
  proof: { h: H; prev: string; next: string; prompt: string; play: string }
  cloud: { h: H; lead: string; chips: string[]; cta: string; stage: string }
  how: { h: H; steps: { t: string; s: string }[]; tracks: string[]; tutorial: string; close: string }
  reel: { h: H; play: string }
  who: { h: H; tiles: { t: string; s: string }[] }
  looks: { h: H; label: string }
  features: { h: H }
  req: { h: H; cols: { t: string; l: [string, string] }[] }
  pricing: { h: H; extras: string }
  download: { h: H; mac: string; yours: string }
  faq: { h: H }
  contact: { h: H }
  footer: { top: string }
}

const ru: Copy = {
  nav: { links: [{ label: 'Примеры', href: '#proof' }, { label: 'Облако', href: '#cloud' }, { label: 'Цены', href: '#pricing' }], menu: 'Меню', close: 'Закрыть', lang: 'Язык' },
  hero: { chip: 'Windows · macOS', h1: ['Одна фраза.', 'Готовое видео.'], reel: 'Смотреть шоурил, 25 с', note: 'без рекламы и телеметрии', promptLabel: 'Пример запроса', go: 'Показать это видео' },
  facts: ['от 15 секунд до 30 минут', '9:16 · 16:9 · 1:1 · 4:5', 'голоса UK · RU · EN', 'работает без ключей', 'свет погас? продолжит с места'],
  proof: { h: ['Одна фраза.', 'Одно видео.'], prev: 'Предыдущий пример', next: 'Следующий пример', prompt: 'Запрос', play: 'Смотреть пример' },
  cloud: {
    h: ['Наши видеокарты', 'работают за вас'],
    lead: 'Кадры, живые сцены и музыка считаются на наших серверах. Работает с любого компьютера.',
    chips: ['без своей видеокарты', 'цена видна до старта', 'мобильная версия скоро'],
    cta: 'Попробовать в облаке', stage: 'Серверы KADR Cloud с видеокартами',
  },
  how: {
    h: ['Три шага', 'до MP4'],
    steps: [
      { t: 'Напишите идею', s: 'Одна фраза или свой текст. Любой формат.' },
      { t: 'Нажмите ➤', s: 'Сценарий, голос, кадры, музыка и субтитры сами.' },
      { t: 'Заберите видео', s: 'Готовый MP4 для соцсетей.' },
    ],
    tracks: ['Сценарий', 'Голос', 'Кадры', 'Музыка', 'Субтитры'], tutorial: 'Видеоурок, 2:01', close: 'Закрыть',
  },
  reel: { h: ['25 секунд', 'настоящих выпусков'], play: 'Включить со звуком' },
  who: {
    h: ['Для кого', 'KADR Studio'],
    tiles: [
      { t: 'Shorts и Reels', s: 'Вертикальные видео без съёмок и монтажа.' },
      { t: 'Малый бизнес', s: 'Реклама кафе или магазина из одной фразы.' },
      { t: 'YouTube без лица', s: 'Фильмы до 30 минут с главами.' },
      { t: 'Разные языки', s: 'Тот же видеоряд, новый голос и субтитры.' },
    ],
  },
  looks: { h: ['12 стилей.', 'Один клик.'], label: 'Стиль картинки' },
  features: { h: ['Всё в', 'одном окне'] },
  req: {
    h: ['Без видеокарты', 'тоже можно'],
    cols: [
      { t: 'Своя NVIDIA', l: ['Кадры, сцены и музыка на вашей видеокарте.', 'Windows 10/11, от 8 ГБ видеопамяти.'] },
      { t: 'Mac с Apple M', l: ['От 16 ГБ памяти кадры рисует сам Mac.', 'macOS 12 и новее, Intel тоже.'] },
      { t: 'Любой компьютер', l: ['Видео из вашего текста даже без ключей.', 'Кадры по ключу или в облаке KADR.'] },
    ],
  },
  pricing: { h: ['', 'Цены'], extras: 'Ещё' },
  download: { h: ['Windows', 'и Mac'], mac: 'Какой у меня Mac?', yours: 'ваш компьютер' },
  faq: { h: ['Частые', 'вопросы'] },
  contact: { h: ['Одна фраза.', 'И ➤'] },
  footer: { top: 'Наверх' },
}

const uk: Copy = {
  nav: { links: [{ label: 'Приклади', href: '#proof' }, { label: 'Хмара', href: '#cloud' }, { label: 'Ціни', href: '#pricing' }], menu: 'Меню', close: 'Закрити', lang: 'Мова' },
  hero: { chip: 'Windows · macOS', h1: ['Одна фраза.', 'Готове відео.'], reel: 'Дивитися шоурил, 25 с', note: 'без реклами й телеметрії', promptLabel: 'Приклад запиту', go: 'Показати це відео' },
  facts: ['від 15 секунд до 30 хвилин', '9:16 · 16:9 · 1:1 · 4:5', 'голоси UK · RU · EN', 'працює без ключів', 'зникло світло? продовжить з місця'],
  proof: { h: ['Одна фраза.', 'Одне відео.'], prev: 'Попередній приклад', next: 'Наступний приклад', prompt: 'Запит', play: 'Дивитися приклад' },
  cloud: {
    h: ['Наші відеокарти', 'працюють за вас'],
    lead: "Кадри, живі сцени й музика рахуються на наших серверах. Працює з будь-якого комп'ютера.",
    chips: ['без своєї відеокарти', 'ціну видно до старту', 'мобільна версія скоро'],
    cta: 'Спробувати в хмарі', stage: 'Сервери KADR Cloud з відеокартами',
  },
  how: {
    h: ['Три кроки', 'до MP4'],
    steps: [
      { t: 'Напишіть ідею', s: 'Одна фраза або свій текст. Будь-який формат.' },
      { t: 'Натисніть ➤', s: 'Сценарій, голос, кадри, музика й субтитри самі.' },
      { t: 'Заберіть відео', s: 'Готовий MP4 для соцмереж.' },
    ],
    tracks: ['Сценарій', 'Голос', 'Кадри', 'Музика', 'Субтитри'], tutorial: 'Відеоурок, 2:01', close: 'Закрити',
  },
  reel: { h: ['25 секунд', 'справжніх випусків'], play: 'Увімкнути зі звуком' },
  who: {
    h: ['Для кого', 'KADR Studio'],
    tiles: [
      { t: 'Shorts і Reels', s: 'Вертикальні відео без зйомок і монтажу.' },
      { t: 'Малий бізнес', s: 'Реклама кафе чи магазину з однієї фрази.' },
      { t: 'YouTube без обличчя', s: 'Фільми до 30 хвилин із розділами.' },
      { t: 'Різні мови', s: 'Той самий відеоряд, новий голос і субтитри.' },
    ],
  },
  looks: { h: ['12 стилів.', 'Один клік.'], label: 'Стиль картинки' },
  features: { h: ['Усе в', 'одному вікні'] },
  req: {
    h: ['Без відеокарти', 'теж можна'],
    cols: [
      { t: 'Своя NVIDIA', l: ['Кадри, сцени й музика на вашій відеокарті.', "Windows 10/11, від 8 ГБ відеопам'яті."] },
      { t: 'Mac з Apple M', l: ["Від 16 ГБ пам'яті кадри малює сам Mac.", 'macOS 12 і новіше, Intel теж.'] },
      { t: "Будь-який комп'ютер", l: ['Відео з вашого тексту навіть без ключів.', 'Кадри за ключем або в хмарі KADR.'] },
    ],
  },
  pricing: { h: ['', 'Ціни'], extras: 'Ще' },
  download: { h: ['Windows', 'і Mac'], mac: 'Який у мене Mac?', yours: "ваш комп'ютер" },
  faq: { h: ['Часті', 'питання'] },
  contact: { h: ['Одна фраза.', 'І ➤'] },
  footer: { top: 'Нагору' },
}

const en: Copy = {
  nav: { links: [{ label: 'Examples', href: '#proof' }, { label: 'Cloud', href: '#cloud' }, { label: 'Pricing', href: '#pricing' }], menu: 'Menu', close: 'Close', lang: 'Language' },
  hero: { chip: 'Windows · macOS', h1: ['One phrase.', 'Finished video.'], reel: 'Watch the showreel, 25 s', note: 'no ads, no telemetry', promptLabel: 'Sample prompt', go: 'Show this video' },
  facts: ['15 seconds to 30 minutes', '9:16 · 16:9 · 1:1 · 4:5', 'voices UK · RU · EN', 'works without keys', 'power cut? resumes where it stopped'],
  proof: { h: ['One phrase.', 'One video.'], prev: 'Previous example', next: 'Next example', prompt: 'Prompt', play: 'Watch example' },
  cloud: {
    h: ['Our GPUs', 'work for you'],
    lead: 'Frames, live scenes and music render on our servers. Works from any computer.',
    chips: ['no graphics card needed', 'price shown before start', 'mobile version soon'],
    cta: 'Try it in the cloud', stage: 'KADR Cloud GPU servers',
  },
  how: {
    h: ['Three steps', 'to MP4'],
    steps: [
      { t: 'Write the idea', s: 'One phrase or your own text. Any format.' },
      { t: 'Press ➤', s: 'Script, voice, frames, music and subtitles, done for you.' },
      { t: 'Take the video', s: 'A finished MP4 for social media.' },
    ],
    tracks: ['Script', 'Voice', 'Frames', 'Music', 'Subtitles'], tutorial: 'Video tutorial, 2:01', close: 'Close',
  },
  reel: { h: ['25 seconds', 'of real releases'], play: 'Play with sound' },
  who: {
    h: ['Who it’s', 'made for'],
    tiles: [
      { t: 'Shorts and Reels', s: 'Vertical videos with no shooting or editing.' },
      { t: 'Small business', s: 'An ad for a cafe or shop from one phrase.' },
      { t: 'Faceless YouTube', s: 'Films up to 30 minutes with chapters.' },
      { t: 'Many languages', s: 'Same footage, a new voice and subtitles.' },
    ],
  },
  looks: { h: ['12 styles.', 'One click.'], label: 'Picture style' },
  features: { h: ['Everything in', 'one window'] },
  req: {
    h: ['No GPU?', 'Still works.'],
    cols: [
      { t: 'Your own NVIDIA', l: ['Frames, scenes and music on your graphics card.', 'Windows 10/11, 8 GB VRAM or more.'] },
      { t: 'Mac with Apple M', l: ['With 16 GB memory the Mac draws frames itself.', 'macOS 12 or newer, Intel too.'] },
      { t: 'Any computer', l: ['Video from your text, even without keys.', 'Frames via keys or in KADR Cloud.'] },
    ],
  },
  pricing: { h: ['', 'Pricing'], extras: 'Also' },
  download: { h: ['Windows', 'and Mac'], mac: 'Which Mac do I have?', yours: 'your computer' },
  faq: { h: ['Questions', 'answered'] },
  contact: { h: ['One phrase.', 'Then ➤'] },
  footer: { top: 'Back to top' },
}

const es: Copy = {
  nav: { links: [{ label: 'Ejemplos', href: '#proof' }, { label: 'Nube', href: '#cloud' }, { label: 'Precios', href: '#pricing' }], menu: 'Menú', close: 'Cerrar', lang: 'Idioma' },
  hero: { chip: 'Windows · macOS', h1: ['Una frase.', 'Vídeo listo.'], reel: 'Ver el showreel, 25 s', note: 'sin anuncios ni telemetría', promptLabel: 'Petición de ejemplo', go: 'Ver este vídeo' },
  facts: ['de 15 segundos a 30 minutos', '9:16 · 16:9 · 1:1 · 4:5', 'voces UK · RU · EN', 'funciona sin claves', '¿apagón? sigue donde se quedó'],
  proof: { h: ['Una frase.', 'Un vídeo.'], prev: 'Ejemplo anterior', next: 'Ejemplo siguiente', prompt: 'Petición', play: 'Ver ejemplo' },
  cloud: {
    h: ['Nuestras GPU', 'trabajan por ti'],
    lead: 'Imágenes, escenas vivas y música se calculan en nuestros servidores. Funciona en cualquier ordenador.',
    chips: ['sin tarjeta gráfica propia', 'precio visible antes de empezar', 'versión móvil pronto'],
    cta: 'Probar en la nube', stage: 'Servidores con GPU de KADR Cloud',
  },
  how: {
    h: ['Tres pasos', 'hasta el MP4'],
    steps: [
      { t: 'Escribe la idea', s: 'Una frase o tu propio texto. Cualquier formato.' },
      { t: 'Pulsa ➤', s: 'Guion, voz, imágenes, música y subtítulos, solos.' },
      { t: 'Llévate el vídeo', s: 'Un MP4 listo para redes.' },
    ],
    tracks: ['Guion', 'Voz', 'Imágenes', 'Música', 'Subtítulos'], tutorial: 'Videotutorial, 2:01', close: 'Cerrar',
  },
  reel: { h: ['25 segundos', 'de vídeos reales'], play: 'Reproducir con sonido' },
  who: {
    h: ['¿Para', 'quién es?'],
    tiles: [
      { t: 'Shorts y Reels', s: 'Vídeos verticales sin rodaje ni edición.' },
      { t: 'Pequeños negocios', s: 'Un anuncio de cafetería o tienda con una frase.' },
      { t: 'YouTube sin rostro', s: 'Películas de hasta 30 minutos con capítulos.' },
      { t: 'Varios idiomas', s: 'El mismo metraje con otra voz y subtítulos.' },
    ],
  },
  looks: { h: ['12 estilos.', 'Un clic.'], label: 'Estilo de imagen' },
  features: { h: ['Todo en', 'una ventana'] },
  req: {
    h: ['¿Sin GPU?', 'También funciona.'],
    cols: [
      { t: 'Tu NVIDIA', l: ['Imágenes, escenas y música en tu tarjeta gráfica.', 'Windows 10/11, desde 8 GB de VRAM.'] },
      { t: 'Mac con Apple M', l: ['Con 16 GB de memoria el Mac dibuja solo.', 'macOS 12 o posterior, también Intel.'] },
      { t: 'Cualquier ordenador', l: ['Vídeo con tu texto, incluso sin claves.', 'Imágenes por clave o en la nube KADR.'] },
    ],
  },
  pricing: { h: ['', 'Precios'], extras: 'Además' },
  download: { h: ['Windows', 'y Mac'], mac: '¿Qué Mac tengo?', yours: 'tu ordenador' },
  faq: { h: ['Preguntas', 'frecuentes'] },
  contact: { h: ['Una frase.', 'Y ➤'] },
  footer: { top: 'Arriba' },
}

const de: Copy = {
  nav: { links: [{ label: 'Beispiele', href: '#proof' }, { label: 'Cloud', href: '#cloud' }, { label: 'Preise', href: '#pricing' }], menu: 'Menü', close: 'Schließen', lang: 'Sprache' },
  hero: { chip: 'Windows · macOS', h1: ['Ein Satz.', 'Fertiges Video.'], reel: 'Showreel ansehen, 25 s', note: 'ohne Werbung und Telemetrie', promptLabel: 'Beispiel-Anfrage', go: 'Dieses Video zeigen' },
  facts: ['15 Sekunden bis 30 Minuten', '9:16 · 16:9 · 1:1 · 4:5', 'Stimmen UK · RU · EN', 'läuft ohne Schlüssel', 'Stromausfall? macht dort weiter'],
  proof: { h: ['Ein Satz.', 'Ein Video.'], prev: 'Vorheriges Beispiel', next: 'Nächstes Beispiel', prompt: 'Anfrage', play: 'Beispiel ansehen' },
  cloud: {
    h: ['Unsere GPUs', 'arbeiten für Sie'],
    lead: 'Bilder, Live-Szenen und Musik entstehen auf unseren Servern. Läuft auf jedem Computer.',
    chips: ['ohne eigene Grafikkarte', 'Preis vor dem Start sichtbar', 'Mobilversion bald'],
    cta: 'In der Cloud testen', stage: 'GPU-Server der KADR Cloud',
  },
  how: {
    h: ['Drei Schritte', 'zum MP4'],
    steps: [
      { t: 'Idee schreiben', s: 'Ein Satz oder eigener Text. Jedes Format.' },
      { t: '➤ drücken', s: 'Skript, Stimme, Bilder, Musik und Untertitel von allein.' },
      { t: 'Video abholen', s: 'Fertige MP4 für Social Media.' },
    ],
    tracks: ['Skript', 'Stimme', 'Bilder', 'Musik', 'Untertitel'], tutorial: 'Videoanleitung, 2:01', close: 'Schließen',
  },
  reel: { h: ['25 Sekunden', 'echte Videos'], play: 'Mit Ton abspielen' },
  who: {
    h: ['Für wen', 'KADR Studio'],
    tiles: [
      { t: 'Shorts und Reels', s: 'Hochformat-Videos ohne Dreh und Schnitt.' },
      { t: 'Kleine Firmen', s: 'Werbung für Café oder Laden aus einem Satz.' },
      { t: 'YouTube ohne Gesicht', s: 'Filme bis 30 Minuten mit Kapiteln.' },
      { t: 'Mehrere Sprachen', s: 'Gleiche Bilder, neue Stimme und Untertitel.' },
    ],
  },
  looks: { h: ['12 Stile.', 'Ein Klick.'], label: 'Bildstil' },
  features: { h: ['Alles in', 'einem Fenster'] },
  req: {
    h: ['Keine GPU?', 'Geht trotzdem.'],
    cols: [
      { t: 'Eigene NVIDIA', l: ['Bilder, Szenen und Musik auf Ihrer Grafikkarte.', 'Windows 10/11, ab 8 GB VRAM.'] },
      { t: 'Mac mit Apple M', l: ['Ab 16 GB Speicher malt der Mac selbst.', 'macOS 12 oder neuer, auch Intel.'] },
      { t: 'Jeder Computer', l: ['Video aus Ihrem Text, auch ohne Schlüssel.', 'Bilder per Schlüssel oder in der KADR Cloud.'] },
    ],
  },
  pricing: { h: ['', 'Preise'], extras: 'Dazu' },
  download: { h: ['Windows', 'und Mac'], mac: 'Welchen Mac habe ich?', yours: 'Ihr Computer' },
  faq: { h: ['Häufige', 'Fragen'] },
  contact: { h: ['Ein Satz.', 'Und ➤'] },
  footer: { top: 'Nach oben' },
}

export const COPY: Record<Lang, Copy> = { ru, uk, en, es, de }
