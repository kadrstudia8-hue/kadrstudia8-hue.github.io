// Content model of the KADR Studio landing page (index.html / landing*.html), section by section in page order.
// Every language file (uk.ts, ru.ts, en.ts, es.ts, de.ts) holds its own native copy. Originally extracted verbatim from the HTML pages,
// since the sales rewrite it is edited copy based on the same product facts (nothing invented, no claims beyond terms/refund).
//
// Conventions
// - Media paths are relative ("media/cafe.mp4", "img/look-anime.jpg"): the dev server and the build serve them from the site root.
// - Links to the site's own legal/support pages are absolute: https://kadrstudia8-hue.github.io/<file>.
// - In-page anchors stay as "#download", "#reel", ...; mailto: links are kept byte-for-byte (including the encoded subject).
// - Text with inline markup (<b>, <a>, the share <button>) is stored as structured `Rich` — never as raw HTML.
// - Arrays may differ in length between languages (es/de have one extra "know in advance" item and one extra FAQ question).
// - Sales rewrite (2026-11): texts are no longer verbatim copies of the HTML pages. Visible copy has no long dashes (— –),
//   no word «ролик» (except the feature name «Проверка ролика»), paragraphs stay short; long explanations live in `details` or FAQ.

export type Lang = 'uk' | 'ru' | 'en' | 'es' | 'de'

/** Absolute or relative URL, "#anchor" or "mailto:". */
export type Href = string

export interface Link {
  label: string
  href: Href
}

/** A call-to-action. `osAware`: the original site (site.js) swaps the label to "Download for Mac/Windows" by the visitor's OS — see `ui`. */
export interface Cta extends Link {
  variant: 'main' | 'ghost'
  osAware?: boolean
}

/** Inline piece of rich text. Plain strings are text; objects are the only markup the source uses. */
export type Inline =
  | string
  | { b: string }
  | { a: string; href: Href }
  /** The phone-only "send the link to yourself" button (navigator.share / clipboard in site.js). */
  | { button: string; action: 'share' }

/** Rich text = a sequence of inline pieces, rendered in order without separators. */
export type Rich = Inline[]

