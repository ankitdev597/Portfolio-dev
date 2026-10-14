"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "@/components/icons";

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  ariaLabel: string;
}

/**
 * Native CSS scroll-snap carousel with accessible prev/next, slide status,
 * and optional autoplay that pauses on interaction and under reduced motion.
 */
export default function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  ariaLabel,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const statusId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const total = children.length;

  const syncIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track || total === 0) return;
    const card = track.children[0] as HTMLElement | undefined;
    const step = card ? card.offsetWidth + 16 : track.clientWidth;
    if (step <= 0) return;
    const next = Math.round(track.scrollLeft / step);
    setIndex(Math.max(0, Math.min(total - 1, next)));
  }, [total]);

  const scrollToIndex = useCallback(
    (nextIndex: number) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.children[0] as HTMLElement | undefined;
      const step = card ? card.offsetWidth + 16 : track.clientWidth;
      const clamped = ((nextIndex % total) + total) % total;
      track.scrollTo({
        left: clamped * step,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      setIndex(clamped);
    },
    [total, reduceMotion],
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncIndex();
    track.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("resize", syncIndex);
    return () => {
      track.removeEventListener("scroll", syncIndex);
      window.removeEventListener("resize", syncIndex);
    };
  }, [syncIndex]);

  useEffect(() => {
    if (!autoPlay || paused || reduceMotion || total < 2) return;

    const interval = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % total;
        const track = trackRef.current;
        if (track) {
          const card = track.children[0] as HTMLElement | undefined;
          const step = card ? card.offsetWidth + 16 : track.clientWidth;
          track.scrollTo({ left: next * step, behavior: "smooth" });
        }
        return next;
      });
    }, autoPlayInterval);

    return () => window.clearInterval(interval);
  }, [autoPlay, autoPlayInterval, paused, reduceMotion, total]);

  function pauseInteraction() {
    setPaused(true);
  }

  return (
    <div className="relative">
      <div
        className="mb-3 flex flex-wrap items-center justify-between gap-3"
        onMouseEnter={pauseInteraction}
        onFocusCapture={pauseInteraction}
      >
        <p id={statusId} className="text-xs text-muted" aria-live="polite">
          Slide {index + 1} of {total}
        </p>

        <div className="flex items-center gap-2">
          {autoPlay && !reduceMotion && (
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              className="icon-btn !h-9 !w-9 text-muted"
              aria-pressed={paused}
              aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
            >
              {paused ? (
                <Play className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              ) : (
                <Pause className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              pauseInteraction();
              scrollToIndex(index - 1);
            }}
            className="icon-btn !h-9 !w-9 text-muted"
            aria-label="Previous slide"
            aria-controls={statusId}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              pauseInteraction();
              scrollToIndex(index + 1);
            }}
            className="icon-btn !h-9 !w-9 text-muted"
            aria-label="Next slide"
            aria-controls={statusId}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        aria-describedby={statusId}
        onTouchStart={pauseInteraction}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            pauseInteraction();
            scrollToIndex(index - 1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            pauseInteraction();
            scrollToIndex(index + 1);
          }
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}`}
            className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[38%]"
          >
            {child}
          </div>
        ))}
      </div>

      {total > 1 && (
        <div className="mt-1 flex justify-center gap-1.5" role="tablist" aria-label={`${ariaLabel} slides`}>
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                pauseInteraction();
                scrollToIndex(i);
              }}
              className={`h-1.5 rounded-full transition-[width,background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                i === index ? "w-5 bg-gold" : "w-1.5 bg-gold/25 hover:bg-gold/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
