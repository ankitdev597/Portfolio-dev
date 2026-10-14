"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const COLS = 4;
const TILES = COLS * COLS;

interface QrPuzzleProps {
  src: string;
  alt: string;
  /** Pixel size of the square QR display */
  size?: number;
  className?: string;
}

/**
 * Assembles a QR code like a puzzle: tiles scatter in, then lock into a
 * crisp scannable grid. Falls back to a plain image under reduced motion.
 */
export default function QrPuzzle({
  src,
  alt,
  size = 200,
  className = "",
}: QrPuzzleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const [assembled, setAssembled] = useState(false);
  const uid = useId();

  const tiles = useMemo(
    () =>
      Array.from({ length: TILES }, (_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        return {
          i,
          col,
          row,
          bgPos: `${(col / (COLS - 1)) * 100}% ${(row / (COLS - 1)) * 100}%`,
        };
      }),
    [],
  );

  useEffect(() => {
    if (!src || reduceMotion) {
      setAssembled(true);
      return;
    }

    const grid = gridRef.current;
    if (!grid) return;

    const pieces = grid.querySelectorAll<HTMLElement>("[data-puzzle-tile]");
    if (!pieces.length) return;

    setAssembled(false);

    const ctx = gsap.context(() => {
      gsap.set(pieces, {
        opacity: 0,
        scale: 0.55,
        rotate: () => gsap.utils.random(-28, 28),
        x: () => gsap.utils.random(-48, 48),
        y: () => gsap.utils.random(-48, 48),
        filter: "blur(3px)",
      });

      const order = gsap.utils.shuffle([...pieces]);

      gsap.to(order, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
        stagger: {
          each: 0.045,
          from: "random",
        },
        ease: "back.out(1.35)",
        onComplete: () => {
          setAssembled(true);
          // Soft “lock” pulse when the puzzle completes
          gsap.fromTo(
            grid,
            { boxShadow: "0 0 0 0 rgb(var(--gold) / 0)" },
            {
              boxShadow: "0 0 0 3px rgb(var(--gold) / 0.35)",
              duration: 0.35,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
            },
          );
        },
      });
    }, grid);

    return () => ctx.revert();
  }, [src, reduceMotion]);

  if (!src) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-[#FFFCF8] ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <div className="qr-puzzle-skeleton grid h-full w-full gap-0.5 p-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {tiles.map((t) => (
            <div
              key={t.i}
              className="rounded-[2px] bg-[#1C1816]/10 animate-pulse"
              style={{ animationDelay: `${t.i * 40}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (reduceMotion) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- data URL from qrcode
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-xl ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={assembled ? alt : `${alt} — assembling`}
    >
      <div
        ref={gridRef}
        className="absolute inset-0 grid overflow-hidden rounded-xl bg-[#FFFCF8]"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: assembled ? 0 : 1,
        }}
        aria-hidden="true"
      >
        {tiles.map((t) => (
          <div
            key={`${uid}-${t.i}`}
            data-puzzle-tile
            className="origin-center will-change-transform"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${COLS * 100}% ${COLS * 100}%`,
              backgroundPosition: t.bgPos,
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </div>

      {/* Invisible full QR for accessibility / long-press save once assembled */}
      {assembled && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="absolute inset-0 h-full w-full rounded-xl opacity-0"
        />
      )}
    </div>
  );
}
