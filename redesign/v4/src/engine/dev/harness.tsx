// Dev-only harness for the engine (not part of the build): /src/engine/dev/harness.html
// Mimics the INTERFACE stage driver: progress / active / pointer, plus ?sec=<id>&p=<0..1> jump.
import { createRoot } from 'react-dom/client'
import { emit, SECTION_IDS, stageInput, subscribe, type SectionId } from '../contract'
import Engine from '../index'

const q = new URLSearchParams(location.search)
const hud = document.getElementById('hud')!

function measure() {
  const vh = innerHeight
  let best: SectionId = 'top', bestD = Infinity
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const r = el.getBoundingClientRect()
    const p = (vh - r.top) / (vh + r.height)
    stageInput.progress[id] = Math.min(1, Math.max(0, p))
    const d = Math.abs(r.top + r.height / 2 - vh / 2)
    if (d < bestD) { bestD = d; best = id }
    if (id === 'how') stageInput.pin.how = Math.min(1, Math.max(0, -r.top / (r.height - vh)))
  }
  stageInput.active = best
  stageInput.scrollY = scrollY
  stageInput.viewport.w = innerWidth; stageInput.viewport.h = innerHeight; stageInput.viewport.dpr = devicePixelRatio
}
addEventListener('scroll', measure, { passive: true })
addEventListener('resize', measure)
addEventListener('pointermove', (e) => {
  stageInput.pointer.x = (e.clientX / innerWidth) * 2 - 1
  stageInput.pointer.y = (e.clientY / innerHeight) * 2 - 1
  stageInput.pointer.active = true
})
subscribe((o) => { hud.textContent = `tier ${o.tier} · ready ${o.ready} · ${o.heroPhase} · ${stageInput.active}` })

const sec = q.get('sec')
if (sec) {
  const el = document.getElementById(sec)
  if (el) scrollTo(0, el.offsetTop + Number(q.get('p') ?? 0) * el.offsetHeight)
}
measure()
emit({ type: 'hero:play', phrase: q.get('phrase') ?? 'Кот-астронавт летит над ночным городом' })
if (q.has('hover')) emit({ type: 'proof:hover', index: Number(q.get('hover')) })
if (q.has('reelplay')) emit({ type: 'reel:play' })
;(window as unknown as Record<string, unknown>).__v4 = { emit, stageInput }

createRoot(document.getElementById('root')!).render(<Engine />)
