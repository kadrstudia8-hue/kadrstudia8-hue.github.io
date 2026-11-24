import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, PMREMGenerator, Scene, Texture, WebGLRenderer, WebGLRenderTarget } from 'three'

type Strip = [hex: string, k: number, pos: [number, number, number], scale: [number, number, number]]

/** PMREM from emissive light strips on black. */
export function buildStripEnv(gl: WebGLRenderer, strips: Strip[]): { texture: Texture; rt: WebGLRenderTarget } {
  const env = new Scene()
  env.background = new Color('#000000')
  const box = new BoxGeometry(1, 1, 1)
  const mats: MeshBasicMaterial[] = []
  for (const [hex, k, p, s] of strips) {
    const m = new MeshBasicMaterial({ color: new Color(hex).multiplyScalar(k) })
    mats.push(m)
    const mesh = new Mesh(box, m)
    mesh.position.set(...p); mesh.scale.set(...s)
    env.add(mesh)
  }
  const pm = new PMREMGenerator(gl)
  const rt = pm.fromScene(env, 0.035)
  pm.dispose(); box.dispose(); mats.forEach((m) => m.dispose())
  return { texture: rt.texture, rt }
}

/** Three neon strips (lime, pink, lilac) + one small key: chrome reads as dark glossy with neon edges. */
export const NEON_STRIPS: Strip[] = [
  ['#D7FF1F', 5.0, [-4, 1.5, 3], [0.3, 6, 0.3]],
  ['#F58BD0', 5.0, [4, 0.5, 3], [0.3, 6, 0.3]],
  ['#B9A6FF', 5.0, [0, 4.5, 2], [7, 0.3, 0.3]],
  ['#ffffff', 2.0, [2.5, 3, 5], [0.6, 0.6, 0.2]],
]

/** Scene environment: white softbox on top + lime / pink / lilac neon bars. */
export default function Env() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    const { texture, rt } = buildStripEnv(gl, [
      ['#ffffff', 2.2, [0, 6, 0], [10, 0.4, 3]],
      ['#ffffff', 1.2, [0, 2.5, 7], [6, 1.2, 0.2]],
      ['#D7FF1F', 3.0, [-6, 1.2, -1], [0.25, 4.5, 0.25]],
      ['#F58BD0', 3.0, [6, 1.6, 1], [0.25, 4.5, 0.25]],
      ['#B9A6FF', 3.0, [0, 1.0, -7], [8, 0.18, 0.18]],
      ['#7DE3FF', 1.6, [-3, -2, 4], [3, 0.12, 0.12]],
    ])
    scene.environment = texture
    scene.environmentIntensity = 1
    return () => { scene.environment = null; rt.dispose() }
  }, [gl, scene])
  return null
}
