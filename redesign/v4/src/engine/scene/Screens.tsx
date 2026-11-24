import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  CanvasTexture, LinearFilter, Mesh, PerspectiveCamera, PlaneGeometry, ShaderMaterial, SRGBColorSpace,
  Texture, TextureLoader, Vector2,
} from 'three'
import { stageInput as I } from '../contract'
import { dom } from '../dom'
import { rectToWorld, SCREEN_DEPTH, unitAt } from '../project'
import { rig } from '../rig'
import { E } from '../state'
import { SDF, SPECTRUM } from '../glsl'

const MARGIN = 48 // px of glow around the screen

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const frag = /* glsl */ `
${SPECTRUM}
${SDF}
uniform sampler2D uMap; uniform float uHas; uniform vec2 uSize; uniform float uMargin; uniform float uTexAspect;
uniform float uReveal; uniform float uTime; uniform float uSpill; uniform float uI; uniform float uRun; uniform float uRadius;
varying vec2 vUv;
void main() {
  vec2 full = uSize + 2.0 * uMargin;
  vec2 p = (vUv - 0.5) * full;               // px from centre
  float d = v4box(p, uSize * 0.5, uRadius);
  vec2 suv = p / uSize + 0.5;                // 0..1 inside screen
  // cover-fit
  float sa = uSize.x / uSize.y;
  vec2 tuv = suv - 0.5;
  if (uTexAspect > sa) tuv.x *= sa / uTexAspect; else tuv.y *= uTexAspect / sa;
  tuv += 0.5;
  vec3 vid = uHas > 0.5 ? texture2D(uMap, tuv).rgb : vec3(0.0);
  float lum = dot(vid, vec3(0.2126, 0.7152, 0.0722));
  float m = clamp((uReveal * 1.6 - (1.0 - pow(lum, 0.6))) / 0.6, 0.0, 1.0) * uHas;
  // dark glass when empty
  vec3 glass = vec3(0.004, 0.004, 0.006) + vec3(0.012, 0.011, 0.016) * (1.0 - suv.y);
  glass += vec3(0.02) * smoothstep(0.02, 0.0, abs(suv.x - suv.y * 0.35 - 0.2)) ;
  vec3 col = mix(glass, vid, m);
  // light of the spectrum falling on the glass
  col += v4spectrum(suv.x) * uSpill * 0.10 * smoothstep(0.0, 1.0, suv.y) * (1.0 - 0.6 * m);
  float inside = smoothstep(0.75, -0.75, d);
  // 1px spectral rim + soft outer glow
  float ang = atan(p.y, p.x) / 6.28318 + 0.5;
  vec3 rimC = v4spectrum(fract(ang + uTime * 0.33 * uRun));
  float rim = smoothstep(1.2, 0.0, abs(d + 0.5));
  float glow = exp(-max(d, 0.0) / 16.0) * (1.0 - inside) * (0.10 + 0.35 * uSpill + 0.25 * uRun);
  vec3 outC = col * inside + rimC * rim * (0.55 + 0.6 * uSpill + 0.4 * uRun) + rimC * glow;
  float a = max(inside, max(rim, glow));
  gl_FragColor = vec4(outC * uI, a * clamp(uI * 1.5, 0.0, 1.0));
}`

const loader = new TextureLoader()
const posterCache = new Map<string, Texture>()
function poster(url: string) {
  let t = posterCache.get(url)
  if (!t) { t = loader.load(url); t.colorSpace = SRGBColorSpace; posterCache.set(url, t) }
  return t
}

