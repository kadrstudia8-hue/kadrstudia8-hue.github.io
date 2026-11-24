import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { cssColorToRgb, mixRgb } from './color'
import { FILM_LOOK, FILM_SHAPES, randomAttrs, type FilmShape } from './filmShapes'
import type { FilmParticlesProps } from './FilmParticles'
import { useScrollProgress } from './progress'
import { deviceTier } from './webgl'

type SceneProps = FilmParticlesProps & { root: RefObject<HTMLDivElement | null>; active: boolean; calm: boolean }

const FOV = 35
const CAM_Z = 6

const VS = /* glsl */ `
attribute vec3 aTo;
attribute vec4 aRnd;
uniform float uMorph, uTime, uDrift, uGain, uSize, uPR, uPush;
uniform vec2 uRes, uMouse;
uniform vec3 uColA, uColB, uColC, uSpark;
varying vec3 vCol;
void main() {
  // staggered, eased per-particle progress along a curved path
  float k = clamp((uMorph - aRnd.x * 0.45) / 0.55, 0.0, 1.0);
  float e = k * k * k * (k * (k * 6.0 - 15.0) + 10.0);
  vec3 d = aTo - position;
  vec3 rn = fract(aRnd.w * vec3(13.17, 27.31, 41.73)) - 0.5;
  vec3 p = mix(position, aTo, e) + (cross(d, vec3(0.0, 0.0, 1.0)) * 0.22 + rn * (0.4 * length(d) + 0.08)) * sin(3.14159 * e);
  // breathing: slow per-particle drift plus a soft travelling swell
  vec3 ph = fract(aRnd.w * vec3(1.0, 7.13, 3.71)) * 6.2832;
  float sp = 0.25 + fract(aRnd.w * 5.3) * 0.3;
  p += sin(uTime * sp * vec3(0.53, 0.47, 0.41) + ph) * uDrift;
  p *= 1.0 + 0.012 * sin(uTime * 0.55 + dot(p, vec3(1.7, 2.3, 1.1)));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  // cursor push: particles within 120 css px move up to 14 px away
  if (uPush > 0.0) {
    vec2 sp = gl_Position.xy / gl_Position.w * uRes * 0.5;
    vec2 dm = sp - uMouse;
    float dl = length(dm);
    float fall = 1.0 - clamp(dl / 120.0, 0.0, 1.0);
    sp += (dl > 0.001 ? dm / dl : vec2(0.0)) * 14.0 * fall * fall * uPush;
    gl_Position.xy = sp / (uRes * 0.5) * gl_Position.w;
  }
  float f = ${CAM_Z.toFixed(1)} / max(0.5, -mv.z);
  float sz = uSize * (0.55 + aRnd.z * 1.1) * f * uPR;
  gl_PointSize = clamp(sz, 1.0, 9.0 * uPR);
  float c = aRnd.y;
  vec3 col = mix(mix(uColA, uColB, clamp(c * 2.0, 0.0, 1.0)), uColC, clamp(c * 2.0 - 1.0, 0.0, 1.0));
  float spk = step(0.965, fract(aRnd.w * 91.7));
  col = mix(col, uSpark, spk) * (1.0 + spk * 0.5 * sin(uTime * 1.3 + ph.x));
  float fog = clamp(0.75 + (mv.z + ${CAM_Z.toFixed(1)}) * 0.35, 0.12, 1.0);
  float lit = clamp(sz / 1.6, 0.0, 1.0);
  vCol = col * (uGain * fog * lit * lit);
}`

const FS = /* glsl */ `
varying vec3 vCol;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(q, q);
  if (r2 > 1.0) discard;
  float a = 1.0 - r2;
  vec3 c = vCol * (a * a);
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
}`

type Spring = { x: number; v: number }
function spring(s: Spring, to: number, k: number, z: number, dt: number, vmax = 0) {
  s.v += (-k * (s.x - to) - 2 * z * Math.sqrt(k) * s.v) * dt
  if (vmax && Math.abs(s.v) > vmax) s.v = Math.sign(s.v) * vmax
  s.x += s.v * dt
}

