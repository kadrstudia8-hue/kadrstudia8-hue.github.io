import { MeshReflectorMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Mesh, PlaneGeometry, ShaderMaterial, Texture, Vector3 } from 'three'
import { NOISE, SPECTRUM } from '../glsl'
import { rig } from '../rig'
import { E } from '../state'

/** Soft spectral pool of light on the floor, always in front of the camera: no section transition goes black. */
const poolFrag = /* glsl */ `
${SPECTRUM}
${NOISE}
uniform float uI; uniform float uTime; varying vec2 vUv;
void main() {
  vec2 p = vUv - 0.5;
  float r = length(p * vec2(1.0, 1.8));
  float fall = exp(-r * r * 14.0);
  float caustic = 0.75 + 0.5 * v4fbm(vec3(p * 9.0, uTime * 0.08));
  vec3 c = mix(vec3(0.75, 0.72, 0.85), v4spectrum(fract(vUv.x * 0.9 + 0.05)), 0.65);
  gl_FragColor = vec4(c * fall * caustic * uI, 1.0);
}`
const fwd = new Vector3()
import { genUrl, useOptionalTexture } from '../textures'

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const frag = /* glsl */ `
uniform sampler2D uMap; uniform float uI; varying vec2 vUv;
void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  float v = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.75, vUv.y) * smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
  gl_FragColor = vec4(c * c * v * uI, 1.0);
}`

/** Black glossy floor (MeshReflectorMaterial) with a soft reflection + optional generated room plate far behind (additive, dim). */
export default function Floor({ tier }: { tier: number }) {
  const room = useOptionalTexture(genUrl('v4-room.webp'))
  const plate = useMemo(() => new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uMap: { value: null as Texture | null }, uI: { value: 0 } },
  }), [])
  const geo = useMemo(() => new PlaneGeometry(1, 1), [])
  const pool = useRef<Mesh>(null)
  const poolMat = useMemo(() => new ShaderMaterial({
    vertexShader: vert, fragmentShader: poolFrag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uI: { value: 0 }, uTime: { value: 0 } },
  }), [])
  useFrame(({ camera }) => {
    const m = pool.current
    if (m) {
      fwd.set(0, 0, -1).applyQuaternion(camera.quaternion).setY(0).normalize()
      m.position.set(camera.position.x + fwd.x * 6.5, 0.012, camera.position.z + fwd.z * 6.5)
      m.rotation.set(-Math.PI / 2, 0, Math.atan2(fwd.x, -fwd.z) * -1)
      poolMat.uniforms.uTime.value = E.time
      poolMat.uniforms.uI.value = 0.16 * rig.dim * (1 - rig.fold) * (1 - 0.7 * rig.farm)
    }
    plate.uniforms.uMap.value = room
    plate.uniforms.uI.value = 0.22 * rig.dim * (1 - 0.8 * rig.farm) * (1 - rig.fold * 0.7)
  })
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]}>
        <planeGeometry args={[60, 40]} />
        <MeshReflectorMaterial
          resolution={tier >= 3 ? 512 : 256}
          blur={[300, 80]}
          mixBlur={1}
          mixStrength={0.6}
          roughness={0.7}
          metalness={0.6}
          depthScale={0.6}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.4}
          mirror={0.6}
          color="#050507"
          envMapIntensity={0.12}
        />
      </mesh>
      <mesh ref={pool} geometry={geo} material={poolMat} scale={[11, 7, 1]} frustumCulled={false} renderOrder={1} />
      {room && <mesh geometry={geo} material={plate} position={[0, 4.5, -16]} scale={[34, 19, 1]} />}
    </>
  )
}
