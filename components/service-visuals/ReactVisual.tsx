"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

export default function ReactVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="React component model with TypeScript UI layers">
      <ellipse cx="180" cy="72" rx="54" ry="22" fill="none" stroke={SVC.crimson} strokeWidth="1.5" />
      <ellipse
        cx="180"
        cy="72"
        rx="54"
        ry="22"
        fill="none"
        stroke={SVC.gold}
        strokeWidth="1.25"
        transform="rotate(60 180 72)"
      />
      <ellipse
        cx="180"
        cy="72"
        rx="54"
        ry="22"
        fill="none"
        stroke={SVC.crimson}
        strokeWidth="1.25"
        transform="rotate(120 180 72)"
        opacity="0.7"
      />
      <circle cx="180" cy="72" r="8" fill={SVC.crimson} />
      <rect x="40" y="48" width="52" height="18" rx="4" fill={SVC.ink} stroke={SVC.gold} strokeWidth="1" />
      <rect x="40" y="78" width="52" height="18" rx="4" fill={SVC.ink} stroke={SVC.line} strokeWidth="1" />
      <rect x="268" y="48" width="52" height="18" rx="4" fill={SVC.ink} stroke={SVC.gold} strokeWidth="1" />
      <rect x="268" y="78" width="52" height="18" rx="4" fill={SVC.ink} stroke={SVC.line} strokeWidth="1" />
      <text x="66" y="60" textAnchor="middle" fill={SVC.muted} fontSize="8" fontFamily="system-ui,sans-serif">
        TSX
      </text>
      <text x="294" y="60" textAnchor="middle" fill={SVC.muted} fontSize="8" fontFamily="system-ui,sans-serif">
        Hooks
      </text>
    </VisualFrame>
  );
}
