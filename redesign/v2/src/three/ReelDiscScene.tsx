import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/** Film reel: a disc with 5 round windows and a hub, extruded with a soft bevel. */
function useReelGeometry() {
  return useMemo(() => {
    const R = 1, shape = new THREE.Shape()
    shape.absarc(0, 0, R, 0, Math.PI * 2, false)
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 2
      const h = new THREE.Path()
      h.absarc(Math.cos(a) * 0.56, Math.sin(a) * 0.56, 0.25, 0, Math.PI * 2, true)
      shape.holes.push(h)
    }
    const hub = new THREE.Path(); hub.absarc(0, 0, 0.09, 0, Math.PI * 2, true); shape.holes.push(hub)
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 6, curveSegments: 64 })
    g.center()
    return g
  }, [])
}

/** Studio environment baked once with PMREM from a few coloured light panels (no HDR download, no drei). */
function StudioEnv() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const env = new THREE.Scene()
    env.background = new THREE.Color('#1a1630')
    const panel = (color: string, intensity: number, pos: [number, number, number], scale: [number, number], look: [number, number, number] = [0, 0, 0]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }))
      m.position.set(...pos); m.scale.set(scale[0], scale[1], 1); m.lookAt(...look); env.add(m)
    }
    panel('#ffffff', 3, [0, 3, 2], [6, 1.2])
    panel('#ff7ae6', 2.4, [-3, 0, 1], [4, 2])
    panel('#7ad0ff', 2.4, [3, 0.5, 1], [4, 2])
    panel('#d8ff5a', 1.6, [0, -3, 1], [5, 1])
    panel('#b9a6ff', 1.2, [0, 0, -4], [4, 4])
    const pm = new THREE.PMREMGenerator(gl)
    const rt = pm.fromScene(env, 0.02)
    scene.environment = rt.texture
    return () => { scene.environment = null; rt.dispose(); pm.dispose(); env.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose() } }) }
  }, [gl, scene])
  return null
}

type Props = { scroll: () => number; pointer: () => [number, number]; active: boolean }

function Reel({ scroll, pointer }: Omit<Props, 'active'>) {
  const geo = useReelGeometry()
  const group = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const tilt = useRef({ x: 0, y: 0, vx: 0, vy: 0 })
  useEffect(() => () => geo.dispose(), [geo])
  useFrame((_, dt) => {
    const g = group.current, s = spin.current
    if (!g || !s) return
    dt = Math.min(dt, 1 / 30)
    // one full turn per 1200px of scroll + slow idle turn (14 s / rev)
    s.rotation.z = -(scroll() / 1200) * Math.PI * 2 - performance.now() / 1000 * (Math.PI * 2 / 14)
    // turn towards the cursor ±20°, spring 60/14
    const [px, py] = pointer()
    const k = 60, z = 14 / (2 * Math.sqrt(60))
    const tx = py * 0.35, ty = px * 0.35
    const T = tilt.current
    T.vx += (-k * (T.x - tx) - 2 * z * Math.sqrt(k) * T.vx) * dt; T.x += T.vx * dt
    T.vy += (-k * (T.y - ty) - 2 * z * Math.sqrt(k) * T.vy) * dt; T.y += T.vy * dt
    g.rotation.x = -0.12 + T.x
    g.rotation.y = -0.5 + T.y
  })
  return (
    <group ref={group}>
      <group ref={spin}>
        <mesh geometry={geo}>
          <meshPhysicalMaterial color="#e9ecff" metalness={1} roughness={0.12} iridescence={1} iridescenceIOR={1.6} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.4} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.34, 48, 1, true]} />
          <meshPhysicalMaterial color="#d8dcf0" metalness={1} roughness={0.2} iridescence={0.8} clearcoat={1} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}

export default function ReelDiscScene({ scroll, pointer, active }: Props) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 2]} camera={{ position: [0, 0, 3.2], fov: 38 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} />
      <StudioEnv />
      <Reel scroll={scroll} pointer={pointer} />
    </Canvas>
  )
}
