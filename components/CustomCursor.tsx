"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='interactive']";

/**
 * Magnetic blend cursor — desktop fine-pointer only.
 * Soft gold core + trailing ring; grows over links/buttons.
 */
export default function CustomCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const core = coreRef.current;
    const ring = ringRef.current;
    if (!core || !ring) return;

    document.documentElement.classList.add("cursor-none");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const corePos = { x: mouse.x, y: mouse.y };
    const ringPos = { x: mouse.x, y: mouse.y };
    let hovering = false;
    let pressed = false;
    let visible = false;
    let raf = 0;

    const paint = () => {
      // Core tracks closely; ring lags for a premium trail.
      corePos.x += (mouse.x - corePos.x) * 0.42;
      corePos.y += (mouse.y - corePos.y) * 0.42;
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;

      const coreScale = pressed ? 0.55 : hovering ? 0.35 : 1;
      const ringScale = pressed ? 0.75 : hovering ? 1.85 : 1;

      core.style.transform = `translate3d(${corePos.x}px, ${corePos.y}px, 0) translate(-50%, -50%) scale(${coreScale})`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      ring.style.opacity = hovering ? "0.95" : "0.7";

      raf = requestAnimationFrame(paint);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        core.style.opacity = "1";
        ring.style.opacity = "0.7";
      }
      const target = e.target as HTMLElement | null;
      hovering = Boolean(target?.closest?.(INTERACTIVE));
      const typing = Boolean(
        target?.closest?.("input, textarea, select, [contenteditable='true']"),
      );
      if (typing) {
        document.documentElement.classList.remove("cursor-none");
        core.style.opacity = "0";
        ring.style.opacity = "0";
      } else {
        document.documentElement.classList.add("cursor-none");
        if (visible) {
          core.style.opacity = "1";
          ring.style.opacity = hovering ? "0.95" : "0.7";
        }
      }
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const onLeave = () => {
      visible = false;
      core.style.opacity = "0";
      ring.style.opacity = "0";
    };

    core.style.opacity = "0";
    ring.style.opacity = "0";
    raf = requestAnimationFrame(paint);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("cursor-none");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-10 w-10 rounded-full border border-[rgb(var(--gold)/0.55)] bg-[rgb(var(--gold)/0.06)] shadow-[0_0_24px_-6px_rgb(var(--primary)/0.45)] will-change-transform"
        aria-hidden="true"
      />
      <div
        ref={coreRef}
        className="pointer-events-none fixed left-0 top-0 z-[201] h-2 w-2 rounded-full bg-[rgb(var(--gold))] mix-blend-difference will-change-transform"
        aria-hidden="true"
      />
    </>
  );
}
