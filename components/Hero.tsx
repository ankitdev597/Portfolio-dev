"use client";

import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/lib/lenis-singleton";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Hero entrance via a single GSAP timeline (not Motion) so copy and artwork
 * reveal together. Scroll sections keep using Reveal + ScrollTrigger.
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const label = root.querySelector<HTMLElement>("[data-hero='label']");
    const title = root.querySelector<HTMLElement>("[data-hero='title']");
    const tagline = root.querySelector<HTMLElement>("[data-hero='tagline']");
    const cta = root.querySelector<HTMLElement>("[data-hero='cta']");
    const scrollCue = root.querySelector<HTMLElement>("[data-hero='scroll']");
    const art = root.querySelector<HTMLElement>("[data-hero='art']");

    const targets = [label, title, tagline, cta, scrollCue, art].filter(
      (el): el is HTMLElement => Boolean(el),
    );

    if (reduceMotion) {
      gsap.set(targets, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
      return;
    }

    let failSafe = 0;
    const ctx = gsap.context(() => {
      gsap.set([label, title, tagline, cta, scrollCue], {
        opacity: 0,
        y: 22,
      });
      if (art) {
        gsap.set(art, { opacity: 0, scale: 0.94 });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.35,
      });

      if (label) {
        tl.to(label, { opacity: 1, y: 0, duration: 0.7 }, 0);
      }
      if (title) {
        tl.to(title, { opacity: 1, y: 0, duration: 0.85 }, 0.1);
      }
      if (tagline) {
        tl.to(tagline, { opacity: 1, y: 0, duration: 0.7 }, 0.22);
      }
      if (cta) {
        tl.to(cta, { opacity: 1, y: 0, duration: 0.65 }, 0.34);
      }
      if (art) {
        tl.to(art, { opacity: 1, scale: 1, duration: 1.05, ease: "power2.out" }, 0.12);
      }
      if (scrollCue) {
        tl.to(scrollCue, { opacity: 0.65, y: 0, duration: 0.55 }, 0.55);
      }

      failSafe = window.setTimeout(() => {
        gsap.set(targets, { clearProps: "transform", opacity: 1, scale: 1 });
      }, 3200);
    }, root);

    return () => {
      window.clearTimeout(failSafe);
      ctx.revert();
      gsap.set(targets, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
    };
  }, [reduceMotion]);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative flex min-h-[100vh] items-center overflow-hidden -mt-[72px] pt-[72px] px-4 sm:px-6 lg:px-8"
    >
      {/* Soft theme-aware ambient — gold primary, crimson secondary */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute right-[-2%] top-[8%] h-[640px] w-[640px] rounded-full bg-gold/[0.08] blur-[140px]" />
        <div className="absolute bottom-[8%] right-[12%] h-[460px] w-[460px] rounded-full bg-primary/[0.05] blur-[110px]" />
        <div className="absolute left-[-8%] top-[22%] h-[360px] w-[360px] rounded-full bg-gold/[0.05] blur-[100px]" />
      </div>

      {/* Particle sphere — right side on desktop, dimmed behind copy on mobile */}
      <div
        data-hero="art"
        className="hero-reveal absolute inset-y-0 right-0 top-0 z-[2] flex h-full w-full items-center justify-center max-lg:opacity-[0.18] lg:w-[55%] lg:opacity-90"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <HeroScene />
      </div>

      <div className="relative z-[3] mx-auto w-full max-w-6xl pointer-events-none py-24 lg:py-32">
        <div className="max-w-[620px] pointer-events-auto">
          <p
            data-hero="label"
            className="hero-reveal text-xs font-semibold uppercase tracking-[0.25em] text-gold"
          >
            {profile.headline}
          </p>

          <h1
            data-hero="title"
            className="hero-reveal mt-4 text-4xl font-bold tracking-tight text-text min-[390px]:text-5xl sm:text-6xl lg:text-7xl"
          >
            {profile.fullName}
          </h1>

          <p
            data-hero="tagline"
            className="hero-reveal mt-6 max-w-xl text-base text-muted sm:text-lg"
          >
            {profile.tagline}. {profile.yearsExperience}+ years of experience.
          </p>

          <div
            data-hero="cta"
            className="hero-reveal mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <button type="button" onClick={() => scrollToSection("projects")} className="btn-primary">
              Explore My Work
            </button>
            <button type="button" onClick={() => scrollToSection("contact")} className="btn-secondary">
              Contact Me
            </button>
          </div>
        </div>
      </div>

      <div className="hero-scroll-cue absolute bottom-8 left-1/2 z-[3] -translate-x-1/2 sm:bottom-10">
        <button
          type="button"
          data-hero="scroll"
          onClick={() => scrollToSection("about")}
          aria-label="Scroll to About section"
          className="hero-reveal flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted"
        >
          Scroll
          <span className="h-8 w-px bg-gradient-to-b from-primary to-transparent" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
