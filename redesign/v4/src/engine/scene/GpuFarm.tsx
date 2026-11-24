import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  AdditiveBlending, BoxGeometry, Color, DoubleSide, Group, InstancedBufferAttribute, InstancedMesh, Matrix4,
  MeshBasicMaterial, MeshStandardMaterial, NormalBlending, Object3D, PlaneGeometry, Quaternion, ShaderMaterial, SRGBColorSpace,
  Texture, TorusGeometry, Vector3,
} from 'three'
import { rig } from '../rig'
import { E } from '../state'
import { genUrl, useOptionalTexture } from '../textures'

const COLS = 6, ROWS = 4, N = COLS * ROWS
const LIGHTS = ['#D7FF1F', '#F58BD0', '#B9A6FF']
const SCREEN_POS = new Vector3(0, 3.55, -7.6)

function boardMatrix(i: number, out: Object3D) {
  const c = i % COLS, r = Math.floor(i / COLS)
  out.position.set((c - (COLS - 1) / 2) * 2.0, 0.3 + r * 0.62, -1.2 - r * 1.3)
  out.rotation.set(0.8, 0, 0)
  out.scale.set(1, 1, 1)
  out.updateMatrix()
}

const flowVert = /* glsl */ `
attribute vec3 aColor; attribute float aPhase;
varying vec2 vUv; varying vec3 vC; varying float vPh;
void main() { vUv = uv; vC = aColor; vPh = aPhase;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0); }`

/** Pulses running along the traces from boards to the screen. */
const traceFrag = /* glsl */ `
uniform float uTime; uniform float uSpeed; uniform float uI;
varying vec2 vUv; varying vec3 vC; varying float vPh;
void main() {
  float x = vUv.x;
  float across = 1.0 - abs(vUv.y * 2.0 - 1.0);
  float line = smoothstep(0.0, 0.6, across);
  float ph = fract(x * 2.0 - uTime * uSpeed * 0.9 + vPh);
  float pulse = smoothstep(0.0, 0.02, ph) * pow(1.0 - ph, 10.0) * 3.0;
  float base = 0.05;
  float ends = smoothstep(0.0, 0.04, x) * smoothstep(1.0, 0.9, x);
  gl_FragColor = vec4(vC * (base + pulse) * line * ends * uI, 1.0);
}`

/** Circuit lines on top of each board with light running along them. */
const boardFrag = /* glsl */ `
uniform float uTime; uniform float uSpeed; uniform float uI;
varying vec2 vUv; varying vec3 vC; varying float vPh;
void main() {
  vec2 uv = vUv;
  float rows = 7.0;
  float ry = fract(uv.y * rows);
  float lane = floor(uv.y * rows);
  float line = smoothstep(0.12, 0.0, abs(ry - 0.5));
  float ph = fract(uv.x * 1.3 - uTime * uSpeed * (0.6 + 0.15 * lane) + vPh + lane * 0.21);
  float pulse = smoothstep(0.0, 0.03, ph) * pow(1.0 - ph, 6.0);
  float edge = smoothstep(0.035, 0.0, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
  vec3 c = vC * (line * (0.05 + 1.8 * pulse) + edge * 0.6);
  gl_FragColor = vec4(c * uI, 1.0);
}`

/** Fan blades drawn in a shader (no per-frame matrix updates). */
const fanFrag = /* glsl */ `
uniform float uTime; uniform float uSpeed; uniform float uI;
varying vec2 vUv; varying vec3 vC; varying float vPh;
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  if (r > 1.0) discard;
  float a = atan(p.y, p.x) + uTime * (6.0 + 6.0 * uSpeed) + vPh * 6.28;
  float blades = smoothstep(0.35, 0.95, 0.5 + 0.5 * sin(a * 7.0 + r * 3.0));
  float hub = smoothstep(0.26, 0.22, r);
  vec3 dark = vec3(0.02, 0.02, 0.025);
  vec3 c = mix(dark, dark * 3.0 + vC * 0.06, blades) * smoothstep(1.0, 0.9, r);
  c += hub * vec3(0.05);
  c += vC * smoothstep(0.9, 1.0, r) * 0.6 * uI;
  gl_FragColor = vec4(c, 1.0);
}`

const screenFrag = /* glsl */ `
uniform sampler2D uMap; uniform float uHas; uniform float uTime; uniform float uSpeed; uniform float uI;
varying vec2 vUv;
float h(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
void main() {
  vec2 g = vec2(16.0, 9.0);
  vec2 cell = floor(vUv * g);
  float cyc = fract(uTime * 0.12 * (0.5 + uSpeed));
  float on = step(h(cell), cyc * 1.35);
  vec3 img = uHas > 0.5 ? texture2D(uMap, vUv).rgb : vec3(0.05, 0.05, 0.07);
  vec2 f = fract(vUv * g);
  float grid = smoothstep(0.0, 0.06, min(f.x, f.y)) ;
  float flash = on * (1.0 - smoothstep(0.0, 0.08, cyc * 1.35 - h(cell))) ;
  vec3 c = img * on * mix(0.75, 1.0, grid) + vec3(0.85, 1.0, 0.3) * flash * 0.8;
  c += vec3(0.02, 0.02, 0.03) * (1.0 - on);
  float rim = smoothstep(0.012, 0.0, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  c += vec3(0.75, 0.65, 1.0) * rim;
  gl_FragColor = vec4(c * uI, 1.0);
}`
const plainVert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

