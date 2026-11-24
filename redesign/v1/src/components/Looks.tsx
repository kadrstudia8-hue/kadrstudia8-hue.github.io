import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, type PointerEvent } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { Rv, SectionHead, Splice } from './ui'
import { useFine } from '../lib/env'

/** 6 frames on a film strip: native horizontal scroll with snap, mouse drag and arrow buttons. */
export function Looks() {
  const { t } = useLang()
  const l = t.looks
  const strip = useRef<HTMLDivElement>(null)
  const fine = useFine()
  const drag = useRef<{ x: number; s: number; moved: boolean } | null>(null)
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (!fine || e.pointerType !== 'mouse' || !strip.current) return
    drag.current = { x: e.clientX, s: strip.current.scrollLeft, moved: false }
    strip.current.classList.add('is-drag')
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current, el = strip.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 3) d.moved = true
    el.scrollLeft = d.s - dx
  }
  const up = () => { drag.current = null; strip.current?.classList.remove('is-drag') }
  const by = (dir: number) => {
    const el = strip.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.look')
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 24), behavior: 'smooth' })
  }

  return (
    <section id="looks" className="sec" aria-labelledby="looks-h" data-scene="dust" data-scene-alpha=".35">
      <Splice />
      <div className="wrap looks-head">
        <SectionHead n={7} id="looks-h" tag={l.tag} title={l.title} lead={l.lead} />
        <div className="looks-arrows">
          <button type="button" className="round-btn" onClick={() => by(-1)} aria-label="←"><ChevronLeft size={20} aria-hidden /></button>
          <button type="button" className="round-btn" onClick={() => by(1)} aria-label="→"><ChevronRight size={20} aria-hidden /></button>
        </div>
      </div>
      <Rv>
        <div ref={strip} className="looks-strip" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} tabIndex={0} aria-label={l.title}>
          {l.styles.map((s, i) => (
            <figure key={s.image.src} className="look">
              <div className="look-img">
                <img src={s.image.src} alt={s.image.alt} width={480} height={328} loading="lazy" draggable={false} />
              </div>
              <figcaption><span className="look-n">{String(i + 1).padStart(2, '0')}</span>{s.name}</figcaption>
            </figure>
          ))}
        </div>
      </Rv>
    </section>
  )
}
