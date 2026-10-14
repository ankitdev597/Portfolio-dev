"use client";

import { useState, type ReactNode } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { usePageVisible } from "@/lib/use-page-visible";

type SceneCanvasProps = Omit<CanvasProps, "children"> & {
  children: ReactNode;
  /** Compact CSS fallback when WebGL is unavailable or context is lost. */
  fallback?: ReactNode;
};

/**
 * Shared R3F canvas: pauses when the tab is hidden, freezes under
 * reduced-motion, and swaps to a CSS fallback if WebGL fails.
 */
export default function SceneCanvas({
  children,
  fallback,
  dpr = [1, 1.5],
  gl,
  ...rest
}: SceneCanvasProps) {
  const reduceMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisible();
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <>
        {fallback ?? (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-transparent to-gold/5"
            aria-hidden="true"
          >
            <span className="h-14 w-14 rounded-full border border-primary/25" />
          </div>
        )}
      </>
    );
  }

  const frameloop = !pageVisible || reduceMotion ? "demand" : "always";

  return (
    <Canvas
      {...rest}
      dpr={dpr}
      frameloop={frameloop}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        ...gl,
      }}
      onCreated={({ gl: renderer }) => {
        const canvas = renderer.domElement;
        function onLost(e: Event) {
          e.preventDefault();
          setFailed(true);
        }
        canvas.addEventListener("webglcontextlost", onLost, false);
      }}
    >
      {children}
    </Canvas>
  );
}
