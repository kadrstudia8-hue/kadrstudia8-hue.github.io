import { useEffect, useRef, type RefObject } from 'react'

let locks = 0
let saved = ''

/** While `active`: locks page scroll, closes on Escape, keeps Tab focus inside `ref`, restores focus on close. */
export function useOverlay(active: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!active) return
    const prevFocus = document.activeElement as HTMLElement | null
    const html = document.documentElement
    if (locks++ === 0) {
      saved = html.style.overflow
      html.style.overflow = 'hidden'
    }
    const focusables = () =>
      Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,video[controls],[tabindex]:not([tabindex="-1"])') ?? [])
        .filter((el) => !el.closest('[inert]'))
    const t = setTimeout(() => (ref.current?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0])?.focus(), 30)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeRef.current(); return }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (!list.length) return
      const first = list[0], last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      if (--locks === 0) html.style.overflow = saved
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [active, ref])
}
