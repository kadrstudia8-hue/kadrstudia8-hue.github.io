/* Point clouds for FilmParticles, ported 1:1 from legacy-prototype-html/scene.js.
   Every shape is the same N particles, unit-ish radius, orientation baked in. No three.js import. */

export type FilmShape = 'reel' | 'frame' | 'film' | 'play' | 'dust'
type Vec = [number, number, number]
type Part = [weight: number, gen: (r: () => number, P: Vec) => void]

const TAU = Math.PI * 2

export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
/** soft jitter, roughly gaussian */
const g3 = (r: () => number) => r() + r() + r() - 1.5

/** rotation Ry(yaw)·Rx(pitch)·Rz(roll), column-major */
function rot(yaw: number, pitch: number, roll: number) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch), cz = Math.cos(roll), sz = Math.sin(roll)
  const m = new Float32Array(9)
  m[0] = cy * cz + sy * sx * sz; m[3] = -cy * sz + sy * sx * cz; m[6] = sy * cx
  m[1] = cx * sz; m[4] = cx * cz; m[7] = -sx
  m[2] = -sy * cz + cy * sx * sz; m[5] = sy * sz + cy * sx * cz; m[8] = cy * cx
  return m
}

function build(n: number, seed: number, parts: Part[], o: Vec) {
  const r = rng(seed), out = new Float32Array(n * 3), P: Vec = [0, 0, 0], M = rot(o[0], o[1], o[2])
  let tot = 0, i = 0
  for (const p of parts) tot += p[0]
  parts.forEach((p, k) => {
    const c = k === parts.length - 1 ? n - i : Math.round((p[0] / tot) * n)
    for (let j = 0; j < c && i < n; j++, i++) {
      p[1](r, P)
      out[i * 3] = M[0] * P[0] + M[3] * P[1] + M[6] * P[2]
      out[i * 3 + 1] = M[1] * P[0] + M[4] * P[1] + M[7] * P[2]
      out[i * 3 + 2] = M[2] * P[0] + M[5] * P[1] + M[8] * P[2]
    }
  })
  return out
}

/** a point on the outline of a rectangle with half-sizes a, b */
function rectEdge(r: () => number, a: number, b: number, P: Vec | [number, number]) {
  let t = r() * 4 * (a + b)
  if (t < 2 * a) { P[0] = t - a; P[1] = b; return } t -= 2 * a
  if (t < 2 * b) { P[0] = a; P[1] = b - t; return } t -= 2 * b
  if (t < 2 * a) { P[0] = a - t; P[1] = -b; return } t -= 2 * a
  P[0] = -a; P[1] = t - b
}

/** film reel: two flanges with 6 round cut-outs, rim, hub, wound film between the flanges */
function reel(n: number) {
  const h = 0.1, HR = 0.22, holes: [number, number][] = []
  for (let k = 0; k < 6; k++) holes.push([Math.cos((k * TAU) / 6 + 0.52) * 0.57, Math.sin((k * TAU) / 6 + 0.52) * 0.57])
  const side = (r: () => number) => (r() < 0.5 ? -h : h) + g3(r) * 0.01
  return build(n, 11, [
    [0.26, (r, P) => {
      const a = r() * TAU, q = r()
      let d = 1, z = (r() * 2 - 1) * h
      if (q < 0.8) { d = 0.92 + 0.08 * Math.sqrt(r()); z = q < 0.4 ? h : -h }
      P[0] = Math.cos(a) * d; P[1] = Math.sin(a) * d; P[2] = z + g3(r) * 0.008
    }],
    [0.36, (r, P) => {
      let x = 0, y = 0
      for (let t = 0; t < 40; t++) {
        const a = r() * TAU, d = Math.sqrt(0.0676 + r() * 0.7788)
        x = Math.cos(a) * d; y = Math.sin(a) * d
        let ok = true
        for (const c of holes) if ((x - c[0]) ** 2 + (y - c[1]) ** 2 < HR * HR) { ok = false; break }
        if (ok) break
      }
      P[0] = x; P[1] = y; P[2] = side(r)
    }],
    [0.18, (r, P) => {
      const c = holes[(r() * 6) | 0], a = r() * TAU
      P[0] = c[0] + Math.cos(a) * HR + g3(r) * 0.006; P[1] = c[1] + Math.sin(a) * HR + g3(r) * 0.006; P[2] = side(r)
    }],
    [0.12, (r, P) => {
      const a = r() * TAU
      let d = 0.25, z = (r() * 2 - 1) * h * 1.6
      if (r() < 0.5) { d = 0.08 + 0.17 * Math.sqrt(r()); z = r() < 0.5 ? -h * 1.6 : h * 1.6 }
      P[0] = Math.cos(a) * d; P[1] = Math.sin(a) * d; P[2] = z
    }],
    [0.08, (r, P) => {
      const a = r() * TAU, d = 0.26 + 0.24 * Math.sqrt(r())
      P[0] = Math.cos(a) * d; P[1] = Math.sin(a) * d; P[2] = (r() * 2 - 1) * h * 0.8
    }],
  ], [-0.5, 0.2, 0])
}

