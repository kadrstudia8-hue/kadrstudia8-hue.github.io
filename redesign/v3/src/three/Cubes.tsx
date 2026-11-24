// Floating glass «frame cubes» over the hero scene (§3.6 3D): RoundedBox + MeshTransmissionMaterial, film-frame
// perforation on every face, warm key light from behind-left, violet point light right. Lazy chunk, ≥1024px only.
import { Float, MeshTransmissionMaterial, RoundedBox, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

type CubeDef = { p: [number, number, number]; s: number; c: string; r: [number, number, number] }
// positions are tuned to the 1440×900 hero (canvas = right 58%): around the arch top, clear of the headline,
// the handwriting and the pager
const CUBES: CubeDef[] = [
  { p: [-1.4, 1.62, 0], s: 0.34, c: '#5ED3E6', r: [0.5, 0.7, 0.1] },
  { p: [-1.0, 1.78, -0.4], s: 0.26, c: '#8B5CF6', r: [0.2, -0.5, 0.35] },
  { p: [-0.1, 1.5, 0.2], s: 0.42, c: '#FFC977', r: [-0.3, 0.6, -0.2] },
  { p: [-0.85, -0.95, 0.3], s: 0.26, c: '#8B5CF6', r: [0.6, 0.3, 0.5] },
]

/** Film frame: light rim + sprocket holes along two edges, transparent elsewhere. */
function useFrameTexture() {
  return useMemo(() => {
    const s = 256, cv = document.createElement('canvas')
    cv.width = cv.height = s
    const g = cv.getContext('2d')!
    g.clearRect(0, 0, s, s)
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 6
    g.strokeRect(10, 10, s - 20, s - 20)
    g.fillStyle = 'rgba(255,255,255,.75)'
    for (let i = 0; i < 7; i++) {
      const y = 30 + i * 30
      g.beginPath(); g.roundRect(20, y, 16, 12, 3); g.fill()
      g.beginPath(); g.roundRect(s - 36, y, 16, 12, 3); g.fill()
    }
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2
    g.strokeRect(50, 30, s - 100, s - 60)
    const tex = new THREE.CanvasTexture(cv)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }, [])
}

const WHITE = new THREE.Color('#ffffff')
const scroll = { y: 0 }
const pointer = { x: 0, y: 0 }

function Cube({ d, i, tex, bg }: { d: CubeDef; i: number; tex: THREE.Texture; bg: THREE.Texture | THREE.Color }) {
  const g = useRef<THREE.Group>(null)
  const v = useRef(new THREE.Vector3())
  const { viewport } = useThree()
  useFrame((_, dt) => {
    const o = g.current
    if (!o) return
    const p = Math.min(1, scroll.y / 900)
    // rise and drift apart with scroll
    o.position.set(d.p[0] * (1 + p * 0.25), d.p[1] + p * 0.6 * (1 + i * 0.15), d.p[2])
    // turn away from the cursor, ±15°
    v.current.set(pointer.x * viewport.width / 2 - o.position.x, pointer.y * viewport.height / 2 - o.position.y, 0)
    const len = Math.max(0.6, v.current.length())
    const away = Math.min(1, 1.6 / len)
    const tx = d.r[0] + p * 0.8 + (v.current.y / len) * away * 0.26
    const ty = d.r[1] + p * 0.8 - (v.current.x / len) * away * 0.26
    const k = 1 - Math.exp(-dt * 4)
    o.rotation.x += (tx - o.rotation.x) * k
    o.rotation.y += (ty - o.rotation.y) * k
    o.rotation.z = d.r[2]
  })
  return (
    <group ref={g} position={d.p}>
      <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.25}>
        <RoundedBox args={[d.s, d.s, d.s]} radius={d.s * 0.12} smoothness={4}>
          <MeshTransmissionMaterial
            samples={4} resolution={256} transmission={1} thickness={0.6} roughness={0.05} ior={1.45}
            chromaticAberration={0.06} anisotropicBlur={0.1} distortion={0.05} distortionScale={0.3} temporalDistortion={0}
            color={new THREE.Color(d.c).lerp(WHITE, 0.55)} attenuationColor={d.c} attenuationDistance={3} backside={false} background={bg}
          />
        </RoundedBox>
        <RoundedBox args={[d.s * 1.006, d.s * 1.006, d.s * 1.006]} radius={d.s * 0.12} smoothness={2}>
          <meshBasicMaterial map={tex} transparent opacity={0.55} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
        </RoundedBox>
      </Float>
    </group>
  )
}

