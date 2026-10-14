"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

const LABELS = ["Mongo", "Express", "React", "Node"] as const;

export default function MernVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="MERN stack: MongoDB, Express, React, and Node.js">
      {LABELS.map((label, i) => (
        <g key={label}>
          <rect
            x={36 + i * 80}
            y="48"
            width="68"
            height="48"
            rx="8"
            fill={SVC.ink}
            stroke={i % 2 === 0 ? SVC.crimson : SVC.gold}
            strokeWidth="1.5"
          />
          <text
            x={70 + i * 80}
            y="76"
            textAnchor="middle"
            fill={SVC.text}
            fontSize="11"
            fontFamily="system-ui,sans-serif"
          >
            {label}
          </text>
          {i < 3 && (
            <path d={`M${104 + i * 80} 72 H${116 + i * 80}`} stroke={SVC.gold} strokeWidth="1.25" />
          )}
        </g>
      ))}
    </VisualFrame>
  );
}
