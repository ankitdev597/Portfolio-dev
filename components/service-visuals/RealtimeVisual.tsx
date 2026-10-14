"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

export default function RealtimeVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="WebSocket real-time links between clients and Laravel Reverb">
      <circle cx="64" cy="72" r="22" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.5" />
      <circle cx="296" cy="72" r="22" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.5" />
      <text x="64" y="76" textAnchor="middle" fill={SVC.muted} fontSize="9" fontFamily="system-ui,sans-serif">
        Client
      </text>
      <text x="296" y="76" textAnchor="middle" fill={SVC.muted} fontSize="9" fontFamily="system-ui,sans-serif">
        Client
      </text>
      <rect x="140" y="48" width="80" height="48" rx="8" fill={SVC.plum} stroke={SVC.gold} strokeWidth="1.5" />
      <text x="180" y="70" textAnchor="middle" fill={SVC.text} fontSize="10" fontFamily="system-ui,sans-serif">
        Reverb
      </text>
      <text x="180" y="84" textAnchor="middle" fill={SVC.muted} fontSize="8" fontFamily="system-ui,sans-serif">
        WebSocket
      </text>
      <path d="M86 72 H140" stroke={SVC.crimson} strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M220 72 H274" stroke={SVC.crimson} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="112" cy="72" r="3" fill={SVC.gold} />
      <circle cx="248" cy="72" r="3" fill={SVC.gold} />
    </VisualFrame>
  );
}
