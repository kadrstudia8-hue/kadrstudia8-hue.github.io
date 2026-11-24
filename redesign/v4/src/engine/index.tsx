import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { NoToneMapping } from 'three'
import { setOutput, stageInput as I, type Tier } from './contract'
import { FrameMonitor, probe, STILL } from './quality'
import { rig } from './rig'
import { E, initEvents, QUIET, heroPhase } from './state'
import Beam from './scene/Beam'
import Director from './scene/Director'
import Dust from './scene/Dust'
import Env from './scene/Env'
import Flare from './scene/Flare'
import Floor from './scene/Floor'
import GpuFarm from './scene/GpuFarm'
import HeroText from './scene/HeroText'
import { ChromePlay, CursorLight, Monoliths, Playhead, PlaySign } from './scene/Objects'
import Post from './scene/Post'
import Prism from './scene/Prism'
import Screens from './scene/Screens'
import Spectrum from './scene/Spectrum'

if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__v4rig = rig

/** Benchmark, on-the-fly downgrade, `ready` flag, and demand frameloop driver. */
function Runtime({ tier, ceiling, onTier }: { tier: Tier; ceiling: Tier; onTier: (t: Tier) => void }) {
  const invalidate = useThree((s) => s.invalidate)
  const mon = useRef<FrameMonitor | null>(null)
  const frames = useRef(0)
  if (!mon.current) mon.current = new FrameMonitor(ceiling, (t) => onTier(t), tier)

  useFrame((_, delta) => {
    frames.current++
    if (frames.current === 2) setOutput({ ready: true, tier })
    mon.current!.frame(delta * 1000, performance.now())
  })

  useEffect(() => {
    let raf = 0
    let lastScroll = -1, lastPx = 0, lastPy = 0, lastInput = performance.now(), warm = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      const now = performance.now()
      if (I.scrollY !== lastScroll || I.pointer.x !== lastPx || I.pointer.y !== lastPy || window.scrollY !== lastScroll) {
        lastScroll = I.scrollY || window.scrollY; lastPx = I.pointer.x; lastPy = I.pointer.y; lastInput = now
      }
      const recent = now - Math.max(lastInput, E.lastInputAt) < 1500
      if (STILL) { if (recent || warm++ < 30) invalidate(); return }
      const story = heroPhase() !== 'done' && heroPhase() !== 'idle'
      const quiet = QUIET.has(I.active) && rig.quiet > 0.98 && !story
      if (!quiet || recent || warm++ < 30) invalidate()
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [invalidate])

  return null
}

function Scene({ tier }: { tier: Tier }) {
  return (
    <>
      <color attach="background" args={['#030304']} />
      <fogExp2 attach="fog" args={['#030304', 0.035]} />
      <Director />
      <Env />
      <Floor tier={tier} />
      <Beam />
      <Flare at={rig.projector} size={2.4} color="#EEF2FF" streak={1} intensity={() => 0.8 * rig.beamIntensity * rig.dim} />
      <Prism tier={tier} />
      <Spectrum />
      <Dust count={tier >= 3 ? 6000 : 2500} />
      <HeroText count={tier >= 3 ? 4000 : 2000} />
      <Screens />
      <GpuFarm />
      <Monoliths tier={tier} />
      <ChromePlay />
      <PlaySign />
      <Playhead />
      <CursorLight />
      <Post tier={tier} />
    </>
  )
}

/**
 * V4 Light Engine. Lazy-loaded by App; renders nothing on tier <= 1 (phone, reduced motion, weak GPU, no WebGL2).
 */
export default function Engine() {
  const [p] = useState(probe)
  const [tier, setTier] = useState<Tier>(p.tier)

  useEffect(() => initEvents(), [])
  useEffect(() => {
    rig.tier = tier
    if (tier <= 1) setOutput({ tier, ready: false })
    else setOutput({ tier })
  }, [tier])
  useEffect(() => () => setOutput({ tier: 1, ready: false }), [])

  if (tier <= 1) return null
  const dpr: [number, number] = tier >= 3 ? [1, 2] : [1, 1.5]
  return (
    <Canvas
      key={tier}
      frameloop="demand"
      dpr={dpr}
      flat
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance', toneMapping: NoToneMapping }}
      camera={{ fov: 32, position: [0, 1.2, 9], near: 0.1, far: 80 }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden
      eventSource={undefined}
      events={undefined}
    >
      <Runtime tier={tier} ceiling={p.tier} onTier={setTier} />
      <Scene tier={tier} />
    </Canvas>
  )
}
