import { getLenisInstance } from "@/lib/lenis-singleton";

/**
 * Clears overflow locks from the preloader / menus and restarts Lenis
 * so the page never stays stuck after load or overlay close.
 */
export function unlockPageScroll() {
  if (typeof document === "undefined") return;

  document.documentElement.style.overflow = "";
  document.documentElement.style.overflowY = "";
  document.body.style.overflow = "";
  document.body.style.overflowY = "";
  document.body.style.touchAction = "";
  document.documentElement.classList.remove("overflow-hidden");
  document.body.classList.remove("overflow-hidden");

  const lenis = getLenisInstance();
  if (lenis) {
    lenis.start();
    // Nudge RAF so wheel/touch works immediately after overlays.
    lenis.resize();
  }
}
