import { PerspectiveCamera, Vector3 } from 'three'
import { dom, type VRect } from './dom'

const _v = new Vector3()
const _f = new Vector3()

/** Depth (from the camera) at which DOM-anchored screens live. */
export const SCREEN_DEPTH = 7.5

/**
 * Place a DOM rect on a camera-facing plane at `depth`. Writes world centre into `pos`
 * and returns world size [w, h]. Orientation = camera.quaternion.
 */
export function rectToWorld(r: VRect, depth: number, cam: PerspectiveCamera, pos: Vector3): [number, number] {
  return pxToWorld(r.x + r.w / 2, r.y + r.h / 2, depth, cam, pos, r.w, r.h)
}

export function pxToWorld(px: number, py: number, depth: number, cam: PerspectiveCamera, pos: Vector3, wpx = 0, hpx = 0): [number, number] {
  const vw = dom.vw, vh = dom.vh
  const nx = (px / vw) * 2 - 1
  const ny = 1 - (py / vh) * 2
  const halfH = Math.tan((cam.fov * Math.PI) / 360) * depth
  const halfW = halfH * cam.aspect
  // camera basis
  _f.set(0, 0, -1).applyQuaternion(cam.quaternion)
  pos.copy(cam.position).addScaledVector(_f, depth)
  _v.set(1, 0, 0).applyQuaternion(cam.quaternion)
  pos.addScaledVector(_v, nx * halfW)
  _v.set(0, 1, 0).applyQuaternion(cam.quaternion)
  pos.addScaledVector(_v, ny * halfH)
  const unit = (2 * halfH) / vh
  return [wpx * unit, hpx * unit]
}

/** World units per CSS px at `depth`. */
export function unitAt(depth: number, cam: PerspectiveCamera) {
  return (2 * Math.tan((cam.fov * Math.PI) / 360) * depth) / dom.vh
}
