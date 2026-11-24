import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { AdditiveBlending, CylinderGeometry, DoubleSide, ShaderMaterial, Vector3 } from 'three'
import { NOISE } from '../glsl'
import { rig } from '../rig'
import { E } from '../state'

const vert = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform float uR0; uniform float uR1;
varying float vT; varying vec3 vN; varying vec3 vW; varying float vAng;
void main() {
  float t = position.y + 0.5;
  vec3 dir = uB - uA;
  float len = length(dir);
  vec3 ax = dir / len;
  vec3 up = abs(ax.y) > 0.95 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 U = normalize(cross(ax, up));
  vec3 V = cross(U, ax);
  float r = mix(uR0, uR1, t);
  vec3 radial = position.x * U + position.z * V;
  vec3 w = uA + ax * len * t + radial * r;
  vT = t; vN = radial; vW = w; vAng = atan(position.z, position.x);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`

const frag = /* glsl */ `
${NOISE}
uniform float uTime; uniform float uI; uniform vec3 uColor; uniform float uCore; uniform float uLen;
varying float vT; varying vec3 vN; varying vec3 vW; varying float vAng;
void main() {
  vec3 V = normalize(cameraPosition - vW);
  float f = abs(dot(normalize(vN), V));        // 1 = looking through the centre of the cone
  float dens = exp(-pow(1.0 - f, 2.0) * uCore); // gaussian radial density
  float along = vT * uLen;
  float n = v4fbm(vec3(along * 1.4 - uTime * 0.06 * 6.0, vAng * 1.3, uTime * 0.05));
  float n2 = v4fbm(vec3(along * 3.1 - uTime * 0.36, vAng * 2.7 + 4.0, 1.7));
  float streak = 0.55 + 0.6 * n * n2 * 1.6;
  float ends = smoothstep(0.0, 0.035, vT) * (1.0 - 0.45 * smoothstep(0.55, 1.0, vT)) * smoothstep(1.0, 0.94, vT);
  float a = dens * streak * ends * uI;
  gl_FragColor = vec4(uColor * a, 1.0);
}`

function makeMat(core: number, color: string, scale: number) {
  return new ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    uniforms: {
      uA: { value: new Vector3() }, uB: { value: new Vector3() },
      uR0: { value: 0.07 }, uR1: { value: 0.34 },
      uTime: { value: 0 }, uI: { value: 0 }, uCore: { value: core }, uLen: { value: 10 },
      uColor: { value: new Vector3(...hexLin(color)).multiplyScalar(scale) },
    },
  })
}

function hexLin(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  const f = (v: number) => Math.pow(v / 255, 2.2)
  return [f((n >> 16) & 255), f((n >> 8) & 255), f(n & 255)]
}

/** Volumetric projector beam: wide soft halo + narrow hot core, both a cone with radial gaussian + flowing fbm. */
export default function Beam() {
  const geo = useMemo(() => new CylinderGeometry(1, 1, 1, 48, 1, true), [])
  const halo = useMemo(() => makeMat(2.2, '#E6ECFF', 0.16), [])
  const core = useMemo(() => makeMat(9.0, '#FFFFFF', 0.34), [])

  useFrame(() => {
    const len = rig.projector.distanceTo(rig.beamEnd)
    const shrink = 1 - 0.7 * rig.fold
    for (const [m, rs] of [[halo, 1], [core, 0.45]] as const) {
      const u = m.uniforms
      u.uA.value.copy(rig.projector)
      u.uB.value.copy(rig.beamEnd)
      u.uR0.value = rig.beamR0 * rs
      u.uR1.value = rig.beamR1 * rs * shrink
      u.uTime.value = E.time
      u.uLen.value = len
      u.uI.value = rig.beamIntensity * rig.dim
    }
  })

  return (
    <group>
      <mesh geometry={geo} material={halo} frustumCulled={false} renderOrder={2} />
      <mesh geometry={geo} material={core} frustumCulled={false} renderOrder={3} />
    </group>
  )
}

export { hexLin }
