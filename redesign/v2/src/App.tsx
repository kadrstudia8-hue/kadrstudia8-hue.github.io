import { useMemo, useState } from 'react'
import { LazyMotion } from 'motion/react'
import { VideoModal } from './VideoModal'
import { useLang } from '@kadr/shared/i18n'
import { Players } from './actions'
import { Cursor, Sky } from './Ambient'
import { Hero } from './Hero'
import { Navbar } from './Navbar'
import { Compare, Faq, Final, How, MobileBar, Pc, Pricing, Proof, Who } from './Page'
import { Footer } from './Sections'

const loadFeatures = () => import('./features').then(r => r.default)

export default function App() {
  const { lang, t, setLang } = useLang()
  const [video, setVideo] = useState<'reel' | 'tutorial' | null>(null)
  const players = useMemo(() => ({ reel: () => setVideo('reel'), tutorial: () => setVideo('tutorial') }), [])
  const v = video === 'tutorial' ? t.tutorial.video : t.reel.video
  const order = t.page?.order ?? []
  const SECTIONS = { top: Hero, proof: Proof, who: Who, how: How, compare: Compare, pc: Pc, pricing: Pricing, faq: Faq, download: Final } as const
  return (
    <LazyMotion features={loadFeatures} strict>
      <Players.Provider value={players}>
        <div className="relative min-h-dvh overflow-x-clip">
          <Sky />
          <Navbar t={t} lang={lang} setLang={setLang} />
          <main className="relative">
            {order.map(id => {
              const S = SECTIONS[id]
              return S === Hero ? <Hero key={id} t={t} onReel={players.reel} /> : <S key={id} t={t} onReel={players.reel} />
            })}
          </main>
          <Footer t={t} lang={lang} setLang={setLang} />
          <MobileBar t={t} lang={lang} />
          <VideoModal open={!!video} onClose={() => setVideo(null)} src={v.src} poster={v.poster} title={v.label} closeLabel={t.ui.langHint.close} />
          <div className="grain" aria-hidden />
          <Cursor />
        </div>
      </Players.Provider>
    </LazyMotion>
  )
}
