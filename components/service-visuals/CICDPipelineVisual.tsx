"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

const STAGES = [
  { label: "Source", icon: "◇" },
  { label: "Build", icon: "▣" },
  { label: "Test", icon: "✓" },
  { label: "Deploy", icon: "▲" },
] as const;

/** Directional CI/CD: Source → Build → Test → Deploy. */
export default function CICDPipelineVisual() {
  const SVC = useSvc();
  const stageW = 68;
  const gap = 16;
  const startX = 22;

  return (
    <VisualFrame label="CI/CD pipeline from Source through Build, Test, and Deploy">
      <defs>
        <marker
          id="ci-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill={SVC.gold} />
        </marker>
      </defs>

      {STAGES.map((stage, i) => {
        const x = startX + i * (stageW + gap);
        const isLast = i === STAGES.length - 1;
        return (
          <g key={stage.label}>
            <rect
              x={x}
              y="44"
              width={stageW}
              height="56"
              rx="9"
              fill={SVC.ink}
              stroke={isLast ? SVC.gold : SVC.crimson}
              strokeWidth="1.6"
            />
            <text
              x={x + stageW / 2}
              y="66"
              textAnchor="middle"
              fill={isLast ? SVC.gold : SVC.crimson}
              fontSize="12"
              fontFamily="system-ui,sans-serif"
            >
              {stage.icon}
            </text>
            <text
              x={x + stageW / 2}
              y="84"
              textAnchor="middle"
              fill={SVC.text}
              fontSize="11"
              fontFamily="system-ui,sans-serif"
              fontWeight="600"
            >
              {stage.label}
            </text>
            {!isLast && (
              <path
                d={`M${x + stageW} 72 H${x + stageW + gap}`}
                stroke={SVC.crimson}
                strokeWidth="1.6"
                markerEnd="url(#ci-arrow)"
                fill="none"
              />
            )}
            {/* Gold status pip */}
            <circle
              cx={x + stageW - 10}
              cy={52}
              r="2.5"
              fill={i < 3 ? SVC.gold : SVC.crimson}
            />
          </g>
        );
      })}
    </VisualFrame>
  );
}
