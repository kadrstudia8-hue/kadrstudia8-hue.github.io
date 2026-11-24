import { useState } from 'react'
import { LazyMotion } from 'motion/react'
import { VideoModal } from './VideoModal'
import { useLang } from '@kadr/shared/i18n'
import { Cursor, Sky } from './Ambient'
import { FactCards } from './FactCards'
import { Hero } from './Hero'
import { Navbar } from './Navbar'
import { PairCards } from './PairCards'
import { ProofBanner } from './ProofBanner'
import { CloudBanner, CtaBand, Promises } from './Sales'
import { Contact, DownloadSection, Faq, Features, Footer, How, Looks, Pricing, Reel, Req, SlimeDivider, Tutorial, Who } from './Sections'

const loadFeatures = () => import('./features').then(r => r.default)

export default function App() {
  const { lang, t, setLang } = useLang()
  const [reel, setReel] = useState(false)
  const openReel = () => setReel(true)
  return (
    <LazyMotion features={loadFeatures} strict>
    <div className="relative min-h-dvh overflow-x-clip">
      <Sky />
      <Navbar t={t} lang={lang} setLang={setLang} />
      <main className="relative">
        <Hero t={t} onReel={openReel} />
        <FactCards t={t} />
        <ProofBanner t={t} />
        <PairCards t={t} onReel={openReel} />
        <Promises t={t} />
        <Reel t={t} />
        <Tutorial t={t} />
        <Who t={t} lang={lang} />
        <How t={t} lang={lang} />
        <Looks t={t} />
        <div className="section-gap"><SlimeDivider /></div>
        <Req t={t} lang={lang} />
        <CloudBanner t={t} />
        <Features t={t} lang={lang} />
        <DownloadSection t={t} />
        <Pricing t={t} />
        <Faq t={t} />
        <Contact t={t} />
        <CtaBand t={t} />
      </main>
      <Footer t={t} lang={lang} setLang={setLang} />
      <VideoModal open={reel} onClose={() => setReel(false)} src={t.reel.video.src} poster={t.reel.video.poster} title={t.reel.video.label} closeLabel={t.ui.langHint.close} />
      <div className="grain" aria-hidden />
      <Cursor />
    </div>
    </LazyMotion>
  )
}
