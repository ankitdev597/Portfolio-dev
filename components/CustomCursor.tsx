"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Trailing-ring custom cursor, desktop fine-pointer only. Bails out
 * entirely on touch devices and under prefers-reduced-motion instead of
 * degrading in place, and always removes the `cursor-none` class it sets
 * on <html> so a hot-reload or unmount never leaves the native cursor
 * hidden with nothing drawing in its place.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isFinePointer || prefersReducedMotion) {
      return;
    }

    // matchMedia is only meaningful client-side (no server render of a
    // pointer/motion-preference-dependent cursor to hydrate against), so
    // this reveal has to happen in an effect rather than an initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("cursor-none");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    function handleMove(e: MouseEvent) {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.05, overwrite: true });
      gsap.to(ringPos, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          if (ring) {
            ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
          }
        },
      });
    }

    function handleDown() {
      gsap.to(ring, { scale: 0.7, duration: 0.2 });
    }
    function handleUp() {
      gsap.to(ring, { scale: 1, duration: 0.2 });
    }

    function handleHoverable(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, [role='button']",
      );
      gsap.to(ring, { scale: el ? 1.6 : 1, duration: 0.25 });
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousemove", handleHoverable);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousemove", handleHoverable);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60"
        aria-hidden="true"
      />
    </>
  );
}