/** 0..1 progress → continuous shape index with a hold around each shape */
function targetIndex(p: number, n: number) {
  if (n < 2) return 0
  const raw = Math.max(0, Math.min(1, p)) * (n - 1)
  const i = Math.min(n - 2, Math.floor(raw))
  const t = raw - i
  return i + Math.min(1, Math.max(0, (t - 0.15) / 0.7))
}

function Particles({
  shapes, color, sparkleColor, progress, scale = 1, center = [0.5, 0.5], density = 1, interactive = true, root, calm, readP,
}: SceneProps & { readP: () => number }) {
  const { size, invalidate } = useThree()
  const tier = useMemo(deviceTier, [])
  const N = Math.round((tier.phone ? 4000 : tier.weak ? 9000 : 14000) * Math.max(0.1, density))
  const list = useMemo(() => (shapes && shapes.length ? shapes : (['reel', 'frame', 'film', 'play'] as FilmShape[])), [shapes])
  const key = list.join(',')

  const attrs = useMemo(() => {
    const m = new Map<FilmShape, THREE.BufferAttribute>()
    for (const s of new Set(list)) m.set(s, new THREE.BufferAttribute(FILM_SHAPES[s](N), 3))
    return m
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, N])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', attrs.get(list[0])!)
    g.setAttribute('aTo', attrs.get(list[Math.min(1, list.length - 1)])!)
    g.setAttribute('aRnd', new THREE.BufferAttribute(randomAttrs(N), 4))
    return g
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attrs, N])
  useEffect(() => () => geometry.dispose(), [geometry])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VS,
    fragmentShader: FS,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
    uniforms: {
      uMorph: { value: 0 }, uTime: { value: 0 }, uDrift: { value: 0.01 }, uGain: { value: 0 }, uSize: { value: 2.3 },
      uPR: { value: 1 }, uPush: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(1e5, 1e5) },
      uColA: { value: new THREE.Vector3() }, uColB: { value: new THREE.Vector3() }, uColC: { value: new THREE.Vector3() },
      uSpark: { value: new THREE.Vector3() },
    },
  }), [])
  useEffect(() => () => material.dispose(), [material])

  // colours: raw sRGB straight into the shader (no colour management), like the original
  useEffect(() => {
    const base = cssColorToRgb(color ?? '#d9b26f', root.current, [0.851, 0.698, 0.435])
    const white: [number, number, number] = [1, 1, 1]
    const spark = sparkleColor ? cssColorToRgb(sparkleColor, root.current) : mixRgb(base, white, 0.72)
    const u = material.uniforms
    u.uColA.value.set(base[0] * 0.93, base[1] * 0.84, base[2] * 0.71)
    u.uColB.value.set(...base)
    u.uColC.value.set(...mixRgb(base, white, 0.45))
    u.uSpark.value.set(...spark)
    invalidate()
  }, [color, sparkleColor, material, root, invalidate])

  const group = useRef<THREE.Points>(null)
  const st = useRef({ G: { x: -1, v: 0 }, TX: { x: 0, v: 0 }, TY: { x: 0, v: 0 }, time: 0, born: 0, a: '', b: '' })
  const ptr = useRef<[number, number]>([0, 0])
  const mouse = useRef<[number, number]>([1e5, 1e5])

  useEffect(() => {
    if (!interactive || calm) return
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      ptr.current = [Math.max(-1, Math.min(1, (e.clientX / innerWidth) * 2 - 1)), Math.max(-1, Math.min(1, (e.clientY / innerHeight) * 2 - 1))]
      const r = root.current?.getBoundingClientRect()
      if (r) mouse.current = [e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))]
    }
    const reset = () => { ptr.current = [0, 0]; mouse.current = [1e5, 1e5] }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', reset)
    document.documentElement.addEventListener('mouseleave', reset)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('blur', reset)
      document.documentElement.removeEventListener('mouseleave', reset)
    }
  }, [interactive, calm, root])

  useFrame((state, delta) => {
    const s = st.current, pts = group.current
    if (!pts) return
    const n = list.length
    const p = progress ? progress.get() : readP()
    const gt = targetIndex(p, n)
    const dt = Math.min(0.05, delta)
    if (s.G.x < 0) s.G.x = gt
    if (calm) {
      s.G.x = Math.round(gt); s.G.v = 0
    } else {
      s.time += dt
      const steps = Math.max(1, Math.ceil(dt * 120)), h = dt / steps
      for (let i = 0; i < steps; i++) {
        spring(s.G, gt, 38, 0.9, h, 3)
        spring(s.TX, ptr.current[0], 14, 0.8, h); spring(s.TY, ptr.current[1], 14, 0.8, h)
      }
    }
    const i = n < 2 ? 0 : Math.max(0, Math.min(n - 2, Math.floor(s.G.x)))
    const m = n < 2 ? 0 : Math.max(0, Math.min(1, s.G.x - i))
    const a = list[i], b = list[Math.min(n - 1, i + 1)]
    if (a !== s.a) { geometry.setAttribute('position', attrs.get(a)!); s.a = a }
    if (b !== s.b) { geometry.setAttribute('aTo', attrs.get(b)!); s.b = b }

    const e = m * m * (3 - 2 * m)
    const u = material.uniforms
    if (!s.born) s.born = state.clock.elapsedTime
    let fade = calm ? 1 : Math.min(1, (state.clock.elapsedTime - s.born) / 1.6)
    fade = fade * fade * (3 - 2 * fade)
    u.uMorph.value = m
    u.uTime.value = s.time
    u.uDrift.value = calm ? 0 : FILM_LOOK[a][0] + (FILM_LOOK[b][0] - FILM_LOOK[a][0]) * e
    u.uGain.value = 0.9 * fade * (FILM_LOOK[a][1] + (FILM_LOOK[b][1] - FILM_LOOK[a][1]) * e)
    u.uPR.value = state.viewport.dpr
    u.uRes.value.set(size.width, size.height)
    u.uMouse.value.set(mouse.current[0], mouse.current[1])
    u.uPush.value = interactive && !calm && !tier.phone ? 1 : 0

    // layout: 1 unit = 0.34 × min(w, h) px (as in the original)
    const W = size.width, H = size.height
    const pxPerUnit = H / (2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2)))
    pts.scale.setScalar((0.34 * Math.min(W, H) * scale) / pxPerUnit)
    let cxf = center[0]
    if (W < 760) cxf = 0.5 + (cxf - 0.5) * 0.3
    pts.position.set(((cxf - 0.5) * W) / pxPerUnit, (-(center[1] - 0.5) * H) / pxPerUnit, 0)
    const t = s.time
    pts.rotation.set(
      calm ? 0 : 0.035 * Math.sin(t * 0.17 + 0.6) + s.TY.x * 0.105,
      calm ? 0 : 0.045 * Math.sin(t * 0.21) + 0.02 * Math.sin(t * 0.13 + 1.7) + s.TX.x * 0.105,
      calm ? 0 : 0.02 * Math.sin(t * 0.11 + 2.1),
      'YXZ',
    )
  })

  return <points ref={group} geometry={geometry} material={material} frustumCulled={false} />
}

export default function FilmParticlesScene(props: SceneProps) {
  const { root, track, active, calm, progress } = props
  const tier = useMemo(deviceTier, [])
  const invalidateRef = useRef<() => void>(() => {})
  const p = useScrollProgress(track ?? root, () => invalidateRef.current())
  // external MotionValue: wake the 'demand' loop (reduced motion) on change
  useEffect(() => {
    const mv = progress as { on?: (e: 'change', cb: () => void) => () => void } | undefined
    return mv?.on?.('change', () => invalidateRef.current())
  }, [progress])

  return (
    <Canvas
      dpr={tier.phone ? 1 : [1, 2]}
      frameloop={!active ? 'never' : calm ? 'demand' : 'always'}
      camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance', depth: false, stencil: false }}
      onCreated={({ invalidate }) => { invalidateRef.current = invalidate }}
      style={{ pointerEvents: 'none' }}
    >
      <Particles {...props} progress={progress} readP={() => p.current} />
    </Canvas>
  )
}
