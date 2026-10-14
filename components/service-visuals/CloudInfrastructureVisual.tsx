"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

/** AWS cloud connected to EC2 / SES / SNS — verified services only. */
export default function CloudInfrastructureVisual() {
  const SVC = useSvc();
  return (
    <VisualFrame label="AWS cloud connected to EC2, SES, and SNS resources">
      <path
        d="M118 50 C118 30 242 30 242 50 L252 72 C252 94 108 94 108 72 Z"
        fill={SVC.plum}
        stroke={SVC.crimson}
        strokeWidth="1.75"
      />
      <text x="180" y="66" textAnchor="middle" fill={SVC.text} fontSize="12" fontFamily="system-ui,sans-serif">
        AWS
      </text>

      {[
        { x: 70, label: "EC2" },
        { x: 154, label: "SES" },
        { x: 238, label: "SNS" },
      ].map(({ x, label }) => (
        <g key={label}>
          <rect
            x={x}
            y="102"
            width="52"
            height="26"
            rx="4"
            fill={SVC.ink}
            stroke={SVC.gold}
            strokeWidth="1.25"
          />
          <text
            x={x + 26}
            y="119"
            textAnchor="middle"
            fill={SVC.muted}
            fontSize="9"
            fontFamily="system-ui,sans-serif"
          >
            {label}
          </text>
          <path
            d={`M${x + 26} 94 V102`}
            stroke={SVC.crimson}
            strokeWidth="1.2"
          />
        </g>
      ))}
    </VisualFrame>
  );
}
