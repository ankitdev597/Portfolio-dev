"use client";

import VisualFrame from "./VisualFrame";
import { useSvc } from "./use-svc";

/** Recognizable stacked DB cylinders with elliptical caps and data layers. */
export default function DatabaseVisual() {
  const SVC = useSvc();
  const drums = [
    { cx: 100, top: 28 },
    { cx: 180, top: 22 },
    { cx: 260, top: 28 },
  ];

  return (
    <VisualFrame label="Stacked database cylinders with elliptical tops and data layers">
      {drums.map(({ cx, top }, i) => {
        const bottom = top + 78;
        const rx = 32;
        const ry = 11;
        return (
          <g key={cx}>
            {/* Body fill using path so sides follow cylinder silhouette */}
            <path
              d={`M ${cx - rx} ${top + ry}
                 L ${cx - rx} ${bottom - ry}
                 A ${rx} ${ry} 0 0 0 ${cx + rx} ${bottom - ry}
                 L ${cx + rx} ${top + ry}
                 A ${rx} ${ry} 0 0 0 ${cx - rx} ${top + ry}
                 Z`}
              fill={SVC.plum}
              stroke={SVC.crimson}
              strokeWidth="1.5"
            />
            {/* Top ellipse */}
            <ellipse
              cx={cx}
              cy={top + ry}
              rx={rx}
              ry={ry}
              fill={SVC.ink}
              stroke={SVC.crimson}
              strokeWidth="1.5"
            />
            {/* Layer rings */}
            <ellipse
              cx={cx}
              cy={top + 34}
              rx={rx - 1}
              ry={ry - 2}
              fill="none"
              stroke={SVC.gold}
              strokeWidth="1.1"
              opacity={0.9}
            />
            <ellipse
              cx={cx}
              cy={top + 52}
              rx={rx - 1}
              ry={ry - 2}
              fill="none"
              stroke={SVC.gold}
              strokeWidth="1"
              opacity={0.55}
            />
            <ellipse
              cx={cx}
              cy={top + 68}
              rx={rx - 1}
              ry={ry - 2}
              fill="none"
              stroke={SVC.crimson}
              strokeWidth="0.9"
              opacity={0.45}
            />
            {/* Data pulse dots */}
            <circle
              cx={cx + (i === 1 ? 10 : -8)}
              cy={top + 34}
              r="2.2"
              fill={SVC.gold}
            />
          </g>
        );
      })}
    </VisualFrame>
  );
}
