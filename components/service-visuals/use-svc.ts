"use client";

import { useTheme } from "@/components/ThemeProvider";
import { SVC_DARK, SVC_LIGHT, type SvcPalette } from "./palette";

/** Theme-aware service illustration palette (gold accents in both modes). */
export function useSvc(): SvcPalette {
  const { theme } = useTheme();
  return theme === "light" ? SVC_LIGHT : SVC_DARK;
}
