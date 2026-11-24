import { lazy, Suspense, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { cx, rel } from '../ui/cx'
import { use3DGate } from './gate'
import type { IridescentShape } from './iridescentGeometry'
import type { ProgressSource } from './progress'

export type { IridescentShape }

export type IridescentObjectProps = {
  className?: string
  style?: CSSProperties
  /** Single shape. */
  shape?: IridescentShape
  /** Several shapes: the object morphs from one to the next by scroll progress. Overrides `shape`. */
  shapes?: IridescentShape[]
  /** 'glass' is refractive iridescent glass (MeshTransmissionMaterial), 'chrome' is liquid iridescent metal. */
  material?: 'glass' | 'chrome'
  /** Material tint (CSS colour or var(--x)). Default white. */
  tint?: string
  /** Colours of the prism light strips that the object reflects and refracts. */
  highlights?: string[]
  /** Thin glowing colour bars behind the object; refracted by the glass they read as prism light. Default false. */
  prismBars?: boolean
  /** Floating dust around the object. */
  dust?: boolean
  dustColor?: string
  /** Canvas clear colour. Default transparent: the page background shows through. */
  background?: string
  /** External 0..1 progress for the morph and scroll rotation (e.g. a MotionValue). Overrides `track`. */
  progress?: ProgressSource
  /** Element whose scroll-through drives the morph (default: the component itself). */
  track?: RefObject<HTMLElement | null>
  /** Idle rotation speed multiplier (0 = no idle spin, only scroll and cursor). */
  speed?: number
  /** Turn towards the cursor (desktop only). Max angle in degrees; 0 disables. */
  cursorTilt?: number
  /** Object size relative to the canvas (1 fills about 70% of the smaller side). */
  scale?: number
  /** Transmission quality. Defaults: desktop 6 samples / 512px, phone 3 / 256. */
  samples?: number
  resolution?: number
  /** Do not mount the canvas below this viewport width (px), e.g. 1024. */
  minWidth?: number
  /** Unmount and show the fallback if the average frame is over 20 ms during the first 2 s. Default true. */
  perfGuard?: boolean
  /** Shown without WebGL, with Save-Data or reduced motion, below `minWidth`, after a perf failure and while the 3D chunk loads. */
  fallback?: ReactNode
}

const Scene = lazy(() => import('./IridescentScene'))

/**
 * Iridescent glass or liquid-chrome hero object (react-three-fiber), built procedurally:
 * crystal, camera lens, film reel, play. Separate lazy chunk, requested once near the viewport and idle;
 * paused off-screen. Phones: DPR up to 1.5 and fewer transmission samples.
 */
export function IridescentObject(props: IridescentObjectProps) {
  const { className, style, fallback = null, minWidth = 0 } = props
  const root = useRef<HTMLDivElement>(null)
  const gate = use3DGate(root, { minWidth })

  return (
    <div ref={root} aria-hidden className={cx(rel(className), className)} style={style}>
      {gate.show ? (
        <Suspense fallback={fallback}>
          <Scene {...props} root={root} active={gate.inView} onPerfFail={gate.fail} />
        </Suspense>
      ) : fallback}
    </div>
  )
}

export default IridescentObject
