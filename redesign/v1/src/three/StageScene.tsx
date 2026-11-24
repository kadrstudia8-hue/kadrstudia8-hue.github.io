// Page-wide gold film dust (port of legacy-prototype-html/scene.js on r3f): one fixed canvas, the shape follows the
// section in the middle of the viewport — reel → frame → film → play → dust — with per-section position / scale /
// brightness from data-scene, data-scene-x / -y / -scale / -alpha (as in scene.js). Copy of the shared
// FilmParticlesScene shader, extended with section stops (the shared one only has a single fixed centre).
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { FILM_LOOK, FILM_SHAPES, randomAttrs, type FilmShape } from '@kadr/shared/three/filmShapes'
import { deviceTier } from '@kadr/shared/three/webgl'

const FOV = 35
const CAM_Z = 6
const SHAPES: FilmShape[] = ['reel', 'frame', 'film', 'play', 'dust']

const VS = /* glsl */ `
attribute vec3 aTo;
attribute vec4 aRnd;
uniform float uMorph, uTime, uDrift, uGain, uSize, uPR, uPush;
uniform vec2 uRes, uMouse;
uniform vec3 uColA, uColB, uColC, uSpark;
varying vec3 vCol;
void main() {
  float k = clamp((uMorph - aRnd.x * 0.45) / 0.55, 0.0, 1.0);
  float e = k * k * k * (k * (k * 6.0 - 15.0) + 10.0);
  vec3 d = aTo - position;
  vec3 rn = fract(aRnd.w * vec3(13.17, 27.31, 41.73)) - 0.5;
  vec3 p = mix(position, aTo, e) + (cross(d, vec3(0.0, 0.0, 1.0)) * 0.22 + rn * (0.4 * length(d) + 0.08)) * sin(3.14159 * e);
  vec3 ph = fract(aRnd.w * vec3(1.0, 7.13, 3.71)) * 6.2832;
  float sp = 0.25 + fract(aRnd.w * 5.3) * 0.3;
  p += sin(uTime * sp * vec3(0.53, 0.47, 0.41) + ph) * uDrift;
  p *= 1.0 + 0.012 * sin(uTime * 0.55 + dot(p, vec3(1.7, 2.3, 1.1)));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  if (uPush > 0.0) {
    vec2 sp = gl_Position.xy / gl_Position.w * uRes * 0.5;
    vec2 dm = sp - uMouse;
    float dl = length(dm);
    float fall = 1.0 - clamp(dl / 120.0, 0.0, 1.0);
    sp += (dl > 0.001 ? dm / dl : vec2(0.0)) * 14.0 * fall * fall * uPush;
    gl_Position.xy = sp / (uRes * 0.5) * gl_Position.w;
  }
  float f = ${CAM_Z.toFixed(1)} / max(0.5, -mv.z);
  float sz = uSize * (0.65 + aRnd.z * 0.65) * f * uPR;
  gl_PointSize = clamp(sz, 1.5 * uPR, 3.2 * uPR);
  float c = aRnd.y;
  vec3 col = mix(mix(uColA, uColB, clamp(c * 2.0, 0.0, 1.0)), uColC, clamp(c * 2.0 - 1.0, 0.0, 1.0));
  float spk = step(0.965, fract(aRnd.w * 91.7));
  col = mix(col, uSpark, spk) * (1.0 + spk * 0.5 * sin(uTime * 1.3 + ph.x));
  float fog = clamp(0.75 + (mv.z + ${CAM_Z.toFixed(1)}) * 0.35, 0.12, 1.0);
  vCol = col * (uGain * fog * (0.7 + 0.3 * aRnd.z));
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

type Stop = { c: number; shape: FilmShape; x: number; y: number; scale: number; alpha: number }
const DEF: Stop = { c: 0, shape: 'dust', x: 0.5, y: 0.5, scale: 1, alpha: 0.3 }

function num(el: Element, k: string, d: number, lo: number, hi: number) {
  const v = parseFloat(el.getAttribute('data-scene-' + k) || '')
  return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d
}

function useStops() {
  const stops = useRef<Stop[]>([])
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const sy = window.scrollY, out: Stop[] = []
      document.querySelectorAll('[data-scene]').forEach((el) => {
        if (!el.getClientRects().length) return
        const r = el.getBoundingClientRect()
        const s = (el.getAttribute('data-scene') || '').trim() as FilmShape
        // on phones the shape may sit elsewhere (data-scene-mx / -my)
        const narrow = window.innerWidth < 768
        out.push({
          c: r.top + sy + r.height / 2, shape: SHAPES.includes(s) ? s : 'dust',
          x: num(el, narrow && el.hasAttribute('data-scene-mx') ? 'mx' : 'x', 0.5, -0.5, 1.5),
          y: num(el, narrow && el.hasAttribute('data-scene-my') ? 'my' : 'y', 0.5, -0.5, 1.5),
          scale: num(el, narrow && el.hasAttribute('data-scene-mscale') ? 'mscale' : 'scale', 1, 0.1, 4),
          alpha: num(el, 'alpha', 1, 0, 1),
        })
      })
      out.sort((a, b) => a.c - b.c)
      stops.current = out
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    const ro = new ResizeObserver(on)
    ro.observe(document.body)
    window.addEventListener('resize', on)
    return () => { ro.disconnect(); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])
  return stops
}

/** continuous position between section centres with a hold around each centre (scene.js targetG) */
function targetG(secs: Stop[]) {
  const n = secs.length, yc = window.scrollY + window.innerHeight / 2
  if (n < 2 || yc <= secs[0].c) return 0
  for (let i = 0; i < n - 1; i++) if (yc < secs[i + 1].c) {
    const t = (yc - secs[i].c) / Math.max(1, secs[i + 1].c - secs[i].c)
    return i + Math.min(1, Math.max(0, (t - 0.15) / 0.7))
  }
  return n - 1
}

type Spring = { x: number; v: number }
function spring(s: Spring, to: number, k: number, z: number, dt: number, vmax = 0) {
  s.v += (-k * (s.x - to) - 2 * z * Math.sqrt(k) * s.v) * dt
  if (vmax && Math.abs(s.v) > vmax) s.v = Math.sign(s.v) * vmax
  s.x += s.v * dt
}
const ss = (m: number) => m * m * (3 - 2 * m)

function Particles() {
  const { size } = useThree()
  const tier = useMemo(deviceTier, [])
  const N = tier.phone ? 4000 : tier.weak ? 9000 : 14000
  const stops = useStops()

  const attrs = useMemo(() => {
    const m = new Map<FilmShape, THREE.BufferAttribute>()
    for (const s of SHAPES) m.set(s, new THREE.BufferAttribute(FILM_SHAPES[s](N), 3))
    return m
  }, [N])
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', attrs.get('reel')!)
    g.setAttribute('aTo', attrs.get('frame')!)
    g.setAttribute('aRnd', new THREE.BufferAttribute(randomAttrs(N), 4))
    return g
  }, [attrs, N])
  useEffect(() => () => geometry.dispose(), [geometry])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VS, fragmentShader: FS, transparent: true, depthTest: false, depthWrite: false,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
    uniforms: {
      uMorph: { value: 0 }, uTime: { value: 0 }, uDrift: { value: 0.01 }, uGain: { value: 0 }, uSize: { value: 2.3 },
      uPR: { value: 1 }, uPush: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(1e5, 1e5) },
      // #d9b26f → #f2d39b, raw sRGB (no colour management, as the original)
      uColA: { value: new THREE.Vector3(0.851, 0.698, 0.435) }, uColB: { value: new THREE.Vector3(0.9, 0.76, 0.52) },
      uColC: { value: new THREE.Vector3(0.949, 0.827, 0.608) }, uSpark: { value: new THREE.Vector3(1, 0.95, 0.85) },
    },
  }), [])
  useEffect(() => () => material.dispose(), [material])

  const pts = useRef<THREE.Points>(null)
  const st = useRef({ G: { x: -1, v: 0 }, TX: { x: 0, v: 0 }, TY: { x: 0, v: 0 }, time: 0, born: -1, a: '', b: '' })
  const ptr = useRef<[number, number]>([0, 0])
  const mouse = useRef<[number, number]>([1e5, 1e5])

  useEffect(() => {
    if (tier.phone) return
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      ptr.current = [Math.max(-1, Math.min(1, (e.clientX / innerWidth) * 2 - 1)), Math.max(-1, Math.min(1, (e.clientY / innerHeight) * 2 - 1))]
      mouse.current = [e.clientX - innerWidth / 2, -(e.clientY - innerHeight / 2)]
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
  }, [tier.phone])

  useFrame((state, delta) => {
    const s = st.current, p = pts.current
    if (!p) return
    const secs = stops.current
    const gt = targetG(secs)
    const dt = Math.min(0.05, delta)
    if (s.G.x < 0) s.G.x = gt
    s.time += dt
    // scrub ~0.6 s: critically damped spring on the section index; tilt ±6° spring 60/16
    const steps = Math.max(1, Math.ceil(dt * 120)), h = dt / steps
    for (let i = 0; i < steps; i++) {
      spring(s.G, gt, 38, 0.9, h, 3)
      spring(s.TX, ptr.current[0], 60, 16 / (2 * Math.sqrt(60)), h); spring(s.TY, ptr.current[1], 60, 16 / (2 * Math.sqrt(60)), h)
    }
    const n = secs.length
    let sa = DEF, sb = DEF, m = 0
    if (n === 1) sa = sb = secs[0]
    else if (n > 1) {
      const i = Math.max(0, Math.min(n - 2, Math.floor(s.G.x)))
      m = Math.max(0, Math.min(1, s.G.x - i)); sa = secs[i]; sb = secs[i + 1]
    }
    const e = ss(m)
    if (sa.shape !== s.a) { geometry.setAttribute('position', attrs.get(sa.shape)!); s.a = sa.shape }
    if (sb.shape !== s.b) { geometry.setAttribute('aTo', attrs.get(sb.shape)!); s.b = sb.shape }
    const u = material.uniforms
    if (s.born < 0) s.born = state.clock.elapsedTime
    const fade = ss(Math.min(1, (state.clock.elapsedTime - s.born) / 1.6))
    const alpha = sa.alpha + (sb.alpha - sa.alpha) * e
    const LA = FILM_LOOK[sa.shape], LB = FILM_LOOK[sb.shape]
    u.uMorph.value = sa.shape === sb.shape ? 0 : m
    u.uTime.value = s.time
    u.uDrift.value = LA[0] + (LB[0] - LA[0]) * e
    u.uGain.value = 0.9 * fade * alpha * (LA[1] + (LB[1] - LA[1]) * e)
    u.uPR.value = state.viewport.dpr
    u.uRes.value.set(size.width, size.height)
    u.uMouse.value.set(mouse.current[0], mouse.current[1])
    u.uPush.value = tier.phone ? 0 : 1
    p.visible = u.uGain.value > 0.004

    const W = size.width, H = size.height
    const pxPerUnit = H / (2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2)))
    const sc = sa.scale + (sb.scale - sa.scale) * e
    p.scale.setScalar((0.34 * Math.min(W, H) * sc) / pxPerUnit)
    let x = sa.x + (sb.x - sa.x) * e
    const y = sa.y + (sb.y - sa.y) * e
    if (W < 760) x = 0.5 + (x - 0.5) * 0.3
    p.position.set(((x - 0.5) * W) / pxPerUnit, (-(y - 0.5) * H) / pxPerUnit, 0)
    const t = s.time
    const TILT = 0.105 // ±6°
    p.rotation.set(
      0.035 * Math.sin(t * 0.17 + 0.6) + s.TY.x * TILT,
      0.045 * Math.sin(t * 0.21) + 0.02 * Math.sin(t * 0.13 + 1.7) + s.TX.x * TILT,
      0.02 * Math.sin(t * 0.11 + 2.1),
      'YXZ',
    )
  })

  return <points ref={pts} geometry={geometry} material={material} frustumCulled={false} />
}

export default function StageScene({ active }: { active: boolean }) {
  const tier = useMemo(deviceTier, [])
  return (
    <Canvas
      dpr={tier.phone ? 1 : [1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance', depth: false, stencil: false }}
      style={{ pointerEvents: 'none' }}
    >
      <Particles />
    </Canvas>
  )
}
