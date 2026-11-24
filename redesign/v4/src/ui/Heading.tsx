// H1/H2: flat heavy caps, line 1 plain, line 2 «burnt by light» (spectrum, scrubbed by scroll and cursor).
// Fit: the longest word never exceeds the column width (long DE/ES words on 360px), so nothing overflows.
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'
import { CALM, STILL, useInView } from './env'
import type { H } from './copy'
import { cx } from './kit'
import { onFrame } from './stage'

function fit(el: HTMLElement) {
  el.style.fontSize = ''
  const w = el.clientWidth
  if (!w) return
  let max = 0
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent ?? ''
    const re = /\S+/g
    for (let m = re.exec(text); m; m = re.exec(text)) {
      range.setStart(n, m.index)
      range.setEnd(n, m.index + m[0].length)
      const r = range.getBoundingClientRect()
      if (r.width > max) max = r.width
    }
  }
  if (max > w) {
    const fs = parseFloat(getComputedStyle(el).fontSize)
    el.style.fontSize = `${Math.floor(fs * (w / max) * 0.97)}px`
  }
}

export function useFit(ref: React.RefObject<HTMLElement | null>, dep: unknown) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    fit(el)
    let raf = 0
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => fit(el)) })
    ro.observe(el.parentElement ?? el)
    document.fonts?.ready.then(() => fit(el))
    return () => { ro.disconnect(); cancelAnimationFrame(raf) }
  }, [ref, dep])
}

export function Heading({ h, as = 'h2', className, id, safe = true }: { h: H; as?: 'h1' | 'h2'; className?: string; id?: string; safe?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const seen = useInView(ref, '0px 0px -8% 0px')
  useFit(ref, h.join('|'))
  // spectrum position follows scroll and cursor (only while on screen)
  useEffect(() => {
    const el = ref.current
    if (!el || CALM || !h[1]) return
    let vis = false
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting })
    io.observe(el)
    const off = onFrame(() => {
      if (!vis) return
      const r = el.getBoundingClientRect()
      const p = 1 - (r.top + r.height / 2) / innerHeight
      const mx = parseFloat(document.documentElement.style.getPropertyValue('--mx')) || innerWidth / 2
      const pos = 20 + p * 60 + ((mx / innerWidth) - 0.5) * 12
      el.style.setProperty('--sp', `${pos.toFixed(2)}%`)
    })
    return () => { io.disconnect(); off() }
  }, [h])
  const Tag = as
  return (
    <Tag ref={ref} id={id} className={cx(as === 'h1' ? 'h1' : 'h2', seen && 'is-in', STILL && 'is-in', className)} data-v4-safe={safe ? '' : undefined}>
      {h[0] && <span className="ln" style={{ '--i': 0 } as CSSProperties}><span className="ln-i">{h[0]}</span></span>}
      {h[0] && h[1] && ' '}
      {h[1] && <span className="ln" style={{ '--i': 1 } as CSSProperties}><span className="ln-i spectral">{h[1]}</span></span>}
    </Tag>
  )
}
