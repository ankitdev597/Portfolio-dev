"use client";

import { useCallback, useRef, useState } from "react";
import { toBlob, toPng } from "html-to-image";
import { Download, Check, Share2 } from "lucide-react";
import { profile, socialLinks, resume } from "@/data/profile";
import ProfilePhotoModal from "@/components/ProfilePhotoModal";
import { MapPin } from "@/components/icons";

const CARD_FILE = "Ankit_Vishwakarma_Profile_Card.png";
const FALLBACK_SITE = "https://ankitvishwakarma.dev";

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

function siteUrl() {
  const env = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE).replace(/\/$/, "");
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    return window.location.origin;
  }
  return env;
}

function shareText() {
  const url = siteUrl();
  return [
    `${profile.fullName}`,
    `${profile.headline}`,
    `Phone: ${profile.phone}`,
    `Email: ${profile.email}`,
    `Portfolio: ${url}`,
    "",
    "Immediate Joiner — Full Stack · AI · AWS",
  ].join("\n");
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Single About profile card — download PNG + WhatsApp / native share.
 */
export default function AboutCard() {
  const exportRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"download" | "whatsapp" | "share" | null>(null);
  const [done, setDone] = useState<"download" | "share" | null>(null);

  const github = socialLinks.find((l) => l.platform === "github");
  const linkedin = socialLinks.find((l) => l.platform === "linkedin");

  const makeCardBlob = useCallback(async () => {
    const node = exportRef.current;
    if (!node) throw new Error("Card not ready");
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    let blob = await toBlob(node, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#0E0C0E",
    });

    if (!blob) {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0E0C0E",
      });
      const res = await fetch(dataUrl);
      blob = await res.blob();
    }

    return blob;
  }, []);

  const downloadCard = useCallback(async () => {
    if (busy) return;
    setBusy("download");
    setDone(null);
    try {
      const blob = await makeCardBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = CARD_FILE;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setDone("download");
      window.setTimeout(() => setDone(null), 2500);
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  }, [busy, makeCardBlob]);

  const shareNative = useCallback(async () => {
    if (busy) return;
    setBusy("share");
    setDone(null);
    try {
      const blob = await makeCardBlob();
      const file = new File([blob], CARD_FILE, { type: "image/png" });
      const text = shareText();

      if (typeof navigator !== "undefined" && navigator.share) {
        const payload: ShareData = { title: profile.fullName, text, url: siteUrl() };
        if (navigator.canShare?.({ files: [file] })) {
          payload.files = [file];
        }
        await navigator.share(payload);
        setDone("share");
        window.setTimeout(() => setDone(null), 2500);
        return;
      }

      await navigator.clipboard?.writeText(text);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = CARD_FILE;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setDone("share");
      window.setTimeout(() => setDone(null), 2500);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    } finally {
      setBusy(null);
    }
  }, [busy, makeCardBlob]);

  const shareWhatsApp = useCallback(async () => {
    if (busy) return;
    setBusy("whatsapp");
    setDone(null);
    try {
      const blob = await makeCardBlob();
      const file = new File([blob], CARD_FILE, { type: "image/png" });
      const text = shareText();

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: profile.fullName,
          text,
        });
        setDone("share");
        window.setTimeout(() => setDone(null), 2500);
        return;
      }

      // Desktop: download PNG + open WhatsApp with contact text
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = CARD_FILE;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setDone("share");
      window.setTimeout(() => setDone(null), 2500);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText())}`,
        "_blank",
        "noopener,noreferrer",
      );
    } finally {
      setBusy(null);
    }
  }, [busy, makeCardBlob]);

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

              <div className="soft-hairline mt-1 border-t pt-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Share card
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={shareWhatsApp}
                    disabled={Boolean(busy)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {busy === "whatsapp" ? "Opening…" : "Share on WhatsApp"}
                  </button>
                  <button
                    type="button"
                    onClick={shareNative}
                    disabled={Boolean(busy)}
                    className="btn-secondary inline-flex w-full items-center justify-center gap-2 !py-2.5 text-xs disabled:opacity-60"
                  >
                    {done === "share" ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        Shared
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                        {busy === "share" ? "Preparing…" : "Share…"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={downloadCard}
                    disabled={Boolean(busy)}
                    className="btn-secondary inline-flex w-full items-center justify-center gap-2 !py-2.5 text-xs disabled:opacity-60"
                  >
                    {done === "download" ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        Card saved
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        {busy === "download" ? "Preparing…" : "Download PNG"}
                      </>
                    )}
                  </button>
                </div>
              </div>
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

      {/* Hidden export card — not shown on page */}
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
