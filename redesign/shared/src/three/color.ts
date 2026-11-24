/** Resolves any CSS colour (hex, rgb(), hsl(), oklch(), named, or var(--x) relative to `scope`) to sRGB 0..1. */
export function cssColorToRgb(color: string, scope?: Element | null, fallback: [number, number, number] = [1, 1, 1]): [number, number, number] {
  if (typeof document === 'undefined') return fallback
  try {
    let c = color.trim()
    if (c.includes('var(') && scope) {
      const probe = document.createElement('span')
      probe.style.color = c
      probe.style.display = 'none'
      scope.appendChild(probe)
      c = getComputedStyle(probe).color
      probe.remove()
    }
    const cv = document.createElement('canvas')
    cv.width = cv.height = 1
    const ctx = cv.getContext('2d', { willReadFrequently: true })
    if (!ctx) return fallback
    ctx.fillStyle = '#010203'
    ctx.fillStyle = c
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return [r / 255, g / 255, b / 255]
  } catch {
    return fallback
  }
}

export const mixRgb = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** sRGB 0..1 → "#rrggbb" (for three.js Color, which is colour-managed). */
export const rgbToHex = (c: [number, number, number]) =>
  '#' + c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('')
