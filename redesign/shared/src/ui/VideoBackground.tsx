import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { attachVideoSource } from './media'
import { cx, rel } from './cx'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type VideoBackgroundProps = {
  /** .mp4 or .m3u8 (HLS: native in Safari, hls.js elsewhere, loaded lazily). */
  src: string
  poster?: string
  className?: string
  videoClassName?: string
  /** Seconds of fade-in at the start and fade-out at the end of every loop. 0 = plain loop. */
  fade?: number
  /** object-position of the video and poster, e.g. "50% 30%". */
  position?: string
  /** Rendered on top of the video (overlays, gradients, content). */
  children?: ReactNode
  /** Start loading only when the element nears the viewport (default true). */
  lazy?: boolean
  /** Inline style for the root. */
  style?: CSSProperties
}

/**
 * Fullscreen decorative background video. Behind the video sits the poster (and the root background:
 * set `--video-bg` or a bg-* class), so each loop fades out to the poster and back in: no hard cut.
 * Paused while off-screen. With prefers-reduced-motion only the poster is shown.
 */
export function VideoBackground({
  src, poster, className, videoClassName, fade = 1, position = '50% 50%', children, lazy = true, style,
}: VideoBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()
  const [near, setNear] = useState(!lazy)
  const visible = useRef(false)

  // load when close to the viewport; play / pause on visibility
  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        visible.current = e.isIntersecting
        if (e.isIntersecting) setNear(true)
        const v = videoRef.current
        if (!v || !v.src && !v.currentSrc) continue
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      }
    }, { rootMargin: '200px 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [reduced])

  // source + fade loop
  useEffect(() => {
    const v = videoRef.current
    if (!v || reduced || !near) return
    v.muted = true
    v.style.opacity = '0'
    let raf = 0
    const tick = () => {
      raf = 0
      const d = v.duration
      if (fade > 0 && isFinite(d) && d > 0) {
        const t = v.currentTime
        const f = Math.min(fade, d / 3)
        const o = Math.max(0, Math.min(1, t / f, (d - t) / f))
        v.style.opacity = String(o)
      } else v.style.opacity = '1'
      if (!v.paused) raf = requestAnimationFrame(tick)
    }
    const onPlay = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const onEnded = () => { v.currentTime = 0; if (visible.current) v.play().catch(() => {}) }
    v.addEventListener('playing', onPlay)
    v.addEventListener('ended', onEnded)
    const detach = attachVideoSource(v, src, () => { if (visible.current) v.play().catch(() => {}) })
    // preload="none": play() is what starts loading; the poster stays until frames arrive
    if (visible.current) v.play().catch(() => {})
    return () => {
      cancelAnimationFrame(raf)
      v.removeEventListener('playing', onPlay)
      v.removeEventListener('ended', onEnded)
      detach()
    }
  }, [src, fade, reduced, near])

  const media = 'absolute inset-0 h-full w-full object-cover'
  return (
    <div
      ref={rootRef}
      className={cx(rel(className), 'overflow-hidden', className)}
      style={{ background: 'var(--video-bg, transparent)', ...style }}
    >
      {poster && <img src={poster} alt="" aria-hidden decoding="async" className={media} style={{ objectPosition: position }} />}
      {!reduced && (
        <video
          ref={videoRef}
          className={cx(media, videoClassName)}
          style={{ objectPosition: position, opacity: 0 }}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden
          tabIndex={-1}
          // loop is done manually so the fade can run on both ends
        />
      )}
      {children != null && <div className="relative h-full">{children}</div>}
    </div>
  )
}

export default VideoBackground
