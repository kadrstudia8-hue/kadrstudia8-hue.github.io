import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, BackSide, Color, FrontSide, Group, MeshPhysicalMaterial, ShaderMaterial } from 'three'
import { SPECTRUM } from '../glsl'
import { rig } from '../rig'
import { extrudeTriangle } from '../shapes'
import { E } from '../state'
import { buildStripEnv, NEON_STRIPS } from './Env'
import Flare from './Flare'

/**
 * Fake glass (no transmission pass: on a black room transmission only shows black).
 * Layers: dark glossy body with neon env reflections, an additive shell whose light lives on the
 * grazing angles and bevelled edges (bright white kernel + spectral split), and a faint inner spectral
 * caustic on the back faces. Reads like v4-prism-macro: dark faces, bright edges, dispersion.
 */
const vert = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vL;
void main() {
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz; vL = position;
  gl_Position = projectionMatrix * viewMatrix * w;
}`

const edgeFrag = /* glsl */ `
${SPECTRUM}
uniform float uTime; uniform float uI;
varying vec3 vN; varying vec3 vW; varying vec3 vL;
void main() {
  vec3 V = normalize(cameraPosition - vW);
  float ndv = abs(dot(normalize(vN), V));
  float fr = pow(1.0 - ndv, 4.0);                     // only grazing angles: edges and bevels
  // dispersion: split the edge light into the spectrum by angle and position
  float hue = fract(0.55 + (1.0 - ndv) * 0.9 + vL.y * 0.6 + vL.x * 0.35);
  vec3 spec = v4spectrum(hue);
  vec3 c = mix(vec3(1.0), spec, smoothstep(0.15, 0.7, fr)) * fr * 2.2;
  // hot entry point of the beam on the left face, small
  float hot = exp(-pow(length(vL.xy - vec2(-0.18, 0.0)) * 7.0, 2.0)) * 0.9;
  gl_FragColor = vec4((c + vec3(hot)) * uI, 1.0);
}`

const innerFrag = /* glsl */ `
${SPECTRUM}
uniform float uTime; uniform float uI;
varying vec3 vN; varying vec3 vW; varying vec3 vL;
void main() {
  vec3 V = normalize(cameraPosition - vW);
  float ndv = abs(dot(normalize(vN), V));
  // spectral fan inside the glass, leaving through the right face
  float band = smoothstep(-0.05, 0.3, vL.x) * smoothstep(0.45, 0.1, abs(vL.y + vL.x * 0.4));
  vec3 c = v4spectrum(fract(vL.y * 1.3 + 0.5)) * band * 0.35 + vec3(0.6, 0.65, 0.8) * pow(1.0 - ndv, 3.0) * 0.12;
  gl_FragColor = vec4(c * uI, 1.0);
}`

export default function Prism({ tier }: { tier: number }) {
  const g = useRef<Group>(null)
  const gl = useThree((s) => s.gl)
  const geo = useMemo(() => extrudeTriangle(0.5, 0.06, 0.9, 0.045), [])
  const env = useMemo(() => buildStripEnv(gl, NEON_STRIPS), [gl])
  useEffect(() => () => env.rt.dispose(), [env])
  const body = useMemo(() => new MeshPhysicalMaterial({
    color: new Color('#0b0b10'), metalness: 0, roughness: 0.03,
    clearcoat: 1, clearcoatRoughness: 0.02, envMap: env.texture, envMapIntensity: 2.2,
    transparent: true, opacity: 0.62, depthWrite: false, iridescence: 0.25, iridescenceIOR: 1.5,
  }), [env])
  const mk = (frag: string, side: typeof FrontSide | typeof BackSide) => new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false,
    blending: AdditiveBlending, side, uniforms: { uTime: { value: 0 }, uI: { value: 0 } },
  })
  const inner = useMemo(() => mk(innerFrag, BackSide), [])
  const edge = useMemo(() => mk(edgeFrag, FrontSide), [])

  useFrame(() => {
    const o = g.current
    if (!o) return
    o.position.copy(rig.prism)
    o.scale.setScalar(rig.prismScale)
    const t = E.time
    const sway = (4 * Math.PI) / 180
    o.rotation.set(Math.sin(t * 0.31) * sway * 0.6, -0.35 + Math.sin(t * 0.23) * sway, rig.prismRotY)
    const k = rig.dim * (1 - rig.fold)
    for (const m of [inner, edge]) m.uniforms.uTime.value = t
    edge.uniforms.uI.value = (0.35 + 0.65 * rig.beamIntensity) * k
    inner.uniforms.uI.value = (0.2 + 0.8 * rig.beamIntensity) * k
  })

  return (
    <group>
      <group ref={g}>
        <mesh geometry={geo} material={inner} renderOrder={1} />
        <mesh geometry={geo} material={body} renderOrder={2} />
        <mesh geometry={geo} material={edge} scale={1.003} renderOrder={3} />
      </group>
      <Flare at={rig.prism} size={tier >= 3 ? 0.7 : 0.6} color="#F4F6FF" streak={0.7}
        intensity={() => 0.22 * rig.beamIntensity * rig.dim * (1 - rig.fold)} />
    </group>
  )
}