export interface Image {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface Video {
  /** mp4, loaded lazily in the original (data-src). */
  src: string
  poster: string
  width: number
  height: number
  /** aria-label of the <video>. */
  label: string
}

// ---------------------------------------------------------------- meta

export interface Meta {
  /** <html lang> */
  htmlLang: Lang
  title: string
  description: string
  canonical: string
  /** <link rel="alternate" hreflang> in source order, including x-default. */
  alternates: { hreflang: string; href: string }[]
  themeColor: string
  og: {
    type: string
    siteName: string
    locale: string
    localeAlternates: string[]
    url: string
    title: string
    description: string
    image: string
    imageWidth: number
    imageHeight: number
  }
  twitterCard: string
  /** <link rel="preload" as="image"> — the hero poster. */
  preloadImage: string
  favicon: string
}

// ---------------------------------------------------------------- nav

export interface Nav {
  logo: { text: string; em: string; href: Href }
  /** Section anchors, in order. */
  links: Link[]
  /** aria-label of the language menu ("Мова", "Language", ...). */
  langMenuLabel: string
  /** Current language as shown in the menu button (full / short). */
  langCurrent: { full: string; short: string }
  cta: Cta
}

// ---------------------------------------------------------------- hero

export interface TitlePart {
  text: string
  /** <span class="nw"> — keep on one line. */
  nowrap?: boolean
  /** <span class="grad"> — gradient accent. */
  accent?: boolean
}

export interface Hero {
  id: 'top'
  tag: string
  /** Parts are separated by a single space in the source. */
  title: TitlePart[]
  lead: string
  ctas: Cta[]
  note: string
  /** Shown on phones only (KADR is a desktop app). */
  mobileHint: Rich
  video: Video
  caption: string
  facts: Rich[]
  /** 3–4 short chips under the CTAs (sales rewrite). */
  badges?: string[]
}

// ---------------------------------------------------------------- proof (demo «одна фраза → ролик»)

export interface DemoExample {
  /** Tab label. */
  label: string
  video: string
  poster: string
  /** 'v' = 9:16, 'h' = 16:9 */
  shape: 'v' | 'h'
  alt: string
  /** data-meta split by "|". */
  meta: string[]
  /** Typed into the prompt box by site.js. */
  prompt: string
}

export interface Proof {
  id: 'proof'
  tag: string
  title: string
  lead: string
  /** aria-label of the tablist. */
  tablistLabel: string
  examples: DemoExample[]
  /** Static (no-JS) state of the demo: prompt text, meta list and poster image. Kept verbatim — may differ slightly from examples[0]. */
  initial: { prompt: string; meta: string[]; image: Image }
  note: string
}

// ---------------------------------------------------------------- reel / tutorial

export interface VideoSection<Id extends string> {
  id: Id
  tag: string
  title: string
  lead: string
  video: Video
  /** Two caption spans under the player: [description, size/sound]. */
  captions: [string, string]
}

export interface Reel extends VideoSection<'reel'> {
  ctas: Cta[]
}

export type Tutorial = VideoSection<'tutorial'>

// ---------------------------------------------------------------- who

export type WhoMedia =
  | { kind: 'trio'; videos: Video[] }
  | { kind: 'solo'; image: Image }
  | { kind: 'video'; video: Video }
  | { kind: 'pair'; items: { image: Image; badge: string }[] }

export interface WhoCard {
  media: WhoMedia
  title: string
  text: string
  /** "Приклад: ..." */
  source: string
  /** Longer explanation for a «more» disclosure; the visible `text` stays short. */
  details?: string
}

export interface Who {
  id: 'who'
  tag: string
  title: string
  cards: WhoCard[]
}

// ---------------------------------------------------------------- how

export interface How {
  id: 'how'
  tag: string
  title: string
  lead: string
  steps: { n: string; title: string; text: string; details?: string }[]
  note: string
  screenshot: Image
  caption: string
}

// ---------------------------------------------------------------- looks

export interface Looks {
  id: 'looks'
  tag: string
  title: string
  lead: string
  /** name = figcaption; image.alt equals the name in the source. */
  styles: { name: string; image: Image }[]
}

// ---------------------------------------------------------------- req (hardware)

export interface Req {
  id: 'req'
  tag: string
  title: string
  lead: string
  tiers: { who: string; title: string; paragraphs: string[]; details?: string }[]
  /** "Що варто знати заздалегідь" — es/de have 5 items, the others 4. */
  notes: { title: string; items: string[] }
}

// ---------------------------------------------------------------- features

export interface Features {
  id: 'features'
  tag: string
  title: string
  lead: string
  /** All 12 cards. */
  items: { icon: string; title: string; text: string; details?: string }[]
}

// ---------------------------------------------------------------- download

export interface DownloadPlatform {
  os: 'windows' | 'mac-arm' | 'mac-intel'
  name: string
  /** Verbatim, including the version string shown on the card (Windows: v3.0.3 by client decision; the live site card still says v3.0.2). */
  details: string
  cta: string
  href: string
}

export interface Download {
  id: 'download'
  tag: string
  title: string
  lead: string
  platforms: DownloadPlatform[]
  note: string
}

// ---------------------------------------------------------------- pricing

export interface Plan {
  name: string
  /** e.g. "−40%" */
  badge?: string
  price: {
    /** As displayed: "Безкоштовно", "$59", "$9". */
    display: string
    /** Crossed-out old price as displayed, e.g. "$99". */
    old?: string
    /** Numeric value in `Pricing.currency` (0 for free). */
    value: number
    oldValue?: number
  }
  per: string
  items: string[]
  cta: Cta
  /** class="hot" — the highlighted plan. */
  highlight?: boolean
}

export interface Pricing {
  id: 'pricing'
  tag: string
  title: string
  lead: string
  /** Currency of plan prices (UAH since the program's prices; Energy packs are quoted in $ in the copy). */
  currency: 'USD' | 'UAH'
  plans: Plan[]
  extras: { title: string; text: string }[]
  note: string
  /** The «how to buy» block (id="notify" in the source; there is no form, just mail). */
  buy: { text: string; cta: Cta; note: string }
  /** "Умови · Повернення" under the block. */
  legal: Link[]
  /** Short benefit strip shown on the highlighted plan (the one with `highlight: true`). */
  highlight?: string
}

// ---------------------------------------------------------------- faq

export interface FaqItem {
  q: string
  /** Answers may contain <b> and <a> (mailto, support/privacy/refund pages) — kept as structure. */
  a: Rich
  /** <details open> — the first one is open in the source. */
  open?: boolean
}

export interface Faq {
  id: 'faq'
  tag: string
  title: string
  items: FaqItem[]
}

// ---------------------------------------------------------------- contact / sticky bar / footer

export interface Contact {
  id: 'contact'
  tag: string
  title: string
  lead: string
  ctas: Cta[]
}

/** Sticky call bar on phones (.mcta): shown after the hero, hidden over #download. */
export interface MobileBar {
  label: string
  ctas: Cta[]
}

export interface Footer {
  copyright: string
  /** Legal owner name is not filled in yet in the source: "[PLACEHOLDER: ...]". */
  ownerPlaceholder: string
  /** Terms, privacy, refunds, licences, support, mail — absolute URLs. */
  links: Link[]
  note: string
}

// ---------------------------------------------------------------- sales blocks (optional; added in the sales rewrite)

/** PascalCase export name of a lucide-react icon, e.g. 'Cloud', 'Gift', 'ShieldCheck'. */
export type LucideIconName = string

/** One benefit/promise card. Only real product facts. */
export interface PromiseItem {
  icon: LucideIconName
  title: string
  text: string
}

/** Benefits strip (4–6 items). Suggested place: right after the hero. */
export interface Promises {
  id: 'promises'
  tag: string
  title: string
  items: PromiseItem[]
}

/** «Our GPUs work for you»: KADR Cloud, the main selling point. */
export interface Cloud {
  id: 'cloud'
  tag: string
  title: string
  lead: string
  /** Exactly 3 short bullets. */
  bullets: string[]
  cta: Cta
}

/** Short announcement of the phone version. */
export interface MobileSoon {
  tag: string
  title: string
  text: string
}

/** Final selling band before the footer. */
export interface CtaBand {
  title: string
  subtitle: string
  cta: Cta
}

// ---------------------------------------------------------------- strings used by site.js / lang.js

export interface Ui {
  /** site.js swaps [data-os-cta] labels to these on Mac/Windows desktops. */
  downloadMac: string
  downloadWindows: string
  /** site.js: label after copying the link on phones. */
  linkCopied: string
  /** lang.js: first-visit hint "read this page in <lang>?" (shown in the *browser's* language). */
  langHint: { question: string; accept: string; close: string }
}

// ---------------------------------------------------------------- page: the 9-section CRO structure (CRO.md, sections 3, 4, 6)
// One structure and one set of texts for every theme. Old fields above stay for the current builds; new layouts read `page`.
// Media for these sections comes from the old fields: hero.video, proof.examples, reel.video, who.cards[i].media,
// looks.styles, how.screenshot, tutorial.video, download.platforms (hrefs), footer.

export type PageSectionId = 'top' | 'proof' | 'who' | 'how' | 'compare' | 'pc' | 'pricing' | 'faq' | 'download'

/** A call to action of the new page. `action` tells the builder what to do instead of (or in addition to) following `href`. */
export interface PageCta {
  label: string
  href: Href
  variant: 'main' | 'ghost'
  /** On Mac/Windows desktops swap the label to ui.downloadMac / ui.downloadWindows (final section only). */
  osAware?: boolean
  /**
   * 'share': navigator.share / copy link (phones; label is the «send the link to yourself» line);
   * 'play-reel': open reel.video; 'play-tutorial': open tutorial.video; 'disclose': open the section's `details`.
   */
  action?: 'share' | 'play-reel' | 'play-tutorial' | 'disclose'
}

/** Head shared by every section: tag (eyebrow, optional), H2 (≤ 5 words), subtitle (≤ 12 words), one CTA. */
export interface PageSection<Id extends PageSectionId> {
  id: Id
  tag?: string
  title: string
  subtitle: string
  cta: PageCta
}

export interface PageHero extends Omit<PageSection<'top'>, 'title'> {
  /** Same shape as hero.title: first part nowrap, second accent. */
  title: TitlePart[]
  /** Quiet second link (reel). */
  secondary: PageCta
  /** 3 chips under the button. */
  chips: string[]
  /** Handwritten note. */
  note: string
  sticker: string
  /** Phones: the main CTA is «send the link to yourself» (action 'share'); caption goes under it. */
  mobile: { cta: PageCta; caption: string }
}

export interface PageProof extends PageSection<'proof'> {
  /** Label above the prompt under each example ("the author's whole job"). */
  promptLabel: string
  /** Caption of the 5th, wide reel card. */
  reelCard: string
}

export interface PageWho extends PageSection<'who'> {
  /** 4 cards in the order of who.cards (their media). */
  cards: { title: string; text: string }[]
  /** Line above the 6 style polaroids (looks.styles). */
  stylesTitle: string
}

export interface PageHow extends PageSection<'how'> {
  /** 3 one-line steps. */
  steps: string[]
  screenshotCaption: string
  /** Handwritten note (an example idea). */
  note: string
}

export interface PageCompare extends PageSection<'compare'> {
  before: { title: string; items: string[] }
  after: { title: string; text: string }
  /** Small honest line under the right column (no invented numbers). */
  note: string
  /** Disclosure with what else the app does (no model names). */
  more: { label: string; items: string[] }
}

export interface PagePc extends PageSection<'pc'> {
  /** Tile 0: own computer; tile 1: KADR Cloud (badge «soon»). */
  tiles: { title: string; badge?: string; text: string }[]
  /** Chip «mobile version soon». */
  mobileChip: string
  /** Opened by the 'disclose' CTA: the technical answer (GPU memory, keys, free photos, first launch on Mac). */
  details: string[]
}

export interface PagePlan {
  id: 'trial' | 'founder' | 'turnkey'
  /** 'entry' = trial (main lime button), 'center' = founder (visual centre), 'premium' = turnkey (black card). */
  tone: 'entry' | 'center' | 'premium'
  /** Label above the price, e.g. «НАЧНИТЕ ЗДЕСЬ». */
  label: string
  name: string
  price: { display: string; value: number; old?: string; oldValue?: number }
  /** Anchor under the price, e.g. «потом 2 999 грн». */
  then?: string
  per: string
  items: string[]
  cta: PageCta
  /** Line under the button. */
  note?: string
}

export interface PagePricing extends PageSection<'pricing'> {
  /** Plan prices are in UAH; the app converts them to USDT at the day's rate. Energy packs are quoted in $. */
  currency: 'UAH'
  /** Order: trial, founder, turnkey. No «N of 100» counter (no real source yet). */
  plans: PagePlan[]
  /** «Возвратов нет. Поэтому сначала 3 видео бесплатно.» full width under the cards. */
  honest: string
  /** Next to the price: «программа пересчитает в USDT по курсу дня». */
  currencyNote: string
  /** 3-step payment scheme + help line. */
  pay: { title: string; steps: string[]; help: string }
  /** One quiet line about the cloud and Energy ⚡ (no button). */
  cloud: string
}

export interface PageFaq extends PageSection<'faq'> {
  /** 6 questions; the first one open. */
  items: FaqItem[]
  /** «All questions» → support page. */
  all: Link
}

export interface PageFinal extends PageSection<'download'> {
  /** Line under the button: the three builds. */
  platforms: string
  /** Disclosure «Which Mac do I have?». */
  macHelp: { label: string; text: string }
  support: Link
}

export interface Page {
  order: PageSectionId[]
  nav: { links: Link[]; cta: PageCta }
  hero: PageHero
  proof: PageProof
  who: PageWho
  how: PageHow
  compare: PageCompare
  pc: PagePc
  pricing: PagePricing
  faq: PageFaq
  final: PageFinal
  /** Phones: [share, prices]. */
  mobileBar: { ctas: PageCta[] }
}

// ---------------------------------------------------------------- whole page

export interface SiteContent {
  lang: Lang
  meta: Meta
  nav: Nav
  hero: Hero
  promises?: Promises
  proof: Proof
  reel: Reel
  tutorial: Tutorial
  who: Who
  how: How
  looks: Looks
  req: Req
  cloud?: Cloud
  mobileSoon?: MobileSoon
  features: Features
  download: Download
  pricing: Pricing
  faq: Faq
  contact: Contact
  ctaBand?: CtaBand
  mobileBar: MobileBar
  footer: Footer
  ui: Ui
  /** New 9-section page (CRO). Optional until every build reads it. */
  page?: Page
}
