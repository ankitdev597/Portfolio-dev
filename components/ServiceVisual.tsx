"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ServiceVisual as ServiceVisualKey } from "@/data/services";
import { ServiceIllustration, DatabaseVisual } from "@/components/service-visuals";

const DatabaseScene3D = dynamic(() => import("@/components/DatabaseScene3D"), {
  ssr: false,
  loading: () => <DatabaseVisual />,
});

/**
 * SVG illustrations for every service. Database also mounts a lazy WebGL
 * cylinder when near the viewport; SVG remains the fallback/loading state.
 */
export default function ServiceVisual({ visual }: { visual: ServiceVisualKey }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const useWebGl = visual === "database";

  useEffect(() => {
    if (!useWebGl) return;

    const el = hostRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [useWebGl]);

  if (!useWebGl) {
    return (
      <div className="h-full w-full">
        <ServiceIllustration visual={visual} />
      </div>
    );
  }

  return (
    <div ref={hostRef} className="h-full w-full">
      {!active && <DatabaseVisual />}
      {active && <DatabaseScene3D />}
    </div>
  );
}
