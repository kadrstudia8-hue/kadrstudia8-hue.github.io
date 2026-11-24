// Generated decor objects (public/gen). The list comes from the build (virtual:v3-gen), so a missing file is never requested.
import gen from 'virtual:v3-gen'

export type GenId = 'v3-hero-scene.webp' | 'v3-hero-loop.mp4' | 'v3-icons.webp' | 'v3-cta-scene.webp'

/** URL of a generated asset, or null while it does not exist yet. */
export function genUrl(id: GenId): string | null {
  const m = (gen as Record<string, number>)[id]
  return m ? `gen/${id}?v=${m}` : null
}
