"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { toBlob, toPng } from "html-to-image";
import QRCode from "qrcode";
import { Check, Download, FileText, Mail, Phone } from "lucide-react";
import { profile, socialLinks, resume } from "@/data/profile";
import ProfilePhotoModal from "@/components/ProfilePhotoModal";
import { MapPin } from "@/components/icons";
import { getSiteUrl } from "@/lib/site-url";
import {
  buildShareText,
  downloadBlob,
  shareFiles,
  whatsAppShareUrl,
} from "@/lib/share";

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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Icon-first control — caption only when the card is hovered. */
function IconRailBtn({
  label,
  hint,
  className,
  children,
  href,
  download,
  onClick,
  disabled,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
  href?: string;
  download?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const a11y = hint ?? label;
  const shell =
    "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-[transform,opacity,border-color,filter] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";

  const control = href ? (
    <a
      href={href}
      download={download}
      aria-label={a11y}
      title={a11y}
      className={`${shell} ${className ?? ""}`}
    >
      {children}
    </a>
  ) : (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={a11y}
      title={a11y}
      className={`${shell} ${className ?? ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex w-14 flex-col items-center gap-1.5">
      {control}
      <span
        className="min-h-[1.1rem] text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-gold opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 group-focus-within:opacity-100 max-lg:opacity-75"
        aria-hidden="true"
      >
        {label}
      </span>
    </div>
  );
}

/** Single About card — WhatsApp share (card + QR) and PNG download. */
export default function AboutCard() {
  const exportRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [busy, setBusy] = useState<"download" | "whatsapp" | null>(null);
  const [done, setDone] = useState<"download" | "whatsapp" | null>(null);

  const github = socialLinks.find((l) => l.platform === "github");
  const linkedin = socialLinks.find((l) => l.platform === "linkedin");
  const site = getSiteUrl();

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(site, {
      width: 280,
      margin: 1,
      color: { dark: "#1C1816", light: "#FFFCF8" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [site]);

  const makeCardBlob = useCallback(async () => {
    const node = exportRef.current;
    if (!node) throw new Error("Card not ready");
    // Wait for QR paint
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await new Promise((r) => setTimeout(r, 40));

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
      downloadBlob(blob, CARD_FILE);
      setDone("download");
      window.setTimeout(() => setDone(null), 2500);
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  }, [busy, makeCardBlob]);

  const shareWhatsApp = useCallback(async () => {
    if (busy) return;
    setBusy("whatsapp");
    setDone(null);
    const text = buildShareText();
    try {
      const blob = await makeCardBlob();
      const file = new File([blob], CARD_FILE, { type: "image/png" });
      const shared = await shareFiles({
        files: [file],
        title: profile.fullName,
        text,
      });
      if (!shared) {
        downloadBlob(blob, CARD_FILE);
        window.open(whatsAppShareUrl(text), "_blank", "noopener,noreferrer");
      }
      setDone("whatsapp");
      window.setTimeout(() => setDone(null), 2500);
    } catch {
      window.open(whatsAppShareUrl(text), "_blank", "noopener,noreferrer");
    } finally {
      setBusy(null);
    }
  }, [busy, makeCardBlob]);

  const whatsappLabel =
    busy === "whatsapp" ? "Opening…" : done === "whatsapp" ? "Ready" : "WhatsApp";
  const pngLabel =
    done === "download" ? "Saved" : busy === "download" ? "Preparing…" : "PNG card";

  return (
    <>
      <article className="group/card glass-panel card-depth overflow-hidden p-5 sm:p-7 lg:p-8">
        <div className="grid items-stretch gap-7 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
          {/* Left — identity + action rail (fills former empty stack) */}
          <div className="relative flex flex-col gap-5 lg:pr-2">
            <div
              className="pointer-events-none absolute inset-y-2 -left-2 hidden w-px bg-gradient-to-b from-transparent via-[rgb(var(--gold)/0.35)] to-transparent lg:block"
              aria-hidden="true"
            />

            <div className="flex flex-col items-center gap-4 lg:items-start">
              <ProfilePhotoModal variant="card" />

              <div className="w-full text-center lg:text-left">
                <h3 className="text-xl font-semibold tracking-tight text-text lg:text-2xl">
                  {profile.fullName}
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-gold">{profile.headline}</p>
                {profile.location && (
                  <p className="mt-2.5 inline-flex items-center justify-center gap-1.5 text-xs text-muted lg:justify-start">
                    <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                    {profile.location}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-1 flex flex-1 flex-col justify-center gap-3 rounded-2xl border border-[rgb(var(--gold)/0.16)] bg-[rgb(var(--surface-elevated)/0.45)] p-4 sm:p-5">
              <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-gold lg:text-left">
                Quick actions
              </p>
              <div className="flex flex-wrap items-start justify-center gap-3 lg:justify-start">
                <IconRailBtn
                  href={profile.phoneHref}
                  label="Call"
                  hint={`Call ${profile.phone}`}
                  className="contact-orb-primary bg-primary text-white shadow-[0_10px_24px_-12px_rgb(var(--primary)/0.7)]"
                >
                  <Phone className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} aria-hidden="true" />
                </IconRailBtn>
                <IconRailBtn
                  href={`mailto:${profile.email}`}
                  label="Email"
                  hint={`Email ${profile.email}`}
                  className="contact-orb-secondary"
                >
                  <Mail className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} aria-hidden="true" />
                </IconRailBtn>
                <IconRailBtn
                  href={resume.path}
                  download={resume.fileName}
                  label="Resume"
                  hint="Download resume"
                  className="contact-orb-secondary"
                >
                  <FileText className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} aria-hidden="true" />
                </IconRailBtn>
              </div>
            </div>
          </div>

          {/* Right — story, metrics, share */}
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2 max-lg:justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/12 px-3 py-1.5 text-xs font-medium text-text">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
                Immediate Joiner
              </span>
              <span className="tech-chip !px-3 text-xs">
                {profile.yearsExperience}+ years experience
              </span>
              <span className="tech-chip !px-3 text-xs">Open to remote / hybrid</span>
            </div>

            <p className="mt-5 line-clamp-5 text-base leading-relaxed text-muted max-lg:text-center sm:text-lg lg:mt-6 lg:line-clamp-none">
              {profile.shortBio}
            </p>

            {profile.availabilityNote && (
              <p className="mt-4 rounded-xl border border-[rgb(var(--gold)/0.28)] bg-[rgb(var(--gold)/0.1)] px-4 py-3 text-sm leading-relaxed text-text max-lg:text-center">
                <span className="font-medium text-gold">Availability — </span>
                {profile.availabilityNote}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[rgb(var(--gold)/0.18)] bg-[rgb(var(--surface-elevated)/0.65)] px-4 py-3.5 text-center transition-[border-color,background-color] duration-200 group-hover/card:border-[rgb(var(--gold)/0.32)] sm:text-left"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-text">{item.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{item.hint}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-1 flex-col justify-end gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgb(var(--gold)/0.16)] bg-[rgb(var(--surface-elevated)/0.4)] px-4 py-3.5">
                <div className="min-w-0 max-lg:w-full max-lg:text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                    Share card + QR
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    PNG includes photo, contact, QR → {site.replace(/^https?:\/\//, "")}
                  </p>
                </div>
                <div className="flex items-center gap-3 max-lg:mx-auto">
                  <IconRailBtn
                    onClick={shareWhatsApp}
                    disabled={Boolean(busy) || !qrDataUrl}
                    label={whatsappLabel}
                    hint="Share card on WhatsApp"
                    className="bg-[#25D366] text-white shadow-[0_8px_22px_-10px_rgb(37_211_102/0.65)] hover:opacity-90"
                  >
                    <WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />
                  </IconRailBtn>
                  <IconRailBtn
                    onClick={downloadCard}
                    disabled={Boolean(busy) || !qrDataUrl}
                    label={pngLabel}
                    hint="Download profile card PNG"
                    className="contact-orb-secondary"
                  >
                    {done === "download" ? (
                      <Check className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <Download className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} aria-hidden="true" />
                    )}
                  </IconRailBtn>
                </div>
              </div>
            </div>

            <div className="soft-hairline mt-5 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 max-lg:justify-center">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                  Connect
                </span>
                {github && (
                  <a
                    href={github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={github.label}
                    className="contact-orb-social !h-11 !w-11"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.6 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
                    </svg>
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={linkedin.label}
                    className="contact-orb-social !h-11 !w-11"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.8 5 6.3V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9Z" />
                    </svg>
                  </a>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm max-lg:justify-center">
                <a href={profile.phoneHref} className="footer-link font-medium">
                  {profile.phone}
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="footer-link break-all font-medium"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Hidden export: card + portfolio QR */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] top-0 overflow-hidden"
        style={{ width: 720, height: 380 }}
      >
        <div
          ref={exportRef}
          style={{
            width: 720,
            height: 380,
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
              gap: 18,
              padding: 22,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: 150,
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
                  margin: "10px 0 0",
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                {profile.fullName}
              </h3>
              <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 500, color: "#C4A26E" }}>
                {profile.headline}
              </p>
              <div style={{ marginTop: 12, display: "grid", gap: 5, fontSize: 12 }}>
                <div>
                  <span style={{ color: "#C4A26E", marginRight: 6 }}>Phone</span>
                  {profile.phone}
                </div>
                <div>
                  <span style={{ color: "#C4A26E", marginRight: 6 }}>Email</span>
                  {profile.email}
                </div>
                <div>
                  <span style={{ color: "#C4A26E", marginRight: 6 }}>Web</span>
                  {site.replace(/^https?:\/\//, "")}
                </div>
              </div>
            </div>

            <div
              style={{
                width: 132,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#FFFCF8",
                  padding: 6,
                  boxSizing: "border-box",
                }}
              >
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt=""
                    style={{ width: "100%", height: "100%", display: "block" }}
                  />
                ) : null}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#C4A26E",
                  textAlign: "center",
                }}
              >
                Scan portfolio
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