/** one 16:9 film frame: picture outline, faint picture light, strip edges, 8 sprocket holes top and bottom */
function frame(n: number) {
  const A = 0.98, B = 0.55
  const bow = (r: () => number, P: Vec, s: number) => { P[2] = 0.06 - 0.12 * P[0] * P[0] + g3(r) * s }
  return build(n, 23, [
    [0.28, (r, P) => { rectEdge(r, A, B, P); P[0] += g3(r) * 0.01; P[1] += g3(r) * 0.01; bow(r, P, 0.02) }],
    [0.16, (r, P) => { P[0] = (r() * 2 - 1) * A; P[1] = (r() * 2 - 1) * B; bow(r, P, 0.05) }],
    [0.14, (r, P) => { P[0] = (r() * 2 - 1) * 1.15; P[1] = (r() < 0.5 ? -0.86 : 0.86) + g3(r) * 0.008; bow(r, P, 0.015) }],
    [0.42, (r, P) => {
      const i = (r() * 8) | 0, s = r() < 0.5 ? -1 : 1
      rectEdge(r, 0.055, 0.038, P); P[0] += -1.05 + i * 0.3; P[1] += s * 0.73; bow(r, P, 0.012)
    }],
  ], [0.28, -0.12, -0.04])
}

/** a ribbon of film (8 frames) curving diagonally through depth, with a gentle twist */
function film(n: number) {
  const F = 8, WV = 0.34, c0: Vec = [0, 0, 0], c1: Vec = [0, 0, 0], c2: Vec = [0, 0, 0], Q: [number, number] = [0, 0]
  const C = (s: number, o: Vec) => {
    o[0] = -2.5 + 5 * s; o[1] = -1.25 + 2.5 * s + 0.32 * Math.sin(TAU * s); o[2] = 0.9 * Math.sin(Math.PI * 1.4 * s - 0.4) - 0.45
  }
  const put = (r: () => number, P: Vec, s: number, v: number) => {
    C(s, c0); C(s - 0.002, c1); C(s + 0.002, c2)
    let tx = c2[0] - c1[0], ty = c2[1] - c1[1], tz = c2[2] - c1[2]
    const l = Math.sqrt(tx * tx + ty * ty + tz * tz); tx /= l; ty /= l; tz /= l
    let bx = ty, by = -tx
    const bl = Math.sqrt(bx * bx + by * by); bx /= bl; by /= bl
    const mx = by * tz, my = -bx * tz, mz = bx * ty - by * tx
    const a = 0.9 * Math.sin(Math.PI * 1.2 * s) - 0.2, ca = Math.cos(a), sa = Math.sin(a), w = v * WV
    P[0] = c0[0] + (bx * ca + mx * sa) * w + g3(r) * 0.006
    P[1] = c0[1] + (by * ca + my * sa) * w + g3(r) * 0.006
    P[2] = c0[2] + mz * sa * w + g3(r) * 0.006
  }
  return build(n, 37, [
    [0.2, (r, P) => put(r, P, r(), r() < 0.5 ? -1 : 1)],
    [0.36, (r, P) => {
      const f = (r() * F) | 0, k = (r() * 4) | 0, s = r() < 0.5 ? -1 : 1
      rectEdge(r, 0.055, 0.075, Q); put(r, P, (f + (k + 0.5) / 4 + Q[0]) / F, s * 0.82 + Q[1])
    }],
    [0.12, (r, P) => put(r, P, Math.min(1, ((r() * (F + 1)) | 0) / F + g3(r) * 0.002), (r() * 2 - 1) * 0.66)],
    [0.32, (r, P) => put(r, P, (((r() * F) | 0) + 0.05 + r() * 0.9) / F, (r() * 2 - 1) * 0.64)],
  ], [0, 0.12, 0])
}

