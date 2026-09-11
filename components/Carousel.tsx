"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  ariaLabel: string;
}

/**
 * Native CSS scroll-snap carousel - no dependency, works with touch drag
 * out of the box. Autoplay pauses on hover, touch, and focus-within, and
 * never runs at all under prefers-reduced-motion.
 */
export default function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  ariaLabel,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!autoPlay) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const track = trackRef.current;
    if (!track) return;

    const interval = window.setInterval(() => {
      if (pausedRef.current) return;

      const card = track.children[0] as HTMLElement | undefined;
      const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + step,
        behavior: "smooth",
      });
    }, autoPlayInterval);

    return () => window.clearInterval(interval);
  }, [autoPlay, autoPlayInterval]);

  function pause() {
    pausedRef.current = true;
  }
  function resume() {
    pausedRef.current = false;
  }

  return (
    <div
      ref={trackRef}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocus={pause}
      onBlur={resume}
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {children.map((child, i) => (
        <div key={i} className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[38%]">
          {child}
        </div>
      ))}
    </div>
  );
}
