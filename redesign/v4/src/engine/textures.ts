import { useEffect, useState } from 'react'
import { SRGBColorSpace, Texture, TextureLoader } from 'three'

const loader = new TextureLoader()
const cache = new Map<string, Promise<Texture | null>>()

function tryLoad(url: string): Promise<Texture | null> {
  return new Promise((res) => {
    loader.load(url, (t) => { t.colorSpace = SRGBColorSpace; res(t) }, undefined, () => res(null))
  })
}

/**
 * Optional texture (generated assets may not exist yet). Returns null until it loads;
 * retries every 20 s for a few minutes so assets generated during a dev session get picked up.
 */
export function useOptionalTexture(url: string): Texture | null {
  const [tex, setTex] = useState<Texture | null>(null)
  useEffect(() => {
    let alive = true, tries = 0
    let timer = 0
    const attempt = () => {
      let p = cache.get(url)
      if (!p) { p = tryLoad(url); cache.set(url, p) }
      p.then((t) => {
        if (!alive) return
        if (t) setTex(t)
        else {
          cache.delete(url)
          if (++tries < 12) timer = window.setTimeout(attempt, 20000)
        }
      })
    }
    attempt()
    return () => { alive = false; clearTimeout(timer) }
  }, [url])
  return tex
}
