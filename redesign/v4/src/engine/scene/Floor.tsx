import { MeshReflectorMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { AdditiveBlending, PlaneGeometry, ShaderMaterial, Texture } from 'three'
import { rig } from '../rig'
import { useOptionalTexture } from '../textures'

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const frag = /* glsl */ `
uniform sampler2D uMap; uniform float uI; varying vec2 vUv;
void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  float v = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.75, vUv.y) * smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
  gl_FragColor = vec4(c * c * v * uI, 1.0);
}`

/** Black glossy floor with a soft reflection + optional generated room plate far behind (additive, dim). */
export default function Floor({ tier }: { tier: number }) {
  const room = useOptionalTexture(`${import.meta.env.BASE_URL}gen/v4-room.webp`)
  const plate = useMemo(() => new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uMap: { value: null as Texture | null }, uI: { value: 0 } },
  }), [])
  const geo = useMemo(() => new PlaneGeometry(1, 1), [])
  useFrame(() => {
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
        />
      </mesh>
      {room && <mesh geometry={geo} material={plate} position={[0, 4.5, -16]} scale={[34, 19, 1]} />}
    </>
  )
}
