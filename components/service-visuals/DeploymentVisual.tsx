"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

/** Linux host with Nginx/Apache and SSL — matches Server Configuration service. */
export default function DeploymentVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="Linux server with web server and SSL configuration">
      <rect x="110" y="28" width="140" height="88" rx="10" fill={SVC.ink} stroke={SVC.crimson} strokeWidth="1.75" />
      {[
        { y: 42, label: "Nginx / Apache", accent: true },
        { y: 64, label: "SSL · TLS", accent: false },
        { y: 86, label: "Linux Host", accent: false },
      ].map((row) => (
        <g key={row.label}>
          <rect
            x="124"
            y={row.y}
            width="112"
            height="16"
            rx="3"
            fill={SVC.plum}
            stroke={row.accent ? SVC.gold : SVC.line}
            strokeWidth="1"
          />
          <text
            x="180"
            y={row.y + 11}
            textAnchor="middle"
            fill={SVC.muted}
            fontSize="8"
            fontFamily="system-ui,sans-serif"
          >
            {row.label}
          </text>
        </g>
      ))}
      <circle cx="232" cy="50" r="3" fill={SVC.crimson} />
    </VisualFrame>
  );
}
