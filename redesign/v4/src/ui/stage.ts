// INTERFACE side of the Light Engine contract: writes StageInput every frame, mirrors StageOutput into <html>,
// owns Lenis and the single rAF loop. Works the same whether the engine is loaded or not.
import Lenis from 'lenis'
import { useEffect, useSyncExternalStore } from 'react'
import { emit, getOutput, SECTION_IDS, stageInput, subscribe, type SectionId, type StageEvent, type StageOutput, type Tier } from '../engine/contract'
import { CALM, ENGINE_ALLOWED, FINE, REDUCED, STILL } from './env'

export { emit }
export type { StageEvent, SectionId }

let lenis: Lenis | null = null
type Tick = (now: number) => void
const ticks = new Set<Tick>()
/** Run a callback every frame of the shared loop. */
export function onFrame(fn: Tick) { ticks.add(fn); return () => { ticks.delete(fn) } }

let tops: { id: SectionId; top: number; h: number }[] = []
function measure() {
  const y = scrollY
  tops = SECTION_IDS.flatMap((id) => {
    const el = document.getElementById(id)
    if (!el) return []
    const r = el.getBoundingClientRect()
    return [{ id, top: r.top + y, h: r.height }]
  })
  stageInput.viewport.w = innerWidth
  stageInput.viewport.h = innerHeight
  stageInput.viewport.dpr = devicePixelRatio || 1
}

let lastY = -1
function updateStage() {
  const y = lenis ? lenis.scroll : scrollY
  const vh = innerHeight
  stageInput.velocity = lastY < 0 ? 0 : y - lastY
  lastY = y
  stageInput.scrollY = y
  let best = Infinity
  const mid = y + vh / 2
  for (const s of tops) {
    const p = (y + vh - s.top) / (s.h + vh)
    stageInput.progress[s.id] = p < 0 ? 0 : p > 1 ? 1 : p
    const d = Math.abs(s.top + s.h / 2 - mid)
    if (d < best) { best = d; stageInput.active = s.id }
  }
  const how = tops.find((s) => s.id === 'how')
  if (how) {
    const span = how.h - vh
    const p = span > 0 ? (y - how.top) / span : 0
    stageInput.pin.how = p < 0 ? 0 : p > 1 ? 1 : p
  }
}

export function scrollToHash(hash: string) {
  const el = hash === '#top' ? document.body : document.querySelector(hash)
  if (!el) return
  if (lenis && !CALM) lenis.scrollTo(hash === '#top' ? 0 : (el as HTMLElement), { offset: hash === '#top' ? 0 : -8 })
  else if (hash === '#top') scrollTo({ top: 0 })
  else (el as HTMLElement).scrollIntoView({ behavior: CALM ? 'auto' : 'smooth' })
}

export function lockScroll(on: boolean) {
  if (!lenis) return
  if (on) lenis.stop(); else lenis.start()
}

/** Boot: Lenis, loop, pointer, measurements. Call once from App. */
export function useStageDriver(lang: StageInputLang) {
  useEffect(() => { stageInput.lang = lang }, [lang])
  useEffect(() => {
    stageInput.reducedMotion = REDUCED || STILL
    const html = document.documentElement
    if (STILL) html.classList.add('still')
    if (!STILL && !REDUCED) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true, syncTouch: false, anchors: false })
    }
    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(document.body)
    const onResize = () => measure()
    addEventListener('resize', onResize)

    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      mx = e.clientX; my = e.clientY
      stageInput.pointer.x = (mx / innerWidth) * 2 - 1
      stageInput.pointer.y = (my / innerHeight) * 2 - 1
      stageInput.pointer.active = true
    }
    const onLeave = () => { stageInput.pointer.active = false }
    addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    // in-page anchors go through Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
      const hash = a.getAttribute('href')!
      if (hash.length < 2) return
      e.preventDefault()
      history.replaceState(history.state, '', hash)
      scrollToHash(hash)
    }
    document.addEventListener('click', onClick)

    let raf = 0
    const loop = (now: number) => {
      lenis?.raf(now)
      updateStage()
      if (FINE && !CALM) {
        cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12
        html.style.setProperty('--mx', `${cx.toFixed(1)}px`)
        html.style.setProperty('--my', `${cy.toFixed(1)}px`)
      }
      ticks.forEach((fn) => fn(now))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    if (location.hash.length > 1) setTimeout(() => scrollToHash(location.hash), 120)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      removeEventListener('resize', onResize)
      removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('click', onClick)
      lenis?.destroy(); lenis = null
    }
  }, [])
}
type StageInputLang = typeof stageInput.lang

// ---------------------------------------------------------------- output → React + <html data-v4-tier>
let out: StageOutput = { ...getOutput(), tier: (REDUCED ? 0 : 1) as Tier }
const subs = new Set<() => void>()
let wired = false
function wire() {
  if (wired || typeof document === 'undefined') return
  wired = true
  let last: StageOutput = getOutput()
  const apply = (o: StageOutput) => {
    last = o
    // Before/without the engine the page is tier 1 (0 with reduced motion). The scene owns the slots only while
    // the engine says ready, tier ≥ 2 AND its canvas is really alive; otherwise every DOM fallback comes back.
    const alive = engineAlive()
    const tier = (REDUCED ? 0 : !ENGINE_ALLOWED || engineDead ? 1 : o.tier) as Tier
    const ready = o.ready && tier >= 2 && alive
    const next = { ...o, tier, ready }
    const html = document.documentElement
    html.dataset.v4Tier = String(tier)
    html.dataset.v4Ready = ready ? '1' : '0'
    if (next.tier !== out.tier || next.ready !== out.ready || next.heroPhase !== out.heroPhase) {
      out = next
      subs.forEach((f) => f())
    }
  }
  reapply = () => apply(last)
  subscribe(apply)
  // watchdog: canvas removed, context lost or zero-sized → fallback (checked twice a second, cheap)
  setInterval(() => reapply(), 500)
}
let engineDead = false
let reapply = () => {}
let lostCanvas: HTMLCanvasElement | null = null
function engineAlive() {
  const c = document.querySelector<HTMLCanvasElement>('.stage-host canvas')
  if (!c || !c.isConnected || c.width === 0 || c.height === 0) return false
  if (c !== lostCanvas && !c.dataset.v4Watch) {
    c.dataset.v4Watch = '1'
    c.addEventListener('webglcontextlost', () => { lostCanvas = c; reapply() })
    c.addEventListener('webglcontextrestored', () => { lostCanvas = null; reapply() })
  }
  return c !== lostCanvas
}
/** Called when the engine crashed or was unmounted: the page goes back to DOM fallbacks for good. */
export function markEngineDead() {
  engineDead = true
  reapply()
}
wire()

export function useStage(): StageOutput {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb) } }, () => out, () => out)
}

/** True when the WebGL scene draws this slot, so the DOM fallback must be invisible. */
export function useSceneOwns() {
  const o = useStage()
  return o.ready
}
