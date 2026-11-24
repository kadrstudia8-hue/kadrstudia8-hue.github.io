import { lazy, Suspense, useEffect, useRef } from 'react'
import { use3DGate } from '@kadr/shared/three/gate'
import { onPointer } from '../lib'

const Scene = lazy(() => import('./ReelDiscScene'))

/** Iridescent chrome film reel (R3F), 280×280, desktop ≥ 1024 only; lazy chunk after idle. Without it the reel
 *  painted in the generated hero image stays visible underneath — that is the fallback. */
export function ReelDisc({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const root = useRef<HTMLDivElement>(null)
  const gate = use3DGate(root, { minWidth: 1024 })
  const ptr = useRef<[number, number]>([0, 0])
  useEffect(() => onPointer((x, y) => { ptr.current = [x, y] }), [])
  return (
    <div ref={root} aria-hidden className={className} style={style}>
      {gate.show && (
        <Suspense fallback={null}>
          <Scene active={gate.inView} scroll={() => window.scrollY} pointer={() => ptr.current} />
        </Suspense>
      )}
    </div>
  )
}
