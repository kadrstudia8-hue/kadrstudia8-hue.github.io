import { useSyncExternalStore } from 'react'

/** Subscribes to a CSS media query. Returns `serverValue` before hydration / when matchMedia is missing. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : serverValue),
    () => serverValue,
  )
}

export function matches(query: string): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches
}
