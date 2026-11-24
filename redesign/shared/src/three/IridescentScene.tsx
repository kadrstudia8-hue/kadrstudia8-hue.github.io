import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { cssColorToRgb, rgbToHex } from './color'
import type { IridescentObjectProps } from './IridescentObject'
import { buildShape, type IridescentShape } from './iridescentGeometry'
import { useScrollProgress } from './progress'
import { deviceTier } from './webgl'

type SceneProps = IridescentObjectProps & {
  root: RefObject<HTMLDivElement | null>
  active: boolean
  onPerfFail: () => void
}

const DEFAULT_HIGHLIGHTS = ['#ff4d6d', '#ffb84d', '#6dffb3', '#4dc3ff', '#9b6dff']

type Spring = { x: number; v: number }
function spring(s: Spring, to: number, k: number, z: number, dt: number) {
  s.v += (-k * (s.x - to) - 2 * z * Math.sqrt(k) * s.v) * dt
  s.x += s.v * dt
}
const smooth = (t: number) => t * t * (3 - 2 * t)

function hex(color: string | undefined, scope: Element | null, fallback: string) {
  if (!color) return fallback
  if (/^#[0-9a-f]{3,8}$/i.test(color)) return color
  return rgbToHex(cssColorToRgb(color, scope))
}

function Dust({ color, count }: { color: string; count: number }) {
  const ref = useRef<THREE.Points>(null)
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // shell around the object, denser behind it
      const r = 1.5 + Math.pow(Math.random(), 0.7) * 3.2
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.4
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.9
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 1
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])
  useEffect(() => () => geometry.dispose(), [geometry])
  useFrame((_, dt) => {
    if (ref.current) { ref.current.rotation.y += dt * 0.02; ref.current.rotation.x += dt * 0.006 }
  })
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color={color} size={0.022} sizeAttenuation transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  )
}

/** Thin glowing bars behind the object: refracted through the glass they read as prism light. */
function PrismBars({ colors }: { colors: string[] }) {
  return (
    <group position={[0, 0, -2.2]}>
      {colors.slice(0, 5).map((c, i) => (
        <mesh key={i} position={[(i - (colors.length - 1) / 2) * 0.55, 0, 0]} rotation={[0, 0, 0.5 + i * 0.07]}>
          <planeGeometry args={[0.04, 5.5]} />
          <meshBasicMaterial color={c} transparent opacity={0.28} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Hero(props: SceneProps & { readP: () => number }) {
  const {
    shape = 'crystal', shapes, material = 'glass', tint, progress, speed = 1, cursorTilt = 14, scale = 1,
    samples, resolution, perfGuard = true, onPerfFail, root, readP,
  } = props
  const tier = useMemo(deviceTier, [])
  const { viewport } = useThree()
  const list = useMemo<IridescentShape[]>(() => (shapes && shapes.length ? shapes : [shape]), [shapes, shape])
  const key = list.join(',')
  const geos = useMemo(() => list.map(buildShape), [key]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos])
  const tintHex = useMemo(() => hex(tint, root.current, '#ffffff'), [tint, root])

  const mesh = useRef<THREE.Mesh>(null)
  const group = useRef<THREE.Group>(null)
  const st = useRef({ G: { x: -1, v: 0 }, RX: { x: 0, v: 0 }, RY: { x: 0, v: 0 }, spin: 0, idx: -1, t: 0, frames: 0, acc: 0, checked: false })
  const ptr = useRef<[number, number]>([0, 0])

  useEffect(() => {
    if (!cursorTilt || tier.phone) return
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      ptr.current = [(e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1]
    }
    const reset = () => { ptr.current = [0, 0] }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', reset)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('blur', reset) }
  }, [cursorTilt, tier.phone])

  useFrame((_, delta) => {
    const s = st.current, m = mesh.current, g = group.current
    if (!m || !g) return
    const dt = Math.min(0.05, delta)
    s.t += dt

    // perf guard: average frame time between 0.5 s and 2.5 s after start
    if (perfGuard && !s.checked && s.t > 0.5) {
      s.frames++; s.acc += delta
      if (s.t > 2.5) {
        s.checked = true
        if (s.acc / s.frames > 0.02) onPerfFail()
      }
    }

    const n = list.length
    const p = Math.max(0, Math.min(1, progress ? progress.get() : readP()))
    const gt = n < 2 ? 0 : p * (n - 1)
    if (s.G.x < 0) s.G.x = gt
    spring(s.G, gt, 30, 0.9, dt)
    const tiltRad = THREE.MathUtils.degToRad(cursorTilt)
    spring(s.RY, ptr.current[0] * tiltRad, 40, 0.8, dt)
    spring(s.RX, ptr.current[1] * tiltRad * 0.7, 40, 0.8, dt)

    // morph: shrink + twist into the midpoint, swap geometry, grow out
    const nearest = Math.max(0, Math.min(n - 1, Math.round(s.G.x)))
    const off = s.G.x - nearest
    if (nearest !== s.idx) { m.geometry = geos[nearest]; s.idx = nearest }
    const squash = smooth(Math.min(1, Math.abs(off) * 2))
    const fit = (Math.min(viewport.width, viewport.height) * 0.35 * scale) / 1.1
    m.scale.setScalar(fit * (1 - 0.72 * squash))

    s.spin += dt * 0.22 * speed
    g.rotation.set(
      s.RX.x + Math.sin(s.t * 0.4) * 0.06,
      s.spin + p * Math.PI * 0.8 + off * Math.PI * 1.4 + s.RY.x,
      Math.sin(s.t * 0.3) * 0.04,
    )
    g.position.y = Math.sin(s.t * 0.8) * 0.05 * fit
  })

  const phone = tier.phone
  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geos[0]}>
        {material === 'chrome' ? (
          <meshPhysicalMaterial
            color={tintHex}
            metalness={1}
            roughness={0.12}
            iridescence={1}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[100, 900]}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.5}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={samples ?? (phone ? 3 : 6)}
            resolution={resolution ?? (phone ? 256 : 512)}
            backside={!phone}
            backsideThickness={0.25}
            transmission={1}
            thickness={0.6}
            roughness={0.04}
            ior={1.45}
            chromaticAberration={0.45}
            anisotropicBlur={0.12}
            distortion={0.18}
            distortionScale={0.35}
            temporalDistortion={0.05}
            iridescence={1}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[0, 1400]}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.2}
            color={tintHex}
          />
        )}
      </mesh>
    </group>
  )
}

