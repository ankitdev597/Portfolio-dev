"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { profile, resume } from "@/data/profile";
import Reveal from "@/components/Reveal";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ankitvishwakarma.dev").replace(
  /\/$/,
  "",
);
const RESUME_URL = `${SITE_URL}${resume.path}`;

export default function ResumeQR() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const absolute =
      process.env.NODE_ENV === "development" && typeof window !== "undefined"
        ? `${window.location.origin}${resume.path}`
        : RESUME_URL;

    QRCode.toDataURL(absolute, {
      width: 280,
      margin: 2,
      color: {
        dark: "#1C1816",
        light: "#FFFCF8",
      },
      errorCorrectionLevel: "M",
    })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="resume-qr" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Scan & Download
          </p>
          <span className="divider-premium" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Resume QR Code
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-sm text-muted sm:text-base">
            Scan with your phone to open and download {profile.fullName}&apos;s resume PDF.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-panel mt-12 flex flex-col items-center gap-6 p-6 text-center sm:p-10">
            <div className="rounded-2xl border border-[rgb(var(--soft-fill)/0.12)] bg-white p-3 shadow-[0_16px_40px_-24px_rgb(var(--primary)/0.45)] sm:p-4">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL from qrcode
                <img
                  src={qrDataUrl}
                  alt={`QR code linking to ${resume.fileName}`}
                  width={220}
                  height={220}
                  className="h-[180px] w-[180px] sm:h-[220px] sm:w-[220px]"
                />
              ) : (
                <div
                  className="flex h-[180px] w-[180px] items-center justify-center bg-white text-sm text-black/50 sm:h-[220px] sm:w-[220px]"
                  aria-hidden="true"
                >
                  Generating…
                </div>
              )}
            </div>

            <div className="space-y-2 px-2">
              <p className="text-base font-semibold text-text">{resume.roleTitle}</p>
              <p className="break-all font-mono text-[11px] text-muted sm:text-xs">{RESUME_URL}</p>
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <a
                href={resume.path}
                download={resume.fileName}
                className="btn-primary inline-flex min-h-11 items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Resume PDF
              </a>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex min-h-11 items-center justify-center"
              >
                Open Resume Link
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
