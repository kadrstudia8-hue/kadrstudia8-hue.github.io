import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, PMREMGenerator, Scene } from 'three'

/** Custom PMREM from light strips: white softbox on top + lime / pink / lilac neon bars. Gives chrome and glass neon reflections. */
export default function Env() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    const env = new Scene()
    env.background = new Color('#000000')
    const box = new BoxGeometry(1, 1, 1)
    const strips: [string, number, [number, number, number], [number, number, number]][] = [
      ['#ffffff', 2.2, [0, 6, 0], [10, 0.4, 3]],
      ['#ffffff', 1.2, [0, 2.5, 7], [6, 1.2, 0.2]],
      ['#D7FF1F', 3.0, [-6, 1.2, -1], [0.25, 4.5, 0.25]],
      ['#F58BD0', 3.0, [6, 1.6, 1], [0.25, 4.5, 0.25]],
      ['#B9A6FF', 3.0, [0, 1.0, -7], [8, 0.18, 0.18]],
      ['#7DE3FF', 1.6, [-3, -2, 4], [3, 0.12, 0.12]],
    ]
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
    pm.dispose()
    scene.environment = rt.texture
    scene.environmentIntensity = 1
    box.dispose(); mats.forEach((m) => m.dispose())
    return () => { scene.environment = null; rt.dispose() }
  }, [gl, scene])
  return null
}
