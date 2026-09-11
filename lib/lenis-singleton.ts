import type Lenis from "lenis";

/**
 * Module-level singleton so any component (nav links, scroll-to-top,
 * section anchors) can drive smooth scrolling without prop-drilling a
 * Lenis instance through the whole tree. Set once by <SmoothScroll> on
 * mount, cleared on unmount.
 */
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenisInstance(): Lenis | null {
  return instance;
}

/** Smooth-scrolls to a section by id, accounting for the fixed navbar height. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  if (instance) {
    instance.scrollTo(target, { offset: -88, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
