// KADR Studio V4 «BLACK GLOSS · Light Engine». The engine is optional: lazy, only on capable desktops.
import { Component, lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { ENGINE_ALLOWED, FINE, CALM, useT } from './ui/env'
import { Divider } from './ui/kit'
import { markEngineDead, useStageDriver } from './ui/stage'
import { Cloud } from './sections/Cloud'
import { Contact, Footer, MobileBar } from './sections/Contact'
import { Download } from './sections/Download'
import { Facts } from './sections/Facts'
import { Faq } from './sections/Faq'
import { Features } from './sections/Features'
import { Hero } from './sections/Hero'
import { How } from './sections/How'
import { Looks } from './sections/Looks'
import { Nav } from './sections/Nav'
import { Pricing } from './sections/Pricing'
import { Proof } from './sections/Proof'
import { Reel } from './sections/Reel'
import { Req } from './sections/Req'
import { Who } from './sections/Who'

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
  const { lang } = useT()
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
        <Hero />
        <Facts />
        <Proof />
        <Divider />
        <Cloud />
        <How />
        <Reel />
        <Divider />
        <Who />
        <Looks />
        <Features />
        <Divider />
        <Req />
        <Pricing />
        <Download />
        <Divider />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <div aria-hidden className="grain" />
    </>
  )
}
