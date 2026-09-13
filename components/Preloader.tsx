"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "@/data/profile";

// Held on screen for at least this long even if the page loads instantly,
// so the preloader reads as an intentional brand moment rather than a
// one-frame flash on a fast connection.
const MIN_VISIBLE_MS = 700;

/**
 * Full-screen loading screen shown on every hard navigation/refresh.
 * Renders visible by default (no client-only gate needed - there's
 * nothing here that depends on a browser API to decide the *initial*
 * render), then fades itself out once the window has fully loaded and
 * the minimum on-screen duration has elapsed.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedAtRef = useRef(0);

  useEffect(() => {
    mountedAtRef.current = performance.now();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function hide() {
      const el = containerRef.current;
      if (!el || prefersReducedMotion) {
        setVisible(false);
        return;
      }
      gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => setVisible(false),
      });
    }

    function scheduleHide() {
      const elapsed = performance.now() - mountedAtRef.current;
      const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);
      window.setTimeout(hide, remaining);
    }

    if (document.readyState === "complete") {
      scheduleHide();
      return;
    }

    window.addEventListener("load", scheduleHide, { once: true });
    return () => window.removeEventListener("load", scheduleHide);
  }, []);

  if (!visible) return null;

  const initials = profile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-background"
    >
      <span className="text-3xl font-bold tracking-wide text-aurora">{initials}</span>
      <div className="h-px w-28 overflow-hidden rounded-full bg-white/10">
        <div className="loader-sweep h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
      <span className="sr-only">Loading {profile.fullName}&apos;s portfolio…</span>
    </div>
  );
}
