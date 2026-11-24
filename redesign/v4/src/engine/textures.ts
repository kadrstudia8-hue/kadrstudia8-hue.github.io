import { useEffect, useState } from 'react'
import { SRGBColorSpace, Texture, TextureLoader } from 'three'
import { gen, type GenId } from '../ui/env'

/** URL of a generated asset in public/gen (list owned by INTERFACE in ui/env.ts), or null while it does not exist. */
export function genUrl(name: GenId): string | null {
  return gen(name)
}

const loader = new TextureLoader()
const cache = new Map<string, Promise<Texture | null>>()

function load(url: string): Promise<Texture | null> {
  let p = cache.get(url)
  if (!p) {
    p = new Promise((res) => loader.load(url, (t) => { t.colorSpace = SRGBColorSpace; res(t) }, undefined, () => res(null)))
    cache.set(url, p)
  }
  return p
}

/** Optional texture: null until loaded, or forever if the url is null / fails. */
export function useOptionalTexture(url: string | null): Texture | null {
  const [tex, setTex] = useState<Texture | null>(null)
  useEffect(() => {
    if (!url) return
    let alive = true
    load(url).then((t) => { if (alive && t) setTex(t) })
    return () => { alive = false }
  }, [url])
  return tex
}
