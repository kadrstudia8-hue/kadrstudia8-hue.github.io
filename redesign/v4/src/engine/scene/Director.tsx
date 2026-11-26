import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { getOutput, setOutput, stageInput as I, type SectionId } from '../contract'
import { dom } from '../dom'
import { pxToWorld, rectToWorld, SCREEN_DEPTH, unitAt } from '../project'
import { STILL } from '../quality'
import { rig } from '../rig'
import { clamp01, damp, E, emitStory, HERO, heroPhase, heroT, QUIET, smooth } from '../state'

const pos = new Vector3(0, 1.2, 9)
const look = new Vector3(0.5, 1.35, 0)
const tPos = new Vector3()
const tLook = new Vector3()
const tmp = new Vector3()
const tmp2 = new Vector3()
const PRISM_HOME = new Vector3(2.0, 2.56, 0.4) // >= 56 px under the nav at 1440
const PRISM_HIGH = new Vector3(0.6, 5.2, -2.5) // out of frame above: spectrum rains down onto targets
const PRISM_SECTIONS = new Set<SectionId>(['top', 'facts', 'looks'])
const FLOOR_A = new Vector3(0.2, 0.02, 3.0)
const FLOOR_ACROSS = new Vector3(2.6, 0, 0)
const specT = new Vector3().copy(FLOOR_A)
const specA = new Vector3().copy(FLOOR_ACROSS)
const right = new Vector3()

const BEAM: Record<SectionId, number> = {
  top: 1, facts: 0.9, proof: 0.8, cloud: 0.2, how: 0.5, reel: 1, who: 0.25, looks: 1,
  features: 0.25, req: 0.25, pricing: 0.5, download: 0.7, faq: 0.25, contact: 1,
}
const OPEN: Record<SectionId, number> = {
  top: 1, facts: 0.9, proof: 0.85, cloud: 0.12, how: 0.35, reel: 0.9, who: 0.2, looks: 1,
  features: 0.2, req: 0.2, pricing: 0.2, download: 0.7, faq: 0.2, contact: 0,
}

function cameraKey(id: SectionId, t: number) {
  const p = I.progress
  const fov = { v: 32 }
  switch (id) {
    case 'top': {
      const s = smooth(0.5, 1, p.top)
      tPos.set(0, 1.2 - 0.3 * s, 9 - 1.5 * s); tLook.set(0.5, 1.35 - 0.4 * s, 0); break
    }
    case 'facts': tPos.set(0, 0.9, 7.5); tLook.set(0.3, 0.75, 0); break
    case 'proof': tPos.set(-3, 1, 6); tLook.set(-0.3, 1.15, 0); break
    case 'cloud': {
      // ride along the farm; look left of it so the farm sits in the cloud-stage slot (right half)
      const x = -2 + 4 * clamp01(p.cloud)
      tPos.set(x, 1.2, 6.2); tLook.set(x - 3.4, 1.25, -4); fov.v = 32 - 4 * smooth(0.15, 0.6, p.cloud); break
    }
    case 'how': tPos.set(0, 1, 7); tLook.set(0, 1, 0); break
    case 'reel': tPos.set(0, 1.15, 7 - 1.5 * smooth(0.2, 0.6, p.reel)); tLook.set(0, 1.2, 0); break
    case 'looks': tPos.set(2, 1, 6); tLook.copy(rig.prism); break
    case 'pricing': tPos.set(0, 0.4, 6); tLook.set(0, 1.4, 0); break
    case 'download': tPos.set(0, 1, 5); tLook.set(0.6, 1, 0); break
    case 'contact': tPos.set(0, 1.2, 7 + 3 * smooth(0.1, 0.8, p.contact)); tLook.set(0, 1.2, 0); break
    default: // quiet: who, features, req, faq
      tPos.set(0.4 + Math.sin(t * 0.13) * 0.1, 1.3 + Math.sin(t * 0.11) * 0.05, 8); tLook.set(0.2, 1.4, 0)
  }
  return fov.v
}

