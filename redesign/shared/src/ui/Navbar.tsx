import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from './cx'
import { useOverlay } from './useOverlay'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type NavLink = { href: string; label: ReactNode }

export type NavbarProps = {
  /** Logo / wordmark (wrap it in your own <a href="/">). */
  brand: ReactNode
  links?: NavLink[]
  /** Language menu slot (desktop bar and mobile overlay). */
  langSlot?: ReactNode
  /** CTA slot, e.g. a MagneticButton (desktop bar and mobile overlay). */
  actions?: ReactNode
  className?: string
  /** Inner container class (max width / padding). */
  innerClassName?: string
  linkClassName?: string
  /** Extra classes applied once the page is scrolled past `threshold`. */
  scrolledClassName?: string
  overlayClassName?: string
  /** px of scroll before the bar turns to glass */
  threshold?: number
  /** Accessible labels (localise them). */
  labels?: { nav?: string; open?: string; close?: string }
  /** Breakpoint at which the desktop links appear: 'md' (768) or 'lg' (1024). */
  breakpoint?: 'md' | 'lg'
}

/**
 * Minimal fixed header: transparent at the top, glass after scrolling. Below the breakpoint the links move
 * into a full-screen overlay (focus trap, Esc, scroll lock).
 * CSS variables: --nav-glass-bg (default rgb(10 10 10 / 0.55)), --nav-border (rgb(255 255 255 / 0.08)),
 *                --nav-overlay-bg (rgb(5 5 5 / 0.96)), --nav-blur (16px).
 */
export function Navbar({
  brand, links = [], langSlot, actions, className, innerClassName, linkClassName, scrolledClassName, overlayClassName,
  threshold = 24, labels, breakpoint = 'md',
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  // the overlay is portalled to <body>, outside the themed wrapper: carry the header's colour, font and vars over
  const [inherited, setInherited] = useState<CSSProperties>({})
  const reduced = usePrefersReducedMotion()
  const close = useCallback(() => setOpen(false), [])
  useOverlay(open, overlayRef, close)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [threshold])

  useEffect(() => {
    const h = headerRef.current
    if (!open || !h) return
    const cs = getComputedStyle(h)
    const v = (n: string, d: string) => cs.getPropertyValue(n).trim() || d
    const blur = v('--nav-blur', '16px')
    const vars: Record<string, string> = {}
    for (let i = 0; i < cs.length; i++) if (cs[i].startsWith('--')) vars[cs[i]] = cs.getPropertyValue(cs[i])
    setInherited({
      ...(vars as CSSProperties),
      color: cs.color,
      fontFamily: cs.fontFamily,
      background: v('--nav-overlay-bg', 'rgb(5 5 5 / 0.96)'),
      backdropFilter: `blur(${blur})`,
      WebkitBackdropFilter: `blur(${blur})`,
    })
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia(breakpoint === 'lg' ? '(min-width: 1024px)' : '(min-width: 768px)')
    const on = () => { if (mq.matches) setOpen(false) }
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [breakpoint])

  const desk = breakpoint === 'lg' ? 'hidden lg:flex' : 'hidden md:flex'
  const mob = breakpoint === 'lg' ? 'lg:hidden' : 'md:hidden'
  const glass = scrolled
    ? {
        background: 'var(--nav-glass-bg, rgb(10 10 10 / 0.55))',
        borderBottomColor: 'var(--nav-border, rgb(255 255 255 / 0.08))',
        backdropFilter: 'blur(var(--nav-blur, 16px)) saturate(140%)',
        WebkitBackdropFilter: 'blur(var(--nav-blur, 16px)) saturate(140%)',
      }
    : { background: 'transparent', borderBottomColor: 'transparent' }

  return (
    <header
      ref={headerRef}
      className={cx('fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300', className, scrolled && scrolledClassName)}
      style={glass}
      data-scrolled={scrolled || undefined}
    >
      <div className={cx('mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6', innerClassName)}>
        <div className="flex min-w-0 shrink-0 items-center">{brand}</div>
        <nav aria-label={labels?.nav ?? 'Main'} className={cx(desk, 'min-w-0 items-center gap-7')}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className={cx('text-sm opacity-80 transition-opacity hover:opacity-100', linkClassName)}>{l.label}</a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          {langSlot && <div className={desk}>{langSlot}</div>}
          {actions && <div className={desk}>{actions}</div>}
          <button
            type="button"
            className={cx(mob, '-mr-2 inline-flex size-10 items-center justify-center rounded-full')}
            aria-label={labels?.open ?? 'Open menu'}
            aria-expanded={open}
            aria-controls="kadr-nav-overlay"
            onClick={() => setOpen(true)}
          >
            <Menu size={22} aria-hidden />
          </button>
        </div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={overlayRef}
              id="kadr-nav-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={labels?.nav ?? 'Main'}
              className={cx('fixed inset-0 z-[60] flex flex-col overflow-y-auto px-6 pb-10', overlayClassName)}
              style={inherited}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between">
                <div onClick={close}>{brand}</div>
                <button type="button" className="-mr-2 inline-flex size-10 items-center justify-center rounded-full" aria-label={labels?.close ?? 'Close menu'} onClick={close} data-autofocus>
                  <X size={24} aria-hidden />
                </button>
              </div>
              <nav aria-label={labels?.nav ?? 'Main'} className="mt-8 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className={cx('py-3 text-3xl leading-tight', linkClassName)}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>
              {(langSlot || actions) && (
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-10">
                  {langSlot}
                  {actions && <div onClick={close}>{actions}</div>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  )
}

export default Navbar
