import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export type IridescentShape = 'crystal' | 'lens' | 'reel' | 'play'

const V = (x: number, y: number) => new THREE.Vector2(x, y)

/** Scale & centre so the bounding sphere has radius `r`. */
function normalize(g: THREE.BufferGeometry, r = 1.15) {
  g.computeBoundingBox()
  const c = new THREE.Vector3()
  g.boundingBox!.getCenter(c)
  g.translate(-c.x, -c.y, -c.z)
  g.computeBoundingSphere()
  const s = r / g.boundingSphere!.radius
  g.scale(s, s, s)
  g.computeBoundingSphere()
  return g
}

/** Faceted brilliant-cut gem: pavilion, girdle, crown, table. Flat facets. */
function crystal() {
  const profile = [V(0, -1.15), V(0.98, 0.12), V(1, 0.2), V(0.62, 0.55), V(0, 0.55)]
  const g = new THREE.LatheGeometry(profile, 10).toNonIndexed()
  g.computeVertexNormals()
  g.rotateZ(0.12)
  return normalize(g, 1.1)
}

/** Camera lens: mount, knurled focus ring, barrel, flared hood, recessed domed front element. Axis → camera. */
function lens() {
  const p: THREE.Vector2[] = [V(0, -0.8), V(0.5, -0.8), V(0.52, -0.74), V(0.6, -0.72), V(0.6, -0.5), V(0.68, -0.48)]
  // knurled focus ring
  for (let i = 0; i <= 12; i++) p.push(V(i % 2 ? 0.7 : 0.72, -0.46 + i * 0.04))
  p.push(V(0.68, 0.04), V(0.64, 0.08), V(0.64, 0.3), V(0.67, 0.32), V(0.8, 0.5), V(0.82, 0.56), V(0.74, 0.58), V(0.66, 0.52), V(0.6, 0.46))
  // front glass dome
  for (let i = 1; i <= 8; i++) {
    const t = i / 8, r = 0.6 * (1 - t)
    p.push(V(Math.max(0, r), 0.46 + 0.14 * Math.sin((t * Math.PI) / 2)))
  }
  const g = new THREE.LatheGeometry(p, 72)
  g.computeVertexNormals()
  g.rotateX(Math.PI / 2)
  return normalize(g, 1.12)
}

/** Film reel: two flanges with six windows and a hub hole, wound film and hub between them. */
function reel() {
  const flange = new THREE.Shape()
  flange.absarc(0, 0, 1, 0, Math.PI * 2, false)
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI * 2) / 6 + 0.52, h = new THREE.Path()
    h.absarc(Math.cos(a) * 0.58, Math.sin(a) * 0.58, 0.22, 0, Math.PI * 2, true)
    flange.holes.push(h)
  }
  const hub = new THREE.Path()
  hub.absarc(0, 0, 0.09, 0, Math.PI * 2, true)
  flange.holes.push(hub)
  const opts = { depth: 0.06, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 40 }
  const f1 = new THREE.ExtrudeGeometry(flange, opts)
  f1.translate(0, 0, 0.16)
  const f2 = new THREE.ExtrudeGeometry(flange, opts)
  f2.translate(0, 0, -0.16 - 0.06)
  const wound = new THREE.CylinderGeometry(0.56, 0.56, 0.3, 64, 1, false).toNonIndexed()
  wound.rotateX(Math.PI / 2)
  const core = new THREE.CylinderGeometry(0.2, 0.2, 0.44, 32, 1, true).toNonIndexed()
  core.rotateX(Math.PI / 2)
  const g = mergeGeometries([f1, f2, wound, core])!
  g.computeVertexNormals()
  g.rotateY(-0.45)
  g.rotateX(0.18)
  return normalize(g, 1.12)
}

/** Rounded play triangle, thick and bevelled. */
function play() {
  const R = 1, rr = 0.2, pts = [0, 1, 2].map((k) => V(Math.cos((k * Math.PI * 2) / 3) * R, Math.sin((k * Math.PI * 2) / 3) * R))
  const s = new THREE.Shape()
  for (let i = 0; i < 3; i++) {
    const p = pts[i], prev = pts[(i + 2) % 3], next = pts[(i + 1) % 3]
    const a = p.clone().lerp(prev, rr), b = p.clone().lerp(next, rr)
    if (i === 0) s.moveTo(a.x, a.y)
    else s.lineTo(a.x, a.y)
    s.quadraticCurveTo(p.x, p.y, b.x, b.y)
  }
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 8, curveSegments: 24 })
  g.computeVertexNormals()
  return normalize(g, 1.05)
}

const BUILD: Record<IridescentShape, () => THREE.BufferGeometry> = { crystal, lens, reel, play }

export function buildShape(shape: IridescentShape) {
  return BUILD[shape]()
}
