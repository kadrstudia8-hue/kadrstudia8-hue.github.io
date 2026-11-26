import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Color, FrontSide, Group, MeshPhysicalMaterial, ShaderMaterial } from 'three'
import { SPECTRUM } from '../glsl'
import { rig } from '../rig'
import { extrudeTriangle } from '../shapes'
import { E } from '../state'
import Flare from './Flare'

const innerVert = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vL;
void main() {
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz; vL = position;
  gl_Position = projectionMatrix * viewMatrix * w;
}`
const innerFrag = /* glsl */ `
${SPECTRUM}
uniform float uTime; uniform float uI;
varying vec3 vN; varying vec3 vW; varying vec3 vL;
void main() {
  vec3 V = normalize(cameraPosition - vW);
  float fr = pow(1.0 - abs(dot(normalize(vN), V)), 2.0);
  float hue = fract(dot(vN, V) * 1.4 + vL.y * 0.9 + vL.x * 0.6 + uTime * 0.04);
  vec3 c = v4spectrum(hue) * (0.25 + 1.4 * fr);
  float hot = exp(-pow(length(vL.xy - vec2(-0.08, 0.02)) * 4.0, 2.0)) * 1.6; // where the beam enters
  gl_FragColor = vec4((c + vec3(hot)) * uI, 1.0);
}`

/** Glass prism with real dispersion (MeshPhysicalMaterial.dispersion) + inner spectral glow. */
export default function Prism({ tier }: { tier: number }) {
  const g = useRef<Group>(null)
  const geo = useMemo(() => extrudeTriangle(0.5, 0.09, 0.9, 0.035), [])
  const glass = useMemo(() => new MeshPhysicalMaterial({
    color: new Color('#ffffff'),
    metalness: 0, roughness: 0.02,
    transmission: 1, ior: 1.52, thickness: 1.2, dispersion: 4,
    clearcoat: 1, clearcoatRoughness: 0.02,
    envMapIntensity: 1.6, specularIntensity: 1,
    attenuationColor: new Color('#EDEBFF'), attenuationDistance: 3,
  }), [])
  const inner = useMemo(() => new ShaderMaterial({
    vertexShader: innerVert, fragmentShader: innerFrag, transparent: true, depthWrite: false,
    blending: AdditiveBlending, side: FrontSide,
    uniforms: { uTime: { value: 0 }, uI: { value: 0 } },
  }), [])

  useFrame(() => {
    const o = g.current
    if (!o) return
    o.position.copy(rig.prism)
    o.scale.setScalar(rig.prismScale)
    const t = E.time
    const sway = (4 * Math.PI) / 180
    o.rotation.set(Math.sin(t * 0.31) * sway * 0.6, -0.35 + Math.sin(t * 0.23) * sway, rig.prismRotY)
    inner.uniforms.uTime.value = t
    inner.uniforms.uI.value = (0.22 + 0.5 * rig.beamIntensity) * rig.dim * (1 - rig.fold)
  })

  return (
    <group>
      <group ref={g}>
        <mesh geometry={geo} material={glass} renderOrder={1} />
        <mesh geometry={geo} material={inner} scale={1.006} renderOrder={2} />
      </group>
      <Flare at={rig.prism} size={tier >= 3 ? 1.5 : 1.2} color="#F4F6FF" streak={0.9}
        intensity={() => 0.5 * rig.beamIntensity * rig.dim * (1 - rig.fold)} />
    </group>
  )
}
