import { motion, type Variants } from 'motion/react'
import { createElement, useMemo, type CSSProperties } from 'react'
import { EASE_OUT } from './revealVariants'
import { cx, rel } from './cx'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type SplitHeadingProps = {
  /** Plain text. "\n" forces a line break. A soft hyphen (U+00AD, &shy;) marks where a long word may break. */
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'
  className?: string
  style?: CSSProperties
  /** Class for every word wrapper (e.g. to italicise / colour via CSS). */
  wordClassName?: string
  /** 'words' — each word animates; 'chars' — each letter (grapheme) animates. */
  split?: 'words' | 'chars'
  /** 'rise' slides up from a mask, 'fade' fades, 'blur' blurs in. */
  variant?: 'rise' | 'fade' | 'blur'
  /** seconds between units */
  stagger?: number
  delay?: number
  duration?: number
  /** Animate on mount instead of on scroll into view. */
  immediate?: boolean
  once?: boolean
  /** In 'chars' mode words longer than this are animated as a whole so they can still hyphenate / wrap. */
  longWord?: number
  /** Language for hyphenation (hyphens: auto), e.g. "de". Inherited from <html lang> when omitted. */
  lang?: string
  id?: string
}

const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null
const graphemes = (w: string) => (segmenter ? Array.from(segmenter.segment(w), (s) => s.segment) : Array.from(w))

/**
 * Big heading animated word by word or letter by letter. Screen readers get the plain text (sr-only),
 * the animated spans are aria-hidden. Words are atomic boxes that wrap naturally; inside a word the text
 * keeps `hyphens: auto` + `overflow-wrap: anywhere`, so very long German compounds wrap instead of
 * overflowing on 375 px. Unicode-aware (Cyrillic, diacritics, emoji) via Intl.Segmenter.
 */
export function SplitHeading({
  text, as = 'h2', className, style, wordClassName, split = 'words', variant = 'rise', stagger, delay = 0,
  duration = 0.9, immediate = false, once = true, longWord = 13, lang, id,
}: SplitHeadingProps) {
  const reduced = usePrefersReducedMotion()
  const step = stagger ?? (split === 'chars' ? 0.025 : 0.07)
  const lines = useMemo(() => text.split('\n').map((l) => l.split(/\s+/).filter(Boolean)), [text])

  const unit: Variants = reduced
    ? { hidden: { opacity: 1 }, shown: { opacity: 1 } }
    : variant === 'rise'
      ? { hidden: { y: '110%' }, shown: { y: '0%', transition: { duration, ease: EASE_OUT } } }
      : variant === 'blur'
        ? { hidden: { opacity: 0, filter: 'blur(10px)' }, shown: { opacity: 1, filter: 'blur(0px)', transition: { duration, ease: EASE_OUT } } }
        : { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration, ease: EASE_OUT } } }

  const container: Variants = { hidden: {}, shown: { transition: { staggerChildren: reduced ? 0 : step, delayChildren: reduced ? 0 : delay } } }
  const mask = variant === 'rise' && !reduced
  // the mask clips descenders unless the box is padded; compensated by a negative margin
  const maskStyle: CSSProperties = mask ? { overflow: 'clip', paddingBottom: '0.12em', marginBottom: '-0.12em', paddingTop: '0.04em', marginTop: '-0.04em' } : {}
  const wrapStyle: CSSProperties = { hyphens: 'auto', WebkitHyphens: 'auto', overflowWrap: 'anywhere' }

  const plain = text.replace(/­/g, '').replace(/\n/g, ' ')
  const animProps = immediate
    ? { initial: 'hidden', animate: 'shown' }
    : { initial: 'hidden', whileInView: 'shown', viewport: { once, amount: 0.3 } }

  return createElement(
    as,
    { className: cx(rel(className), className), style, lang, id },
    <span className="sr-only">{plain}</span>,
    <motion.span aria-hidden className="block" variants={container} {...animProps}>
      {lines.map((words, li) => (
        <span key={li} className="block">
          {words.map((word, wi) => {
            const asChars = split === 'chars' && !reduced && graphemes(word).length <= longWord && !word.includes('­')
            return (
              <span key={wi}>
                <span className={cx('inline-block max-w-full align-top', wordClassName)} style={{ ...maskStyle, ...wrapStyle, ...(asChars ? { whiteSpace: 'nowrap' } : null) }}>
                  {asChars ? (
                    graphemes(word).map((g, gi) => (
                      <motion.span key={gi} className="inline-block" variants={unit} style={{ whiteSpace: 'pre' }}>{g}</motion.span>
                    ))
                  ) : (
                    <motion.span className="inline-block max-w-full" variants={unit}>{word}</motion.span>
                  )}
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </span>
            )
          })}
        </span>
      ))}
    </motion.span>,
  )
}

export default SplitHeading