/** a solid, rounded play triangle inside a thin ring */
function play(n: number) {
  const RR = 0.11, V: [number, number][] = [], NR: [number, number][] = []
  for (let k = 0; k < 3; k++) V.push([Math.cos((k * TAU) / 3) * 0.512, Math.sin((k * TAU) / 3) * 0.512])
  for (let k = 0; k < 3; k++) {
    const a = V[k], b = V[(k + 1) % 3], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy)
    NR.push([dy / l, -dx / l])
  }
  return build(n, 53, [
    [0.55, (r, P) => {
      let u = r(), v = r()
      const d = RR * Math.sqrt(r()), t = r() * TAU
      if (u + v > 1) { u = 1 - u; v = 1 - v }
      P[0] = V[0][0] + u * (V[1][0] - V[0][0]) + v * (V[2][0] - V[0][0]) + Math.cos(t) * d
      P[1] = V[0][1] + u * (V[1][1] - V[0][1]) + v * (V[2][1] - V[0][1]) + Math.sin(t) * d
      P[2] = (r() * 2 - 1) * 0.07
    }],
    [0.17, (r, P) => {
      const i = (r() * 3) | 0, p = V[i], q = V[(i + 1) % 3], t = r()
      if (r() < 0.82) { P[0] = p[0] + t * (q[0] - p[0]) + NR[i][0] * RR; P[1] = p[1] + t * (q[1] - p[1]) + NR[i][1] * RR }
      else {
        const a1 = Math.atan2(NR[(i + 2) % 3][1], NR[(i + 2) % 3][0])
        let da = Math.atan2(NR[i][1], NR[i][0]) - a1
        while (da < 0) da += TAU
        P[0] = p[0] + Math.cos(a1 + t * da) * RR; P[1] = p[1] + Math.sin(a1 + t * da) * RR
      }
      P[2] = g3(r) * 0.05
    }],
    [0.28, (r, P) => {
      const t = r() * TAU, d = 1 + g3(r) * 0.012
      P[0] = Math.cos(t) * d; P[1] = Math.sin(t) * d; P[2] = g3(r) * 0.02
    }],
  ], [-0.22, 0.08, 0])
}

/** dust motes in a wide projector beam from the upper left, plus strays */
function dust(n: number) {
  const A: Vec = [-3, 1.9, -1.8], D: Vec = [4.3, -2.6, 1.4], tn = Math.tan(0.34)
  let L = Math.sqrt(D[0] ** 2 + D[1] ** 2 + D[2] ** 2)
  const ax: Vec = [D[0] / L, D[1] / L, D[2] / L], u: Vec = [ax[1], -ax[0], 0]
  const ul = Math.sqrt(u[0] ** 2 + u[1] ** 2); u[0] /= ul; u[1] /= ul
  const w: Vec = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]]
  L *= 1.25
  return build(n, 71, [
    [0.82, (r, P) => {
      const t = L * (0.12 + 0.88 * Math.pow(r(), 0.45)), d = t * tn * Math.sqrt(r()), a = r() * TAU, c = Math.cos(a) * d, s = Math.sin(a) * d
      for (let k = 0; k < 3; k++) P[k] = A[k] + ax[k] * t + u[k] * c + w[k] * s
    }],
    [0.18, (r, P) => { P[0] = (r() * 2 - 1) * 3.2; P[1] = (r() * 2 - 1) * 1.9; P[2] = (r() * 2 - 1) * 1.3 - 0.2 }],
  ], [0, 0, 0])
}

export const FILM_SHAPES: Record<FilmShape, (n: number) => Float32Array> = { reel, frame, film, play, dust }
/** per shape: drift amplitude (units), brightness */
export const FILM_LOOK: Record<FilmShape, [drift: number, gain: number]> = {
  reel: [0.012, 1], frame: [0.01, 1], film: [0.014, 1], play: [0.01, 0.95], dust: [0.11, 0.7],
}

/** per-particle random attributes: x = morph delay, y = colour mix, z = size, w = phase seed */
export function randomAttrs(n: number) {
  const r = rng(7), out = new Float32Array(n * 4)
  for (let i = 0; i < n; i++) { out[i * 4] = r(); out[i * 4 + 1] = r(); out[i * 4 + 2] = Math.pow(r(), 1.6); out[i * 4 + 3] = r() }
  return out
}
