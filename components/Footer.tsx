"use client";

import { profile, socialLinks } from "@/data/profile";
import { siteConfig } from "@/data/data";
import { scrollToSection } from "@/lib/lenis-singleton";

const FOOTER_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "share", label: "Share & QR" },
  { id: "contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container-page py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="group flex items-center gap-2.5 text-left"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[11px] font-bold text-white shadow-[0_0_0_1px_rgb(var(--gold)/0.28)]"
                aria-hidden="true"
              >
                AV
              </span>
              <span className="text-base font-semibold text-text transition-colors group-hover:text-gold">
                {profile.fullName}
              </span>
            </button>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {profile.headline}. {siteConfig.availability} — ready for production-ready
              full-stack work.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={profile.phoneHref}
                className="btn-primary !px-5 !py-2.5 text-xs"
                aria-label={`Call ${profile.phone}`}
              >
                Call {profile.phone}
              </a>
              <a href={`mailto:${profile.email}`} className="btn-secondary !px-5 !py-2.5 text-xs">
                Email
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
              Navigate
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-1">
              {FOOTER_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="footer-link"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
              Connect
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={profile.phoneHref} className="footer-link block">
                  {profile.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className="footer-link break-all">
                  {profile.email}
                </a>
              </li>
              {profile.location && (
                <li className="text-sm text-muted">{profile.location}</li>
              )}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn !h-10 !w-auto gap-2 !rounded-full !px-4 text-xs font-medium"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[rgb(var(--hairline)/var(--hairline-a))] pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm font-medium text-gold">{siteConfig.availability}</p>
        </div>
      </div>
    </footer>
  );
}
