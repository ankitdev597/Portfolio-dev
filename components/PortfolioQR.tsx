"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, ExternalLink, Link2 } from "lucide-react";
import { profile, resume } from "@/data/profile";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import QrPuzzle from "@/components/QrPuzzle";

const FALLBACK_SITE = "https://ankitvishwakarma.dev";

function siteBase(): string {
  const env = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE).replace(/\/$/, "");
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    return window.location.origin;
  }
  return env;
}

async function makeQr(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: "#1C1816",
      light: "#FFFCF8",
    },
    errorCorrectionLevel: "H",
  });
}

export default function PortfolioQR() {
  const [portfolioQr, setPortfolioQr] = useState("");
  const [resumeQr, setResumeQr] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState(FALLBACK_SITE);
  const [resumeUrl, setResumeUrl] = useState(`${FALLBACK_SITE}${resume.path}`);

  useEffect(() => {
    let cancelled = false;
    const base = siteBase();
    const site = base;
    const pdf = `${base}${resume.path}`;

    setPortfolioUrl(site);
    setResumeUrl(pdf);

    // Slight delay so the puzzle entrance feels intentional after scroll-in
    const timer = window.setTimeout(() => {
      Promise.all([makeQr(site), makeQr(pdf)])
        .then(([siteData, pdfData]) => {
          if (cancelled) return;
          setPortfolioQr(siteData);
          setResumeQr(pdfData);
        })
        .catch(() => {
          if (!cancelled) {
            setPortfolioQr("");
            setResumeQr("");
          }
        });
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <Section id="share">
      <SectionHeading
        eyebrow="Scan & Share"
        title="Portfolio & Resume QR"
        description={`Watch each code assemble like a puzzle — then scan to open this site on any phone, or download ${profile.fullName}'s resume PDF instantly.`}
      />

      <div className="section-card-grid-2">
        <Reveal delay={0.08} className="h-full">
          <article className="glass-panel card-depth flex h-full min-h-[22rem] flex-col items-center p-5 text-center sm:min-h-[24rem] sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              Portfolio
            </p>

            <div className="mt-6 rounded-2xl border border-[rgb(var(--border)/0.5)] bg-white p-3 shadow-[0_16px_40px_-24px_rgb(var(--primary)/0.45)] sm:p-4">
              <QrPuzzle
                src={portfolioQr}
                alt={`QR code linking to ${profile.fullName}'s portfolio`}
                size={200}
              />
            </div>

            <div className="mt-6 flex min-h-[4.5rem] flex-1 flex-col justify-start space-y-2 px-1">
              <p className="text-base font-semibold text-text">{profile.fullName}</p>
              <p className="line-clamp-2 break-all font-mono text-[11px] text-muted sm:text-xs">
                {portfolioUrl}
              </p>
            </div>

            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2"
            >
              <Link2 className="h-4 w-4" aria-hidden="true" />
              Open Portfolio
            </a>
          </article>
        </Reveal>

        <Reveal delay={0.14} className="h-full">
          <article className="glass-panel card-depth flex h-full min-h-[22rem] flex-col items-center p-5 text-center sm:min-h-[24rem] sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              Resume PDF
            </p>

            <div className="mt-6 rounded-2xl border border-[rgb(var(--border)/0.5)] bg-white p-3 shadow-[0_16px_40px_-24px_rgb(var(--primary)/0.45)] sm:p-4">
              <QrPuzzle
                src={resumeQr}
                alt={`QR code linking to ${resume.fileName}`}
                size={200}
              />
            </div>

            <div className="mt-6 flex min-h-[4.5rem] flex-1 flex-col justify-start space-y-2 px-1">
              <p className="text-base font-semibold text-text">{resume.roleTitle}</p>
              <p className="line-clamp-2 break-all font-mono text-[11px] text-muted sm:text-xs">
                {resumeUrl}
              </p>
            </div>

            <div className="mt-auto flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={resume.path}
                download={resume.fileName}
                className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download PDF
              </a>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Open Link
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
