import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, BufferAttribute, BufferGeometry, PerspectiveCamera, ShaderMaterial, Vector3 } from 'three'
import { CURL } from '../glsl'
import { dom } from '../dom'
import { pxToWorld, SCREEN_DEPTH } from '../project'
import { rig } from '../rig'
import { E } from '../state'

const vert = /* glsl */ `
${CURL}
uniform float uP; uniform float uTime; uniform float uPx;
attribute vec3 aEnd; attribute vec2 aD; // delay, seed
varying float vA; varying float vT;
void main() {
  float t = clamp((uP - aD.x) / 0.62, 0.0, 1.0);
  float e = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  vec3 p = mix(position, aEnd, e);
  p += v4curl(position * 1.7 + vec3(uTime * 0.25, 0.0, aD.y * 3.0)) * sin(3.14159 * e) * 0.22;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.4 + 1.2 * aD.y) * uPx;
  float appear = smoothstep(0.0, 0.05, uP - aD.x * 0.2);
  vA = appear * (1.0 - smoothstep(0.82, 1.0, t)) * step(0.0001, uP);
  vT = e;
}`
const frag = /* glsl */ `
varying float vA; varying float vT;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float m = smoothstep(0.5, 0.05, length(c));
  vec3 col = mix(vec3(0.93, 1.0, 0.55), vec3(1.0), smoothstep(0.0, 0.5, vT)) * 1.3;
  gl_FragColor = vec4(col * m * vA, 1.0);
}`

function rasterize(text: string, max: number): { x: number; y: number }[] | null {
  const fontPx = 64
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  const font = `900 ${fontPx}px "Onest Variable", Onest, system-ui, sans-serif`
  ctx.font = font
  const w = Math.min(2048, Math.ceil(ctx.measureText(text).width) + 8)
  c.width = w; c.height = fontPx + 24
  ctx.font = font
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 4, c.height / 2)
  const data = ctx.getImageData(0, 0, c.width, c.height).data
  const pts: { x: number; y: number }[] = []
  for (let y = 0; y < c.height; y += 1) for (let x = 0; x < c.width; x += 1) {
    if (data[(y * c.width + x) * 4 + 3] > 140) pts.push({ x: x / fontPx, y: (y - c.height / 2) / fontPx })
  }
  if (!pts.length) return null
  // random subset
  for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]] }
  return pts.slice(0, max)
}

const tmp = new Vector3()

/** Hero story: the typed phrase breaks into dust and is pulled into the projector beam. */
export default function HeroText({ count }: { count: number }) {
  const cam = useThree((s) => s.camera) as PerspectiveCamera
  const dpr = useThree((s) => s.viewport.dpr)
  const built = useRef(-1)
  const geo = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('aEnd', new BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('aD', new BufferAttribute(new Float32Array(count * 2), 2))
    g.setDrawRange(0, 0)
    return g
  }, [count])
  const mat = useMemo(() => new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uP: { value: 0 }, uTime: { value: 0 }, uPx: { value: 1 } },
  }), [])
  const visible = useRef(false)

  useFrame(() => {
    const p = rig.heroDust
    if (p < 0) { mat.uniforms.uP.value = 0; visible.current = false; geo.setDrawRange(0, 0); return }
    if (built.current !== E.heroStoryId) {
      built.current = E.heroStoryId
      const pts = E.heroPhrase.trim() ? rasterize(E.heroPhrase.trim(), count) : null
      if (!pts) { geo.setDrawRange(0, 0); return }
      const r = dom.rect('hero-prompt')
      const rect = r ?? { x: Math.min(80, dom.vw * 0.05) + 56, y: dom.vh * 0.62 + 40, w: 480, h: 64 }
      const padL = r ? 64 : 0
      const maxW = Math.max(...pts.map((q) => q.x))
      const scale = Math.min((rect.h * 0.34), (rect.w - padL - 16) / Math.max(maxW, 0.01))
      const pos = geo.attributes.position.array as Float32Array
      const end = geo.attributes.aEnd.array as Float32Array
      const d = geo.attributes.aD.array as Float32Array
      const A = rig.projector, B = rig.prism
      const ax = tmp.copy(B).sub(A)
      for (let i = 0; i < pts.length; i++) {
        const q = pts[i]
        const px = rect.x + padL + q.x * scale
        const py = rect.y + rect.h / 2 + q.y * scale
        const w = new Vector3()
        pxToWorld(px, py, SCREEN_DEPTH, cam, w)
        pos.set([w.x, w.y, w.z], i * 3)
        const t = 0.68 + Math.random() * 0.3
        const rr = (rig.beamR0 + (rig.beamR1 - rig.beamR0) * t) * Math.sqrt(Math.random()) * 0.8
        const ang = Math.random() * Math.PI * 2
        end.set([A.x + ax.x * t + Math.cos(ang) * rr, A.y + ax.y * t + Math.sin(ang) * rr, A.z + ax.z * t + Math.sin(ang + 1) * rr], i * 3)
        d[i * 2] = (q.x / Math.max(maxW, 0.01)) * 0.3 + Math.random() * 0.06
        d[i * 2 + 1] = Math.random()
      }
      geo.attributes.position.needsUpdate = true
      geo.attributes.aEnd.needsUpdate = true
      geo.attributes.aD.needsUpdate = true
      geo.setDrawRange(0, pts.length)
      visible.current = true
    }
    mat.uniforms.uP.value = p
    mat.uniforms.uTime.value = E.time
    mat.uniforms.uPx.value = dpr
  })

  return <points geometry={geo} material={mat} frustumCulled={false} renderOrder={8} />
}
