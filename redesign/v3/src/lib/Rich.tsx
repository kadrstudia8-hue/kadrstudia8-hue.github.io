import type { Rich as RichT } from '@kadr/shared/content/index.ts'
import { Fragment } from 'react'

/** Renders the site's structured rich text (b / a / share button). */
export function Rich({ value, onShare, shareLabel }: { value: RichT; onShare?: () => void; shareLabel?: string }) {
  return (
    <>
      {value.map((p, i) => {
        if (typeof p === 'string') return <Fragment key={i}>{p}</Fragment>
        if ('b' in p) return <b key={i}>{p.b}</b>
        if ('a' in p) {
          const ext = /^https?:/.test(p.href)
          return <a key={i} href={p.href} {...(ext ? { target: '_blank', rel: 'noopener' } : null)}>{p.a}</a>
        }
        return (
          <button key={i} type="button" onClick={onShare} className="underline decoration-white/40 underline-offset-[3px] hover:decoration-white">
            {shareLabel ?? p.button}
          </button>
        )
      })}
    </>
  )
}
