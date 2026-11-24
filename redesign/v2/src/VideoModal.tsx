// Copy of shared/ui/VideoModal using <m.*> so it works inside <LazyMotion> (keeps the full motion bundle out of the first chunk).
import { X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { attachVideoSource } from '@kadr/shared/ui/media'
import { cx } from '@kadr/shared/ui/cx'
import { useOverlay } from '@kadr/shared/ui/useOverlay'
import { usePrefersReducedMotion } from './lib'

export type VideoModalProps = {
  open: boolean
  onClose: () => void
  /** .mp4 or .m3u8 */
  src: string
  poster?: string
  /** Accessible name of the dialog, e.g. the video title. */
  title: string
  className?: string
  /** Class of the video frame (aspect ratio / radius). Default: 16:9, max 1280px. */
  frameClassName?: string
  closeLabel?: string
  /** Start with sound (the click that opened the modal counts as a user gesture). */
  sound?: boolean
  /** Optional caption tracks. */
  tracks?: { src: string; srclang: string; label: string; default?: boolean }[]
}

/**
 * Fullscreen player for demo videos. Native controls, Esc / backdrop click / close button,
 * focus trap, scroll lock. Portalled to <body>: set --modal-bg on :root (default rgb(0 0 0 / 0.9)) or pass className.
 */
export function VideoModal({
  open, onClose, src, poster, title, className, frameClassName, closeLabel = 'Close', sound = true, tracks,
}: VideoModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()
  useOverlay(open, ref, onClose)

  useEffect(() => {
    const v = videoRef.current
    if (!open || !v) return
    v.muted = !sound
    const detach = attachVideoSource(v, src)
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}) })
    return () => { v.pause(); detach() }
  }, [open, src, sound])

  if (typeof document === 'undefined') return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cx('fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-8', className)}
          style={{ background: 'var(--modal-bg, rgb(0 0 0 / 0.9))' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X size={22} aria-hidden />
          </button>
          <m.div
            className={cx('relative aspect-video max-h-full w-full max-w-[1280px] overflow-hidden rounded-xl bg-black', frameClassName)}
            initial={reduced ? false : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <video ref={videoRef} className="h-full w-full object-contain" poster={poster} controls playsInline data-autofocus>
              {tracks?.map((t) => <track key={t.src} kind="subtitles" src={t.src} srcLang={t.srclang} label={t.label} default={t.default} />)}
            </video>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default VideoModal
