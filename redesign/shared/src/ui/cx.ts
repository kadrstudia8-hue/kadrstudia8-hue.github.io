/** Tiny className joiner (no tailwind-merge: later classes do not override earlier ones by specificity). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** 'relative' unless the caller's className already sets a position (Tailwind has no merge: both would apply
 *  and the stylesheet order, not the class order, would decide). */
export function rel(className?: string): string {
  return className && /(^|\s|:)(absolute|fixed|sticky|static|relative)(\s|$)/.test(className) ? '' : 'relative'
}
