"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/lib/lenis-singleton";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pt-28 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <HeroScene />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
          >
            {profile.headline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-5xl font-bold tracking-tight text-text sm:text-6xl lg:text-7xl"
          >
            {profile.fullName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-base text-muted sm:text-lg"
          >
            {profile.tagline}. {profile.yearsExperience}+ years of experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button type="button" onClick={() => scrollToSection("projects")} className="btn-primary">
              Explore My Work
            </button>
            <button type="button" onClick={() => scrollToSection("contact")} className="btn-secondary">
              Contact Me
            </button>
          </motion.div>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToSection("about")}
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { duration: 1, delay: 0.8 }, y: { duration: 1.8, repeat: Infinity } }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted"
      >
        Scroll
        <span className="h-8 w-px bg-gradient-to-b from-primary to-transparent" />
      </motion.button>
    </section>
  );
}
