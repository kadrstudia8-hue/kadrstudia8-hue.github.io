/**
 * Read-only DOM tracker: slots (data-v4-slot), readability mask (data-v4-safe), videos (data-v4-video).
 * ENGINE never mutates the DOM. One ResizeObserver + MutationObserver, rects re-read on scroll.
 */
export interface VRect { x: number; y: number; w: number; h: number; visible: boolean }

const MAX_SAFE = 6

class DomTracker {
  slots = new Map<string, HTMLElement>()
  rects = new Map<string, VRect>()
  videos = new Map<string, HTMLVideoElement>()
  safeEls: HTMLElement[] = []
  /** Safe rects in GL uv (x0, y0, x1, y1), bottom-left origin. */
  safe = new Float32Array(MAX_SAFE * 4)
  safeN = 0
  vw = window.innerWidth
  vh = window.innerHeight
  private dirtyScan = true
  private dirtyRects = true
  private lastScroll = -1
  private frame = 0
  private ro: ResizeObserver | null = null
  private mo: MutationObserver | null = null
  private refs = 0

  attach() {
    if (this.refs++ > 0) return
    this.ro = new ResizeObserver(() => { this.dirtyRects = true })
    this.mo = new MutationObserver(() => { this.dirtyScan = true })
    this.mo.observe(document.body, {
      subtree: true, childList: true, attributes: true,
      attributeFilter: ['data-v4-slot', 'data-v4-safe', 'data-v4-video'],
    })
    window.addEventListener('resize', this.onResize)
    this.dirtyScan = true
  }

  detach() {
    if (--this.refs > 0) return
    this.ro?.disconnect(); this.mo?.disconnect()
    window.removeEventListener('resize', this.onResize)
  }

  private onResize = () => { this.dirtyRects = true }

  private scan() {
    this.dirtyScan = false
    this.ro?.disconnect()
    this.slots.clear(); this.videos.clear()
    document.querySelectorAll<HTMLElement>('[data-v4-slot]').forEach((el) => {
      const n = el.dataset.v4Slot
      if (n) { this.slots.set(n, el); this.ro?.observe(el) }
    })
    document.querySelectorAll<HTMLVideoElement>('video[data-v4-video]').forEach((el) => {
      const n = el.dataset.v4Video
      if (n) this.videos.set(n, el)
    })
    this.safeEls = Array.from(document.querySelectorAll<HTMLElement>('[data-v4-safe]'))
    this.dirtyRects = true
  }

  /** Call once per rendered frame. */
  update() {
    this.frame++
    if (this.dirtyScan || this.frame % 90 === 0) this.scan()
    const sy = window.scrollY
    // Re-read on scroll, on resize, and every few frames to follow pinned / transformed elements.
    if (!this.dirtyRects && sy === this.lastScroll && this.frame % 6 !== 0) return
    this.dirtyRects = false
    this.lastScroll = sy
    this.vw = window.innerWidth
    this.vh = window.innerHeight
    for (const [name, el] of this.slots) {
      const r = el.getBoundingClientRect()
      const visible = r.width > 2 && r.height > 2 && r.bottom > -this.vh * 0.25 && r.top < this.vh * 1.25
      const cur = this.rects.get(name)
      if (cur) { cur.x = r.left; cur.y = r.top; cur.w = r.width; cur.h = r.height; cur.visible = visible }
      else this.rects.set(name, { x: r.left, y: r.top, w: r.width, h: r.height, visible })
    }
    for (const name of this.rects.keys()) if (!this.slots.has(name)) this.rects.delete(name)

    const list: { r: DOMRect; a: number }[] = []
    for (const el of this.safeEls) {
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > this.vh || r.width < 1 || r.height < 1) continue
      const a = (Math.min(r.bottom, this.vh) - Math.max(r.top, 0)) * r.width
      list.push({ r, a })
    }
    list.sort((p, q) => q.a - p.a)
    this.safeN = Math.min(MAX_SAFE, list.length)
    for (let i = 0; i < this.safeN; i++) {
      const r = list[i].r
      this.safe[i * 4 + 0] = r.left / this.vw
      this.safe[i * 4 + 1] = 1 - r.bottom / this.vh
      this.safe[i * 4 + 2] = r.right / this.vw
      this.safe[i * 4 + 3] = 1 - r.top / this.vh
    }
  }

  rect(name: string): VRect | null {
    const r = this.rects.get(name)
    return r && r.visible ? r : null
  }

  video(name: string): HTMLVideoElement | null {
    const v = this.videos.get(name)
    return v && v.isConnected ? v : null
  }
}

export const dom = new DomTracker()
