import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial, Vector3 } from 'three'
import { SPECTRUM } from '../glsl'
import { rig } from '../rig'
import { E } from '../state'

const vert = /* glsl */ `
${SPECTRUM}
uniform vec3 uA; uniform vec3 uB; uniform float uR0; uniform float uR1;
uniform vec3 uO; uniform vec3 uT; uniform vec3 uAT; uniform float uOpen;
uniform vec3 uPO; uniform vec3 uPD; uniform float uPOn;
uniform float uTime; uniform float uPx; uniform float uI; uniform float uFanI; uniform float uAmbI;
attribute vec4 aP;     // t, angle, radius, seed
attribute float aKind; // 0 beam, 1 spectrum fan, 2 room
varying vec3 vCol; varying float vA;
void main() {
  vec3 dir = uB - uA; float len = max(length(dir), 0.001); vec3 ax = dir / len;
  vec3 up = abs(ax.y) > 0.95 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 U = normalize(cross(ax, up)); vec3 V = cross(U, ax);
  float seed = aP.w;
  float t = fract(aP.x + uTime * 0.02 / len * (0.6 + seed));
  vec3 p; vec3 col = vec3(1.0); float a = 0.0;
  vec3 wob = 0.04 * vec3(sin(uTime * 0.3 + seed * 50.0), sin(uTime * 0.23 + seed * 31.0), cos(uTime * 0.27 + seed * 17.0));
  if (aKind < 0.5) {
    float ang = aP.y + uTime * 0.05 * (seed - 0.5);
    float r = aP.z * mix(uR0, uR1, t) * 1.15;
    p = uA + ax * len * t + (cos(ang) * U + sin(ang) * V) * r + wob;
    a = uI * smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.9, t);
    col = mix(vec3(1.0), vec3(0.85, 0.9, 1.0), seed);
  } else if (aKind < 1.5) {
    float s = aP.z * 2.0 - 1.0;
    vec3 b = mix(uO, uT, uOpen) + uAT * s * (0.15 + 0.85 * uOpen);
    vec3 a0 = uO + normalize(uAT + 1e-4) * 0.07 * s;
    p = mix(a0, b, t) + wob * 2.0;
    a = uFanI * smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.85, t) * smoothstep(0.05, 0.3, uOpen);
    col = v4spectrum(aP.z) * 1.6;
  } else {
    p = vec3(-7.0 + aP.x * 14.0, 0.1 + aP.z * 4.2, -5.0 + fract(aP.y * 0.159) * 10.0);
    p += vec3(sin(uTime * 0.05 + seed * 9.0), sin(uTime * 0.04 + seed * 13.0) * 0.5, cos(uTime * 0.03 + seed * 7.0)) * 0.6;
    a = uAmbI;
    col = vec3(0.9, 0.9, 1.0);
  }
  // cursor pushes dust away from its ray (radius 0.6)
  vec3 d = p - uPO; float pr = max(dot(d, uPD), 0.0); vec3 off = p - (uPO + uPD * pr);
  float dist = length(off);
  p += (off / max(dist, 1e-3)) * max(0.6 - dist, 0.0) * 0.9 * uPOn;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depthSize = clamp(9.0 / -mv.z, 0.4, 1.6);
  gl_PointSize = clamp((1.0 + 2.0 * seed) * depthSize, 1.0, 3.0) * uPx;
  float tw = 0.45 + 0.55 * sin(uTime * (0.8 + seed * 2.6) + seed * 40.0);
  vA = a * tw; vCol = col;
}`

const frag = /* glsl */ `
varying vec3 vCol; varying float vA;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float m = smoothstep(0.5, 0.0, length(c));
  if (vA * m < 0.002) discard;
  gl_FragColor = vec4(vCol * vA * m, 1.0);
}`

export default function Dust({ count }: { count: number }) {
  const dpr = useThree((s) => s.viewport.dpr)
  const geo = useMemo(() => {
    const nFan = Math.round(count * 0.17)
    const nRoom = Math.round(count * 0.12)
    const nBeam = count - nFan - nRoom
    const p = new Float32Array(count * 4)
    const k = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      p[i * 4] = Math.random()
      p[i * 4 + 1] = Math.random() * Math.PI * 2
      p[i * 4 + 2] = i < nBeam ? Math.sqrt(Math.random()) : Math.random()
      p[i * 4 + 3] = Math.random()
      k[i] = i < nBeam ? 0 : i < nBeam + nFan ? 1 : 2
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('aP', new BufferAttribute(p, 4))
    g.setAttribute('aKind', new BufferAttribute(k, 1))
    return g
  }, [count])
  const mat = useMemo(() => new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: {
      uA: { value: new Vector3() }, uB: { value: new Vector3() }, uR0: { value: 0.07 }, uR1: { value: 0.34 },
      uO: { value: new Vector3() }, uT: { value: new Vector3() }, uAT: { value: new Vector3() }, uOpen: { value: 0 },
      uPO: { value: new Vector3() }, uPD: { value: new Vector3() }, uPOn: { value: 0 },
      uTime: { value: 0 }, uPx: { value: 1 }, uI: { value: 0 }, uFanI: { value: 0 }, uAmbI: { value: 0 },
    },
  }), [])

  useFrame(() => {
    const u = mat.uniforms
    u.uA.value.copy(rig.projector); u.uB.value.copy(rig.beamEnd)
    u.uR0.value = rig.beamR0; u.uR1.value = rig.beamR1 * (1 - 0.7 * rig.fold)
    u.uO.value.copy(rig.specOrigin); u.uT.value.copy(rig.specTarget); u.uAT.value.copy(rig.specAcross)
    u.uOpen.value = rig.specOpen
    u.uPO.value.copy(rig.cursorRayO); u.uPD.value.copy(rig.cursorRayD); u.uPOn.value = rig.cursorOn
    u.uTime.value = E.time
    u.uPx.value = dpr
    u.uI.value = 0.9 * Math.max(rig.beamIntensity, 0.25) * rig.dim
    u.uFanI.value = 0.8 * rig.specIntensity * rig.dim
    u.uAmbI.value = (0.12 + 0.18 * rig.quiet) * rig.dim
  })

  return <points geometry={geo} material={mat} frustumCulled={false} renderOrder={5} />
}
