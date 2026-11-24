import { lazy, Suspense, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { cx, rel } from '../ui/cx'
import type { FilmShape } from './filmShapes'
import { use3DGate } from './gate'
import type { ProgressSource } from './progress'

export type { FilmShape }

export type FilmParticlesProps = {
  className?: string
  style?: CSSProperties
  /** Shapes the dust re-forms into, in scroll order. Default reel → frame → film → play. 'dust' is a loose beam. */
  shapes?: FilmShape[]
  /** Particle colour: any CSS colour or var(--x) (resolved on mount). Default warm gold. */
  color?: string
  /** Colour of the rare bright sparkles. Default: `color` mixed with white. */
  sparkleColor?: string
  /** External 0..1 progress (e.g. motion useScroll().scrollYProgress). Overrides `track`. */
  progress?: ProgressSource
  /** Element whose scroll-through drives the morph (default: the component itself). For a sticky canvas,
   *  pass the tall section that contains it. */
  track?: RefObject<HTMLElement | null>
  /** Size of the shape relative to the smaller viewport side (1 ≈ legacy). */
  scale?: number
  /** Shape centre in canvas fractions, [x, y], 0..1. On narrow canvases x is pulled to the middle. */
  center?: [number, number]
  /** Particle count multiplier (device class already picks 5k / 9k / 14k). */
  density?: number
  /** Pointer parallax (desktop only). */
  interactive?: boolean
  /** Shown without WebGL, with Save-Data, with reduced motion (unless `allowReduced`), below `minWidth`
   *  and while the 3D chunk loads. */
  fallback?: ReactNode
  /** With reduced motion render a still frame of the nearest shape instead of `fallback`. */
  allowReduced?: boolean
  /** Do not mount the canvas below this viewport width (px). */
  minWidth?: number
}

const Scene = lazy(() => import('./FilmParticlesScene'))

/**
 * Gold film dust that re-forms by scroll progress: reel → frame with perforation → film strip → play.
 * Port of legacy-prototype-html/scene.js on @react-three/fiber, loaded as a separate chunk once near
 * the viewport and the browser is idle; paused off-screen. Phones: 4k particles, DPR 1. Decorative (aria-hidden).
 */
export function FilmParticles(props: FilmParticlesProps) {
  const { className, style, fallback = null, allowReduced = false, minWidth = 0 } = props
  const root = useRef<HTMLDivElement>(null)
  const gate = use3DGate(root, { allowReduced, minWidth })

  return (
    <div ref={root} aria-hidden className={cx(rel(className), 'pointer-events-none overflow-hidden', className)} style={style}>
      {gate.show ? (
        <Suspense fallback={fallback}>
          <Scene {...props} root={root} active={gate.inView} calm={gate.reduced} />
        </Suspense>
      ) : fallback}
    </div>
  )
}

export default FilmParticles
