// Video helpers: lazy muted loops that only play on screen, and a modal player.
import { X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useOverlay } from '@kadr/shared/ui/useOverlay'
import { CALM } from './env'
import { cx } from './kit'
import { lockScroll } from './stage'

/** Muted looping video: src is attached near the viewport, plays only while visible and `play` is true. */
export function AutoVideo({ src, poster, label, play = true, className, slot, hidden, fit = 'cover' }: {
  src: string; poster?: string; label?: string; play?: boolean; className?: string; slot?: string; hidden?: boolean; fit?: 'cover' | 'contain'
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io1.disconnect() } }, { rootMargin: '600px 0px' })
    const io2 = new IntersectionObserver(([e]) => setVis(e.isIntersecting), { threshold: 0.15 })
    io1.observe(el); io2.observe(el)
    return () => { io1.disconnect(); io2.disconnect() }
  }, [])
  useEffect(() => {
    const el = ref.current
    if (!el || !near) return
    if (play && vis && !CALM) el.play().catch(() => {})
    else el.pause()
  }, [play, vis, near])
  return (
    <video
      ref={ref}
      className={cx('vid', fit === 'contain' && 'vid-contain', className)}
      src={near && !CALM ? src : undefined}
      poster={poster}
      muted loop playsInline preload="none"
      aria-label={label}
      aria-hidden={hidden || !label ? true : undefined}
      data-v4-video={slot}
      tabIndex={-1}
    />
  )
}

/** Fullscreen player (tutorial). */
export function VideoModal({ open, onClose, src, poster, label, closeLabel, children }: {
  open: boolean; onClose: () => void; src: string; poster: string; label: string; closeLabel: string; children?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useOverlay(open, ref, onClose)
  useEffect(() => { lockScroll(open) }, [open])
  if (!open) return null
  return createPortal(
    <div ref={ref} className="modal" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <button type="button" className="round-btn modal-x" onClick={onClose} aria-label={closeLabel} data-autofocus><X size={20} /></button>
        <video className="modal-v" src={src} poster={poster} controls autoPlay playsInline aria-label={label} />
        {children}
      </div>
    </div>,
    document.body,
  )
}
