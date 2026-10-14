"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, for revealing a row of items in sequence. */
  delay?: number;
  y?: number;
}

/**
 * Grouped fade/rise reveal via GSAP + ScrollTrigger.
 * Scoped with gsap.context; failsafe keeps content visible if ST stalls.
 * Do not wrap the Hero — it uses its own entrance timeline.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(el, { clearProps: "all", opacity: 1, y: 0 });
      return;
    }

    const safeDelay = Math.min(Math.max(delay, 0), 0.14);
    let completed = false;
    let failSafe = 0;
    let trigger: ScrollTrigger | undefined;

    const ctx = gsap.context(() => {
      const show = () => {
        gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
      };

      const reveal = () => {
        if (completed) return;
        completed = true;
        window.clearTimeout(failSafe);
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.68,
          delay: safeDelay,
          ease: "power2.out",
          clearProps: "transform",
          overwrite: true,
        });
      };

      failSafe = window.setTimeout(() => {
        if (completed) return;
        completed = true;
        show();
      }, 3000);

      const inView = el.getBoundingClientRect().top < window.innerHeight * 0.94;
      gsap.set(el, { opacity: 0, y });

      if (inView) {
        // Slight delay so hero timeline owns the first paint.
        window.requestAnimationFrame(() => reveal());
        return;
      }

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: reveal,
      });
    }, el);

    return () => {
      window.clearTimeout(failSafe);
      trigger?.kill();
      ctx.revert();
      gsap.set(el, { clearProps: "all", opacity: 1, y: 0 });
    };
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