/** One DOM-anchored screen showing a real site video (data-v4-video) as a texture. */
export function Screen({ slot, video, isActive, reveal, run }: {
  slot: string; video: string; isActive: () => boolean; reveal?: () => number; run?: () => number
}) {
  const ref = useRef<Mesh>(null)
  const cam = useThree((s) => s.camera) as PerspectiveCamera
  const geo = useMemo(() => new PlaneGeometry(1, 1), [])
  const st = useRef({ el: null as HTMLVideoElement | null, tex: null as Texture | null, canvas: null as HTMLCanvasElement | null, lastT: -1, hasFrame: false })
  const mat = useMemo(() => new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false,
    uniforms: {
      uMap: { value: null }, uHas: { value: 0 }, uSize: { value: new Vector2(1, 1) }, uMargin: { value: MARGIN },
      uTexAspect: { value: 16 / 9 }, uReveal: { value: 1 }, uTime: { value: 0 }, uSpill: { value: 0 },
      uI: { value: 1 }, uRun: { value: 0 }, uRadius: { value: 12 },
    },
  }), [])

  useEffect(() => () => { st.current.tex?.dispose() }, [])

  useFrame(() => {
    const mesh = ref.current
    if (!mesh) return
    const r = dom.rect(slot)
    if (!r) { mesh.visible = false; return }
    mesh.visible = true
    rectToWorld(r, SCREEN_DEPTH, cam, mesh.position)
    mesh.quaternion.copy(cam.quaternion)
    const unit = unitAt(SCREEN_DEPTH, cam)
    mesh.scale.set((r.w + 2 * MARGIN) * unit, (r.h + 2 * MARGIN) * unit, 1)
    const runV = run ? run() : 0
    if (runV > 0.01) {
      // turn towards the cursor (up to 6 degrees)
      const cx = ((r.x + r.w / 2) / dom.vw) * 2 - 1
      const cy = ((r.y + r.h / 2) / dom.vh) * 2 - 1
      mesh.rotateY((I.pointer.x - cx) * 0.105 * runV)
      mesh.rotateX((I.pointer.y - cy) * 0.07 * runV)
    }
    const u = mat.uniforms
    u.uSize.value.set(r.w, r.h)
    u.uTime.value = E.time
    u.uReveal.value = reveal ? reveal() : 1
    u.uSpill.value = rig.specTargetName === slot ? rig.specOpen * rig.specIntensity : 0
    u.uRun.value = runV
    u.uI.value = rig.dim * (1 - 0.85 * rig.fold)

    // ----- video texture: update only for the active screen -----
    const s = st.current
    const el = dom.video(video)
    if (el !== s.el) { s.tex?.dispose(); s.tex = null; s.el = el; s.hasFrame = false; s.lastT = -1 }
    if (!el) { u.uHas.value = 0; return }
    const ready = el.readyState >= 2 && el.videoWidth > 0
    if (ready && isActive() && el.currentTime !== s.lastT) {
      s.lastT = el.currentTime
      if (!s.tex) {
        if (el.videoWidth > 1280) {
          s.canvas = document.createElement('canvas')
          s.canvas.width = 1280; s.canvas.height = Math.round((1280 * el.videoHeight) / el.videoWidth)
          s.tex = new CanvasTexture(s.canvas)
        } else s.tex = new Texture(el)
        s.tex.colorSpace = SRGBColorSpace
        s.tex.minFilter = LinearFilter; s.tex.magFilter = LinearFilter; s.tex.generateMipmaps = false
      }
      if (s.canvas) s.canvas.getContext('2d')!.drawImage(el, 0, 0, s.canvas.width, s.canvas.height)
      s.tex.needsUpdate = true
      s.hasFrame = true
      u.uTexAspect.value = el.videoWidth / el.videoHeight
    }
    if (s.hasFrame && s.tex) { u.uMap.value = s.tex; u.uHas.value = 1 }
    else if (el.poster) {
      const p = poster(el.poster)
      u.uMap.value = p
      const img = p.image as HTMLImageElement | undefined
      u.uHas.value = img && img.width ? 1 : 0
      if (img && img.width) u.uTexAspect.value = img.width / img.height
    } else u.uHas.value = 0
  })

  return <mesh ref={ref} geometry={geo} material={mat} frustumCulled={false} renderOrder={7} />
}

export default function Screens() {
  const proofActive = (i: number) => () => (E.proofHover ?? E.proofSelect) === i
  return (
    <>
      <Screen slot="hero-screen" video="hero" isActive={() => I.active === 'top' || I.active === 'facts'} reveal={() => rig.heroReveal} />
      {[0, 1, 2, 3].map((i) => (
        <Screen key={i} slot={`proof-${i}`} video={`proof-${i}`} isActive={proofActive(i)} run={() => (E.proofHover === i ? 1 : 0)} />
      ))}
      <Screen slot="reel-screen" video="reel" isActive={() => I.active === 'reel'} />
    </>
  )
}
