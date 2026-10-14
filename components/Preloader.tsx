"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { profile } from "@/data/profile";

const PreloaderScene = dynamic(() => import("@/components/PreloaderScene"), { ssr: false });

const MIN_VISIBLE_MS = 750;
const MAX_VISIBLE_MS = 1800;

/**
 * Brand loading screen. Uses a CSS fallback on coarse pointers / reduce-motion /
 * Save-Data so mobile devices are not charged a WebGL cost for a brief splash.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [useScene, setUseScene] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedAtRef = useRef(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    mountedAtRef.current = performance.now();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const saveData =
      typeof navigator !== "undefined" &&
      "connection" in navigator &&
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

    // Client-only capability check — must run after mount (matchMedia /
    // navigator.connection are unavailable during SSR).
    if (!prefersReducedMotion && !coarsePointer && !saveData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUseScene(true);
    }

    function hide() {
      if (hiddenRef.current) return;
      hiddenRef.current = true;

      const el = containerRef.current;
      if (!el || prefersReducedMotion) {
        setVisible(false);
        return;
      }
      gsap.to(el, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => setVisible(false),
      });
    }

    function scheduleHide() {
      const elapsed = performance.now() - mountedAtRef.current;
      const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);
      window.setTimeout(hide, remaining);
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
      scheduleHide();
    } else {
      document.addEventListener("DOMContentLoaded", scheduleHide, { once: true });
    }

    const maxTimer = window.setTimeout(hide, MAX_VISIBLE_MS);

    return () => {
      document.removeEventListener("DOMContentLoaded", scheduleHide);
      window.clearTimeout(maxTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-background"
    >
      <div className="flex h-36 w-full max-w-sm items-center justify-center sm:h-44">
        {useScene ? (
          <div className="h-full w-full">
            <PreloaderScene />
          </div>
        ) : (
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/25 bg-primary/5"
            aria-hidden="true"
          >
            <span className="h-10 w-10 rounded-full border-2 border-primary/50 border-t-transparent motion-safe:animate-spin" />
          </div>
        )}
      </div>
      <p className="text-lg font-semibold tracking-wide text-text sm:text-xl">{profile.fullName}</p>
      <div className="h-px w-28 overflow-hidden rounded-full bg-gold/20" aria-hidden="true">
        <div className="loader-sweep h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
      <span className="sr-only">Loading {profile.fullName}&apos;s portfolio…</span>
    </div>
  );
}
