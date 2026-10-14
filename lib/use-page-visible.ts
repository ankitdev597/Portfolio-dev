"use client";

import { useEffect, useState } from "react";

/** Tracks document visibility so WebGL loops can pause in background tabs. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function sync() {
      setVisible(document.visibilityState === "visible");
    }
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return visible;
}
