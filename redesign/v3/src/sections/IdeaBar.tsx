import { Check, ChevronDown, SendHorizontal } from 'lucide-react'
import { AnimatePresence, m as motion } from 'motion/react'
import { useReducedMotion } from '../lib/motion'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '@kadr/shared/i18n'
import { COPY } from '../copy'

const FORMATS = ['9:16', '16:9', '1:1', '4:5']

/**
 * «Idea bar» in place of the reference search field: an imitation of the app's main screen. Real prompts from #proof
 * are typed (28 ms/char) → pause 1.6 s → erased → next; ➤ pulses once before each change. Stops while focused/hovered.
 * Click / Enter → scroll to #proof with that example selected. Not a real input.
 */
export function IdeaBar({ onPick }: { onPick: (i: number) => void }) {
  const { t, lang } = useLang()
  const c = COPY[lang]
  const reduced = useReducedMotion()
  const ex = t.proof.examples
  const [i, setI] = useState(0)
  const [n, setN] = useState(reduced ? ex[0].prompt.length : 0)
  const [pulse, setPulse] = useState(0)
  const [hold, setHold] = useState(false)
  const [fmt, setFmt] = useState(0)
  const [open, setOpen] = useState(false)
  const seg = useRef<HTMLDivElement>(null)
  const textBox = useRef<HTMLSpanElement>(null)

  useEffect(() => { setI(0); setN(reduced ? ex[0].prompt.length : 0) }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // typing machine
  const phase = useRef<'type' | 'wait' | 'erase'>('type')
  useEffect(() => {
    if (reduced || hold) return
    const full = ex[i].prompt
    let id: ReturnType<typeof setTimeout>
    if (phase.current === 'type') {
      if (n < full.length) id = setTimeout(() => setN(n + 1), 28)
      else { phase.current = 'wait'; id = setTimeout(() => { setPulse((p) => p + 1); phase.current = 'erase'; setN(n - 1) }, 1600) }
    } else if (phase.current === 'erase') {
      if (n > 0) id = setTimeout(() => setN(Math.max(0, n - 3)), 12)
      else { phase.current = 'type'; id = setTimeout(() => setI((i + 1) % ex.length), 260) }
    }
    return () => clearTimeout(id!)
  }, [n, i, hold, reduced, ex])

  // keep the caret visible: the text box scrolls to its end while typing
  useEffect(() => { const el = textBox.current; if (el) el.scrollLeft = el.scrollWidth }, [n])

  useEffect(() => {
    if (!open) return
    const off = (e: MouseEvent) => { if (!seg.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', off); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', esc) }
  }, [open])

  const go = () => onPick(i)
  const shown = ex[i].prompt.slice(0, n)

  return (
    <div className="wrap relative z-20 -mt-[28px] md:-mt-[32px] lg:-mt-[38px]">
      <div
        className="mx-auto flex h-14 w-full items-center gap-1 rounded-full pl-1.5 pr-1 md:h-16 md:max-w-[640px] md:pl-2 md:pr-1.5 lg:h-[76px] lg:max-w-[720px] lg:pr-2"
        style={{ background: 'rgba(255,255,255,.88)', boxShadow: '0 0 0 8px rgba(255,255,255,.14), 0 20px 50px -20px rgba(5,2,20,.7)', WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
        onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)} onBlur={() => setHold(false)}
      >
        <motion.button
          type="button" onClick={go} aria-label={`${t.proof.tablistLabel}: ${ex[i].label}`}
          key={pulse}
          animate={reduced || pulse === 0 ? undefined : { scale: [1, 1.18, 1] }}
          transition={{ duration: .5, ease: 'easeOut' }}
          whileHover={reduced ? undefined : { rotate: -12, scale: 1.1 }}
          whileTap={{ scale: .9 }}
          className="grid size-11 flex-none place-items-center rounded-full text-[#15101F] focus-visible:!outline-violet"
        >
          <SendHorizontal size={20} strokeWidth={1.9} aria-hidden />
        </motion.button>
        <button type="button" onClick={go} className="relative h-full min-w-0 flex-1 cursor-pointer text-left focus-visible:!outline-offset-[-2px] focus-visible:!outline-violet" aria-label={`${t.proof.tablistLabel}: ${ex[i].prompt}`}>
          <span ref={textBox} aria-hidden className="flex h-full items-center overflow-hidden whitespace-nowrap pr-2 text-[15px] font-normal text-[#2a2140] md:text-[16px]"
            style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 28px)', maskImage: 'linear-gradient(90deg, transparent 0, #000 28px)' }}>
            {shown}<span className="caret" />
          </span>
        </button>
        <div ref={seg} className="relative h-12 w-[84px] flex-none md:h-[52px] md:w-[150px] lg:h-[60px] lg:w-[220px]">
          <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={`${c.format}: ${FORMATS[fmt]}`} onClick={() => setOpen((o) => !o)}
            className="group flex h-full w-full items-center justify-center gap-1.5 rounded-full bg-[#15101F] text-[16px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#231A38] active:scale-[.98] focus-visible:!outline-offset-[-4px] lg:gap-3 lg:text-[20px]">
            {FORMATS[fmt]}
            <ChevronDown size={18} className="transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden />
          </button>
          <AnimatePresence>
            {open && (
              <motion.ul role="listbox" aria-label={c.format}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .16 }}
                className="absolute right-0 top-[calc(100%+12px)] z-30 m-0 w-[150px] list-none rounded-2xl bg-[#15101F] p-1.5 shadow-[0_20px_40px_-12px_rgba(5,2,20,.8)] lg:w-full">
                {FORMATS.map((f, k) => (
                  <li key={f}>
                    <button type="button" role="option" aria-selected={k === fmt} onClick={() => { setFmt(k); setOpen(false) }}
                      className="flex h-11 w-full items-center justify-between rounded-xl px-3 text-[15px] font-medium text-white/85 hover:bg-white/10">
                      {f}{k === fmt && <Check size={15} className="text-lilac" aria-hidden />}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
