import { m } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './lib'

type Line = { text: string; kind: 'pink' | 'chrome' | 'lime'; wrap?: boolean }

/**
 * Inflated 3-material H1 (pink / chrome / lime). Each line = 4 stacked text layers:
 * dark stroke + drop shadows (volume), gradient fill, white gloss (−3px), and a gloss sweep every 7 s.
 * Font size is fitted so the widest unbreakable piece (a line, or a word of the lime line) fits the column —
 * long words in ES / DE / EN still sit inside the column. Lines "inflate" in one by one (spring 260/18).
 */
export function InflatedTitle({ lines, max, min, maxLines, className = '' }: { lines: Line[]; max: number; min: number; maxLines?: number; className?: string }) {
  const box = useRef<HTMLHeadingElement>(null)
  const meas = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(max)
  const reduced = usePrefersReducedMotion()
  const key = lines.map(l => l.text).join('|')

  useLayoutEffect(() => {
    const el = box.current, m = meas.current
    if (!el || !m) return
    const fit = () => {
      const avail = el.clientWidth
      if (!avail) return
      // natural width of every unbreakable piece at 100px
      let widest = 0
      m.querySelectorAll<HTMLElement>('[data-piece]').forEach(p => { widest = Math.max(widest, p.getBoundingClientRect().width) })
      if (!widest) return
      let fs = Math.floor((avail / widest) * 100 * 0.97)
      fs = Math.max(min, Math.min(max, fs))
      if (maxLines) {
        // greedy-wrap the lime line at the candidate size; shrink until all lines fit in maxLines rows
        const words = Array.from(m.querySelectorAll<HTMLElement>('[data-word]')).map(w => w.getBoundingClientRect().width)
        const space = 24
        const limeRows = (f: number) => {
          let rows = 1, cur = 0
          for (const w of words) {
            const ww = (w * f) / 100
            if (cur && cur + (space * f) / 100 + ww > avail) { rows++; cur = ww } else cur += (cur ? (space * f) / 100 : 0) + ww
          }
          return rows
        }
        const fixed = lines.length - 1
        while (fs > min && fixed + limeRows(fs) > maxLines) fs -= 2
      }
      setSize(fs)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    document.fonts?.ready.then(fit)
    document.fonts?.load(`900 100px "M PLUS Rounded 1c"`, key).then(fit).catch(() => {})
    return () => ro.disconnect()
  }, [key, max, min, maxLines, lines.length])

  return (
    <h1 ref={box} className={`puffy relative ${className}`} style={{ fontSize: size }} aria-label={lines.map(l => l.text).join(' ')}>
      {/* measurer */}
      <div ref={meas} aria-hidden className="puffy pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap" style={{ fontSize: 100 }}>
        {lines.map((l, i) => l.wrap
          ? <span key={i}>{l.text.split(' ').map((w, k) => <span key={k} data-piece data-word className="inline-block" >{w}</span>)}</span>
          : <span key={i} data-piece className="inline-block" >{l.text}</span>)}
      </div>
      {lines.map((l, i) => (
        <m.span key={l.text + i} aria-hidden className={`puffy-line puffy-${l.kind} ${l.wrap ? 'wrap-ok' : ''}`} 
          initial={reduced ? false : { opacity: 0, y: '0.35em' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 + i * 0.12, opacity: { duration: 0.18, delay: 0.1 + i * 0.12 } }}>
          <span>{l.text}</span>
        </m.span>
      ))}
    </h1>
  )
}
