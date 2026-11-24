// Video helpers: lazy muted loops that only play on screen, and a modal player.
import { X } from 'lucide-react'
import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useOverlay } from '@kadr/shared/ui/useOverlay'
import { CALM } from './env'
import { cx } from './kit'
import { lockScroll, onFrame, useSceneOwns } from './stage'

/** Muted looping video: src is attached near the viewport, plays only while visible and `play` is true. */
/** Whether the element is on screen: IntersectionObserver plus a cheap rect poll (the scene hides slots with opacity 0). */
export function useOnScreen(ref: React.RefObject<Element | null>, margin = 0) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: `${margin}px 0px` })
    io.observe(el)
    let n = 0
    const off = onFrame(() => {
      if (++n % 12) return
      const r = el.getBoundingClientRect()
      const v = r.bottom > -margin && r.top < innerHeight + margin && r.width > 0
      setOn((p) => (p === v ? p : v))
    })
    return () => { io.disconnect(); off() }
  }, [ref, margin])
  return on
}

type AutoVideoProps = {
  src: string; poster?: string; label?: string; play?: boolean; className?: string; slot?: string; hidden?: boolean; fit?: 'cover' | 'contain'
  /** Attach src right away (hero after hero:play). */
  eager?: boolean
}

/** A failing video never takes the page down: it degrades to its poster. */
class MediaBoundary extends Component<{ poster?: string; className?: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(e: unknown) { console.warn('[v4] video disabled:', e) }
  render() {
    if (!this.state.failed) return this.props.children
    return this.props.poster ? <img className={cx('vid', this.props.className)} src={this.props.poster} alt="" aria-hidden /> : null
  }
}

export function AutoVideo(p: AutoVideoProps) {
  return <MediaBoundary poster={p.poster} className={p.className}><AutoVideoInner {...p} /></MediaBoundary>
}

function AutoVideoInner({ src, poster, label, play = true, className, slot, hidden, fit = 'cover', eager }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const owns = useSceneOwns()
  const nearNow = useOnScreen(ref, 600)
  const vis = useOnScreen(ref)
  const [near, setNear] = useState(false)
  useEffect(() => { if (nearNow || eager) setNear(true) }, [nearNow, eager])
  // the scene draws slot videos as textures: they must have src and play even while the DOM copy is invisible
  const live = owns && !!slot ? true : !CALM
  useEffect(() => {
    const el = ref.current
    if (!el || !near) return
    if (play && vis && live) { el.muted = true; el.play().catch(() => {}) }
    else el.pause()
  }, [play, vis, near, live, src])
  return (
    <video
      ref={ref}
      className={cx('vid', fit === 'contain' && 'vid-contain', className)}
      src={near && live ? src : undefined}
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
