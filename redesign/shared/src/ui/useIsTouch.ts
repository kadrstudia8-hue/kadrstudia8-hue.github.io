import { useMediaQuery } from './useMediaQuery'

/** Primary input cannot hover / is coarse (phones, tablets). Hybrid laptops with a mouse report false. */
export const TOUCH_QUERY = '(hover: none), (pointer: coarse)'

export function useIsTouch(): boolean {
  return useMediaQuery(TOUCH_QUERY)
}

export default useIsTouch

/** Real mouse / trackpad: cursor effects (magnetic, tilt, glare) only run when this is true. */
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

export function useHasFinePointer(): boolean {
  return useMediaQuery(FINE_POINTER_QUERY)
}
