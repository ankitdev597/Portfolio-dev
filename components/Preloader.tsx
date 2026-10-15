"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { profile } from "@/data/profile";
import { getLenisInstance } from "@/lib/lenis-singleton";
import { unlockPageScroll } from "@/lib/unlock-scroll";

const PreloaderScene = dynamic(() => import("@/components/PreloaderScene"), {
  ssr: false,
  loading: () => null,
});

/** Premium pacing — intentional robotic boot, never endless. */
const MIN_DURATION_MS = 2400;
const MAX_DURATION_MS = 4800;

/**
 * Dark Crimson Noir robotic boot: 3D wireframe + GSAP progress,
 * then curtain reveal. Preserves hash / scroll so you land on the
 * same section you opened.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [percent, setPercent] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const barTrackRef = useRef<HTMLDivElement>(null);

  const progressProxy = useRef({ value: 0 });
  const loadDoneRef = useRef(false);
  const exitStartedRef = useRef(false);
  const mountedAtRef = useRef(0);
  const restoreTargetRef = useRef<{ hash: string; y: number }>({ hash: "", y: 0 });

  useEffect(() => {
    mountedAtRef.current = performance.now();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    restoreTargetRef.current = {
      hash: window.location.hash || "",
      y: window.scrollY || 0,
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    getLenisInstance()?.stop();

    const root = rootRef.current;
    const content = contentRef.current;
    const robot = robotRef.current;
    const ring = ringRef.current;
    const brand = brandRef.current;
    const label = labelRef.current;
    const bar = barFillRef.current;
    const barTrack = barTrackRef.current;
    const pctEl = percentRef.current;

    if (root) gsap.set(root, { opacity: 1 });

    let ringTween: gsap.core.Tween | null = null;

    if (!prefersReducedMotion && content) {
      gsap.set([robot, brand, label, pctEl, barTrack], { opacity: 0, y: 16 });
      if (ring) gsap.set(ring, { rotation: 0 });

      const tlIn = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlIn
        .to(robot, { opacity: 1, y: 0, duration: 0.7 }, 0.05)
        .to(brand, { opacity: 1, y: 0, duration: 0.65 }, 0.2)
        .to(label, { opacity: 1, y: 0, duration: 0.5 }, 0.32)
        .to([pctEl, barTrack], { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.4);

      if (ring) {
        ringTween = gsap.to(ring, {
          rotation: 360,
          duration: 8,
          ease: "none",
          repeat: -1,
        });
      }
    }

    function setProgressVisual(value: number) {
      const rounded = Math.max(0, Math.min(100, Math.round(value)));
      setPercent(rounded);
      if (bar) gsap.set(bar, { width: `${rounded}%` });
      if (pctEl) pctEl.textContent = String(rounded).padStart(2, "0");
    }

    const progressTween = gsap.to(progressProxy.current, {
      value: 92,
      duration: prefersReducedMotion ? 0.5 : 2.6,
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
        duration: 0.6,
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
      if (!loadDoneRef.current || exitStartedRef.current) return;

      const elapsed = performance.now() - mountedAtRef.current;
      const wait = Math.max(MIN_DURATION_MS - elapsed, 0);

      window.setTimeout(() => {
        if (exitStartedRef.current) return;
        exitStartedRef.current = true;
        progressTween.kill();
        ringTween?.kill();

        gsap.to(progressProxy.current, {
          value: 100,
          duration: prefersReducedMotion ? 0.15 : 0.35,
          ease: "power2.inOut",
          onUpdate: () => setProgressVisual(progressProxy.current.value),
          onComplete: () => runExit(prefersReducedMotion),
        });
      }, wait);
    }

    function restoreViewport() {
      const { hash, y } = restoreTargetRef.current;
      const lenis = getLenisInstance();

      if (hash) {
        const id = hash.replace(/^#/, "");
        const el = id ? document.getElementById(id) : null;
        if (el) {
          if (lenis) {
            lenis.scrollTo(el, { immediate: true });
          } else {
            el.scrollIntoView({ behavior: "auto", block: "start" });
          }
          return;
        }
      }

      if (y > 0) {
        if (lenis) lenis.scrollTo(y, { immediate: true });
        else window.scrollTo(0, y);
      }
    }

    function finishLoader() {
      unlockPageScroll();
      restoreViewport();
      setVisible(false);
    }

    function runExit(reduce: boolean) {
      const el = rootRef.current;
      const panel = panelRef.current;
      if (!el) {
        finishLoader();
        return;
      }

      if (reduce) {
        gsap.to(el, { opacity: 0, duration: 0.2, onComplete: finishLoader });
        return;
      }

      const exit = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: finishLoader,
      });

      exit
        .to(pctEl, { color: "rgb(196 162 110)", duration: 0.22, ease: "power2.out" }, 0)
        .to(content, { opacity: 0, y: -24, duration: 0.4, ease: "power2.in" }, 0.1)
        .to(
          panel,
          {
            yPercent: -105,
            duration: 0.72,
            ease: "power4.inOut",
          },
          0.24,
        )
        .set(el, { pointerEvents: "none" }, 0.24);
    }

    const progressTarget = progressProxy.current;

    return () => {
      window.removeEventListener("load", markLoadDone);
      window.clearTimeout(maxTimer);
      progressTween.kill();
      ringTween?.kill();
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
      className="fixed inset-0 z-[200] overflow-hidden"
      data-theme="dark"
      style={{ colorScheme: "dark" }}
    >
      <div
        ref={panelRef}
        className="absolute inset-0 flex flex-col items-center justify-center will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 18%, rgba(180,52,62,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(196,162,110,0.1), transparent 50%), #08080A",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(232,228,222,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(232,228,222,0.35) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div
          ref={contentRef}
          className="relative z-10 flex w-full max-w-lg flex-col items-center px-6"
        >
          <div
            ref={robotRef}
            className="relative flex h-44 w-full max-w-sm items-center justify-center sm:h-52"
            aria-hidden="true"
          >
            <div
              ref={ringRef}
              className="absolute inset-[8%] rounded-full border border-[rgba(196,162,110,0.28)]"
              style={{
                borderTopColor: "rgba(180,52,62,0.75)",
                borderRightColor: "rgba(196,162,110,0.45)",
              }}
            />
            <div className="absolute inset-[18%] rounded-full border border-dashed border-[rgba(196,162,110,0.18)]" />
            <div className="relative h-full w-full">
              <PreloaderScene />
            </div>
          </div>

          <p
            ref={brandRef}
            className="mt-2 text-center text-2xl font-semibold tracking-tight text-[#E8E4DE] sm:text-3xl"
          >
            {profile.fullName}
          </p>

          <p
            ref={labelRef}
            className="mt-2 text-center text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#C4A26E]"
          >
            System boot · Crimson Noir
          </p>

          <div className="mt-8 flex w-full max-w-xs flex-col items-center gap-3 sm:max-w-sm">
            <div className="flex items-baseline gap-1 tabular-nums">
              <span
                ref={percentRef}
                className="text-4xl font-bold tracking-tight text-[#E8E4DE] sm:text-5xl"
              >
                00
              </span>
              <span className="text-lg font-semibold text-[#C4A26E] sm:text-xl">%</span>
            </div>

            <div
              ref={barTrackRef}
              className="h-1 w-full overflow-hidden rounded-full bg-[rgba(196,162,110,0.15)] sm:h-1.5"
              aria-hidden="true"
            >
              <div
                ref={barFillRef}
                className="h-full w-0 rounded-full"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #B4343E, #C4A26E, #B4343E)",
                  boxShadow: "0 0 14px rgba(196,162,110,0.35)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">
        Loading {profile.fullName}&apos;s portfolio — {percent} percent
      </span>
    </div>
  );
}
