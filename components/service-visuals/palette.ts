/** Shared service-diagram colors — dark Crimson Noir + light warm gold. */

export type SvcPalette = {
  crimson: string;
  crimsonDim: string;
  gold: string;
  plum: string;
  ink: string;
  line: string;
  text: string;
  muted: string;
  bgFrom: string;
  bgTo: string;
};

/** Dark (default) — charcoal panel, gold/crimson diagram. */
export const SVC_DARK: SvcPalette = {
  crimson: "#B4343E",
  crimsonDim: "#78262E",
  gold: "#C4A26E",
  plum: "#1C161A",
  ink: "#08080A",
  line: "#3A2E34",
  text: "#E8E4DE",
  muted: "#A89E96",
  bgFrom: "#1C161A",
  bgTo: "#08080A",
};

/**
 * Light — cream panel, gold strokes, ink labels.
 * Box fills stay pale so gold/crimson outlines read clearly.
 */
export const SVC_LIGHT: SvcPalette = {
  crimson: "#A8303A",
  crimsonDim: "#782830",
  gold: "#A87C3E",
  plum: "#F0E8DA",
  ink: "#FFFCF8",
  line: "#D6C8B2",
  text: "#1C1816",
  muted: "#6C6258",
  bgFrom: "#FFFCF8",
  bgTo: "#F0E6D6",
};

/** @deprecated Prefer useSvc() for theme-aware colors. */
export const SVC = SVC_DARK;
