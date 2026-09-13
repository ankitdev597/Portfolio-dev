"use client";

import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion: reduce`, client-side only. Starts as
 * `false` (matching a plain server render) and flips once mounted, so
 * consumers should treat the first render as "motion allowed" and adjust
 * once this resolves - same pattern already used ad hoc in Reveal,
 * CustomCursor, and Preloader, pulled out here so new components (the
 * Services 3D visuals) don't have to re-implement the matchMedia dance.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mql.matches);

    function handleChange(e: MediaQueryListEvent) {
      setReduced(e.matches);
    }

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
