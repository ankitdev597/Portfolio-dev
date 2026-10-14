"use client";

import { useId, type ReactNode } from "react";
import { useSvc } from "./use-svc";

/** Consistent 360×144 illustration surface for every service card. */
export default function VisualFrame({
  children,
  label,
  decorative = false,
}: {
  children: ReactNode;
  label: string;
  decorative?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const bgId = `svc-bg-${uid}`;
  const SVC = useSvc();

  return (
    <svg
      viewBox="0 0 360 144"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={SVC.bgFrom} />
          <stop offset="100%" stopColor={SVC.bgTo} />
        </linearGradient>
      </defs>
      <rect width="360" height="144" fill={`url(#${bgId})`} rx="0" />
      {/* Soft gold edge so light panels don't feel flat */}
      <rect
        x="0.5"
        y="0.5"
        width="359"
        height="143"
        fill="none"
        stroke={SVC.gold}
        strokeOpacity="0.22"
      />
      {children}
    </svg>
  );
}
