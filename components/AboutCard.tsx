"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Check } from "lucide-react";
import { profile, socialLinks, resume } from "@/data/profile";
import ProfilePhotoModal from "@/components/ProfilePhotoModal";
import { MapPin } from "@/components/icons";

const CARD_FILE = "Ankit_Vishwakarma_Profile_Card.png";

const HIGHLIGHTS = [
  {
    label: "Experience",
    value: `${profile.yearsExperience}+ years`,
    hint: "Production shipping",
  },
  {
    label: "Availability",
    value: "Immediate Joiner",
    hint: "Notice ends 10 Nov 2026",
  },
  {
    label: "Focus",
    value: "Full Stack + AI",
    hint: "MERN · Laravel · AWS",
  },
] as const;

/**
 * Single About profile card — on-page UX + hidden PNG export for sharing.
 * No second visible “share card” (that felt like a duplicate).
 */
export default function AboutCard() {
  const exportRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const github = socialLinks.find((l) => l.platform === "github");
  const linkedin = socialLinks.find((l) => l.platform === "linkedin");

  const downloadCard = useCallback(async () => {
    const node = exportRef.current;
    if (!node || busy) return;

    setBusy(true);
    setDone(false);

    try {
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0E0C0E",
      });

      const link = document.createElement("a");
      link.download = CARD_FILE;
      link.href = dataUrl;
      link.click();
      setDone(true);
      window.setTimeout(() => setDone(false), 2500);
    } catch {
      try {
        const dataUrl = await toPng(exportRef.current!, {
          pixelRatio: 2,
          cacheBust: true,
        });
        window.open(dataUrl, "_blank");
      } catch {
        /* ignore */
      }
    } finally {
      setBusy(false);
    }
  }, [busy]);

  return (
    <>
      <article className="glass-panel card-depth overflow-hidden p-5 sm:p-7 lg:p-8">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-10">
          <div className="flex flex-col items-center gap-4 lg:items-stretch">
            <ProfilePhotoModal variant="card" />

            <div className="w-full text-center lg:text-left">
              <h3 className="text-xl font-semibold tracking-tight text-text">
                {profile.fullName}
              </h3>
              <p className="mt-1 text-sm text-gold">{profile.headline}</p>
              {profile.location && (
                <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs text-muted lg:justify-start">
                  <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                  {profile.location}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2.5">
              <a
                href={profile.phoneHref}
                className="btn-primary w-full !py-2.5 text-center text-xs"
                aria-label={`Call ${profile.phone}`}
              >
                Call {profile.phone}
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="btn-secondary w-full !py-2.5 text-center text-xs"
              >
                Email me
              </a>
              <a
                href={resume.path}
                download={resume.fileName}
                className="btn-secondary w-full !py-2.5 text-center text-xs"
              >
                Download resume
              </a>
              <button
                type="button"
                onClick={downloadCard}
                disabled={busy}
                className="btn-secondary inline-flex w-full items-center justify-center gap-2 !py-2.5 text-xs disabled:opacity-60"
              >
                {done ? (
                  <>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Card saved
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    {busy ? "Preparing…" : "Download card image"}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/12 px-3 py-1.5 text-xs font-medium text-text">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
                Immediate Joiner
              </span>
              <span className="tech-chip !px-3 text-xs">
                {profile.yearsExperience}+ years experience
              </span>
              <span className="tech-chip !px-3 text-xs">Open to remote / hybrid</span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              {profile.shortBio}
            </p>

            {profile.availabilityNote && (
              <p className="mt-4 rounded-xl border border-[rgb(var(--gold)/0.22)] bg-[rgb(var(--gold)/0.08)] px-4 py-3 text-sm leading-relaxed text-text">
                <span className="font-medium text-gold">Availability — </span>
                {profile.availabilityNote}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[rgb(var(--hairline)/var(--hairline-a))] bg-[rgb(var(--surface-elevated)/0.55)] px-4 py-3.5"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-text">{item.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{item.hint}</p>
                </div>
              ))}
            </div>

            <div className="soft-hairline mt-auto flex flex-wrap items-center gap-3 border-t pt-5">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                Connect
              </span>
              {github && (
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link text-sm font-medium"
                >
                  GitHub
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link text-sm font-medium"
                >
                  LinkedIn
                </a>
              )}
              <a href={profile.phoneHref} className="footer-link text-sm font-medium">
                {profile.phone}
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="footer-link break-all text-sm font-medium"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Hidden export-only card — not shown on page (avoids double UI) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] top-0 overflow-hidden"
        style={{ width: 640, height: 336 }}
      >
        <div
          ref={exportRef}
          style={{
            width: 640,
            height: 336,
            position: "relative",
            overflow: "hidden",
            borderRadius: 16,
            background: "linear-gradient(145deg, #121012 0%, #1A1418 48%, #0E0C0E 100%)",
            color: "#F2ECE4",
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 55% 70% at 100% 0%, rgba(180,52,62,0.28), transparent 55%), radial-gradient(ellipse 45% 55% at 0% 100%, rgba(196,162,110,0.18), transparent 50%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              height: "100%",
              gap: 20,
              padding: 22,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: 180,
                flexShrink: 0,
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(196,162,110,0.35)",
                background: "#1C161A",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/profile-photo.jpg"
                alt=""
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  alignSelf: "flex-start",
                  padding: "5px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(52,211,153,0.35)",
                  background: "rgba(16,185,129,0.12)",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 999, background: "#34D399" }} />
                Immediate Joiner
              </div>
              <h3
                style={{
                  margin: "12px 0 0",
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                {profile.fullName}
              </h3>
              <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 500, color: "#C4A26E" }}>
                {profile.headline}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#9C9288" }}>
                {profile.tagline} · {profile.yearsExperience}+ years
              </p>
              <div style={{ marginTop: 14, display: "grid", gap: 6, fontSize: 12 }}>
                <div>
                  <span style={{ color: "#C4A26E", marginRight: 6 }}>Phone</span>
                  {profile.phone}
                </div>
                <div>
                  <span style={{ color: "#C4A26E", marginRight: 6 }}>Email</span>
                  {profile.email}
                </div>
                {profile.location && (
                  <div>
                    <span style={{ color: "#C4A26E", marginRight: 6 }}>Location</span>
                    {profile.location}
                  </div>
                )}
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  gap: 12,
                  fontSize: 11,
                  color: "#9C9288",
                }}
              >
                {github && <span>GitHub · ankitdev597</span>}
                {linkedin && <span>LinkedIn · ankit-vishwakarma</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
