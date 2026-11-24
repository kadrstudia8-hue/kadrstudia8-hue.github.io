import { Plus } from 'lucide-react'
import { createElement, useId, useState, type ReactNode } from 'react'
import { cx } from './cx'

export type AccordionItem = { id?: string; title: ReactNode; content: ReactNode }

export type AccordionProps = {
  items: AccordionItem[]
  className?: string
  itemClassName?: string
  buttonClassName?: string
  panelClassName?: string
  /** Several panels may be open at once. */
  multiple?: boolean
  /** Indexes open initially. */
  defaultOpen?: number[]
  /** Heading level wrapping each button (WAI-ARIA accordion pattern). */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Custom icon; it gets data-open on the button for styling. Default: a plus that turns into ×. */
  icon?: ReactNode
  onToggle?: (index: number, open: boolean) => void
}

/**
 * FAQ accordion: heading > button[aria-expanded][aria-controls] + region[aria-labelledby].
 * Height animates with the CSS grid 0fr → 1fr trick; closed panels are `inert` (not focusable, hidden from AT).
 * Divider colour: --accordion-border (default currentColor at 15%).
 */
export function Accordion({
  items, className, itemClassName, buttonClassName, panelClassName, multiple = false, defaultOpen = [],
  headingLevel = 3, icon, onToggle,
}: AccordionProps) {
  const uid = useId()
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen))
  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : [])
      const willOpen = !prev.has(i)
      if (willOpen) next.add(i)
      else next.delete(i)
      onToggle?.(i, willOpen)
      return next
    })
  }

  return (
    <div className={className}>
      {items.map((item, i) => {
        const isOpen = open.has(i)
        const bid = `${uid}-b-${item.id ?? i}`, pid = `${uid}-p-${item.id ?? i}`
        return (
          <div
            key={item.id ?? i}
            className={cx('border-b', itemClassName)}
            style={{ borderColor: 'var(--accordion-border, color-mix(in srgb, currentColor 15%, transparent))' }}
            data-open={isOpen || undefined}
          >
            {createElement(
              `h${headingLevel}`,
              { className: 'm-0' },
              <button
                id={bid}
                type="button"
                aria-expanded={isOpen}
                aria-controls={pid}
                data-open={isOpen || undefined}
                onClick={() => toggle(i)}
                className={cx('group flex w-full items-center justify-between gap-6 py-5 text-left', buttonClassName)}
              >
                <span className="min-w-0">{item.title}</span>
                {icon ?? (
                  <Plus
                    aria-hidden
                    size={20}
                    className={cx('shrink-0 transition-transform duration-300 motion-reduce:transition-none', isOpen && 'rotate-45')}
                  />
                )}
              </button>,
            )}
            <div
              id={pid}
              role="region"
              aria-labelledby={bid}
              inert={!isOpen || undefined}
              className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="min-h-0 overflow-hidden">
                <div className={cx('pb-5 opacity-80', panelClassName)}>{item.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
