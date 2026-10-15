import type { Project, ProjectIconKey } from "@/data/projects";

export type ProjectImageKind = "screenshot" | "representative";

export interface ProjectMediaTheme {
  /** Short category label for the representative cover */
  label: string;
  from: string;
  via: string;
  to: string;
  accent: string;
  /** Local SVG under /public — never depends on external hosts */
  fallbackSrc: string;
}

/** Category-matched themes used when a live screenshot is missing or fails to load. */
export const PROJECT_MEDIA_THEMES: Record<ProjectIconKey, ProjectMediaTheme> = {
  wallet: {
    label: "E‑commerce · Wallet",
    from: "#0f766e",
    via: "#115e59",
    to: "#134e4a",
    accent: "#5eead4",
    fallbackSrc: "/images/projects/fallbacks/wallet.svg",
  },
  comms: {
    label: "CRM · Communications",
    from: "#1d4ed8",
    via: "#1e40af",
    to: "#172554",
    accent: "#93c5fd",
    fallbackSrc: "/images/projects/fallbacks/comms.svg",
  },
  facilities: {
    label: "Facilities · CRM",
    from: "#0f766e",
    via: "#0e7490",
    to: "#164e63",
    accent: "#67e8f9",
    fallbackSrc: "/images/projects/fallbacks/facilities.svg",
  },
  care: {
    label: "Operations · Care",
    from: "#0369a1",
    via: "#0e7490",
    to: "#134e4a",
    accent: "#7dd3fc",
    fallbackSrc: "/images/projects/fallbacks/care.svg",
  },
  casting: {
    label: "Talent · Casting",
    from: "#3f3f46",
    via: "#18181b",
    to: "#09090b",
    accent: "#6ee7b7",
    fallbackSrc: "/images/projects/fallbacks/casting.svg",
  },
  trading: {
    label: "Exchange · Platform",
    from: "#14532d",
    via: "#166534",
    to: "#052e16",
    accent: "#a3e635",
    fallbackSrc: "/images/projects/fallbacks/trading.svg",
  },
  "ai-chat": {
    label: "AI · Insights",
    from: "#14453d",
    via: "#1a3a32",
    to: "#0c1f1a",
    accent: "#5eead4",
    fallbackSrc: "/images/projects/fallbacks/ai-chat.svg",
  },
  travel: {
    label: "Travel · Booking",
    from: "#1e3a5f",
    via: "#0f172a",
    to: "#020617",
    accent: "#38bdf8",
    fallbackSrc: "/images/projects/fallbacks/travel.svg",
  },
  health: {
    label: "Health · Wellness",
    from: "#9f1239",
    via: "#881337",
    to: "#4c0519",
    accent: "#fda4af",
    fallbackSrc: "/images/projects/fallbacks/health.svg",
  },
  finance: {
    label: "Fintech · Finance",
    from: "#14532d",
    via: "#052e16",
    to: "#022c22",
    accent: "#86efac",
    fallbackSrc: "/images/projects/fallbacks/finance.svg",
  },
  sports: {
    label: "Sports · Booking",
    from: "#b45309",
    via: "#92400e",
    to: "#451a03",
    accent: "#fcd34d",
    fallbackSrc: "/images/projects/fallbacks/sports.svg",
  },
  jobs: {
    label: "HR · Jobs",
    from: "#3730a3",
    via: "#312e81",
    to: "#1e1b4b",
    accent: "#a5b4fc",
    fallbackSrc: "/images/projects/fallbacks/jobs.svg",
  },
  data: {
    label: "Data · Processing",
    from: "#334155",
    via: "#1e293b",
    to: "#0f172a",
    accent: "#94a3b8",
    fallbackSrc: "/images/projects/fallbacks/data.svg",
  },
  automation: {
    label: "Automation · Scraping",
    from: "#57534e",
    via: "#44403c",
    to: "#1c1917",
    accent: "#d6d3d1",
    fallbackSrc: "/images/projects/fallbacks/automation.svg",
  },
  scheduler: {
    label: "Workers · Scheduling",
    from: "#0e7490",
    via: "#155e75",
    to: "#083344",
    accent: "#67e8f9",
    fallbackSrc: "/images/projects/fallbacks/scheduler.svg",
  },
  "ai-toolkit": {
    label: "AI · Toolkit",
    from: "#6b21a8",
    via: "#581c87",
    to: "#3b0764",
    accent: "#e9d5ff",
    fallbackSrc: "/images/projects/fallbacks/ai-toolkit.svg",
  },
  business: {
    label: "Business · Hub",
    from: "#7f1d1d",
    via: "#450a0a",
    to: "#1c1917",
    accent: "#fca5a5",
    fallbackSrc: "/images/projects/fallbacks/business.svg",
  },
};

export function getProjectMediaTheme(icon: ProjectIconKey): ProjectMediaTheme {
  return PROJECT_MEDIA_THEMES[icon];
}

/**
 * Resolve what to show for a project card.
 * Prefer a real screenshot path when present; otherwise use the category fallback.
 */
export function resolveProjectMedia(project: Project): {
  src: string;
  kind: ProjectImageKind;
  theme: ProjectMediaTheme;
} {
  const theme = getProjectMediaTheme(project.icon);
  if (project.image) {
    return {
      src: project.image,
      kind: project.imageKind ?? "screenshot",
      theme,
    };
  }
  return {
    src: theme.fallbackSrc,
    kind: "representative",
    theme,
  };
}
