import { ExtrudeGeometry, Shape, Vector2 } from 'three'

/** Rounded equilateral triangle. `rot` = angle of the first vertex (PI/2 = pointing up, 0 = pointing right / play). */
export function roundedTriangle(R: number, corner: number, rot = Math.PI / 2): Shape {
  const pts: Vector2[] = []
  for (let i = 0; i < 3; i++) {
    const a = rot + (i * Math.PI * 2) / 3
    pts.push(new Vector2(Math.cos(a) * R, Math.sin(a) * R))
  }
  const s = new Shape()
  for (let i = 0; i < 3; i++) {
    const p = pts[i], prev = pts[(i + 2) % 3], next = pts[(i + 1) % 3]
    const a = p.clone().add(prev.clone().sub(p).normalize().multiplyScalar(corner))
    const b = p.clone().add(next.clone().sub(p).normalize().multiplyScalar(corner))
    if (i === 0) s.moveTo(a.x, a.y)
    else s.lineTo(a.x, a.y)
    s.quadraticCurveTo(p.x, p.y, b.x, b.y)
  }
  s.closePath()
  return s
}

export function extrudeTriangle(R: number, corner: number, depth: number, bevel: number, rot = Math.PI / 2) {
  const g = new ExtrudeGeometry(roundedTriangle(R, corner, rot), {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 10,
  })
  g.center()
  g.computeVertexNormals()
  return g
}
