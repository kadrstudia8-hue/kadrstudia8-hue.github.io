import {
  Captions, Check, ChevronRight, Clapperboard, Download as DownloadIcon, FileText, Image as ImageIcon, KeyRound, Languages, Mail, Mic, Music, PenLine,
  Plus, Scissors, Sparkles as SparklesIcon, UserRound,
} from 'lucide-react'
import { m } from 'motion/react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { LANGS, type Lang, type SiteContent, type Video } from '@kadr/shared/content/index'
import { FINE, GEN, GenImg, RichText, derive, onPointer, playExclusive, useAutoVideo, useMediaQuery, useOsLabel, usePrefersReducedMotion } from './lib'
import { BlackButton, LimeButton, NeonScript, PixelTitle, Rise, SectionHead, Sparkle, Tag, WhiteButton } from './ui'
import { OsGlyph } from './PairCards'
import { Logo } from './Navbar'
import { MobileSoon, More, Plaque } from './Sales'

/* ------------------------------------------------------------------ player */
export function Player({ video, className = '', round = 'rounded-[16px]', dark }: { video: Video; className?: string; round?: string; dark?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!on || !v) return
    v.src = video.src; v.muted = false
    playExclusive(v)
  }, [on, video.src])
  useEffect(() => { setOn(false) }, [video.src])
  return (
    <div className={`relative overflow-hidden bg-ink ${round} ${className}`} style={{ aspectRatio: `${video.width} / ${video.height}` }}>
      <video ref={ref} poster={video.poster} preload="none" playsInline controls={on} aria-hidden={!on} className="h-full w-full object-cover" aria-label={video.label} width={video.width} height={video.height} />
      {!on && (
        <button type="button" onClick={() => setOn(true)} aria-label={video.label}
          className="group absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_50%,rgba(11,11,18,0),rgba(11,11,18,.35))] focus-visible:outline-none">
          <span className="relative grid size-[76px] place-items-center rounded-full border-[1.5px] border-ink bg-[radial-gradient(70%_60%_at_35%_25%,rgba(255,255,255,.55),transparent_60%),linear-gradient(in_oklch_180deg,#E8FF7A_0%,#D8FA45_35%,#C8F31D_75%,#B9E512_100%)] shadow-[0_4px_0_#0B0B12,inset_0_1px_0_rgba(255,255,255,.6)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105 group-active:translate-y-1 group-active:shadow-none group-focus-visible:outline-3 group-focus-visible:outline-offset-4 group-focus-visible:outline-violet md:size-[92px]">
            <span className={`absolute inset-[-10px] rounded-full border-2 ${dark ? 'border-lime/60' : 'border-white/80'} animate-ping [animation-duration:1.8s]`} />
            <svg viewBox="0 0 24 24" className="ml-1 size-8 md:size-9" aria-hidden><path d="M7 4.5v15l13-7.5z" fill="#0B0B12" /></svg>
          </span>
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ slime divider (GSAP d-morph, 8 s loop) */
const SLIME_A = 'M0 0 H1440 V18 C1320 30 1250 22 1180 26 C1150 28 1140 64 1120 64 C1100 64 1098 30 1060 28 C940 22 860 40 760 30 C700 24 690 52 676 52 C662 52 660 26 620 24 C500 18 380 40 260 28 C220 24 212 78 190 78 C168 78 170 30 140 26 C90 20 40 30 0 22 Z'
const SLIME_B = 'M0 0 H1440 V24 C1320 20 1250 30 1180 24 C1150 22 1144 86 1122 86 C1100 86 1096 28 1060 24 C940 30 860 22 760 34 C700 30 694 70 678 70 C662 70 658 32 620 30 C500 26 380 22 260 34 C220 30 214 58 192 58 C170 58 168 30 140 32 C90 28 40 20 0 28 Z'
export function SlimeDivider({ flip }: { flip?: boolean }) {
  const path = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()
  const gid = useId().replace(/:/g, '')
  useEffect(() => {
    if (reduced || !path.current) return
    let kill: (() => void) | undefined
    import('gsap').then(({ gsap }) => {
      if (!path.current) return
      const tw = gsap.to(path.current, { attr: { d: SLIME_B }, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      kill = () => tw.kill()
    })
    return () => kill?.()
  }, [reduced])
  return (
    <div className="pointer-events-none relative z-[1] h-[56px] w-full overflow-hidden md:h-[88px]" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id={`sl${gid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E01FB8" /><stop offset=".55" stopColor="#FF4FD8" /><stop offset="1" stopColor="#FF9BEA" /></linearGradient>
        </defs>
        <path ref={path} d={SLIME_A} fill={`url(#sl${gid})`} />
        <path d="M0 8 C300 14 600 4 900 10 S1300 6 1440 10" stroke="#fff" strokeOpacity=".55" strokeWidth="3" fill="none" />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ reel */
export function Reel({ t }: { t: SiteContent }) {
  const r = t.reel
  return (
    <section id="reel" className="wrap section-gap" aria-labelledby="reel-h">
      <Rise className="card-black relative overflow-hidden p-5 md:p-8 xl:p-10">
        <span className="pointer-events-none absolute -left-20 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(122,77,255,.45),transparent_65%)]" aria-hidden />
        <span className="pointer-events-none absolute -bottom-24 right-[-60px] size-96 rounded-full bg-[radial-gradient(circle,rgba(255,79,216,.3),transparent_65%)]" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center lg:gap-10">
          <div>
            <Tag className="!bg-lime !text-ink">{r.tag}</Tag>
            <h2 id="reel-h" className="h-sec mt-4 text-white">{r.title}</h2>
            <p className="mt-4 text-[16px] leading-[1.5] text-white/75 md:text-[17px]">{r.lead}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {r.ctas.map(c => c.variant === 'main'
                ? <LimeButton key={c.href} href={c.href}>{c.label}</LimeButton>
                : <WhiteButton key={c.href} href={c.href} className="!h-[52px]">{c.label}</WhiteButton>)}
            </div>
          </div>
          <figure className="m-0">
            <div className="relative">
              <Player video={r.video} dark className="w-full shadow-[0_0_0_1px_rgba(255,255,255,.12),0_30px_60px_-20px_rgba(122,77,255,.5)]" />
            </div>
            <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-[14px] text-white/60">
              <span>{r.captions[0]}</span><span>{r.captions[1]}</span>
            </figcaption>
          </figure>
        </div>
      </Rise>
    </section>
  )
}

/* ------------------------------------------------------------------ tutorial */
export function Tutorial({ t }: { t: SiteContent }) {
  const tu = t.tutorial
  const d = derive(t)
  return (
    <section id="tutorial" className="wrap section-gap" aria-labelledby="tut-h">
      <Rise className="card-lilac relative overflow-visible p-5 md:p-8 xl:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-12">
          <figure className="relative m-0">
            <Player video={tu.video} className="w-full border-[3px] border-white shadow-[0_24px_50px_-20px_rgba(75,43,214,.55)]" />
            {d.tutorialTime && (
              <span aria-hidden className="sticker hand absolute -right-2 -top-5 h-[64px] w-[84px] rotate-[6deg] !text-[30px] md:-right-5 md:-top-7 md:h-[78px] md:w-[96px] md:!text-[36px]">{d.tutorialTime}</span>
            )}
            <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-[14px] text-ink-2/80">
              <span>{tu.captions[0]}</span><span>{tu.captions[1]}</span>
            </figcaption>
          </figure>
          <div className="lg:order-first lg:col-start-2 lg:row-start-1">
            <Tag>{tu.tag}</Tag>
            <h2 id="tut-h" className="h-sec mt-4">{tu.title}</h2>
            <p className="lead mt-4">{tu.lead}</p>
          </div>
        </div>
      </Rise>
    </section>
  )
}

/* ------------------------------------------------------------------ who */
function HoverVideo({ v, play, className = '', auto }: { v: Video; play: boolean; className?: string; auto?: boolean }) {
  const [ref] = useAutoVideo(!!auto, 0.6)
  useEffect(() => {
    const el = ref.current
    if (!el || auto) return
    if (play) { el.muted = true; el.play().catch(() => {}) } else el.pause()
  }, [play, auto, ref])
  return (
    <video ref={ref} poster={v.poster} muted loop playsInline preload="none" aria-label={v.label} className={`h-full w-full object-cover ${className}`} width={v.width} height={v.height}>
      <source src={v.src} type="video/mp4" />
    </video>
  )
}

export function Who({ t, lang }: { t: SiteContent; lang: Lang }) {
  const w = t.who
  const fine = useMediaQuery(FINE)
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = useState(-1)
  const ICON = [0, 1, 2, 3]
  return (
    <section id="who" className="wrap section-gap" aria-labelledby="who-h">
      <SectionHead tag={w.tag} title={w.title} id="who-h" />
      <ul className="m-0 mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 md:gap-6 lg:mt-14 xl:grid-cols-4">
        {w.cards.map((c, i) => {
          const m = c.media
          const play = fine && !reduced && hover === i
          return (
            <Rise as="li" key={c.title} i={i} className="h-full">
              <article className="glass-flat group flex h-full flex-col overflow-hidden p-3 transition-transform duration-300 hover:-translate-y-1.5"
                onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(-1)}>
                <div className="relative aspect-[4/3.4] overflow-hidden rounded-[14px] bg-ink">
                  {m.kind === 'trio' && (
                    <div className="grid h-full grid-cols-3 gap-1">
                      {m.videos.map((v, k) => <HoverVideo key={v.src} v={v} play={play} auto={!fine && k === 1} />)}
                    </div>
                  )}
                  {m.kind === 'solo' && <img src={m.image.src} alt={m.image.alt} loading="lazy" className="h-full w-full object-cover object-[50%_30%]" width={m.image.width} height={m.image.height} />}
                  {m.kind === 'video' && <HoverVideo v={m.video} play={play} auto={!fine} />}
                  {m.kind === 'pair' && (
                    <div className="grid h-full grid-rows-2 gap-1">
                      {m.items.map(it => (
                        <div key={it.badge} className="relative overflow-hidden">
                          <img src={it.image.src} alt={it.image.alt} loading="lazy" className="h-full w-full object-cover" width={it.image.width} height={it.image.height} />
                          <span aria-hidden className="absolute left-2 top-2 rounded-[6px] bg-lime px-1.5 py-0.5 text-[11px] font-extrabold text-ink">{it.badge}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <span className="absolute -bottom-3 -right-2 rotate-[-8deg]" aria-hidden>
                    <span className="grid size-12 place-items-center rounded-full border-2 border-white shadow-lg" style={{ background: ['#FF4FD8', '#C8F31D', '#7A4DFF', '#57B4FF'][ICON[i]] }}>
                      <Sparkle size={18} color={i === 1 ? '#0B0B12' : '#fff'} />
                    </span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                  <h3 className="card-title m-0">{c.title}</h3>
                  <p className="card-text mt-2">{c.text}</p>
                  <div className="flex-1"><More lang={lang} details={c.details} /></div>
                  <p className="hand mt-3 text-[21px] leading-[1.05] text-violet-deep">{c.source}</p>
                </div>
              </article>
            </Rise>
          )
        })}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ how (lime banner #2) */
export function How({ t, lang }: { t: SiteContent; lang: Lang }) {
  const h = t.how
  const d = derive(t)
  const bubbles = ['bubble-pink', 'bubble-lime', 'bubble-lilac']
  return (
    <section id="how" className="wrap section-gap" aria-labelledby="how-h">
      <div className="banner-lime overflow-hidden p-5 md:p-8 xl:p-10">
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-start lg:gap-12">
          <div>
            <Tag>{h.tag}</Tag>
            <PixelTitle id="how-h" text={h.title} className="mt-4" />
            <p className="mt-4 max-w-[500px] text-[16px] font-medium leading-[1.45] md:text-[17px]">{h.lead}</p>
            <p className="hand mt-8 hidden w-fit rotate-[-6deg] text-[34px] uppercase leading-none text-ink lg:block">
              «{d.dendy}»
              <svg viewBox="0 0 160 20" className="mt-1 w-full" aria-hidden><path d="M4 12c30-8 70-8 150-2" stroke="#0B0B12" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
            </p>
          </div>
          <figure className="relative m-0 lg:mt-2">
            <div className="relative rounded-[18px] bg-ink p-[10px] pb-[22px] shadow-[0_30px_50px_-20px_rgba(40,20,120,.6)] md:p-3 md:pb-7">
              <img src={h.screenshot.src} alt={h.screenshot.alt} width={h.screenshot.width} height={h.screenshot.height} loading="lazy" className="block w-full rounded-[10px]" />
              <span className="absolute bottom-[7px] left-1/2 size-2 -translate-x-1/2 rounded-full bg-white/30 md:bottom-2.5" />
            </div>
            <div className="mx-auto h-5 w-24 bg-[linear-gradient(in_oklch_180deg,#3A3A4A,#1A1A26_45%,#0B0B12)] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" aria-hidden />
            <div className="mx-auto h-2 w-44 rounded-full bg-ink" aria-hidden />
            <figcaption className="hand mt-3 text-center text-[22px] leading-[1.05] text-ink md:text-[24px]">{h.caption}</figcaption>
          </figure>
        </div>
        <ol className="relative m-0 mt-8 grid list-none gap-3 p-0 md:gap-5 lg:mt-10 lg:grid-cols-3">
          {h.steps.map((s, i) => (
            <Rise as="li" key={s.n} i={i} className="rounded-[20px] bg-white p-5 shadow-[0_14px_30px_-18px_rgba(40,20,120,.45)] md:p-6">
              <span className={`font-puffy bubble grid size-14 place-items-center rounded-full text-[28px] font-black ${bubbles[i % 3]}`} style={{ textShadow: '0 1px 0 rgba(0,0,0,.12)' }}>{s.n}</span>
              <h3 className="card-title mt-4">{s.title}</h3>
              <p className="card-text mt-2">{s.text}</p>
              <More lang={lang} details={s.details} />
            </Rise>
          ))}
        </ol>
        <p className="relative mt-6 max-w-[900px] text-[14px] font-medium leading-[1.5] text-ink/75 max-md:text-[16px]">{h.note}</p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ looks (polaroids) */
export function Looks({ t }: { t: SiteContent }) {
  const l = t.looks
  const rot = [-3, 2, -2, 3, -1, 2]
  return (
    <section id="looks" className="wrap section-gap" aria-labelledby="looks-h">
      <SectionHead tag={l.tag} title={l.title} lead={l.lead} id="looks-h" />
      <ul className="m-0 mt-10 grid list-none grid-cols-2 gap-x-3 gap-y-6 p-0 md:grid-cols-3 md:gap-x-8 md:gap-y-10 lg:mt-14 xl:grid-cols-6 xl:gap-x-6">
        {l.styles.map((s, i) => (
          <Rise as="li" key={s.name} i={i}>
            <figure className="polaroid relative m-0 bg-white p-2.5 pb-1 shadow-[0_18px_34px_-18px_rgba(60,40,160,.5)] md:p-3 md:pb-1.5" style={{ transform: `rotate(${rot[i % rot.length]}deg)` }}>
              <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-3deg] bg-[rgba(200,243,29,.75)] shadow-sm" aria-hidden />
              <img src={s.image.src} alt={s.image.alt} loading="lazy" width={480} height={328} className="block aspect-[480/328] w-full object-cover" />
              <figcaption className="hand pb-1.5 pt-3 text-center text-[24px] leading-[1.1] text-ink md:text-[26px]">{s.name}</figcaption>
            </figure>
          </Rise>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ req */
export function Req({ t, lang }: { t: SiteContent; lang: Lang }) {
  const r = t.req
  const accents = ['#FF4FD8', '#C8F31D', '#7A4DFF']
  return (
    <section id="req" className="wrap section-gap" aria-labelledby="req-h">
      <SectionHead tag={r.tag} title={r.title} lead={r.lead} id="req-h" />
      <div className="mt-10 grid gap-3 md:gap-6 lg:mt-14 lg:grid-cols-[1fr_1fr_1fr_1.15fr]">
        {r.tiers.map((tier, i) => (
          <Rise key={tier.title} i={i} className="glass-flat relative overflow-hidden p-6 md:p-7">
            <span className="absolute right-5 top-5 size-3 rounded-full" style={{ background: accents[i], boxShadow: `0 0 0 4px ${accents[i]}33` }} aria-hidden />
            <p className="m-0 text-[12px] font-extrabold uppercase tracking-[.08em] text-violet-deep">{tier.who}</p>
            <h3 className="card-title mt-3">{tier.title}</h3>
            {tier.paragraphs.map((p, k) => <p key={k} className="card-text mt-3">{p}</p>)}
            <More lang={lang} details={tier.details} />
          </Rise>
        ))}
        <Rise i={3} className="relative rounded-[20px] bg-white p-6 shadow-[0_14px_40px_-18px_rgba(60,40,160,.35)] md:p-7">
          <h3 className="card-title m-0">{r.notes.title}</h3>
          <ul className="m-0 mt-4 list-none space-y-3 p-0">
            {r.notes.items.map(it => (
              <li key={it} className="card-text flex gap-3">
                <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full border-[1.5px] border-ink bg-lime"><Check size={12} strokeWidth={3.2} aria-hidden /></span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </Rise>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ features */
const FEAT_ICONS = [PenLine, Mic, ImageIcon, Clapperboard, Music, Captions, Scissors, UserRound, Languages, FileText, SparklesIcon, KeyRound]
const BUBBLES = ['bubble-pink', 'bubble-lime', 'bubble-lilac']
export function Features({ t, lang }: { t: SiteContent; lang: Lang }) {
  const f = t.features
  return (
    <section id="features" className="wrap section-gap" aria-labelledby="feat-h">
      <SectionHead tag={f.tag} title={f.title} lead={f.lead} id="feat-h" />
      <ul className="m-0 mt-10 grid list-none grid-cols-2 gap-3 p-0 md:gap-5 lg:mt-14 lg:grid-cols-4 xl:gap-6">
        {f.items.map((it, i) => {
          const I = FEAT_ICONS[i] ?? SparklesIcon
          const b = BUBBLES[i % 3]
          return (
            <Rise as="li" key={it.title} i={i % 4} className="glass-flat group p-4 transition-transform duration-300 hover:-translate-y-1 md:p-6">
              <span className={`bubble grid size-12 place-items-center rounded-full transition-transform duration-300 [transition-timing-function:cubic-bezier(.3,1.6,.5,1)] group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:scale-110 md:size-14 ${b}`}>
                <I size={24} strokeWidth={2.2} aria-hidden />
              </span>
              <h3 className="mt-4 hyphens-auto text-[16px] font-extrabold leading-[1.15] [overflow-wrap:anywhere] md:text-[18px]">{it.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.45] text-ink-2 max-md:text-[16px]">{it.text}</p>
              <More lang={lang} details={it.details} />
            </Rise>
          )
        })}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ download */
export function DownloadSection({ t }: { t: SiteContent }) {
  const dl = t.download
  return (
    <section id="download" className="wrap section-gap" aria-labelledby="dl-h">
      <Rise className="card-lilac relative overflow-hidden p-5 md:p-8 xl:p-10">
        <span className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,79,216,.35),transparent_65%)]" aria-hidden />
        <span className="pointer-events-none absolute -bottom-40 left-[20%] size-[420px] rounded-full bg-[radial-gradient(circle,rgba(87,180,255,.35),transparent_65%)]" aria-hidden />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <Tag>{dl.tag}</Tag>
            <h2 id="dl-h" className="h-sec mt-4">{dl.title}</h2>
            <p className="lead mt-4 max-w-[560px]">{dl.lead}</p>
          </div>
          <div className="pointer-events-none relative mx-auto aspect-[4/3] w-full max-w-[420px] lg:-my-10" aria-hidden>
            <GenImg src={GEN.devices} className="h-full w-full object-contain drop-shadow-[0_24px_30px_rgba(75,43,214,.35)]" width={1344} height={1008} />
          </div>
        </div>
        <ul className="relative m-0 mt-8 grid list-none gap-3 p-0 md:grid-cols-3 md:gap-5">
          {dl.platforms.map((p, i) => (
            <Rise as="li" key={p.os} i={i}>
              <a href={p.href} className="group flex h-full items-center gap-4 rounded-[16px] border-[1.5px] border-ink bg-white p-4 shadow-[0_3px_0_#0B0B12] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_5px_0_#0B0B12] active:translate-y-[3px] active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-violet md:p-5">
                <span className="icon-sq !size-14 !rounded-[14px]"><OsGlyph os={p.os} size={24} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-extrabold leading-tight">{p.name}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-ink-2 max-md:text-[14px]">{p.details}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-[14px] font-bold text-violet-deep">{p.cta}<DownloadIcon size={15} strokeWidth={2.4} className="transition-transform group-hover:translate-y-0.5" aria-hidden /></span>
                </span>
              </a>
            </Rise>
          ))}
        </ul>
        <p className="relative mt-5 text-[14px] leading-[1.5] text-ink-2 max-md:text-[16px]">{dl.note}</p>
        <div className="relative"><MobileSoon t={t} /></div>
      </Rise>
    </section>
  )
}

/* ------------------------------------------------------------------ pricing */
function Holo({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  useEffect(() => (reduced ? undefined : onPointer((x, y) => { ref.current?.style.setProperty('--holo', `${Math.round(Math.atan2(y, x) * 57.3 + 180)}deg`) })), [reduced])
  return <span ref={ref} className={`holo ${className}`}>{children}</span>
}

export function Pricing({ t }: { t: SiteContent }) {
  const pr = t.pricing
  return (
    <section id="pricing" className="wrap section-gap" aria-labelledby="price-h">
      <SectionHead tag={pr.tag} title={pr.title} lead={pr.lead} id="price-h" />
      <div className="mt-10 grid gap-4 md:gap-6 lg:mt-14 lg:grid-cols-3 lg:items-stretch">
        {pr.plans.map((p, i) => {
          const hot = !!p.highlight
          const dark = !hot && i === pr.plans.length - 1
          const tone = hot ? 'card-limehot' : dark ? 'card-black' : 'glass-flat'
          return (
            <Rise key={p.name} i={i} className={`relative flex flex-col rounded-[20px] p-6 md:p-8 ${tone} ${hot ? 'max-lg:order-first lg:-translate-y-3 shadow-[0_6px_0_#0B0B12,0_30px_60px_-24px_rgba(122,160,0,.6)]' : ''}`}>
              {hot && pr.highlight && <Plaque>{pr.highlight}</Plaque>}
              {p.badge && (
                <Holo className="absolute -right-3 -top-5 grid size-[76px] rotate-[10deg] place-items-center rounded-full border-[1.5px] border-ink bg-pink text-[20px] font-black text-white shadow-[0_6px_14px_-6px_rgba(0,0,0,.45)]">
                  <span className="font-puffy relative z-[1]">{p.badge}</span>
                </Holo>
              )}
              <h3 className={`m-0 text-[15px] font-extrabold uppercase tracking-[.06em] ${dark ? 'text-lime' : 'text-violet-deep'} ${hot ? '!text-ink' : ''}`}>{p.name}</h3>
              <p className="m-0 mt-4 flex min-h-[56px] flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className={`font-extrabold leading-none tracking-[-.03em] ${p.price.display.length > 5 ? 'text-[34px] xl:text-[44px]' : 'text-[46px] md:text-[56px]'}`}>{p.price.display}</span>
                {p.price.old && <s className={`text-[22px] font-bold ${dark ? 'text-white/45' : 'text-ink/45'}`}>{p.price.old}</s>}
              </p>
              <p className={`mt-2 text-[15px] font-semibold ${dark ? 'text-white/70' : 'text-ink-2'}`}>{p.per}</p>
              <ul className="m-0 mt-6 flex-1 list-none space-y-3 p-0">
                {p.items.map(it => (
                  <li key={it} className={`flex gap-3 text-[15px] leading-[1.4] max-md:text-[16px] ${dark ? 'text-white/85' : 'text-ink-2'}`}>
                    <span className={`mt-0.5 grid size-5 flex-none place-items-center rounded-full ${hot ? 'bg-ink text-lime' : dark ? 'bg-lime text-ink' : 'bg-ink text-white'}`}><Check size={12} strokeWidth={3.2} aria-hidden /></span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                {hot ? <BlackButton href={p.cta.href} className="w-full !h-[52px]" arrow={!/→/.test(p.cta.label)}>{p.cta.label}</BlackButton>
                  : dark ? <LimeButton href={p.cta.href} className="w-full" arrow={!/→/.test(p.cta.label)}>{p.cta.label}</LimeButton>
                    : <BlackButton href={p.cta.href} className="w-full !h-[52px]" arrow={!/→/.test(p.cta.label)}>{p.cta.label}</BlackButton>}
              </div>
            </Rise>
          )
        })}
      </div>
      <div className="mt-4 grid gap-4 md:mt-6 md:grid-cols-2 md:gap-6">
        {pr.extras.map((x, i) => (
          <Rise key={x.title} i={i} className="glass-flat flex gap-4 p-5 md:p-6">
            <span className="grid size-11 flex-none place-items-center rounded-[12px]" style={{ background: i ? '#7A4DFF' : '#FF4FD8', color: '#fff' }}>{i ? <UserRound size={20} aria-hidden /> : <SparklesIcon size={20} aria-hidden />}</span>
            <div><h3 className="m-0 text-[17px] font-extrabold">{x.title}</h3><p className="card-text mt-1.5">{x.text}</p></div>
          </Rise>
        ))}
      </div>
      <p className="mt-5 text-[14px] leading-[1.5] text-ink-2 max-md:text-[16px]">{pr.note}</p>
      <Rise className="mt-6 flex flex-col gap-4 rounded-[20px] border-[1.5px] border-dashed border-ink/30 bg-white/60 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="max-w-[720px]">
          <p className="m-0 text-[16px] font-semibold leading-[1.45]">{pr.buy.text}</p>
          <p className="m-0 mt-1.5 text-[14px] text-ink-2 max-md:text-[16px]">{pr.buy.note}</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <LimeButton href={pr.buy.cta.href} arrow={false}><Mail size={18} aria-hidden />{pr.buy.cta.label}</LimeButton>
          <p className="m-0 flex gap-4 text-[14px]">{pr.legal.map(l => <a key={l.href} href={l.href} target="_blank" rel="noopener" className="text-link">{l.label}</a>)}</p>
        </div>
      </Rise>
    </section>
  )
}

/* ------------------------------------------------------------------ faq */
export function Faq({ t }: { t: SiteContent }) {
  const f = t.faq
  const [open, setOpen] = useState<Set<number>>(() => new Set(f.items.flatMap((it, i) => (it.open ? [i] : []))))
  useEffect(() => { setOpen(new Set(f.items.flatMap((it, i) => (it.open ? [i] : [])))) }, [f])
  const toggle = (i: number) => setOpen(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })
  return (
    <section id="faq" className="wrap section-gap" aria-labelledby="faq-h">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Tag>{f.tag}</Tag>
          <h2 id="faq-h" className="h-sec mt-4">{f.title}</h2>
          <p className="hand mt-6 hidden rotate-[-4deg] text-[30px] leading-none text-violet-deep lg:block">{t.contact.title}</p>
        </div>
        <ul className="m-0 list-none space-y-3 p-0">
          {f.items.map((it, i) => {
            const isOpen = open.has(i)
            return (
              <li key={it.q} className="glass-flat !rounded-[18px]">
                <h3 className="m-0">
                  <button type="button" className="acc-q flex w-full items-center gap-4 rounded-[18px] p-4 text-left md:px-6 md:py-5" aria-expanded={isOpen} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => toggle(i)}>
                    <span className="flex-1 text-[17px] font-bold leading-snug md:text-[18px]">{it.q}</span>
                    <span className="plus" aria-hidden><Plus size={20} strokeWidth={2.6} /></span>
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={`acc-body ${isOpen ? 'open' : ''}`} inert={!isOpen}>
                  <div>
                    <p className="rich m-0 px-4 pb-5 text-[16px] leading-[1.55] text-ink-2 md:px-6 md:pr-20"><RichText r={it.a} /></p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ contact */
export function Contact({ t }: { t: SiteContent }) {
  const c = t.contact
  const main = c.ctas.find(x => x.variant === 'main') ?? c.ctas[0]
  const label = useOsLabel(main, t)
  return (
    <section id="contact" className="wrap section-gap" aria-labelledby="contact-h">
      <Rise className="card-black relative overflow-hidden p-6 md:p-10 xl:p-14">
        <span className="pointer-events-none absolute -left-24 bottom-[-40%] size-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,79,216,.35),transparent_65%)]" aria-hidden />
        <span className="pointer-events-none absolute -right-24 -top-32 size-[480px] rounded-full bg-[radial-gradient(circle,rgba(122,77,255,.45),transparent_65%)]" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <Tag className="!bg-lime !text-ink">{c.tag}</Tag>
            <h2 id="contact-h" className="sr-only">{c.title}</h2>
            <NeonScript text={c.title} size={84} maxChars={12} rotate={-4} className="mt-6 w-full max-w-[520px]" />
          </div>
          <div>
            <p className="m-0 text-[17px] leading-[1.55] text-white/80 md:text-[19px]">{c.lead}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LimeButton href={main.href}>{label}</LimeButton>
              {c.ctas.filter(x => x !== main).map(x => <WhiteButton key={x.href} href={x.href} className="!h-[52px]">{x.label}</WhiteButton>)}
            </div>
          </div>
        </div>
        <Sparkle size={20} color="#C8F31D" className="absolute right-[8%] top-10" />
        <Sparkle size={12} color="#FF9BEA" className="absolute bottom-10 right-[40%]" />
      </Rise>
    </section>
  )
}

/* ------------------------------------------------------------------ footer */
export function Footer({ t, lang, setLang }: { t: SiteContent; lang: Lang; setLang: (l: Lang) => void }) {
  const mail = t.footer.links.find(l => l.href.startsWith('mailto:'))
  const reduced = usePrefersReducedMotion()
  return (
    <footer className="wrap mt-[72px] pb-8 md:mt-24">
      <div className="flex flex-col gap-8 border-t border-ink/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Logo size={26} />
          <p className="mt-2 text-[14px] text-ink-2 max-md:text-[16px]">{t.footer.note}</p>
        </div>
        <nav aria-label="footer" className="flex flex-wrap gap-x-5 gap-y-1 md:gap-x-7">
          {t.footer.links.filter(l => l !== mail).map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" className="nav-link inline-flex min-h-11 max-w-full items-center !text-[13px] [overflow-wrap:anywhere] md:!text-[14px]"><svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden><path d="M2 6.5C20 3.5 45 3 98 5.5" /></svg><span>{l.label}</span></a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {mail && (
            <a href={mail.href} aria-label={mail.label} title={mail.label} className="group rounded-[10px] focus-visible:outline-3 focus-visible:outline-lime">
              <span className="icon-sq !size-11"><Mail size={19} aria-hidden /></span>
            </a>
          )}
          <span className="mx-1 h-6 w-px bg-ink/15" aria-hidden />
          {LANGS.map(l => (
            <button key={l.code} type="button" onClick={() => { setLang(l.code); window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) }} aria-pressed={l.code === lang} aria-label={l.name}
              className={`grid h-11 min-w-11 place-items-center rounded-[10px] px-1 text-[13px] font-extrabold transition-colors focus-visible:outline-3 focus-visible:outline-violet ${l.code === lang ? 'bg-ink text-lime' : 'text-ink hover:bg-white/70'}`}>
              {l.short}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-1 text-[13px] text-ink-2/80 md:flex-row md:justify-between max-md:text-[14px]">
        <span>{t.footer.copyright}</span>
        <a href="#top" className="text-link inline-flex items-center gap-1">KADR studio <ChevronRight size={14} className="-rotate-90" aria-hidden /></a>
      </div>
    </footer>
  )
}