/**
 * Sunset environment for reflections, baked once with PMREM from a few emissive panels
 * (warm sun low behind, lilac sky left, teal top light) — no HDR download, no loader code in the chunk.
 */
function SunsetEnv() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const env = new THREE.Scene()
    env.background = new THREE.Color('#2a1d4f')
    const panel = (color: string, intensity: number, pos: [number, number, number], scale: [number, number]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }))
      m.position.set(...pos); m.scale.set(scale[0], scale[1], 1); m.lookAt(0, 0, 0)
      env.add(m)
    }
    panel('#FFB56B', 3, [6, -1, -4], [10, 3])
    panel('#FFE3B0', 4, [3, 1, -6], [2.5, 2.5])
    panel('#C8A6FF', 1.6, [-6, 3, 2], [8, 6])
    panel('#5ED3E6', 1.2, [0, 6, 4], [10, 2])
    const pm = new THREE.PMREMGenerator(gl)
    const rt = pm.fromScene(env, 0.04)
    scene.environment = rt.texture
    return () => { scene.environment = null; rt.dispose(); pm.dispose(); env.traverse((o) => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose() } }) }
  }, [gl, scene])
  return null
}

/** Average frame time over the first 2 s; > 20 ms → unmount (the video/poster stays). */
function PerfGuard({ onFail }: { onFail: () => void }) {
  const acc = useRef({ t: 0, n: 0, done: false })
  useFrame((_, dt) => {
    const a = acc.current
    // throttled frames (background tab / hidden pane) say nothing about the GPU: skip them
    if (a.done || document.hidden || dt > 0.25) return
    a.t += dt; a.n++
    if (a.t > 2) {
      a.done = true
      const slow = (a.t / a.n) * 1000 > 20
      document.documentElement.dataset.cubes = slow ? 'fail' : 'ok'
      if (slow) onFail()
    }
  })
  return null
}

/** Refraction backdrop: the hero poster (so the glass bends the sunset, not the transparent canvas). */
function Scene({ tex, poster }: { tex: THREE.Texture; poster: string }) {
  const bg = useTexture(poster)
  bg.colorSpace = THREE.SRGBColorSpace
  return <>{CUBES.map((d, i) => <Cube key={i} d={d} i={i} tex={tex} bg={bg} />)}</>
}

export default function Cubes({ active, onFail, poster }: { active: boolean; onFail: () => void; poster: string | null }) {
  const tex = useFrameTexture()
  const bg = useMemo(() => new THREE.Color('#7a4f9a'), [])
  const [hidden, setHidden] = useState(typeof document !== 'undefined' && document.hidden)
  useEffect(() => {
    const vis = () => setHidden(document.hidden)
    const sc = () => { scroll.y = window.scrollY }
    const mv = (e: PointerEvent) => { pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = -((e.clientY / innerHeight) * 2 - 1) }
    sc()
    document.addEventListener('visibilitychange', vis)
    window.addEventListener('scroll', sc, { passive: true })
    window.addEventListener('pointermove', mv, { passive: true })
    return () => { document.removeEventListener('visibilitychange', vis); window.removeEventListener('scroll', sc); window.removeEventListener('pointermove', mv) }
  }, [])
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active && !hidden ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.toneMapping = THREE.ACESFilmicToneMapping }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[-4, 2, -3]} intensity={2} color="#FFB56B" />
      <pointLight position={[4, 1, 2]} intensity={1.2 * 30} color="#8B5CF6" />
      <SunsetEnv />
      {poster ? <Suspense fallback={null}><Scene tex={tex} poster={poster} /></Suspense> : CUBES.map((d, i) => <Cube key={i} d={d} i={i} tex={tex} bg={bg} />)}
      <PerfGuard onFail={onFail} />
    </Canvas>
  )
}
