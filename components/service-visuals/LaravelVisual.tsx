"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

export default function LaravelVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="Laravel backend routing into controllers, services, and data">
      <rect x="40" y="36" width="88" height="72" rx="8" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.75" />
      <text x="84" y="64" textAnchor="middle" fill={SVC.crimson} fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">
        Laravel
      </text>
      <text x="84" y="82" textAnchor="middle" fill={SVC.muted} fontSize="9" fontFamily="system-ui,sans-serif">
        PHP · Routes
      </text>
      <path d="M128 72 H168" stroke={SVC.gold} strokeWidth="1.5" />
      {["Controllers", "Services", "Eloquent / DB"].map((label, i) => (
        <g key={label}>
          <rect
            x="168"
            y={36 + i * 28}
            width="140"
            height="22"
            rx="5"
            fill={SVC.plum}
            stroke={i === 1 ? SVC.gold : SVC.line}
            strokeWidth="1.25"
          />
          <text
            x="238"
            y={51 + i * 28}
            textAnchor="middle"
            fill={SVC.text}
            fontSize="9"
            fontFamily="system-ui,sans-serif"
          >
            {label}
          </text>
        </g>
      ))}
    </VisualFrame>
  );
}
