import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { AdditiveBlending, DoubleSide, PlaneGeometry, ShaderMaterial, Vector3 } from 'three'
import { NOISE, SPECTRUM } from '../glsl'
import { rig } from '../rig'
import { E } from '../state'

const vert = /* glsl */ `
uniform vec3 uO; uniform vec3 uT; uniform vec3 uA0; uniform vec3 uAT; uniform float uOpen;
varying vec2 vUv;
void main() {
  vUv = uv;
  float s = uv.x * 2.0 - 1.0;
  float o = uOpen;
  vec3 a = uO + uA0 * s;
  vec3 b = mix(uO, uT, o) + uAT * s * (0.15 + 0.85 * o);
  vec3 w = mix(a, b, uv.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`

const frag = /* glsl */ `
${SPECTRUM}
${NOISE}
uniform float uTime; uniform float uI; uniform float uOpen;
varying vec2 vUv;
void main() {
  float u = vUv.x, v = vUv.y;
  vec3 col = v4spectrum(u);
  // 5 soft bands of light
  float bands = 0.55 + 0.45 * pow(abs(sin(u * 3.14159 * 5.0)), 0.6);
  float edge = smoothstep(0.0, 0.14, u) * smoothstep(1.0, 0.86, u);
  float caustic = v4fbm(vec3(u * 9.0, v * 4.0 - uTime * 0.35, uTime * 0.12));
  caustic = 0.65 + 0.9 * pow(caustic, 2.0);
  float along = smoothstep(0.0, 0.08, v) * (0.55 + 0.45 * v) * smoothstep(1.0, 0.97, v);
  float a = edge * bands * caustic * along * uI * smoothstep(0.0, 0.15, uOpen);
  gl_FragColor = vec4(col * a, 1.0);
}`

/** Spectral fan from the prism to the current target (screen, floor, object). */
export default function Spectrum() {
  const geo = useMemo(() => new PlaneGeometry(1, 1, 16, 24).translate(0.5, 0.5, 0), [])
  const mat = useMemo(() => new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false,
    blending: AdditiveBlending, side: DoubleSide,
    uniforms: {
      uO: { value: new Vector3() }, uT: { value: new Vector3() }, uA0: { value: new Vector3() },
      uAT: { value: new Vector3() }, uOpen: { value: 0 }, uTime: { value: 0 }, uI: { value: 0 },
    },
  }), [])

  useFrame(() => {
    const u = mat.uniforms
    u.uO.value.copy(rig.specOrigin)
    u.uT.value.copy(rig.specTarget)
    u.uAT.value.copy(rig.specAcross)
    u.uA0.value.copy(rig.specAcross).normalize().multiplyScalar(0.07)
    u.uOpen.value = rig.specOpen
    u.uTime.value = E.time
    u.uI.value = 0.95 * rig.specIntensity * rig.dim
  })

  return <mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={4} />
}
