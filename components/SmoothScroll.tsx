"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenisInstance } from "@/lib/lenis-singleton";

/** Register once on the client; Safe to call repeatedly from components. */
function ensureScrollTrigger() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
}
ensureScrollTrigger();

/**
 * Lenis + ScrollTrigger bridge. Skipped under prefers-reduced-motion.
 * Refreshes triggers after layout settle and on resize.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    setLenisInstance(lenis);

    const unsubScroll = lenis.on("scroll", ScrollTrigger.update);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 450);

    let resizeTimer: number;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    }
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.clearTimeout(refreshId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      unsubScroll();
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}
