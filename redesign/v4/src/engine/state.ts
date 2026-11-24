import { onEvent, setOutput, stageInput, type StageOutput } from './contract'
import { STILL, STORY_AT } from './quality'

/** Internal mutable engine state (no React re-renders). */
export const E = {
  time: 0,              // engine clock, seconds (frozen in ?still)
  dt: 0,
  proofSelect: 0,
  proofHover: null as number | null,
  looks: 0,
  looksAt: -10,         // time of last looks switch
  pricingHover: null as number | null,
  pricingEnterAt: -10,
  reelPlaying: false,
  ctaHover: false,
  // hero story
  heroStart: -1,        // engine time when hero:play arrived
  heroPhrase: '',
  heroStoryId: 0,       // increments on each hero:play
  lastInputAt: 0,       // performance.now() of last scroll/pointer change (for demand frameloop)
}

export const HERO = { typing: 1.2, dust: 2.2, spectrum: 3.2, reveal: 4.0 }

export function heroT(): number {
  if (STILL) return 99
  if (E.heroStart < 0) return -1
  if (STORY_AT !== null) return STORY_AT
  return E.time - E.heroStart
}

export function heroPhase(t = heroT()): StageOutput['heroPhase'] {
  if (t < 0) return 'idle'
  if (t < HERO.typing) return 'typing'
  if (t < HERO.dust) return 'dust'
  if (t < HERO.spectrum) return 'spectrum'
  if (t < HERO.reveal) return 'reveal'
  return 'done'
}

/** Start (or restart) the hero story. */
export function emitStory(phrase: string) {
  E.heroStart = E.time
  E.heroPhrase = phrase
  E.heroStoryId++
  setOutput({ heroPhase: STILL ? 'done' : 'typing' })
}

export function initEvents(): () => void {
  return onEvent((e) => {
    switch (e.type) {
      case 'hero:play': emitStory(e.phrase); break
      case 'proof:select': E.proofSelect = e.index; break
      case 'proof:hover': E.proofHover = e.index; break
      case 'looks:select':
        if (e.index !== E.looks) { E.looks = e.index; E.looksAt = E.time }
        break
      case 'pricing:hover': E.pricingHover = e.index; break
      case 'reel:play': E.reelPlaying = true; break
      case 'reel:pause': E.reelPlaying = false; break
      case 'cta:hover': E.ctaHover = e.on; break
    }
    E.lastInputAt = performance.now()
  })
}

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 4)
/** Frame-rate independent damp. */
export const damp = (a: number, b: number, lambda: number, dt: number) => a + (b - a) * (1 - Math.exp(-lambda * dt))

export const QUIET = new Set(['who', 'features', 'req', 'faq'])
export const input = stageInput
