"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

export default function FullstackVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="Full-stack layers from UI through API to data">
      <rect x="48" y="28" width="100" height="28" rx="6" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.5" />
      <text x="98" y="46" textAnchor="middle" fill={SVC.text} fontSize="11" fontFamily="system-ui,sans-serif">
        UI
      </text>
      <rect x="130" y="58" width="100" height="28" rx="6" fill={SVC.ink} stroke={SVC.gold} strokeWidth="1.5" />
      <text x="180" y="76" textAnchor="middle" fill={SVC.text} fontSize="11" fontFamily="system-ui,sans-serif">
        API
      </text>
      <rect x="212" y="88" width="100" height="28" rx="6" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.5" />
      <text x="262" y="106" textAnchor="middle" fill={SVC.text} fontSize="11" fontFamily="system-ui,sans-serif">
        Data
      </text>
      <path d="M148 42 H180 V58" fill="none" stroke={SVC.gold} strokeWidth="1.25" opacity="0.85" />
      <path d="M230 72 H262 V88" fill="none" stroke={SVC.crimson} strokeWidth="1.25" opacity="0.85" />
    </VisualFrame>
  );
}
