import type { Tier } from './contract'

/** URL flags: ?still freezes time (for screenshots in a throttled panel), ?tier=N forces a tier. */
export const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams()
export const STILL = params.has('still')
/** ?story=2.0 freezes the hero story at that second (QA of the text-to-dust phase). */
export const STORY_AT = params.has('story') ? Number(params.get('story')) : null
const forced = params.get('tier')
export const FORCED_TIER: Tier | null = forced && /^[0-3]$/.test(forced) ? (Number(forced) as Tier) : null

export interface Probe {
  tier: Tier       // ceiling before benchmark
  renderer: string
  tablet: boolean
}

/** Static probe before the canvas mounts. Tier <= 1 means: do not mount. */
export function probe(): Probe {
  if (FORCED_TIER !== null) return { tier: FORCED_TIER, renderer: 'forced', tablet: false }
  const w = window.innerWidth
  const coarse = matchMedia('(pointer: coarse)').matches
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  if (reduced) return { tier: 0, renderer: '', tablet: false }
  if ((coarse && w < 768) || nav.connection?.saveData) return { tier: 1, renderer: '', tablet: false }

  let gl: WebGL2RenderingContext | null = null
  try {
    gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
  } catch { gl = null }
  if (!gl) return { tier: 0, renderer: '', tablet: false }
  let renderer = ''
  const ext = gl.getExtension('WEBGL_debug_renderer_info')
  renderer = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)).toLowerCase()
  gl.getExtension('WEBGL_lose_context')?.loseContext()

  if (/swiftshader|llvmpipe|software|basic render|microsoft basic/.test(renderer)) return { tier: 1, renderer, tablet: false }
  const tablet = coarse && w >= 768
  const strong = /nvidia|geforce|rtx|gtx|quadro|radeon|amd|apple m\d|apple gpu|arc\(tm\)|intel\(r\) arc/.test(renderer)
  const weak = /mali|adreno|powervr|intel\(r\) (hd|uhd)|hd graphics/.test(renderer)
  if (nav.deviceMemory && nav.deviceMemory <= 2) return { tier: 1, renderer, tablet }
  let tier: Tier = strong ? 3 : 2
  if (tablet || weak) tier = 2
  return { tier, renderer, tablet }
}

/**
 * Frame-time monitor. Once the scene is on screen it is never switched off: the only step is from the full look
 * (tier 3) to the lighter one (tier 2). Frames are vsynced, so a healthy 60 Hz screen reports about 16.7 ms and keeps tier 3.
 *   benchmark (first 90 valid frames after warm-up): tier 3 drops to 2 when the average is over 20 ms;
 *   afterwards: tier 3 drops to 2 after 30 consecutive frames over 24 ms.
 * Throttled frames (hidden tab / hidden panel, dt > 100 ms) are ignored.
 * Devices that should not run the scene at all (phones, reduced motion, software rendering) are filtered by probe() before it mounts.
 */
export class FrameMonitor {
  private n = 0
  private sum = 0
  private slow = 0
  benchDone = false
  constructor(private ceiling: Tier, private onTier: (t: Tier, reason: string) => void, private current: Tier) {}

  private lighter(reason: string) {
    this.slow = 0
    this.current = 2
    this.onTier(2, reason)
  }

  frame(dtMs: number, _nowMs: number) {
    if (STILL || FORCED_TIER !== null) return
    if (document.hidden || dtMs > 100 || dtMs <= 0) return
    if (this.current < 3) return // tier 2 is the floor: the scene stays on
    if (!this.benchDone) {
      this.n++
      if (this.n <= 12) return // shader compile warm-up
      this.sum += dtMs
      if (this.n >= 102) {
        this.benchDone = true
        const avg = this.sum / 90
        if (avg > 20) this.lighter(`bench ${avg.toFixed(1)}ms`)
      }
      return
    }
    if (dtMs > 24) this.slow++
    else this.slow = 0
    if (this.slow >= 30) this.lighter('slow frames')
  }
}
