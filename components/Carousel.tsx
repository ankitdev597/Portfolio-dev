"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "@/components/icons";

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  ariaLabel: string;
  /** Hide prev/next — dots can still show via `showDots`. */
  showControls?: boolean;
  /** Progress dots under the track (default: true when controls on, or always for autoplay). */
  showDots?: boolean;
  /** Tailwind classes for each slide shell. */
  slideClassName?: string;
  className?: string;
}

/**
 * Native CSS scroll-snap carousel with optional autoplay.
 * Autoplay runs on its own; hover/touch only pauses temporarily.
 */
export default function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  ariaLabel,
  showControls = true,
  showDots,
  slideClassName = "w-[88%] shrink-0 snap-start sm:w-[70%] lg:w-[48%]",
  className = "",
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const statusId = useId();
  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const total = children.length;
  const dotsVisible = showDots ?? (showControls || autoPlay);

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
    if (!autoPlay || hoverPaused || reduceMotion || total < 2) return;

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
  }, [autoPlay, autoPlayInterval, hoverPaused, reduceMotion, total]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onTouchStart={() => setHoverPaused(true)}
      onTouchEnd={() => setHoverPaused(false)}
    >
      {(showControls || autoPlay) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p id={statusId} className="text-xs text-muted" aria-live="polite">
            {index + 1} / {total}
            {autoPlay && !reduceMotion ? (
              <span className="ml-2 text-gold/80">{hoverPaused ? "Paused" : "Auto"}</span>
            ) : null}
          </p>

          {showControls && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToIndex(index - 1)}
                className="icon-btn !h-10 !w-10 text-muted"
                aria-label="Previous slide"
                aria-controls={statusId}
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollToIndex(index + 1)}
                className="icon-btn !h-10 !w-10 text-muted"
                aria-label="Next slide"
                aria-controls={statusId}
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}

      {!showControls && !autoPlay && (
        <p id={statusId} className="sr-only" aria-live="polite">
          Slide {index + 1} of {total}
        </p>
      )}

      <div className="featured-carousel-mask">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          aria-describedby={statusId}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollToIndex(index - 1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
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
              className={`${slideClassName} flex`}
            >
              <div className="flex h-full w-full flex-col">{child}</div>
            </div>
          ))}
        </div>
      </div>

      {dotsVisible && total > 1 && (
        <div
          className="mt-4 flex justify-center gap-1.5"
          role="tablist"
          aria-label={`${ariaLabel} slides`}
        >
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-[width,background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                i === index ? "w-6 bg-gold" : "w-1.5 bg-gold/25 hover:bg-gold/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
