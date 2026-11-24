import { useState } from 'react'
import { BackdropProvider } from './components/ui'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { FactsMarquee, Proof } from './components/Proof'
import { Reel, Tutorial } from './components/Reel'
import { Who } from './components/Who'
import { How } from './components/How'
import { Looks } from './components/Looks'
import { Features, Req } from './components/Info'
import { DownloadSec, Pricing } from './components/Sales'
import { Contact, Faq, Footer, MobileBar } from './components/End'
import { Stage } from './three/Stage'
import { CloudSec, CtaBand, Promises } from './components/Pitch'

export default function App() {
  const [host, setHost] = useState<HTMLDivElement | null>(null)
  return (
    <BackdropProvider value={host}>
      <div className="page">
        <div ref={setHost} className="backdrop" aria-hidden />
        <Stage />
        <div className="vignette" aria-hidden />
        <Nav />
        <main className="main">
          <Hero />
          <Promises />
          <FactsMarquee />
          <Proof />
          <Reel />
          <Tutorial />
          <Who />
          <How />
          <Looks />
          <Req />
          <CloudSec />
          <Features />
          <DownloadSec />
          <Pricing />
          <Faq />
          <Contact />
          <CtaBand />
        </main>
        <Footer />
        <MobileBar />
        <div className="grain" aria-hidden />
      </div>
    </BackdropProvider>
  )
}