const plateFrag = /* glsl */ `
uniform sampler2D uMap; uniform float uI; varying vec2 vUv;
void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  float v = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.7, vUv.y) * smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
  gl_FragColor = vec4(c * v * uI, 1.0);
}`

const BASE = import.meta.env.BASE_URL

/** Cloud section: render farm of 6x4 GPU boards with light pulses running to one screen. */
export default function GpuFarm() {
  const group = useRef<Group>(null)
  const refs = {
    body: useRef<InstancedMesh>(null), shroud: useRef<InstancedMesh>(null), rad: useRef<InstancedMesh>(null),
    ring: useRef<InstancedMesh>(null), fan: useRef<InstancedMesh>(null), top: useRef<InstancedMesh>(null),
    trace: useRef<InstancedMesh>(null),
  }
  const plate = useOptionalTexture(genUrl('v4-gpu-farm.webp'))
  const shot = useOptionalTexture(`${BASE}media/film.jpg`)

  const g = useMemo(() => ({
    body: new BoxGeometry(1.7, 0.08, 0.86),
    shroud: new BoxGeometry(1.56, 0.12, 0.7),
    rad: new BoxGeometry(1.5, 0.1, 0.1),
    ring: new TorusGeometry(0.2, 0.014, 8, 40),
    disc: new PlaneGeometry(0.4, 0.4),
    plane: new PlaneGeometry(1, 1),
    trace: new PlaneGeometry(1, 1),
  }), [])

  const flowAttrs = (count: number, per: (i: number) => [Color, number]) => {
    const col = new Float32Array(count * 3), ph = new Float32Array(count)
    for (let i = 0; i < count; i++) { const [c, p] = per(i); col.set([c.r, c.g, c.b], i * 3); ph[i] = p }
    return { col: new InstancedBufferAttribute(col, 3), ph: new InstancedBufferAttribute(ph, 1) }
  }

  const m = useMemo(() => {
    const mk = (frag: string, add = true) => new ShaderMaterial({
      vertexShader: flowVert, fragmentShader: frag, transparent: add, depthWrite: !add,
      blending: add ? AdditiveBlending : NormalBlending, side: DoubleSide,
      uniforms: { uTime: { value: 0 }, uSpeed: { value: 0.4 }, uI: { value: 1 } },
    })
    return {
      body: new MeshStandardMaterial({ color: '#17171c', metalness: 1, roughness: 0.28 }),
      shroud: new MeshStandardMaterial({ color: '#0c0c10', metalness: 0.85, roughness: 0.34 }),
      rad: new MeshStandardMaterial({ color: '#9a9aa6', metalness: 1, roughness: 0.22 }),
      ring: new MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
      fan: mk(fanFrag, false),
      top: mk(boardFrag),
      trace: mk(traceFrag),
      screen: new ShaderMaterial({
        vertexShader: plainVert, fragmentShader: screenFrag,
        uniforms: { uMap: { value: null as Texture | null }, uHas: { value: 0 }, uTime: { value: 0 }, uSpeed: { value: 0.4 }, uI: { value: 1 } },
      }),
      plate: new ShaderMaterial({
        vertexShader: plainVert, fragmentShader: plateFrag, transparent: true, depthWrite: false, blending: AdditiveBlending,
        uniforms: { uMap: { value: null as Texture | null }, uI: { value: 0 } },
      }),
    }
  }, [])

  useLayoutEffect(() => {
    const o = new Object3D(), child = new Object3D(), mtx = new Matrix4()
    const setAll = (mesh: InstancedMesh | null, count: number, fn: (i: number, base: Matrix4) => void) => {
      if (!mesh) return
      for (let i = 0; i < count; i++) { fn(i, mtx); mesh.setMatrixAt(i, mtx) }
      mesh.instanceMatrix.needsUpdate = true
    }
    const local = (i: number, x: number, y: number, z: number, rx: number, sx = 1, sy = 1, out = mtx) => {
      boardMatrix(i, o)
      child.position.set(x, y, z); child.rotation.set(rx, 0, 0); child.scale.set(sx, sy, 1); child.updateMatrix()
      out.multiplyMatrices(o.matrix, child.matrix)
    }
    setAll(refs.body.current, N, (i, out) => { boardMatrix(i, o); out.copy(o.matrix) })
    setAll(refs.shroud.current, N, (i) => local(i, 0, 0.1, 0.02, 0))
    setAll(refs.rad.current, N, (i) => local(i, 0, 0.1, -0.43, 0))
    setAll(refs.ring.current, N * 2, (i) => local(i >> 1, (i & 1 ? 0.38 : -0.38), 0.165, 0.02, -Math.PI / 2))
    setAll(refs.fan.current, N * 2, (i) => local(i >> 1, (i & 1 ? 0.38 : -0.38), 0.162, 0.02, -Math.PI / 2))
    setAll(refs.top.current, N, (i) => local(i, 0, 0.042, 0, -Math.PI / 2, 1.72, 0.88))

    const colors = LIGHTS.map((h) => new Color(h))
    const ring = refs.ring.current
    if (ring) for (let i = 0; i < N * 2; i++) ring.setColorAt(i, colors[(i >> 1) % 3].clone().multiplyScalar(1.6))
    if (ring?.instanceColor) ring.instanceColor.needsUpdate = true
    for (const [mesh, count, per] of [
      [refs.fan.current, N * 2, (i: number) => [colors[(i >> 1) % 3], Math.random()]],
      [refs.top.current, N, (i: number) => [colors[i % 3], i * 0.137]],
      [refs.trace.current, N, (i: number) => [colors[i % 3], (i * 0.29) % 1]],
    ] as const) {
      if (!mesh) continue
      const a = flowAttrs(count, per as (i: number) => [Color, number])
      mesh.geometry = mesh.geometry.clone()
      mesh.geometry.setAttribute('aColor', a.col)
      mesh.geometry.setAttribute('aPhase', a.ph)
    }

    // traces: from each board to the screen
    const trace = refs.trace.current
    if (trace) {
      const a = new Vector3(), dir = new Vector3(), side = new Vector3(), nrm = new Vector3(), toCam = new Vector3(0, 0.5, 1).normalize()
      const basis = new Matrix4(), q = new Quaternion(), s = new Vector3()
      for (let i = 0; i < N; i++) {
        boardMatrix(i, o)
        a.set(0, 0.06, -0.45).applyMatrix4(o.matrix)
        const b = SCREEN_POS.clone().add(new Vector3(((i % COLS) - 2.5) * 0.45, -1.0 + Math.floor(i / COLS) * 0.12, 0))
        dir.copy(b).sub(a)
        const len = dir.length(); dir.normalize()
        side.crossVectors(dir, toCam).normalize()
        nrm.crossVectors(dir, side).normalize()
        basis.makeBasis(dir, side, nrm)
        q.setFromRotationMatrix(basis)
        s.set(len, 0.035, 1)
        mtx.compose(a.clone().addScaledVector(dir, len / 2), q, s)
        trace.setMatrixAt(i, mtx)
      }
      trace.instanceMatrix.needsUpdate = true
    }
  }, [])

  useFrame(() => {
    const grp = group.current
    if (!grp) return
    const f = rig.farm
    grp.visible = f > 0.01
    if (!grp.visible) return
    grp.position.y = -1.6 * (1 - f) * (1 - f)
    const t = E.time
    for (const mat of [m.fan, m.top, m.trace]) {
      mat.uniforms.uTime.value = t
      mat.uniforms.uSpeed.value = rig.farmSpeed
      mat.uniforms.uI.value = f
    }
    m.ring.color.setScalar(0.4 + 0.6 * f)
    m.screen.uniforms.uTime.value = t
    m.screen.uniforms.uSpeed.value = rig.farmSpeed
    m.screen.uniforms.uI.value = f
    if (shot) { m.screen.uniforms.uMap.value = shot; m.screen.uniforms.uHas.value = 1 }
    if (plate) { m.plate.uniforms.uMap.value = plate; m.plate.uniforms.uI.value = 0.28 * f }
  })

  return (
    <group ref={group} visible={false}>
      <instancedMesh ref={refs.body} args={[g.body, m.body, N]} />
      <instancedMesh ref={refs.shroud} args={[g.shroud, m.shroud, N]} />
      <instancedMesh ref={refs.rad} args={[g.rad, m.rad, N]} />
      <instancedMesh ref={refs.ring} args={[g.ring, m.ring, N * 2]} />
      <instancedMesh ref={refs.fan} args={[g.disc, m.fan, N * 2]} />
      <instancedMesh ref={refs.top} args={[g.plane, m.top, N]} frustumCulled={false} />
      <instancedMesh ref={refs.trace} args={[g.trace, m.trace, N]} frustumCulled={false} />
      <mesh geometry={g.plane} material={m.screen} position={SCREEN_POS} scale={[3.6, 2.025, 1]} />
      {plate && <mesh geometry={g.plane} material={m.plate} position={[0, 2.6, -10]} scale={[18, 10.1, 1]} />}
    </group>
  )
}