export default function Director() {
  const cam = useThree((s) => s.camera) as PerspectiveCamera
  const started = useRef(-1)

  useEffect(() => {
    dom.attach()
    return () => dom.detach()
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    E.dt = STILL ? 0 : dt
    if (!STILL) E.time += dt
    else E.time = 12
    const t = E.time
    dom.update()

    // ---------- hero story ----------
    if (started.current < 0) started.current = t
    if (E.heroStart < 0 && !STILL && t - started.current > 2.5) emitStory('')
    const ht = heroT()
    const phase = heroPhase(ht)
    if (getOutput().heroPhase !== phase && !(STILL && getOutput().heroPhase === 'done')) setOutput({ heroPhase: STILL ? 'done' : phase })
    const storyOn = ht >= 0 && ht < HERO.reveal + 0.2
    const d0 = HERO.typing - 0.1, d1 = HERO.dust + 0.4
    rig.heroDust = ht >= d0 && ht < d1 ? (ht - d0) / (d1 - d0) : -1
    rig.heroReveal = ht < 0 ? 0 : smooth(HERO.spectrum, HERO.reveal, ht)

    // ---------- camera ----------
    const id = I.active
    const fov = cameraKey(id, t)
    tPos.x += I.pointer.x * 0.16
    tPos.y += -I.pointer.y * 0.08
    const k = STILL ? 1 : 1 - Math.exp(-4 * dt)
    pos.lerp(tPos, k)
    look.lerp(tLook, k)
    cam.position.copy(pos)
    cam.lookAt(look)
    const nf = STILL ? fov : damp(cam.fov, fov, 4, dt)
    if (Math.abs(nf - cam.fov) > 1e-4) { cam.fov = nf; cam.updateProjectionMatrix() }
    cam.updateMatrixWorld()

    // ---------- prism ----------
    const ps = dom.rect('prism')
    let pScale = 1
    if (ps) {
      // looks: centre 24 px lower, prism at most 200 px tall
      rectToWorld({ x: ps.x, y: ps.y + 24, w: ps.w, h: ps.h, visible: true }, 6.5, cam, tmp)
      pScale = (Math.min(200, ps.h * 0.8) * unitAt(6.5, cam)) / 0.86
    } else tmp.copy(PRISM_SECTIONS.has(id) ? PRISM_HOME : PRISM_HIGH)
    const kp = STILL ? 1 : 1 - Math.exp(-3 * dt)
    rig.prism.lerp(tmp, kp)
    rig.prismScale = STILL ? pScale : damp(rig.prismScale, pScale, 3, dt)
    const looksTarget = E.looks * (Math.PI / 3)
    rig.prismRotY = STILL ? looksTarget : damp(rig.prismRotY, looksTarget, 7, dt)

    // ---------- contact fold / play sign ----------
    rig.fold = smooth(0.25, 0.75, I.progress.contact)
    const cp = dom.rect('cta-play')
    if (cp) { const [w, h] = rectToWorld(cp, 6, cam, rig.playCenter); rig.playSize = Math.min(w, h) }
    else { const [w] = pxToWorld(dom.vw * 0.5, dom.vh * 0.42, 6, cam, rig.playCenter, dom.vh * 0.28, 0); rig.playSize = w }
    rig.playQuat.copy(cam.quaternion)

    // ---------- beam ----------
    rig.beamEnd.copy(rig.prism).lerp(rig.playCenter, rig.fold)
    let bi = BEAM[id] ?? 0.3
    if (id === 'top' || id === 'facts') {
      if (ht < 0) bi = 0.35
      else if (storyOn) bi = 0.35 + 0.65 * smooth(HERO.typing - 0.4, HERO.dust, ht)
    }
    bi *= 1 + 0.06 * Math.sin((t / 5) * Math.PI * 2)
    rig.beamIntensity = STILL ? bi : damp(rig.beamIntensity, bi, 3, dt)

    // ---------- spectrum target ----------
    let open = OPEN[id] ?? 0.2
    let target: string | null = null
    if (id === 'top') target = 'hero-screen'
    else if (id === 'proof') target = `proof-${E.proofHover ?? E.proofSelect}`
    else if (id === 'reel') target = 'reel-screen'
    let found = false
    if (target) {
      const r = dom.rect(target)
      if (r) {
        const [w] = rectToWorld(r, SCREEN_DEPTH, cam, tmp)
        right.set(1, 0, 0).applyQuaternion(cam.quaternion).multiplyScalar(w * 0.5)
        tmp2.copy(right)
        found = true
      }
    } else if (id === 'download') {
      const r = dom.rect('download-object')
      if (r) {
        const [w, h] = rectToWorld(r, 6, cam, tmp)
        tmp2.set(1, 0, 0).applyQuaternion(cam.quaternion).multiplyScalar(Math.min(w, h) * 0.3)
        found = true
      }
    } else if (id === 'looks') {
      tmp.set(rig.prism.x + 1.2, 0.02, rig.prism.z + 2.2); tmp2.set(1.8, 0, 0); found = true
    }
    if (!found) { tmp.copy(FLOOR_A); tmp2.copy(FLOOR_ACROSS) }
    rig.specTargetName = !found ? '' : target ?? (id === 'download' ? 'download-object' : '')
    if (id === 'top') open *= ht < 0 ? 0 : smooth(HERO.dust, HERO.spectrum, ht)
    if (id === 'facts' && ht >= 0 && ht < HERO.spectrum) open *= smooth(HERO.dust, HERO.spectrum, ht)
    open *= 1 - rig.fold
    const ks = STILL ? 1 : 1 - Math.exp(-5 * dt)
    specT.lerp(tmp, ks)
    specA.lerp(tmp2, ks)
    rig.specTarget.copy(specT)
    rig.specAcross.copy(specA)
    rig.specOrigin.copy(rig.prism)
    if (id === 'reel' || id === 'download') {
      // the fan enters its target from the left at mid-height: it never crosses the H2 or the nav
      const r = dom.rect(id === 'reel' ? 'reel-screen' : 'download-object')
      if (r) {
        const reach = id === 'reel' ? 220 : 160
        const span = id === 'reel' ? 0.5 : 0.22
        pxToWorld(Math.max(r.x - reach, 8), r.y + r.h * 0.5, SCREEN_DEPTH, cam, tmp)
        rig.specOrigin.copy(tmp)
        pxToWorld(r.x + r.w * (id === 'reel' ? 0.5 : 0.3), r.y + r.h * 0.5, SCREEN_DEPTH, cam, tmp)
        rig.specTarget.copy(tmp)
        rig.specAcross.set(0, 1, 0).applyQuaternion(cam.quaternion).multiplyScalar(r.h * span * unitAt(SCREEN_DEPTH, cam))
      }
    }
    rig.specOpen = STILL ? open : damp(rig.specOpen, open, id === 'top' ? 8 : 2.5, dt)
    rig.specIntensity = rig.beamIntensity

    // ---------- section mixes ----------
    // farm lives only around cloud and is fully off by progress.cloud = 0.9 (never under how)
    const pc = I.progress.cloud
    const farmOn = (id === 'cloud' || id === 'proof' ? 1 : 0) * smooth(0.25, 0.4, pc) * (1 - smooth(0.72, 0.88, pc))
    rig.farm = STILL ? farmOn : Math.min(damp(rig.farm, farmOn, 5, dt), 1 - smooth(0.72, 0.9, pc))
    const cs = dom.rect('cloud-stage')
    rig.leftX = cs ? cs.x - 25 : dom.vw * 0.486
    rig.farmSpeed = 0.4 + 0.6 * clamp01(I.progress.cloud)
    const priceOn = id === 'pricing' ? 1 : 0
    if (priceOn && rig.pricing < 0.02) E.pricingEnterAt = t
    rig.pricing = STILL ? priceOn : damp(rig.pricing, priceOn, 4, dt)
    rig.quiet = STILL ? +QUIET.has(id) : damp(rig.quiet, QUIET.has(id) ? 1 : 0, 3, dt)
    const dimT = id === 'reel' && E.reelPlaying ? 0.35 : 1
    rig.dim = STILL ? dimT : damp(rig.dim, dimT, 3, dt)

    // ---------- cursor light ----------
    rig.cursorRayO.copy(cam.position)
    tmp.set(I.pointer.x, -I.pointer.y, 0.5).unproject(cam)
    rig.cursorRayD.copy(tmp).sub(cam.position).normalize()
    rig.cursor.copy(cam.position).addScaledVector(rig.cursorRayD, 5)
    rig.cursorOn = damp(rig.cursorOn, I.pointer.active ? 1 : 0, 6, dt || 0.016)
    rig.cursorColor.set(E.ctaHover ? '#D7FF1F' : '#EDEBE6')
  }, -2)

  return null
}
