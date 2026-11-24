import { Color, Quaternion, Vector3 } from 'three'
import type { Tier } from './contract'

/** World-space light rig, recomputed each frame by <Director/>; read by all scene parts. */
export const rig = {
  tier: 3 as Tier,
  projector: new Vector3(-7.2, 4.4, -4.5),
  prism: new Vector3(1.6, 2.9, 0.4),
  prismRotY: 0,
  beamEnd: new Vector3(),
  beamIntensity: 0,
  beamR0: 0.07,          // radius at lens
  beamR1: 0.34,          // radius at prism
  // spectrum fan
  specOrigin: new Vector3(),
  specTarget: new Vector3(),
  specAcross: new Vector3(1, 0, 0), // half-width vector at target
  specOpen: 0,
  specTargetName: '',    // slot the spectrum currently lands on
  specIntensity: 0,
  // contact fold
  fold: 0,
  playCenter: new Vector3(),
  playSize: 1,
  playQuat: new Quaternion(),
  // misc
  dim: 1,                // global scene multiplier (reel play darkens to .35)
  cursor: new Vector3(),
  cursorRayO: new Vector3(),
  cursorRayD: new Vector3(0, 0, -1),
  cursorOn: 0,
  cursorColor: new Color('#EDEBE6'),
  farm: 0,               // 0..1 visibility of GPU farm
  farmSpeed: 0.4,
  pricing: 0,            // 0..1 pricing monolith visibility
  quiet: 0,              // 0..1 for quiet sections
  heroReveal: 0,         // 0..1 hero screen develop
  heroDust: -1,          // 0..1 text-dust progress, -1 = inactive
}