export default function IridescentScene(props: SceneProps) {
  const { root, track, active, dust = true, dustColor, highlights, background, prismBars = false, material = 'glass' } = props
  const tier = useMemo(deviceTier, [])
  const p = useScrollProgress(track ?? root)
  const colors = useMemo(
    () => (highlights && highlights.length ? highlights : DEFAULT_HIGHLIGHTS).map((c) => hex(c, root.current, '#ffffff')),
    [highlights, root],
  )
  const dustHex = useMemo(() => hex(dustColor, root.current, '#f3e9d2'), [dustColor, root])
  const bg = useMemo(() => (background ? hex(background, root.current, '#000000') : null), [background, root])

  return (
    <Canvas
      dpr={tier.phone ? [1, 1.5] : [1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 30, position: [0, 0, 6], near: 0.1, far: 40 }}
      gl={{ alpha: !bg, antialias: !tier.phone, powerPreference: 'high-performance' }}
    >
      {bg && <color attach="background" args={[bg]} />}
      <Environment resolution={tier.phone ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, 5, -1]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, -5, 1]} rotation-x={-Math.PI / 2} scale={[10, 1, 1]} />
        {colors.map((c, i) => {
          const a = (i / colors.length) * Math.PI * 2
          return (
            <Lightformer
              key={i}
              form="rect"
              intensity={3}
              color={c}
              position={[Math.cos(a) * 5, 0, Math.sin(a) * 5]}
              rotation={[0, -a - Math.PI / 2, 0]}
              scale={[0.7, 9, 1]}
            />
          )
        })}
        <Lightformer form="rect" intensity={material === 'chrome' ? 1.6 : 0.8} color="#ffffff" position={[2, 1, 5]} scale={[4, 4, 1]} />
        <Lightformer form="ring" intensity={2} color={colors[0]} position={[-3, 2, 4]} scale={1.5} />
      </Environment>
      {prismBars && <PrismBars colors={colors} />}
      {dust && <Dust color={dustHex} count={tier.phone ? 260 : 700} />}
      <Hero {...props} readP={() => p.current} />
    </Canvas>
  )
}
