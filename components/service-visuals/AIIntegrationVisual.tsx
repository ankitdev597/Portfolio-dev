"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

export default function AIIntegrationVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="Application integrating with an LLM API">
      <defs>
        <marker id="ai-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={SVC.gold} />
        </marker>
      </defs>

      <rect x="36" y="44" width="100" height="56" rx="8" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.5" />
      <text x="86" y="70" textAnchor="middle" fill={SVC.text} fontSize="10" fontFamily="system-ui,sans-serif">
        App
      </text>
      <text x="86" y="86" textAnchor="middle" fill={SVC.muted} fontSize="8" fontFamily="system-ui,sans-serif">
        Prompt · Context
      </text>

      <path d="M136 72 H174" stroke={SVC.gold} strokeWidth="1.5" markerEnd="url(#ai-arrow)" fill="none" />

      <rect x="174" y="40" width="128" height="64" rx="10" fill={SVC.plum} stroke={SVC.gold} strokeWidth="1.5" />
      <circle cx="206" cy="72" r="10" fill="none" stroke={SVC.crimson} strokeWidth="1.5" />
      <circle cx="236" cy="72" r="10" fill="none" stroke={SVC.gold} strokeWidth="1.25" />
      <circle cx="266" cy="72" r="10" fill="none" stroke={SVC.crimson} strokeWidth="1.25" />
      <text x="238" y="98" textAnchor="middle" fill={SVC.muted} fontSize="9" fontFamily="system-ui,sans-serif">
        LLM API
      </text>
    </VisualFrame>
  );
}
