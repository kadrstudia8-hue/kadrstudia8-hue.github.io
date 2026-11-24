/**
 * V4 Light Engine contract (DESIGN-V4.md, 11.1).
 * No three.js imports here: INTERFACE imports this file eagerly.
 * Rule: only add fields, never rename or remove.
 */

export type SectionId =
  | 'top' | 'facts' | 'proof' | 'cloud' | 'how' | 'reel' | 'who' | 'looks'
  | 'features' | 'req' | 'pricing' | 'download' | 'faq' | 'contact'
export type Tier = 0 | 1 | 2 | 3

export const SECTION_IDS: readonly SectionId[] = [
  'top', 'facts', 'proof', 'cloud', 'how', 'reel', 'who', 'looks',
  'features', 'req', 'pricing', 'download', 'faq', 'contact',
]

/** Written only by INTERFACE (each scroll frame), read only by ENGINE. Mutable object, no re-renders. */
export interface StageInput {
  scrollY: number                       // px, Lenis value
  velocity: number                      // px/frame, Lenis
  viewport: { w: number; h: number; dpr: number }
  active: SectionId                     // section whose centre is closest to viewport centre
  progress: Record<SectionId, number>   // 0..1: 0 = section top at viewport bottom, 1 = section bottom at viewport top
  pin: { how: number }                  // 0..1 inside pinned timeline
  pointer: { x: number; y: number; active: boolean }  // -1..1 from viewport centre (y up = +1? see note)
  lang: 'ru' | 'uk' | 'en' | 'es' | 'de'
  reducedMotion: boolean
}
// pointer note: x = -1 left .. +1 right, y = -1 top .. +1 bottom (DOM orientation).

/** Written only by ENGINE, read by INTERFACE via subscribe. */
export interface StageOutput {
  tier: Tier            // before engine is ready: 1
  ready: boolean        // first scene frame rendered
  heroPhase: 'idle' | 'typing' | 'dust' | 'spectrum' | 'reveal' | 'done'
}

/** UI -> ENGINE events */
export type StageEvent =
  | { type: 'hero:play'; phrase: string }              // start the story (load and click on the arrow)
  | { type: 'proof:select'; index: number }            // 0..3
  | { type: 'proof:hover'; index: number | null }
  | { type: 'looks:select'; index: number }            // 0..5
  | { type: 'pricing:hover'; index: number | null }    // 0..2
  | { type: 'reel:play' } | { type: 'reel:pause' }
  | { type: 'cta:hover'; on: boolean }

const zeroProgress = (): Record<SectionId, number> => {
  const p = {} as Record<SectionId, number>
  for (const id of SECTION_IDS) p[id] = 0
  return p
}

export const stageInput: StageInput = {
  scrollY: 0,
  velocity: 0,
  viewport: {
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
    dpr: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  },
  active: 'top',
  progress: zeroProgress(),
  pin: { how: 0 },
  pointer: { x: 0, y: 0, active: false },
  lang: 'ru',
  reducedMotion: false,
}

/* ---------- output store ---------- */
const output: StageOutput = { tier: 1, ready: false, heroPhase: 'idle' }
const outSubs = new Set<(o: StageOutput) => void>()

export function getOutput(): StageOutput {
  return output
}

/** Subscribe to engine output. Called immediately with the current value. */
export function subscribe(fn: (o: StageOutput) => void): () => void {
  outSubs.add(fn)
  fn({ ...output })
  return () => { outSubs.delete(fn) }
}

/** ENGINE only: patch output and notify subscribers (only on change). */
export function setOutput(patch: Partial<StageOutput>): void {
  let changed = false
  for (const k of Object.keys(patch) as (keyof StageOutput)[]) {
    if (output[k] !== patch[k]) { (output as unknown as Record<string, unknown>)[k] = patch[k]; changed = true }
  }
  if (!changed) return
  const snap = { ...output }
  outSubs.forEach((fn) => fn(snap))
}

/* ---------- events ---------- */
const evSubs = new Set<(e: StageEvent) => void>()
/** Events emitted before the engine loads; replayed to the first listener (last of each type). */
const pending = new Map<string, StageEvent>()

export function emit(e: StageEvent): void {
  if (evSubs.size === 0) { pending.set(e.type, e); return }
  evSubs.forEach((fn) => fn(e))
}

/** ENGINE only: listen to UI events. */
export function onEvent(fn: (e: StageEvent) => void): () => void {
  evSubs.add(fn)
  if (pending.size) { const list = [...pending.values()]; pending.clear(); list.forEach(fn) }
  return () => { evSubs.delete(fn) }
}
