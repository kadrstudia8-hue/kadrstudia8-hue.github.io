import { ArrowRight, Check, Cloud as CloudIcon, Cpu, Download, MousePointerClick, Play, Plus, ShieldCheck, Smartphone, Wallet, X, Zap } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { Lang, SiteContent, Video } from '@kadr/shared/content/index'
import { CtaButton, Players, useOs, useShare } from './actions'
import { FINE, GEN, GenImg, RichText, playExclusive, useAutoVideo, useMediaQuery, usePrefersReducedMotion } from './lib'
import { SpriteIcon } from './FactCards'
import { OsGlyph } from './PairCards'
import { LimeButton, NeonScript, PixelTitle, Rise, Sparkle, Tag } from './ui'

/* ------------------------------------------------------------------ shared bits */
function Head({ tag, title, subtitle, id, dark, pixel, className = '' }: { tag?: string; title: string; subtitle: string; id: string; dark?: boolean; pixel?: boolean; className?: string }) {
  const reduced = usePrefersReducedMotion()
  return (
    <m.div className={`max-w-[760px] ${className}`} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
      {tag && <Tag className="mb-4">{tag}</Tag>}
      {pixel ? <PixelTitle id={id} text={title} className={dark ? '!text-white' : ''} /> : <h2 id={id} className={`h-sec m-0 ${dark ? 'text-white' : ''}`}>{title}</h2>}
      <p className={`m-0 mt-3 text-[17px] font-medium leading-[1.45] md:mt-4 md:text-[19px] ${dark ? 'text-white/80' : 'text-ink-2'}`}>{subtitle}</p>
    </m.div>
  )
}

/** Open/close panel with the same grid-rows trick as the FAQ. */
function Disclose({ open, id, children }: { open: boolean; id: string; children: ReactNode }) {
  return <div id={id} className={`acc-body ${open ? 'open' : ''}`} inert={!open}><div>{children}</div></div>
}

/* ------------------------------------------------------------------ 2. proof */
function Thumb({ poster, label, active, onClick }: { poster: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} title={label}
      className={`group relative flex flex-col overflow-hidden rounded-[14px] border-2 bg-white text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-violet ${active ? 'border-ink shadow-[0_3px_0_#0B0B12]' : 'border-white/80 shadow-[0_8px_18px_-10px_rgba(40,20,120,.5)]'}`}>
      <img src={poster} alt="" loading="lazy" width={240} height={240} className="block aspect-square w-full object-cover" />
      <span className={`flex min-h-[34px] items-center px-1.5 py-1 text-[11px] font-bold leading-[1.15] [overflow-wrap:anywhere] md:text-[12px] ${active ? 'bg-ink text-lime' : 'bg-white text-ink'}`}>{label}</span>
    </button>
  )
}

