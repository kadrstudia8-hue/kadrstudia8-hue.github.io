import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import {
  AdditiveBlending, BoxGeometry, Color, Group, Mesh, MeshPhysicalMaterial, PerspectiveCamera, PlaneGeometry,
  PointLight, ShaderMaterial, Vector2, Vector3,
} from 'three'
import { stageInput as I } from '../contract'
import { dom } from '../dom'
import { SDF, SPECTRUM } from '../glsl'
import { rectToWorld, SCREEN_DEPTH, unitAt } from '../project'
import { rig } from '../rig'
import { damp, E, easeOut } from '../state'
import { extrudeTriangle } from '../shapes'

const plainVert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const plane = new PlaneGeometry(1, 1)
const tmp = new Vector3()

/* ---------------- pricing monoliths ---------------- */
const MONO = ['#B9A6FF', '#D7FF1F', '#F58BD0']
const underFrag = /* glsl */ `
${SDF}
uniform vec3 uColor; uniform float uI; uniform vec2 uSize;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - vec2(0.5, 0.0)) * uSize;          // px, origin at bottom centre
  float line = exp(-abs(p.y - uSize.y * 0.18) / 2.0) * smoothstep(uSize.x * 0.5, uSize.x * 0.3, abs(p.x));
  float glow = exp(-max(p.y - uSize.y * 0.18, 0.0) / (uSize.y * 0.22)) * smoothstep(uSize.x * 0.55, uSize.x * 0.15, abs(p.x));
  glow *= smoothstep(0.0, uSize.y * 0.18, p.y);
  gl_FragColor = vec4(uColor * (line * 1.4 + glow * 0.55) * uI, 1.0);
}`

function Monolith({ i, tier }: { i: number; tier: number }) {
  const cam = useThree((s) => s.camera) as PerspectiveCamera
  const box = useRef<Mesh>(null)
  const under = useRef<Mesh>(null)
  const geo = useMemo(() => new BoxGeometry(1, 1, 1), [])
  const glass = useMemo(() => new MeshPhysicalMaterial(tier >= 3 ? {
    color: '#ffffff', metalness: 0, roughness: 0.12, transmission: 0.9, thickness: 0.6, ior: 1.45,
    attenuationColor: new Color(MONO[i]), attenuationDistance: 1.1, envMapIntensity: 1.2, clearcoat: 1,
  } : {
    color: new Color(MONO[i]).multiplyScalar(0.12), metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.35,
    envMapIntensity: 1.2, clearcoat: 1,
  }), [i, tier])
  const um = useMemo(() => new ShaderMaterial({
    vertexShader: plainVert, fragmentShader: underFrag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uColor: { value: new Color(MONO[i]).convertSRGBToLinear() }, uI: { value: 0 }, uSize: { value: new Vector2(1, 1) } },
  }), [i])
  const light = useRef(0)

  useFrame(() => {
    const b = box.current, u = under.current
    if (!b || !u) return
    const r = dom.rect(`price-${i}`)
    const on = rig.pricing > 0.01 && !!r
    b.visible = u.visible = on
    if (!on || !r) return
    const depth = SCREEN_DEPTH + 0.6
    const [w, h] = rectToWorld(r, depth, cam, b.position)
    b.quaternion.copy(cam.quaternion)
    b.scale.set(w * 0.84, h * 0.94, 0.4)
    // under-light below the card
    const unit = unitAt(SCREEN_DEPTH, cam)
    const uh = r.h * 0.9
    tmp.set(r.x + r.w / 2, r.y + r.h + uh * 0.18 - uh / 2, 0)
    rectToWorld({ x: r.x - r.w * 0.1, y: r.y + r.h - uh * 0.82, w: r.w * 1.2, h: uh, visible: true }, SCREEN_DEPTH - 0.2, cam, u.position)
    u.quaternion.copy(cam.quaternion)
    u.scale.set(r.w * 1.2 * unit, uh * unit, 1)
    const start = easeOut((E.time - E.pricingEnterAt - i * 0.14) / 0.8)
    const hover = E.pricingHover === i ? 1.6 : 1
    const mid = i === 1 ? 1.2 : 1
    light.current = damp(light.current, start * hover * mid, 10, E.dt || 0.016)
    um.uniforms.uI.value = light.current * rig.pricing * rig.dim
    um.uniforms.uSize.value.set(r.w * 1.2, uh)
  })

  return (
    <>
      <mesh ref={box} geometry={geo} material={glass} visible={false} />
      <mesh ref={under} geometry={plane} material={um} visible={false} frustumCulled={false} renderOrder={9} />
    </>
  )
}

export function Monoliths({ tier }: { tier: number }) {
  return <>{[0, 1, 2].map((i) => <Monolith key={i} i={i} tier={tier} />)}</>
}

