import { useMediaQuery } from './useMediaQuery'

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** true when the user asked the OS for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY)
}

export default usePrefersReducedMotion
