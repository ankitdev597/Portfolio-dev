"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

/** Trigger → action → branched notify/queue workflow. */
export default function WorkflowVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="Workflow with trigger, action, and branching notify and queue paths">
      <defs>
        <marker
          id="wf-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill={SVC.gold} />
        </marker>
      </defs>

      <circle cx="52" cy="72" r="18" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.75" />
      <text x="52" y="76" textAnchor="middle" fill={SVC.gold} fontSize="9" fontFamily="system-ui,sans-serif">
        Trigger
      </text>

      <path
        d="M70 72 H112"
        stroke={SVC.gold}
        strokeWidth="1.5"
        markerEnd="url(#wf-arrow)"
        fill="none"
      />

      <rect x="112" y="54" width="64" height="36" rx="7" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.5" />
      <text x="144" y="76" textAnchor="middle" fill={SVC.text} fontSize="10" fontFamily="system-ui,sans-serif">
        Action
      </text>

      <path d="M176 72 H208" stroke={SVC.gold} strokeWidth="1.5" fill="none" />
      <circle cx="208" cy="72" r="5" fill={SVC.crimson} />

      <path
        d="M208 72 L248 44"
        stroke={SVC.crimson}
        strokeWidth="1.35"
        markerEnd="url(#wf-arrow)"
        fill="none"
      />
      <path
        d="M208 72 L248 100"
        stroke={SVC.crimson}
        strokeWidth="1.35"
        markerEnd="url(#wf-arrow)"
        fill="none"
      />

      <rect x="248" y="28" width="72" height="30" rx="6" fill={SVC.ink} stroke={SVC.gold} strokeWidth="1.25" />
      <text x="284" y="47" textAnchor="middle" fill={SVC.text} fontSize="9" fontFamily="system-ui,sans-serif">
        Notify
      </text>

      <rect x="248" y="86" width="72" height="30" rx="6" fill={SVC.ink} stroke={SVC.gold} strokeWidth="1.25" />
      <text x="284" y="105" textAnchor="middle" fill={SVC.text} fontSize="9" fontFamily="system-ui,sans-serif">
        Queue
      </text>
    </VisualFrame>
  );
}
