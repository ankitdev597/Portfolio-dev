"use client";

import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Shared visual pace — same px/s for Skills + DevOps + Featured. */
export const MARQUEE_SPEED = 48;
export const MARQUEE_SPEED_SLOW = 42;

interface MarqueeProps {
  children: ReactNode;
  /**
   * Scroll speed in pixels per second. Duration is derived from content
   * width so short and long lists feel the same pace.
   */
  speed?: number;
  /** Reverse scroll direction. */
  reverse?: boolean;
  /**
   * How many times to repeat the item set inside each half-track
   * so short lists still fill the viewport.
   */
  repeat?: number;
  ariaLabel: string;
  className?: string;
}

function renderCopies(children: ReactNode, repeat: number) {
  const items = Children.toArray(children);

  return Array.from({ length: Math.max(1, repeat) }, (_, copy) =>
    items.map((child, i) => {
      if (isValidElement(child)) {
        return cloneElement(child, { key: `${copy}-${child.key ?? i}` });
      }
      return <Fragment key={`${copy}-${i}`}>{child}</Fragment>;
    }),
  );
}

/**
 * AssistBee-style infinite CSS ticker: duplicated track, translateX(-50%),
 * linear loop. Pauses while the cursor is over it (or focus/touch).
 */
export default function Marquee({
  children,
  speed = MARQUEE_SPEED,
  reverse = false,
  repeat = 3,
  ariaLabel,
  className = "",
}: MarqueeProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(90);
  const [paused, setPaused] = useState(false);
  const copies = renderCopies(children, repeat);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const sync = () => {
      const width = group.scrollWidth;
      if (width <= 0) return;
      setDuration(Math.max(width / Math.max(speed, 1), 20));
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(group);
    return () => ro.disconnect();
  }, [children, repeat, speed]);

  return (
    <div
      className={`marquee-wrapper${paused ? " is-paused" : ""} ${className}`}
      role="region"
      aria-label={ariaLabel}
      aria-live="off"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className={`marquee-track${reverse ? " marquee-track--reverse" : ""}`}
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        <div ref={groupRef} className="marquee-group">
          {copies}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {copies}
        </div>
      </div>
    </div>
  );
}
