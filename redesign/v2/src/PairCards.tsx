import { m } from 'motion/react'
import type { SiteContent } from '@kadr/shared/content/index'
import { GEN, GenImg, derive, usePrefersReducedMotion } from './lib'
import { AppleIcon, LimeAction, NeonScript, Sparkle, WinIcon } from './ui'

export function OsGlyph({ os, size = 18 }: { os: string; size?: number }) {
  if (os === 'windows') return <WinIcon size={size} />
  return (
    <span className="relative inline-grid place-items-center">
      <AppleIcon size={size} />
      <span className="absolute -bottom-2 -right-3 rounded-[4px] bg-lime px-[3px] text-[8px] font-extrabold leading-[11px] text-ink">{os === 'mac-arm' ? 'M' : 'Intel'}</span>
    </span>
  )
}

function DevicesFallback() {
  return (
    <div className="absolute inset-[18%_6%_14%_10%]">
      <div className="absolute right-0 top-0 h-[70%] w-[70%] rounded-[18px] border-[6px] border-[#CDBEFF] bg-[linear-gradient(160deg,#5B7BFF,#B04DFF)] shadow-xl" />
      <div className="absolute bottom-0 left-0 h-[55%] w-[55%] rounded-[14px] border-[6px] border-[#DCD0FF] bg-[linear-gradient(160deg,#6B8BFF,#C05DFF)] shadow-xl" />
    </div>
  )
}

export function PairCards({ t, onReel }: { t: SiteContent; onReel: () => void }) {
  const d = derive(t)
  const reduced = usePrefersReducedMotion()
  const dl = t.download
  const posters = ['media/oleg.jpg', 'media/cafe.jpg', 'media/ocean.jpg', 'media/film.jpg']
  const spring = { type: 'spring' as const, stiffness: 260, damping: 22 }
  return (
    <div className="wrap relative z-[2] mt-[30px] grid gap-[30px] md:gap-6 lg:mt-11 lg:grid-cols-[760fr_536fr]">
      {/* lilac: download teaser */}
      <m.div className="card-lilac relative min-h-[290px] overflow-hidden p-6 md:p-8 lg:h-[290px]"
        initial={reduced ? false : { opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={spring}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]" aria-hidden>
          <span className="absolute -right-10 -top-16 size-72 rounded-full bg-[radial-gradient(circle,rgba(255,79,216,.35),transparent_65%)]" />
          <span className="absolute bottom-[-30%] left-[30%] size-80 rounded-full bg-[radial-gradient(circle,rgba(122,77,255,.3),transparent_65%)]" />
        </div>
        <div className="relative z-[2] max-w-[340px]">
          <h3 className="m-0 text-[28px] font-extrabold uppercase leading-[1.02] tracking-[-.02em] md:text-[34px]">{dl.title}</h3>
          <p className="card-text mt-3 !text-[15px] !leading-[1.4] max-md:!text-[16px]">{dl.lead}</p>
          <ul className="m-0 mt-5 flex list-none gap-3 p-0">
            {dl.platforms.map(p => (
              <li key={p.os}>
                <a href="#download" aria-label={p.name} title={p.name} className="group block rounded-[10px] p-0.5 focus-visible:outline-3 focus-visible:outline-lime">
                  <span className="icon-sq !size-11 md:!size-10"><OsGlyph os={p.os} /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="pointer-events-none relative -mx-2 mt-2 aspect-[4/3] max-w-[380px] sm:absolute sm:right-[8px] sm:top-[10px] sm:mx-0 sm:mt-0 sm:w-[46%] sm:max-w-none lg:right-[10px] lg:top-[6px] lg:w-[350px]">
          <GenImg src={GEN.devices} className="h-full w-full object-contain drop-shadow-[0_20px_26px_rgba(75,43,214,.35)]" width={1344} height={1008} fallback={<DevicesFallback />} />
          <span className="hand absolute bottom-[2%] right-[10%] rotate-[-6deg] text-[22px] uppercase text-violet-deep md:text-[24px]">{d.mp4}</span>
        </div>
      </m.div>

      {/* black: showreel teaser */}
      <m.div className="card-black relative min-h-[290px] overflow-hidden p-6 md:p-8 lg:h-[290px]"
        initial={reduced ? false : { opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ ...spring, delay: 0.08 }}>
        <div className="relative z-[2] max-w-[270px]">
          <h3 className="m-0 text-[26px] font-extrabold uppercase leading-[1.05] tracking-[-.01em] md:text-[28px]">{t.reel.tag}</h3>
          <p className="mt-2 text-[16px] font-medium leading-[1.35] text-white/75 md:text-[15px]">{t.reel.title}</p>
          <ul className="m-0 mt-5 flex list-none p-0" aria-hidden>
            {posters.map((src, k) => (
              <li key={src} className="-ml-2.5 first:ml-0">
                <span className="relative block size-11 overflow-hidden rounded-full border-2 border-ink ring-2 ring-white/90 md:size-12" style={{ zIndex: 4 - k }}>
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" width={48} height={48} />
                </span>
              </li>
            ))}
          </ul>
          <LimeAction small className="mt-5" onClick={onReel}>{d.reelLabel}</LimeAction>
        </div>
        <div className="pointer-events-none absolute bottom-6 right-4 w-[200px] md:right-8 md:top-12 md:w-[230px]" aria-hidden>
          <svg viewBox="0 0 60 40" className="absolute -top-8 right-6 w-12 rotate-[10deg]" style={{ filter: 'drop-shadow(0 0 6px rgba(200,243,29,.6))' }}>
            <path d="M6 32 10 10l12 12 8-16 8 16 12-12 4 22Z" fill="none" stroke="#C8F31D" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
          <NeonScript text={d.oneSentence} size={44} rotate={-8} maxChars={10} />
          <svg viewBox="0 0 200 30" className="mt-1 w-[180px]" style={{ filter: 'drop-shadow(0 0 6px rgba(200,243,29,.6))' }}>
            <path d="M4 18c40-14 90-14 150-4 10 2 20-2 30-8" fill="none" stroke="#C8F31D" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </div>
        <Sparkle size={14} color="#C8F31D" className="absolute right-[45%] top-8 opacity-80" />
      </m.div>
    </div>
  )
}