/* ---------------- chrome play (download) ---------------- */
export function ChromePlay() {
  const cam = useThree((s) => s.camera) as PerspectiveCamera
  const g = useRef<Group>(null)
  const geo = useMemo(() => extrudeTriangle(0.5, 0.13, 0.26, 0.09, 0), [])
  const mat = useMemo(() => new MeshPhysicalMaterial({
    color: '#e9e9f2', metalness: 1, roughness: 0.07, clearcoat: 1, clearcoatRoughness: 0.03,
    envMapIntensity: 1.8, iridescence: 0.35, iridescenceIOR: 1.6,
  }), [])
  const sp = useRef({ s: 1, v: 0 })
  useFrame(() => {
    const o = g.current
    if (!o) return
    const r = dom.rect('download-object')
    o.visible = !!r
    if (!r) return
    const [w, h] = rectToWorld(r, 6, cam, o.position)
    o.quaternion.copy(cam.quaternion)
    const t = E.time
    o.rotateY(Math.sin(t * 0.5) * 0.35 + I.pointer.x * 0.3)
    o.rotateX(Math.sin(t * 0.37) * 0.08 + I.pointer.y * 0.2)
    // spring 260/22 towards hover scale
    const target = E.ctaHover ? 1.07 : 1
    const dt = E.dt || 0.016
    const s = sp.current
    s.v += ((target - s.s) * 260 - s.v * 22) * dt
    s.s += s.v * dt
    o.scale.setScalar((Math.min(w, h) / 0.95) * 0.62 * s.s)
  })
  return (
    <group ref={g} visible={false}>
      <mesh geometry={geo} material={mat} />
    </group>
  )
}

/* ---------------- play folded from the beam (contact) ---------------- */
const signFrag = /* glsl */ `
${SPECTRUM}
uniform float uI; uniform float uTime;
varying vec2 vUv;
float sdTri(vec2 p, float r) { // equilateral triangle pointing right
  p = vec2(p.y, -p.x);
  const float k = sqrt(3.0);
  p.x = abs(p.x) - r; p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  p.x += 0.08;
  float d = sdTri(p, 0.42) - 0.06;
  float fill = smoothstep(0.01, -0.01, d);
  float rim = exp(-abs(d) * 40.0);
  float glow = exp(-max(d, 0.0) * 7.0) * (1.0 - fill);
  float ang = atan(p.y, p.x) / 6.28318 + 0.5;
  vec3 spec = v4spectrum(fract(ang + uTime * 0.05));
  vec3 core = vec3(1.0) * fill * (0.55 + 0.45 * smoothstep(0.0, -0.3, d));
  vec3 c = core * 1.2 + spec * rim * 1.6 + spec * glow * 0.6;
  gl_FragColor = vec4(c * uI, 1.0);
}`

export function PlaySign() {
  const ref = useRef<Mesh>(null)
  const mat = useMemo(() => new ShaderMaterial({
    vertexShader: plainVert, fragmentShader: signFrag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uI: { value: 0 }, uTime: { value: 0 } },
  }), [])
  useFrame(() => {
    const m = ref.current
    if (!m) return
    m.visible = rig.fold > 0.01
    if (!m.visible) return
    m.position.copy(rig.playCenter)
    m.quaternion.copy(rig.playQuat)
    m.scale.setScalar(rig.playSize * 1.6)
    mat.uniforms.uI.value = Math.pow(rig.fold, 1.5)
    mat.uniforms.uTime.value = E.time
  })
  return <mesh ref={ref} geometry={plane} material={mat} visible={false} frustumCulled={false} renderOrder={10} />
}

/* ---------------- how: playhead light ---------------- */
const headFrag = /* glsl */ `
uniform float uI; uniform vec2 uSize; varying vec2 vUv;
void main() {
  float x = (vUv.x - 0.5) * uSize.x;
  float core = exp(-abs(x) / 1.2);
  float glow = exp(-abs(x) / 26.0) * 0.35;
  float v = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
  vec3 c = mix(vec3(0.84, 1.0, 0.12), vec3(1.0), core) * (core * 1.6 + glow);
  gl_FragColor = vec4(c * v * uI, 1.0);
}`
export function Playhead() {
  const cam = useThree((s) => s.camera) as PerspectiveCamera
  const ref = useRef<Mesh>(null)
  const mat = useMemo(() => new ShaderMaterial({
    vertexShader: plainVert, fragmentShader: headFrag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uI: { value: 0 }, uSize: { value: new Vector2(160, 300) } },
  }), [])
  useFrame(() => {
    const m = ref.current
    if (!m) return
    const r = dom.rect('how-track')
    m.visible = !!r && I.active === 'how'
    if (!r || !m.visible) return
    const x = r.x + Math.min(Math.max(I.pin.how, 0), 1) * r.w
    const hh = r.h * 1.7
    rectToWorld({ x: x - 80, y: r.y + r.h / 2 - hh / 2, w: 160, h: hh, visible: true }, SCREEN_DEPTH + 0.2, cam, m.position)
    const unit = unitAt(SCREEN_DEPTH + 0.2, cam)
    m.quaternion.copy(cam.quaternion)
    m.scale.set(160 * unit, hh * unit, 1)
    mat.uniforms.uSize.value.set(160, hh)
    mat.uniforms.uI.value = rig.dim
  })
  return <mesh ref={ref} geometry={plane} material={mat} visible={false} frustumCulled={false} renderOrder={9} />
}

/* ---------------- cursor light ---------------- */
export function CursorLight() {
  const ref = useRef<PointLight>(null)
  useFrame(() => {
    const l = ref.current
    if (!l) return
    l.position.copy(rig.cursor)
    l.color.copy(rig.cursorColor)
    l.intensity = 0.6 * 9 * rig.cursorOn * rig.dim
  })
  return <pointLight ref={ref} distance={9} decay={1.4} intensity={0} />
}
