import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Color, Mesh, PlaneGeometry, ShaderMaterial, Vector3 } from 'three'

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const frag = /* glsl */ `
uniform vec3 uColor; uniform float uI; uniform float uStreak;
varying vec2 vUv;
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float core = exp(-r * r * 60.0) * 2.5;
  float halo = exp(-r * 4.5) * 0.45;
  float streak = exp(-abs(p.y) * 60.0) * exp(-abs(p.x) * 2.2) * uStreak;
  float a = (core + halo + streak) * smoothstep(1.0, 0.7, r + abs(p.y) * 0.0);
  gl_FragColor = vec4(uColor * a * uI, 1.0);
}`

const geo = new PlaneGeometry(1, 1)

/** Camera-facing glow with an optional horizontal streak (lens, prism hot spot). */
export default function Flare({ at, size, color, intensity, streak = 0.6 }: {
  at: Vector3; size: number; color: string; intensity: () => number; streak?: number
}) {
  const ref = useRef<Mesh>(null)
  const mat = useMemo(() => new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, depthTest: false,
    blending: AdditiveBlending,
    uniforms: { uColor: { value: new Color(color) }, uI: { value: 0 }, uStreak: { value: streak } },
  }), [color, streak])
  useFrame(({ camera }) => {
    const m = ref.current
    if (!m) return
    m.position.copy(at)
    m.quaternion.copy(camera.quaternion)
    m.scale.setScalar(size)
    mat.uniforms.uI.value = intensity()
  })
  return <mesh ref={ref} geometry={geo} material={mat} frustumCulled={false} renderOrder={6} />
}
