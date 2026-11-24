import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import { useCallback, useState } from 'react'
import { STILL } from './lib/motion'
import { Contact, Footer, MobileBar } from './sections/Contact'
import { Hero } from './sections/Hero'
import { Download, Faq, Features, Pricing, Req } from './sections/Info'
import { Nav } from './sections/Nav'
import { Looks, Proof } from './sections/Proof'
import { How, Reel, Tutorial } from './sections/Watch'
import { Facts, Who } from './sections/Who'
import { CloudSection, MobileSoon, Promises } from './sections/Sales'
import { Bokeh, CursorLight, PageShade, World } from './sections/World'

export default function App() {
  const [pick, setPick] = useState<{ i: number; n: number } | null>(null)
  const onPick = useCallback((i: number) => {
    setPick((p) => ({ i, n: (p?.n ?? 0) + 1 }))
    document.getElementById('proof')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [])
  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion={STILL ? 'always' : 'user'}>
      <a href="#proof" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-night">KADR Studio</a>
      <World />
      <CursorLight />
      <Nav />
      <main className="relative overflow-x-clip">
        <PageShade />
        <Bokeh />
        <Hero onPick={onPick} />
        <Who />
        <Facts />
        <Proof pick={pick} />
        <Promises />
        <Reel />
        <Tutorial />
        <How />
        <Looks />
        <Req />
        <CloudSection />
        <MobileSoon />
        <Features />
        <Download />
        <Pricing />
        <Faq />
        <Contact />
        <Footer />
      </main>
      <MobileBar />
      <div aria-hidden className="grain" />
    </MotionConfig>
    </LazyMotion>
  )
}
