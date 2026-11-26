// KADR Studio V4 «BLACK GLOSS · Light Engine». The engine is optional: lazy, only on capable desktops.
import { Component, Fragment, lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { ENGINE_ALLOWED, FINE, CALM, useT } from './ui/env'
import { Divider } from './ui/kit'
import { markEngineDead, useStageDriver } from './ui/stage'
import type { PageSectionId } from '@kadr/shared/content/index.ts'
import { Compare } from './sections/Compare'
import { Faq } from './sections/Faq'
import { Final, Footer, MobileBar } from './sections/Final'
import { Hero } from './sections/Hero'
import { How } from './sections/How'
import { Nav } from './sections/Nav'
import { Pc } from './sections/Pc'
import { Pricing } from './sections/Pricing'
import { Proof } from './sections/Proof'
import { Who } from './sections/Who'

/** One structure for both themes: sections in content.page.order (CRO.md 3). */
const SECTIONS: Record<PageSectionId, () => ReactNode> = {
  top: () => <Hero />, proof: () => <Proof />, who: () => <Who />, how: () => <How />, compare: () => <Compare />,
  pc: () => <Pc />, pricing: () => <Pricing />, faq: () => <Faq />, download: () => <Final />,
}

// The engine entry may not exist (site must work without engine/): glob resolves to {} then.
const engineLoaders = import.meta.glob<{ default: ComponentType }>('./engine/index.{ts,tsx}')
const engineLoader = Object.values(engineLoaders)[0]
const Stage = engineLoader ? lazy(engineLoader) : null

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(e: unknown) { console.warn('[v4] engine disabled:', e); markEngineDead() }
  render() { return this.state.failed ? null : this.props.children }
}

/** Loads the engine after idle + first interaction or 1.5 s (DESIGN-V4 10.3). */
function useEngineGate() {
  const [go, setGo] = useState(false)
  useEffect(() => {
    if (!ENGINE_ALLOWED || !Stage) return
    let done = false
    const fire = () => {
      if (done) return
      done = true
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
      if (ric) ric(() => setGo(true), { timeout: 800 }); else setGo(true)
    }
    const tm = setTimeout(fire, 1500)
    const evs = ['pointermove', 'wheel', 'keydown', 'touchstart'] as const
    evs.forEach((e) => addEventListener(e, fire, { once: true, passive: true }))
    return () => { clearTimeout(tm); evs.forEach((e) => removeEventListener(e, fire)) }
  }, [])
  return go
}

export default function App() {
  const { lang, p } = useT()
  const order = (p.order?.length ? p.order : (Object.keys(SECTIONS) as PageSectionId[])).filter((id) => id in SECTIONS)
  useStageDriver(lang)
  const engine = useEngineGate()
  return (
    <>
      <a href="#proof" className="skip">KADR Studio</a>
      <div aria-hidden className="room" />
      {engine && Stage && (
        <div className="stage-host" aria-hidden>
          <Boundary><Suspense fallback={null}><Stage /></Suspense></Boundary>
        </div>
      )}
      {FINE && !CALM && <div aria-hidden className="cursor-light" />}
      <Nav />
      <main className="page">
        {order.map((id, i) => <Fragment key={id}>{i > 0 && i % 3 === 0 && <Divider />}{SECTIONS[id]?.()}</Fragment>)}
      </main>
      <Footer />
      <MobileBar />
      <div aria-hidden className="grain" />
    </>
  )
}
