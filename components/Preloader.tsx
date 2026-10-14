"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "@/data/profile";
import { getLenisInstance } from "@/lib/lenis-singleton";
import { unlockPageScroll } from "@/lib/unlock-scroll";

/** Premium pacing — long enough to feel intentional, never endless. */
const MIN_DURATION_MS = 2400;
const MAX_DURATION_MS = 4800;

/**
 * Cinematic brand loader: GSAP-driven 0→100% counter + gold progress rail,
 * then a boom reveal. 3D orb lives full-screen on the hero — not here.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [percent, setPercent] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLParagraphElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  const progressProxy = useRef({ value: 0 });
  const loadDoneRef = useRef(false);
  const boomStartedRef = useRef(false);
  const mountedAtRef = useRef(0);

  useEffect(() => {
    mountedAtRef.current = performance.now();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    getLenisInstance()?.stop();

    const root = rootRef.current;
    const brand = brandRef.current;
    const bar = barFillRef.current;
    const spin = spinRef.current;
    const label = labelRef.current;
    const pctEl = percentRef.current;

    if (!prefersReducedMotion && root) {
      const tlIn = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlIn
        .fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .fromTo(
          brand,
          { opacity: 0, y: 24, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
          0.12,
        )
        .fromTo(label, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.28)
        .fromTo(
          [spin, pctEl, bar?.parentElement],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 },
          0.22,
        );
    }

    function setProgressVisual(value: number) {
      const rounded = Math.max(0, Math.min(100, Math.round(value)));
      setPercent(rounded);
      if (bar) gsap.set(bar, { width: `${rounded}%` });
      if (pctEl) pctEl.textContent = String(rounded).padStart(2, "0");
    }

    const progressTween = gsap.to(progressProxy.current, {
      value: 92,
      duration: prefersReducedMotion ? 0.55 : 3.0,
      ease: "power1.out",
      onUpdate: () => setProgressVisual(progressProxy.current.value),
    });

    function markLoadDone() {
      loadDoneRef.current = true;
      tryFinish();
    }

    if (document.readyState === "complete") {
      markLoadDone();
    } else {
      window.addEventListener("load", markLoadDone, { once: true });
    }

    if (document.readyState === "interactive" || document.readyState === "complete") {
      gsap.to(progressProxy.current, {
        value: Math.max(progressProxy.current.value, 55),
        duration: 0.7,
        ease: "power2.out",
        overwrite: false,
        onUpdate: () => setProgressVisual(progressProxy.current.value),
      });
    }

    const maxTimer = window.setTimeout(() => {
      loadDoneRef.current = true;
      tryFinish();
    }, MAX_DURATION_MS);

    function tryFinish() {
      if (!loadDoneRef.current || boomStartedRef.current) return;

      const elapsed = performance.now() - mountedAtRef.current;
      const wait = Math.max(MIN_DURATION_MS - elapsed, 0);

      window.setTimeout(() => {
        if (boomStartedRef.current) return;
        boomStartedRef.current = true;
        progressTween.kill();

        gsap.to(progressProxy.current, {
          value: 100,
          duration: prefersReducedMotion ? 0.2 : 0.5,
          ease: "power2.inOut",
          onUpdate: () => setProgressVisual(progressProxy.current.value),
          onComplete: () => runBoom(prefersReducedMotion),
        });
      }, wait);
    }

    function finishLoader() {
      unlockPageScroll();
      setVisible(false);
    }

    function runBoom(reduce: boolean) {
      const el = rootRef.current;
      const flash = flashRef.current;
      if (!el) {
        finishLoader();
        return;
      }

      if (reduce) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.25,
          onComplete: finishLoader,
        });
        return;
      }

      const boom = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: finishLoader,
      });

      boom
        .to(brand, { scale: 1.05, duration: 0.26, ease: "power2.out" }, 0)
        .to(
          pctEl,
          { scale: 1.1, color: "rgb(var(--gold))", duration: 0.26, ease: "power2.out" },
          0,
        )
        .fromTo(
          flash,
          { opacity: 0, scale: 0.6 },
          { opacity: 0.8, scale: 1.12, duration: 0.2, ease: "power2.out" },
          0.1,
        )
        .to(flash, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.28)
        .to(
          [brand, label, spin, pctEl, bar?.parentElement],
          { opacity: 0, y: -20, filter: "blur(8px)", duration: 0.35, stagger: 0.03 },
          0.25,
        )
        .to(
          el,
          {
            opacity: 0,
            scale: 1.06,
            filter: "blur(10px)",
            duration: 0.6,
            ease: "power4.inOut",
          },
          0.38,
        );
    }

    const progressTarget = progressProxy.current;

    return () => {
      window.removeEventListener("load", markLoadDone);
      window.clearTimeout(maxTimer);
      progressTween.kill();
      gsap.killTweensOf(progressTarget);
      unlockPageScroll();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={`Loading portfolio ${percent} percent`}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[28%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold/[0.1] blur-[120px]" />
        <div className="absolute bottom-[18%] left-[20%] h-[280px] w-[280px] rounded-full bg-primary/[0.07] blur-[100px]" />
      </div>

      <div
        ref={flashRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgb(var(--gold) / 0.55), rgb(var(--primary) / 0.25) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6">
        <div
          ref={spinRef}
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/5"
          aria-hidden="true"
        >
          <span className="h-10 w-10 rounded-full border-2 border-gold/55 border-t-transparent motion-safe:animate-spin" />
        </div>

        <p
          ref={brandRef}
          className="text-center text-2xl font-semibold tracking-[0.04em] text-text sm:text-3xl"
        >
          {profile.fullName}
        </p>
        <p
          ref={labelRef}
          className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-gold"
        >
          Loading portfolio
        </p>

        <div className="mt-10 flex w-full max-w-[220px] flex-col items-center gap-3">
          <div className="flex items-baseline gap-1 tabular-nums">
            <span
              ref={percentRef}
              className="text-4xl font-bold tracking-tight text-text sm:text-5xl"
            >
              00
            </span>
            <span className="text-lg font-semibold text-gold">%</span>
          </div>

          <div
            className="h-[3px] w-full overflow-hidden rounded-full bg-gold/15"
            aria-hidden="true"
          >
            <div
              ref={barFillRef}
              className="h-full w-0 rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgb(var(--primary)), rgb(var(--gold)), rgb(var(--primary)))",
                boxShadow: "0 0 16px rgb(var(--gold) / 0.45)",
              }}
            />
          </div>
        </div>
      </div>

      <span className="sr-only">
        Loading {profile.fullName}&apos;s portfolio — {percent} percent
      </span>
    </div>
  );
}
