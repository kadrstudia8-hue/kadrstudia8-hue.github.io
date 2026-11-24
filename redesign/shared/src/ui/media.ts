/** Attaches an mp4 or HLS (.m3u8) source to a <video>. hls.js is loaded lazily (own chunk) and only when the
 *  browser has no native HLS (Safari/iOS play .m3u8 natively). Returns a cleanup function. */
export function isHls(src: string): boolean {
  return /\.m3u8(\?|#|$)/i.test(src)
}

export function attachVideoSource(video: HTMLVideoElement, src: string, onReady?: () => void): () => void {
  let disposed = false
  let destroy: (() => void) | undefined
  const ready = () => { if (!disposed) onReady?.() }

  if (!isHls(src) || video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src
    video.addEventListener('loadeddata', ready, { once: true })
    return () => {
      disposed = true
      video.removeEventListener('loadeddata', ready)
      video.removeAttribute('src')
      video.load()
    }
  }

  import('hls.js').then(({ default: Hls }) => {
    if (disposed) return
    if (!Hls.isSupported()) { video.src = src; video.addEventListener('loadeddata', ready, { once: true }); return }
    const hls = new Hls({ capLevelToPlayerSize: true, startLevel: -1 })
    hls.loadSource(src)
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED, ready)
    hls.on(Hls.Events.ERROR, (_e, data) => {
      if (!data.fatal) return
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
      else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
      else hls.destroy()
    })
    destroy = () => hls.destroy()
  })

  return () => { disposed = true; destroy?.() }
}
