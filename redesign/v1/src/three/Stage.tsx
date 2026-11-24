import { lazy, Suspense, useEffect, useState } from 'react'
import { hasWebGL, saveData } from '@kadr/shared/three/webgl'
import { useReduced } from '../lib/env'

const Scene = lazy(() => import('./StageScene'))

/**
 * Fixed particle canvas behind the content. The three.js chunk is requested after the page is idle, only with
 * WebGL, no Save-Data and no reduced motion; otherwise (and while it loads) the CSS fallback shows:
 * faint dust + static sprocket perforation along the edges. Paused while the tab is hidden.
 */
export function Stage() {
  const reduced = useReduced()
  const [ok, setOk] = useState(false)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    if (reduced || saveData() || !hasWebGL()) return
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void }
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setOk(true), { timeout: 2500 })
      return () => w.cancelIdleCallback?.(id)
    }
    const t = setTimeout(() => setOk(true), 600)
    return () => clearTimeout(t)
  }, [reduced])
  useEffect(() => {
    const on = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])
  return (
    <div className="stage" aria-hidden>
      {!ok && <div className="stage-fallback" />}
      {ok && (
        <Suspense fallback={<div className="stage-fallback" />}>
          <Scene active={visible} />
        </Suspense>
      )}
    </div>
  )
}
