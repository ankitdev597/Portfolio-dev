"use client";

import Image from "next/image";
import { useState } from "react";
import type { LucideIcon } from "@/components/icons";
import type { Project } from "@/data/projects";
import {
  getProjectMediaTheme,
  resolveProjectMedia,
  type ProjectImageKind,
} from "@/lib/project-media";

function RepresentativeCover({
  theme,
  Icon,
  title,
}: {
  theme: ReturnType<typeof getProjectMediaTheme>;
  Icon: LucideIcon;
  title: string;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6"
      style={{
        background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.via} 48%, ${theme.to} 100%)`,
      }}
      role="img"
      aria-label={`${title} representative preview — not a live website screenshot`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-48 w-48 rounded-full opacity-30 blur-2xl"
        style={{ background: theme.accent }}
        aria-hidden="true"
      />

      <p className="relative text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
        Representative preview
      </p>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-4">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:scale-105"
          style={{ color: theme.accent }}
        >
          <Icon className="h-8 w-8 text-white" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="text-center text-sm font-medium text-white/90 sm:text-base">{theme.label}</p>
      </div>

      <p className="relative text-[10px] text-white/50">Not a live website screenshot</p>
    </div>
  );
}

export default function ProjectCardMedia({
  project,
  Icon,
  showFeaturedBadge,
}: {
  project: Project;
  Icon: LucideIcon;
  showFeaturedBadge?: boolean;
}) {
  const initial = resolveProjectMedia(project);
  const theme = getProjectMediaTheme(project.icon);
  const [kind, setKind] = useState<ProjectImageKind>(initial.kind);
  const [showPhoto, setShowPhoto] = useState(initial.kind === "screenshot" && Boolean(project.image));

  const photoSrc = project.image;
  const showingScreenshot = showPhoto && Boolean(photoSrc) && kind === "screenshot";

  return (
    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-[rgb(var(--hairline)/var(--hairline-a))] bg-[rgb(var(--surface-elevated))]">
      {/* Neutral plane while a screenshot loads; themed cover only for representatives */}
      <div
        className="absolute inset-0 bg-[rgb(var(--surface-elevated))]"
        aria-hidden="true"
      />

      {!showingScreenshot && (
        <RepresentativeCover theme={theme} Icon={Icon} title={project.title} />
      )}

      {showingScreenshot && photoSrc && (
        <Image
          src={photoSrc}
          alt={`${project.title} live website screenshot`}
          fill
          sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
          loading="lazy"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          onError={() => {
            setShowPhoto(false);
            setKind("representative");
          }}
        />
      )}

      {!showingScreenshot && (
        // Local SVG asset preferred; CSS cover beneath stays if the file fails.
        // eslint-disable-next-line @next/next/no-img-element -- static local SVG; next/image SVG handling is unnecessary here
        <img
          src={theme.fallbackSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
        {showFeaturedBadge && (
          <span className="rounded-full bg-gradient-to-r from-primary to-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            Featured
          </span>
        )}
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur-sm ${
            showingScreenshot
              ? "bg-black/55 text-white"
              : "bg-black/45 text-white/90 ring-1 ring-white/25"
          }`}
        >
          {showingScreenshot ? "Live screenshot" : "Representative"}
        </span>
      </div>
    </div>
  );
}