export function Proof({ t }: { t: SiteContent }) {
  const p = t.page!.proof
  const ex = t.proof.examples
  const [i, setI] = useState(0)
  const cur = ex[i] ?? ex[0]
  const players = useContext(Players)
  const reduced = usePrefersReducedMotion()
  const [vref, playing] = useAutoVideo(true, 0.5)
  useEffect(() => {
    const v = vref.current
    if (!v) return
    v.load()
    const r = v.getBoundingClientRect()
    if (!reduced && r.bottom > 0 && r.top < innerHeight) playExclusive(v)
  }, [cur.video, vref, reduced])

  return (
    <section id="proof" className="wrap relative z-[3] mt-[30px] lg:-mt-6" aria-labelledby="proof-h">
      <div className="banner-lime p-5 md:p-8 xl:p-10">
        <div aria-hidden className="pointer-events-none absolute right-[2%] top-[-46px] hidden aspect-[4/3] w-[360px] xl:block">
          <GenImg src={GEN.cassette} className="h-full w-full object-contain drop-shadow-[0_24px_30px_rgba(75,43,214,.35)]" width={1344} height={1008} />
          <span className={`spool absolute aspect-square w-[11.4%] rounded-full ${playing ? 'on' : ''}`} style={{ left: '35.7%', top: '51.1%', translate: '-50% -50%', background: 'radial-gradient(circle,#0B0B12 0 26%,transparent 27%),conic-gradient(#8F6BFF 0 10%,#B9A6FF 10% 20%,#8F6BFF 20% 30%,#B9A6FF 30% 40%,#8F6BFF 40% 50%,#B9A6FF 50% 60%,#8F6BFF 60% 70%,#B9A6FF 70% 80%,#8F6BFF 80% 90%,#B9A6FF 90% 100%)', WebkitMaskImage: 'radial-gradient(circle,#000 0 64%,transparent 65%)', maskImage: 'radial-gradient(circle,#000 0 64%,transparent 65%)' }} />
          <span className={`spool absolute aspect-square w-[11.4%] rounded-full ${playing ? 'on' : ''}`} style={{ left: '56.7%', top: '46.6%', translate: '-50% -50%', background: 'radial-gradient(circle,#0B0B12 0 26%,transparent 27%),conic-gradient(#8F6BFF 0 10%,#B9A6FF 10% 20%,#8F6BFF 20% 30%,#B9A6FF 30% 40%,#8F6BFF 40% 50%,#B9A6FF 50% 60%,#8F6BFF 60% 70%,#B9A6FF 70% 80%,#8F6BFF 80% 90%,#B9A6FF 90% 100%)', WebkitMaskImage: 'radial-gradient(circle,#000 0 64%,transparent 65%)', maskImage: 'radial-gradient(circle,#000 0 64%,transparent 65%)' }} />
        </div>
        <Head tag={p.tag} title={p.title} subtitle={p.subtitle} id="proof-h" pixel className="relative xl:max-w-[720px]" />

        <div className="relative mt-6 grid gap-5 md:mt-8 lg:grid-cols-[260px_minmax(0,1fr)_380px] lg:gap-8">
          {/* player + prompt */}
          <div className="grid grid-cols-[150px_minmax(0,1fr)] items-start gap-4 md:grid-cols-[220px_minmax(0,1fr)] lg:contents">
            <figure className="relative m-0">
              <div className="overflow-hidden rounded-[18px] border-[3px] border-white bg-ink shadow-[0_24px_40px_-16px_rgba(40,20,120,.6)]">
                <video ref={vref} className={`block aspect-[9/16] w-full ${cur.shape === 'h' ? 'object-contain' : 'object-cover'}`} poster={cur.poster} muted loop playsInline preload="none" aria-label={cur.alt}>
                  <source src={cur.video} type="video/mp4" />
                </video>
              </div>
            </figure>
            <div className="min-w-0 lg:pt-2">
              <p className="m-0 inline-flex items-center gap-1.5 rounded-[6px] bg-ink px-2 py-1 text-[11px] font-extrabold uppercase tracking-[.06em] text-lime">{p.promptLabel}</p>
              <AnimatePresence mode="wait">
                <m.p key={cur.prompt} className="hand m-0 mt-3 text-[22px] leading-[1.02] text-ink md:text-[30px] lg:text-[36px]"
                  initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                  «{cur.prompt}»
                </m.p>
              </AnimatePresence>
              <p className="m-0 mt-3 flex flex-wrap gap-1.5">
                {cur.meta.slice(0, 2).map(x => <span key={x} className="rounded-[6px] bg-white/70 px-2 py-1 text-[12px] font-bold text-ink">{x}</span>)}
              </p>
            </div>
          </div>

          {/* thumbs + reel card */}
          <div>
            <div role="tablist" aria-label={t.proof.tablistLabel} className="grid grid-cols-4 gap-2 md:gap-3">
              {ex.map((e, k) => <Thumb key={e.label} poster={e.poster} label={e.label} active={k === i} onClick={() => setI(k)} />)}
            </div>
            <button type="button" onClick={players.reel}
              className="group relative mt-3 flex w-full items-center gap-3 overflow-hidden rounded-[16px] bg-ink p-2 pr-4 text-left text-white shadow-[0_14px_30px_-16px_rgba(40,20,120,.7)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-violet md:mt-4">
              <span className="relative block w-[42%] flex-none overflow-hidden rounded-[10px]">
                <img src={t.reel.video.poster} alt="" loading="lazy" width={960} height={540} className="block aspect-video w-full object-cover" />
                <span className="absolute inset-0 grid place-items-center"><span className="grid size-10 place-items-center rounded-full border-[1.5px] border-ink bg-lime text-ink shadow-[0_3px_0_#0B0B12] transition-transform group-hover:scale-110"><Play size={16} fill="currentColor" strokeWidth={0} className="ml-0.5" aria-hidden /></span></span>
              </span>
              <span className="text-[15px] font-bold leading-snug">{p.reelCard}</span>
            </button>
            <div className="mt-4 md:mt-5"><CtaButton cta={p.cta} t={t} tone="black" className="w-full md:w-auto" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ 3. who */
const WHO_ICON = [3, 1, 0, 2] // sprite cells: play, clapper, reel, microphone

function WhoMediaView({ t, i }: { t: SiteContent; i: number }) {
  const card = t.who.cards[i]
  const fine = useMediaQuery(FINE)
  const reduced = usePrefersReducedMotion()
  if (!card) return null
  const mm = card.media
  const V = ({ v, cls = '' }: { v: Video; cls?: string }) => <AutoV v={v} cls={cls} on={!reduced} />
  return (
    <div className="relative aspect-video overflow-hidden rounded-[18px] border-[3px] border-white bg-ink shadow-[0_24px_50px_-22px_rgba(40,20,120,.6)]">
      {mm.kind === 'trio' && <div className="grid h-full grid-cols-3 gap-1">{mm.videos.map(v => <V key={v.src} v={v} />)}</div>}
      {mm.kind === 'solo' && (
        <div className="relative h-full">
          <img src={mm.image.src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
          <img src={mm.image.src} alt={mm.image.alt} className="relative mx-auto h-full object-contain" loading="lazy" />
        </div>
      )}
      {mm.kind === 'video' && <V v={mm.video} />}
      {mm.kind === 'pair' && (
        <div className="grid h-full grid-cols-2 gap-1">
          {mm.items.map(it => (
            <div key={it.badge} className="relative overflow-hidden">
              <img src={it.image.src} alt={it.image.alt} loading="lazy" className="h-full w-full object-cover" />
              <span aria-hidden className="absolute left-2 top-2 rounded-[6px] bg-lime px-1.5 py-0.5 text-[12px] font-extrabold text-ink">{it.badge}</span>
            </div>
          ))}
        </div>
      )}
      {fine && null}
    </div>
  )
}
function AutoV({ v, cls, on }: { v: Video; cls: string; on: boolean }) {
  const [ref] = useAutoVideo(on, 0.4)
  return <video ref={ref} poster={v.poster} muted loop playsInline preload="none" aria-label={v.label} className={`h-full w-full object-cover ${cls}`}><source src={v.src} type="video/mp4" /></video>
}

export function Who({ t }: { t: SiteContent }) {
  const p = t.page!.who
  const [i, setI] = useState(0)
  const rot = [-3, 2, -2, 3, -1, 2]
  return (
    <section id="who" className="wrap section-gap" aria-labelledby="who-h">
      <Head title={p.title} subtitle={p.subtitle} id="who-h" />
      <div className="mt-8 grid gap-4 md:mt-10 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-8">
        <div role="tablist" aria-label={p.title} className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {p.cards.map((c, k) => (
            <button key={c.title} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}
              className={`glass-flat group relative flex items-center gap-3 !rounded-[18px] p-3 text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-violet md:gap-4 md:p-4 ${k === i ? '!border-ink !shadow-[0_3px_0_#0B0B12]' : ''}`}>
              <SpriteIcon i={WHO_ICON[k] ?? k} size={52} className="flex-none max-md:!size-10" />
              <span className="min-w-0">
                <span className="block text-[16px] font-extrabold leading-tight md:text-[18px]">{c.title}</span>
                <span className="mt-0.5 hidden text-[14px] leading-snug text-ink-2 md:block">{c.text}</span>
              </span>
              {k === i && <m.span layoutId="who-ind" className="absolute -right-1.5 top-1/2 hidden size-3 -translate-y-1/2 rounded-full border-[1.5px] border-ink bg-lime lg:block" />}
            </button>
          ))}
        </div>
        <div>
          <WhoMediaView t={t} i={i} />
          <p className="m-0 mt-3 text-[16px] leading-snug text-ink-2 md:hidden">{p.cards[i]?.text}</p>
        </div>
      </div>

      <div className="mt-8 md:mt-10">
        <p className="hand m-0 text-[26px] leading-none text-violet-deep md:text-[30px]">{p.stylesTitle}</p>
        <ul className="m-0 mt-4 grid list-none grid-cols-3 gap-x-2 gap-y-3 p-0 md:gap-x-4 xl:grid-cols-6">
          {t.looks.styles.map((s, k) => (
            <li key={s.name}>
              <figure className="polaroid m-0 bg-white p-1.5 pb-0.5 shadow-[0_14px_26px_-16px_rgba(60,40,160,.5)] md:p-2" style={{ transform: `rotate(${rot[k % 6]}deg)` }}>
                <img src={s.image.src} alt={s.image.alt} loading="lazy" width={480} height={328} className="block aspect-[480/328] w-full object-cover" />
                <figcaption className="hand pb-1 pt-3 text-center text-[17px] leading-[1.2] text-ink md:text-[21px]">{s.name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-7"><CtaButton cta={p.cta} t={t} /></div>
    </section>
  )
}

/* ------------------------------------------------------------------ 4. how */
export function How({ t }: { t: SiteContent }) {
  const p = t.page!.how
  const players = useContext(Players)
  const shot = t.how.screenshot
  const bubbles = ['bubble-pink', 'bubble-lime', 'bubble-lilac']
  return (
    <section id="how" className="wrap section-gap" aria-labelledby="how-h">
      <div className="banner-lime overflow-hidden p-5 md:p-8 xl:p-10">
        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
          <div>
            <Head title={p.title} subtitle={p.subtitle} id="how-h" pixel />
            <ol className="m-0 mt-6 list-none space-y-3 p-0">
              {p.steps.map((s, k) => (
                <li key={s} className="flex items-center gap-3">
                  <span className={`bubble grid size-10 flex-none place-items-center rounded-full text-[18px] font-black ${bubbles[k % 3]}`}>{k + 1}</span>
                  <span className="text-[18px] font-bold md:text-[20px]">{s}</span>
                </li>
              ))}
            </ol>
            <p className="hand m-0 mt-5 hidden w-fit rotate-[-5deg] text-[30px] uppercase leading-none text-ink lg:block">{p.note}</p>
          </div>
          <figure className="relative m-0">
            <div className="relative rounded-[18px] bg-ink p-[8px] pb-[58px] shadow-[0_30px_50px_-20px_rgba(40,20,120,.6)] md:p-3 md:pb-[64px]">
              <div className="relative overflow-hidden rounded-[10px]">
                <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" className="block w-full" />
                <span aria-hidden className="absolute rounded-[10px] ring-[3px] ring-lime shadow-[0_0_0_6px_rgba(200,243,29,.25)]" style={{ left: '5.6%', top: '39.6%', width: '65.6%', height: '12.2%' }} />
                <span aria-hidden className="absolute animate-ping rounded-[8px] ring-[3px] ring-lime [animation-duration:2.2s]" style={{ left: '66%', top: '43%', width: '4.4%', height: '7.2%' }} />
              </div>
              <span className="absolute bottom-[26px] left-6 size-2 rounded-full bg-white/30 md:bottom-[30px]" />
                <button type="button" onClick={players.tutorial} aria-label={p.cta.label}
                  className="group absolute bottom-[10px] right-[10px] inline-flex md:bottom-3 md:right-3 items-center gap-2 rounded-[12px] border-[1.5px] border-ink bg-lime py-1.5 pl-1.5 pr-3 text-[13px] font-bold text-ink shadow-[0_3px_0_#0B0B12] transition-transform hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none focus-visible:outline-3 focus-visible:outline-violet md:text-[15px]">
                  <span className="grid size-7 place-items-center rounded-[8px] bg-ink text-lime"><Play size={13} fill="currentColor" strokeWidth={0} className="ml-0.5" aria-hidden /></span>
                  {p.cta.label}
                </button>
            </div>
            <div className="mx-auto h-4 w-24 bg-[linear-gradient(in_oklch_180deg,#3A3A4A,#1A1A26_45%,#0B0B12)] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" aria-hidden />
            <div className="mx-auto h-2 w-40 rounded-full bg-ink" aria-hidden />
            <figcaption className="hand mt-2 text-center text-[22px] leading-[1.05] text-ink">{p.screenshotCaption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ 5. compare */
export function Compare({ t }: { t: SiteContent }) {
  const p = t.page!.compare
  const [open, setOpen] = useState(false)
  const id = useId()
  const rot = [-4, 3, -2, 4, -3, 2]
  return (
    <section id="compare" className="wrap section-gap" aria-labelledby="cmp-h">
      <Head title={p.title} subtitle={p.subtitle} id="cmp-h" />
      <div className="mt-8 grid items-stretch gap-4 md:mt-10 md:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] md:gap-3">
        <Rise className="glass-flat p-5 md:p-7">
          <p className="m-0 text-[13px] font-extrabold uppercase tracking-[.08em] text-ink/50">{p.before.title}</p>
          <ul className="m-0 mt-4 flex list-none flex-wrap gap-2.5 p-0">
            {p.before.items.map((x, k) => (
              <li key={x} className="relative inline-flex h-11 items-center gap-2 rounded-[10px] border border-ink/10 bg-[#E4E5EE] px-3.5 text-[16px] font-bold text-ink/45 shadow-[0_3px_8px_-4px_rgba(0,0,0,.2)]" style={{ transform: `rotate(${rot[k % 6]}deg)` }}>
                <X size={15} strokeWidth={2.6} className="text-[#E01FB8]" aria-hidden />
                <span className="line-through decoration-[#E01FB8] decoration-2">{x}</span>
              </li>
            ))}
          </ul>
        </Rise>
        <div className="grid place-items-center" aria-hidden>
          <span className="grid size-12 rotate-90 place-items-center rounded-full border-[1.5px] border-ink bg-white shadow-[0_3px_0_#0B0B12] md:rotate-0"><ArrowRight size={22} strokeWidth={2.4} /></span>
        </div>
        <Rise i={1} className="card-limehot relative flex flex-col justify-center rounded-[20px] p-5 shadow-[0_6px_0_#0B0B12,0_30px_60px_-24px_rgba(122,160,0,.6)] md:p-7">
          <p className="m-0 text-[13px] font-extrabold uppercase tracking-[.08em] text-ink">{p.after.title}</p>
          <div className="mt-4 flex items-center gap-2 rounded-[14px] border-[1.5px] border-ink bg-white p-2 pl-4 shadow-[inset_0_2px_0_rgba(11,11,18,.06)]">
            <span className="flex-1 text-[20px] font-extrabold leading-tight md:text-[24px]">{p.after.text.replace(/\s*➤\s*$/, '')}</span>
            <span className="grid size-11 flex-none place-items-center rounded-[10px] bg-ink text-[20px] text-lime" aria-hidden>➤</span>
          </div>
          <p className="m-0 mt-3 text-[14px] font-medium text-ink/75 max-md:text-[15px]">{p.note}</p>
          <Sparkle size={22} color="#0B0B12" className="absolute -right-2 -top-3" />
        </Rise>
      </div>
      <div className="mt-5">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(v => !v)}
          className="acc-q group inline-flex min-h-11 items-center gap-3 rounded-[12px] text-[16px] font-bold">
          <span className="plus !size-9" aria-hidden><Plus size={18} strokeWidth={2.6} /></span>{p.more.label}
        </button>
        <Disclose open={open} id={id}>
          <ul className="m-0 mt-3 grid list-none gap-2 p-0 sm:grid-cols-2">
            {p.more.items.map(x => (
              <li key={x} className="flex gap-2.5 text-[15px] leading-snug text-ink-2 max-md:text-[16px]">
                <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-ink text-lime"><Check size={12} strokeWidth={3.2} aria-hidden /></span>{x}
              </li>
            ))}
          </ul>
        </Disclose>
      </div>
      <div className="mt-6"><CtaButton cta={p.cta} t={t} /></div>
    </section>
  )
}

/* ------------------------------------------------------------------ 6. pc */
export function Pc({ t }: { t: SiteContent }) {
  const p = t.page!.pc
  const [open, setOpen] = useState(false)
  const id = useId()
  const [own, cloud] = p.tiles
  return (
    <section id="pc" className="wrap section-gap" aria-labelledby="pc-h">
      <Head title={p.title} subtitle={p.subtitle} id="pc-h" />
      <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6">
        {own && (
          <Rise className="card-lilac relative min-h-[220px] overflow-hidden p-5 md:p-7">
            <span className="bubble bubble-lilac grid size-12 place-items-center rounded-[14px]" aria-hidden><Cpu size={24} strokeWidth={2.2} /></span>
            <h3 className="card-title mt-4">{own.title}</h3>
            <p className="card-text mt-2 max-w-[260px]">{own.text}</p>
            <div aria-hidden className="pointer-events-none absolute bottom-2 right-2 aspect-[4/3] w-[44%] max-w-[260px]">
              <GenImg src={GEN.devices} className="h-full w-full object-contain drop-shadow-[0_16px_20px_rgba(75,43,214,.35)]" width={1344} height={1008} />
            </div>
          </Rise>
        )}
        {cloud && (
          <Rise i={1} className="cloud-banner relative min-h-[220px] overflow-hidden rounded-[20px] p-5 text-white md:p-7">
            <span className="grid size-12 place-items-center rounded-[14px] border-[1.5px] border-ink bg-lime text-ink shadow-[0_3px_0_#0B0B12]" aria-hidden><CloudIcon size={24} strokeWidth={2.2} /></span>
            {cloud.badge && <span className="sticker hand absolute right-5 top-5 !h-auto !w-auto rotate-[6deg] !px-3 !py-1.5 !text-[20px]">{cloud.badge}</span>}
            <h3 className="card-title mt-4 text-white">{cloud.title}</h3>
            <p className="mt-2 max-w-[340px] text-[15px] leading-[1.45] text-white/85 max-md:text-[16px]">{cloud.text}</p>
            <Zap aria-hidden size={120} strokeWidth={1.2} className="pointer-events-none absolute -bottom-4 right-4 text-white/15" />
          </Rise>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <CtaButton cta={p.cta} t={t} tone="black" onDisclose={() => setOpen(v => !v)} expanded={open} />
        <span className="inline-flex h-11 items-center gap-2 rounded-[12px] border-[1.5px] border-dashed border-ink/30 bg-white/60 px-3 text-[14px] font-bold"><Smartphone size={17} aria-hidden />{p.mobileChip}</span>
      </div>
      <Disclose open={open} id={id}>
        <ul className="m-0 mt-4 list-none space-y-2.5 rounded-[18px] bg-white/70 p-5 md:p-6">
          {p.details.map(x => <li key={x} className="flex gap-2.5 text-[15px] leading-[1.5] text-ink-2 max-md:text-[16px]"><span className="mt-2 size-1.5 flex-none rounded-full bg-violet" aria-hidden />{x}</li>)}
        </ul>
      </Disclose>
    </section>
  )
}

/* ------------------------------------------------------------------ 7. pricing */
export function Pricing({ t }: { t: SiteContent }) {
  const p = t.page!.pricing
  const payIcons = [Download, MousePointerClick, Wallet]
  return (
    <section id="pricing" className="wrap section-gap" aria-labelledby="price-h">
      <Head title={p.title} subtitle={p.subtitle} id="price-h" />
      <div className="mt-8 grid gap-4 md:mt-10 lg:grid-cols-[1fr_1.12fr_1fr] lg:items-center lg:gap-6">
        {p.plans.map((pl, k) => {
          const center = pl.tone === 'center', premium = pl.tone === 'premium'
          const tone = center ? 'card-limehot shadow-[0_6px_0_#0B0B12,0_30px_60px_-24px_rgba(122,160,0,.6)] lg:py-10' : premium ? 'card-black' : 'glass-flat'
          return (
            <Rise key={pl.id} i={k} className={`relative flex flex-col rounded-[20px] p-6 md:p-7 ${tone}`}>
              <p className={`m-0 w-fit rounded-[6px] px-2 py-1 text-[11px] font-extrabold uppercase tracking-[.08em] ${center ? 'bg-ink text-lime' : premium ? 'bg-white/10 text-lime' : 'bg-lime text-ink'}`}>{pl.label}</p>
              <h3 className={`m-0 mt-4 text-[16px] font-extrabold ${premium ? 'text-white/80' : 'text-ink-2'}`}>{pl.name}</h3>
              <p className="m-0 mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className={`font-extrabold leading-none tracking-[-.03em] ${center ? 'text-[46px] md:text-[54px]' : 'text-[40px] md:text-[44px]'}`}>{pl.price.display}</span>
                {pl.price.old && <s className="text-[18px] font-bold text-ink/45">{pl.price.old}</s>}
              </p>
              {pl.then && <p className="m-0 mt-2.5 text-[14px] font-semibold text-ink/65">{pl.then}</p>}
              <p className={`m-0 mt-2 text-[15px] font-bold ${premium ? 'text-white' : 'text-ink'}`}>{pl.per}</p>
              <ul className="m-0 mt-5 flex-1 list-none space-y-2.5 p-0">
                {pl.items.map(it => (
                  <li key={it} className={`flex gap-2.5 text-[15px] leading-[1.4] max-md:text-[16px] ${premium ? 'text-white/85' : 'text-ink-2'}`}>
                    <span className={`mt-0.5 grid size-5 flex-none place-items-center rounded-full ${center ? 'bg-ink text-lime' : premium ? 'bg-lime text-ink' : 'bg-ink text-white'}`}><Check size={12} strokeWidth={3.2} aria-hidden /></span>{it}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <CtaButton cta={pl.cta} t={t} tone={pl.tone === 'entry' ? 'lime' : premium ? 'white' : 'black'} className="w-full !h-[52px]" />
                {pl.note && <p className="m-0 mt-2 text-center text-[13px] font-semibold text-ink/65 max-md:text-[14px]">{pl.note}</p>}
              </div>
            </Rise>
          )
        })}
      </div>
      <Rise className="mt-5 flex flex-col gap-1 rounded-[18px] border-[1.5px] border-ink bg-white px-5 py-4 shadow-[0_3px_0_#0B0B12] md:flex-row md:items-center md:justify-between md:px-6">
        <p className="m-0 flex items-center gap-3 text-[17px] font-extrabold leading-snug md:text-[18px]"><ShieldCheck size={22} className="flex-none text-violet" aria-hidden />{p.honest}</p>
        <p className="m-0 text-[14px] font-semibold text-ink-2 max-md:pl-[34px]">{p.currencyNote}</p>
      </Rise>
      <div className="mt-5 rounded-[20px] bg-white/55 p-5 md:p-6">
        <p className="m-0 text-[13px] font-extrabold uppercase tracking-[.08em] text-ink/60">{p.pay.title}</p>
        <ol className="m-0 mt-3 grid list-none gap-3 p-0 md:grid-cols-3">
          {p.pay.steps.map((s, k) => {
            const I = payIcons[k] ?? Check
            return (
              <li key={s} className="flex items-center gap-3">
                <span className={`bubble grid size-11 flex-none place-items-center rounded-[12px] ${['bubble-pink', 'bubble-lime', 'bubble-lilac'][k % 3]}`}><I size={20} strokeWidth={2.3} aria-hidden /></span>
                <span className="text-[15px] font-bold leading-snug max-md:text-[16px]"><span className="text-ink/45">{k + 1}. </span>{s}</span>
              </li>
            )
          })}
        </ol>
        <p className="m-0 mt-4 text-[14px] text-ink-2 max-md:text-[16px]">{p.pay.help}</p>
      </div>
      <p className="m-0 mt-4 flex items-center gap-2 text-[14px] text-ink-2/80 max-md:text-[15px]"><Zap size={15} className="flex-none text-violet" aria-hidden />{p.cloud}</p>
    </section>
  )
}

/* ------------------------------------------------------------------ 8. faq */
export function Faq({ t }: { t: SiteContent }) {
  const p = t.page!.faq
  const init = () => new Set(p.items.flatMap((it, i) => (it.open ? [i] : [])))
  const [open, setOpen] = useState<Set<number>>(init)
  useEffect(() => { setOpen(init()) }, [p]) // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = (i: number) => setOpen(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })
  return (
    <section id="faq" className="wrap section-gap" aria-labelledby="faq-h">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Head title={p.title} subtitle={p.subtitle} id="faq-h" />
          <div className="mt-5 hidden flex-wrap items-center gap-4 lg:flex">
            <CtaButton cta={p.cta} t={t} tone="black" />
            <a href={p.all.href} target="_blank" rel="noopener" className="text-link text-[15px] font-semibold">{p.all.label}</a>
          </div>
        </div>
        <div>
          <ul className="m-0 list-none space-y-3 p-0">
            {p.items.map((it, i) => {
              const isOpen = open.has(i)
              return (
                <li key={it.q} className="glass-flat !rounded-[18px]">
                  <h3 className="m-0">
                    <button type="button" className="acc-q flex w-full items-center gap-4 rounded-[18px] p-4 text-left md:px-6 md:py-5" aria-expanded={isOpen} aria-controls={`pfaq-${i}`} id={`pfaq-q-${i}`} onClick={() => toggle(i)}>
                      <span className="flex-1 text-[17px] font-bold leading-snug md:text-[18px]">{it.q}</span>
                      <span className="plus" aria-hidden><Plus size={20} strokeWidth={2.6} /></span>
                    </button>
                  </h3>
                  <div id={`pfaq-${i}`} role="region" aria-labelledby={`pfaq-q-${i}`} className={`acc-body ${isOpen ? 'open' : ''}`} inert={!isOpen}>
                    <div><p className="rich m-0 px-4 pb-5 text-[16px] leading-[1.55] text-ink-2 md:px-6 md:pr-20"><RichText r={it.a} /></p></div>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-4 lg:hidden">
            <CtaButton cta={p.cta} t={t} tone="black" />
            <a href={p.all.href} target="_blank" rel="noopener" className="text-link text-[15px] font-semibold">{p.all.label}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ 9. final / download */
export function Final({ t }: { t: SiteContent }) {
  const p = t.page!.final
  const os = useOs()
  const plats = t.download.platforms
  const mine = os === 'windows' ? plats.find(x => x.os === 'windows') : os === 'mac' ? plats.find(x => x.os === 'mac-arm') : undefined
  const label = os === 'windows' ? t.ui.downloadWindows : os === 'mac' ? t.ui.downloadMac : p.cta.label
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <section id="download" className="wrap section-gap" aria-labelledby="final-h">
      <Rise className="card-black relative overflow-hidden p-6 md:p-10 xl:p-14">
        <span className="pointer-events-none absolute -left-24 bottom-[-40%] size-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,79,216,.35),transparent_65%)]" aria-hidden />
        <span className="pointer-events-none absolute -right-24 -top-32 size-[480px] rounded-full bg-[radial-gradient(circle,rgba(122,77,255,.45),transparent_65%)]" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <h2 id="final-h" className="sr-only">{p.title}</h2>
            <NeonScript text={p.title} size={80} maxChars={11} rotate={-4} className="w-full max-w-[500px]" />
            <p className="m-0 mt-4 text-[18px] font-semibold text-white/85 md:text-[20px]">{p.subtitle}</p>
          </div>
          <div>
            <LimeButton href={mine?.href ?? p.cta.href} className="w-full sm:w-auto">{label}</LimeButton>
            <ul className="m-0 mt-5 grid list-none grid-cols-3 gap-2 p-0">
              {plats.map(x => {
                const active = mine?.os === x.os
                return (
                  <li key={x.os}>
                    <a href={x.href} className={`group flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] px-2 py-2.5 text-center text-[12px] font-bold leading-tight transition-colors focus-visible:outline-3 focus-visible:outline-lime md:text-[13px] ${active ? 'border-lime bg-lime/10 text-lime' : 'border-white/20 text-white/85 hover:border-white/50'}`}>
                      <span className="pb-2.5"><OsGlyph os={x.os} size={20} /></span>
                      <span>{x.name}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <p className="m-0 mt-3 text-[13px] text-white/55 max-md:text-[14px]">{p.platforms}</p>
            <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(v => !v)}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-lime focus-visible:outline-3 focus-visible:outline-lime">
              {p.macHelp.label}
            </button>
            <Disclose open={open} id={id}><p className="m-0 mt-1 text-[15px] leading-[1.5] text-white/75">{p.macHelp.text}</p></Disclose>
            <p className="m-0 mt-4"><a href={p.support.href} target="_blank" rel="noopener" className="text-[15px] font-semibold text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-lime">{p.support.label}</a></p>
          </div>
        </div>
        <Sparkle size={20} color="#C8F31D" className="absolute right-[8%] top-10" />
      </Rise>
    </section>
  )
}

/* ------------------------------------------------------------------ mobile sticky bar */
export function MobileBar({ t, lang }: { t: SiteContent; lang: Lang }) {
  const [show, setShow] = useState(false)
  const ctas = t.page!.mobileBar.ctas
  const main = ctas.find(c => c.action === 'share') ?? ctas[0]
  const other = ctas.find(c => c !== main)
  const { share, label } = useShare(t, main.label)
  const phone = useMediaQuery('(max-width: 767px)')
  const ref = useRef(false)
  useEffect(() => {
    if (!phone) return
    const dl = document.getElementById('download')
    let overDl = false
    const io = dl ? new IntersectionObserver(([e]) => { overDl = e.isIntersecting; upd() }, { threshold: 0.15 }) : null
    const upd = () => setShow(window.scrollY > window.innerHeight * 0.9 && !overDl)
    if (dl) io!.observe(dl)
    upd(); window.addEventListener('scroll', upd, { passive: true })
    ref.current = true
    return () => { window.removeEventListener('scroll', upd); io?.disconnect() }
  }, [phone, lang])
  if (!phone) return null
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-[120%]'}`}
      aria-hidden={!show} inert={!show}>
      <div className="flex items-center gap-2 rounded-[16px] border border-white/80 bg-white/75 p-2 shadow-[0_10px_30px_-10px_rgba(40,20,120,.45)] backdrop-blur-[12px]">
        <button type="button" onClick={share} className="btn btn-lime !h-11 flex-1 !px-3 !text-[15px]">{label}</button>
        {other && <a href={other.href} className="btn btn-black !h-11 !px-4 !text-[15px]">{other.label}</a>}
      </div>
    </div>
  )
}
