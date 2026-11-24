import { useLang } from '@kadr/shared/i18n'
import type { WhoMedia } from '@kadr/shared/content/types'
import { Hud, LoopVideo, More, Rv, RvGroup, SectionHead, Splice } from './ui'

function Media({ m }: { m: WhoMedia }) {
  switch (m.kind) {
    case 'trio':
      return (
        <div className="dm dm-trio">
          {m.videos.map((v, i) => (
            <div key={v.src} className="dm-cell">
              <LoopVideo src={v.src} poster={v.poster} label={v.label} width={v.width} height={v.height} play={i === 1} />
            </div>
          ))}
        </div>
      )
    case 'solo':
      return (
        <div className="dm dm-solo">
          <img className="dm-blur" src={m.image.src} alt="" aria-hidden loading="lazy" />
          <img className="dm-portrait" src={m.image.src} alt={m.image.alt} width={m.image.width} height={m.image.height} loading="lazy" />
        </div>
      )
    case 'video':
      return <div className="dm"><LoopVideo src={m.video.src} poster={m.video.poster} label={m.video.label} width={m.video.width} height={m.video.height} /></div>
    case 'pair':
      return (
        <div className="dm dm-pair">
          {m.items.map((it) => (
            <figure key={it.badge} className="dm-cell dm-badged" data-badge={it.badge}>
              <img src={it.image.src} alt={it.image.alt} width={it.image.width} height={it.image.height} loading="lazy" />
            </figure>
          ))}
        </div>
      )
  }
}

export function Who() {
  const { t, lang } = useLang()
  const w = t.who
  return (
    <section id="who" className="sec" aria-labelledby="who-h" data-scene="dust" data-scene-alpha=".3">
      <Splice />
      <div className="wrap">
        <SectionHead n={5} id="who-h" tag={w.tag} title={w.title} />
        <RvGroup className="who-grid" amount={0.1}>
          {w.cards.map((c, i) => (
            <Rv key={c.title} as="article" className="dossier glass">
              <Hud />
              <div className="dossier-media"><Media m={c.media} /></div>
              <div className="dossier-body">
                <p className="dossier-n" aria-hidden>{String(i + 1).padStart(2, '0')} / {String(w.cards.length).padStart(2, '0')}</p>
                <h3 className="h3">{c.title}</h3>
                <p className="dossier-text">{c.text}</p>
                <More text={c.details} lang={lang} />
                <p className="dossier-src">{c.source}</p>
              </div>
            </Rv>
          ))}
        </RvGroup>
      </div>
    </section>
  )
}
