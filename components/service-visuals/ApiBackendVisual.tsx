"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

export default function ApiBackendVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="Clients connecting to a REST API with request and response paths">
      <defs>
        <marker id="api-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={SVC.gold} />
        </marker>
      </defs>

      <rect x="24" y="28" width="70" height="28" rx="5" fill={SVC.ink} stroke={SVC.line} strokeWidth="1.2" />
      <rect x="24" y="68" width="70" height="28" rx="5" fill={SVC.ink} stroke={SVC.line} strokeWidth="1.2" />
      <text x="59" y="46" textAnchor="middle" fill={SVC.muted} fontSize="9" fontFamily="system-ui,sans-serif">
        Client A
      </text>
      <text x="59" y="86" textAnchor="middle" fill={SVC.muted} fontSize="9" fontFamily="system-ui,sans-serif">
        Client B
      </text>

      <path d="M94 42 H148" stroke={SVC.gold} strokeWidth="1.25" markerEnd="url(#api-arrow)" fill="none" />
      <path d="M94 82 H148" stroke={SVC.crimson} strokeWidth="1.25" markerEnd="url(#api-arrow)" fill="none" />

      <rect x="148" y="36" width="120" height="72" rx="10" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.75" />
      <text x="208" y="64" textAnchor="middle" fill={SVC.text} fontSize="11" fontFamily="system-ui,sans-serif">
        REST API
      </text>
      <text x="208" y="82" textAnchor="middle" fill={SVC.gold} fontSize="9" fontFamily="system-ui,sans-serif">
        GET · POST · PUT
      </text>

      <circle cx="300" cy="54" r="6" fill={SVC.crimson} />
      <circle cx="300" cy="72" r="6" fill={SVC.gold} />
      <circle cx="300" cy="90" r="6" fill={SVC.crimson} opacity="0.7" />
      <text x="318" y="58" fill={SVC.muted} fontSize="8" fontFamily="system-ui,sans-serif">
        /api
      </text>
    </VisualFrame>
  );
}
