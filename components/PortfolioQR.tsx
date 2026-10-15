"use client";

import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, FileText } from "lucide-react";
import { profile, resume } from "@/data/profile";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import QrPuzzle from "@/components/QrPuzzle";
import { getResumeUrl } from "@/lib/site-url";
import {
  dataUrlToBlob,
  downloadBlob,
  shareFiles,
  whatsAppShareUrl,
} from "@/lib/share";

async function makeQr(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 440,
    margin: 2,
    color: { dark: "#1C1816", light: "#FFFCF8" },
    errorCorrectionLevel: "H",
  });
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Resume-only QR section — portfolio QR is omitted (redundant on this site). */
export default function PortfolioQR() {
  const resumeUrl = getResumeUrl();
  const [resumeQr, setResumeQr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      makeQr(resumeUrl)
        .then((data) => {
          if (!cancelled) setResumeQr(data);
        })
        .catch(() => {
          if (!cancelled) setResumeQr("");
        });
    }, 160);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [resumeUrl]);

  const shareQr = useCallback(async () => {
    if (!resumeQr || busy) return;
    setBusy(true);

    const text = [
      `${profile.fullName} — Resume`,
      resume.roleTitle,
      `PDF: ${resumeUrl}`,
    ].join("\n");
    const fileName = "Ankit_Vishwakarma_Resume_QR.png";

    try {
      const blob = await dataUrlToBlob(resumeQr);
      const file = new File([blob], fileName, { type: "image/png" });
      const shared = await shareFiles({
        files: [file],
        title: "Resume QR",
        text,
      });
      if (!shared) {
        downloadBlob(blob, fileName);
        window.open(whatsAppShareUrl(text), "_blank", "noopener,noreferrer");
      }
    } catch {
      window.open(whatsAppShareUrl(text), "_blank", "noopener,noreferrer");
    } finally {
      setBusy(false);
    }
  }, [busy, resumeQr, resumeUrl]);

  const downloadQr = useCallback(async () => {
    if (!resumeQr) return;
    const blob = await dataUrlToBlob(resumeQr);
    downloadBlob(blob, "Ankit_Vishwakarma_Resume_QR.png");
  }, [resumeQr]);

  return (
    <Section id="share">
      <Reveal>
        <article className="glass-panel card-depth relative mx-auto flex w-full max-w-lg flex-col items-center overflow-hidden p-6 text-center sm:p-8">
          {/* Soft watermark behind the card content */}
          <p
            className="pointer-events-none absolute inset-x-0 top-8 text-center text-[clamp(2.5rem,12vw,4.5rem)] font-bold tracking-[-0.04em] text-text/[0.045] select-none"
            aria-hidden="true"
          >
            RESUME
          </p>

          <p className="relative text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
            Resume QR
          </p>
          <h2 className="relative mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Scan to open the resume
          </h2>

          <div className="relative mt-6 rounded-2xl border border-[rgb(var(--border)/0.5)] bg-white p-3 shadow-[0_20px_48px_-28px_rgb(var(--primary)/0.55)] sm:p-4">
            <QrPuzzle
              src={resumeQr}
              alt={`QR code linking to ${resume.fileName}`}
              size={220}
            />
          </div>

          <div className="relative mt-5 space-y-1.5 px-1">
            <p className="text-base font-semibold text-text">{profile.fullName}</p>
            <p className="text-sm text-muted">{resume.roleTitle}</p>
          </div>

          <div className="relative mt-7 flex w-full flex-col gap-2.5">
            <button
              type="button"
              onClick={shareQr}
              disabled={!resumeQr || busy}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-60"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {busy ? "Opening…" : "Share QR on WhatsApp"}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={downloadQr}
                disabled={!resumeQr}
                className="btn-secondary inline-flex min-h-11 items-center justify-center gap-2 text-xs disabled:opacity-60"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                QR PNG
              </button>
              <a
                href={resume.path}
                download={resume.fileName}
                className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 text-xs"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                PDF
              </a>
            </div>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}
