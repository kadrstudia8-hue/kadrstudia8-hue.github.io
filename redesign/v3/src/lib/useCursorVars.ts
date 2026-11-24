import type { PointerEvent } from 'react'

/** Sets --cx/--cy on the element (cursor position) for the glass glare. */
export function glareMove(e: PointerEvent<HTMLElement>) {
  if (e.pointerType === 'touch') return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--cx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--cy', `${e.clientY - r.top}px`)
}
