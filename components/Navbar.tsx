"use client";

import { useEffect, useId, useState } from "react";
import { profile, socialLinks } from "@/data/profile";
import { getLenisInstance, scrollToSection } from "@/lib/lenis-singleton";
import { unlockPageScroll } from "@/lib/unlock-scroll";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "devops", label: "DevOps" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "share", label: "Share & QR" },
  { id: "contact", label: "Contact" },
];

const SECTION_IDS = ["hero", ...LINKS.map((l) => l.id)];
const LENIS_ATTACH_MAX_ATTEMPTS = 40;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const menuId = useId();

  useEffect(() => {
    function readScrollY() {
      const lenis = getLenisInstance();
      return lenis ? lenis.scroll : window.scrollY;
    }

    function onScroll() {
      setScrolled(readScrollY() > 16);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let unsubscribe: (() => void) | undefined;
    let attempts = 0;
    const attachLenis = window.setInterval(() => {
      attempts += 1;
      const lenis = getLenisInstance();
      if (lenis && !unsubscribe) {
        unsubscribe = lenis.on("scroll", onScroll);
        onScroll();
        window.clearInterval(attachLenis);
        return;
      }
      if (attempts >= LENIS_ATTACH_MAX_ATTEMPTS) {
        window.clearInterval(attachLenis);
      }
    }, 50);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(attachLenis);
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!elements.length) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let bestId = "hero";
        let bestRatio = 0;
        for (const id of SECTION_IDS) {
          const r = ratios.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActiveId(bestId);
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      unlockPageScroll();
      return;
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    getLenisInstance()?.stop();

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockPageScroll();
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function go(id: string) {
    setMenuOpen(false);
    setActiveId(id);
    window.requestAnimationFrame(() => {
      unlockPageScroll();
      scrollToSection(id);
    });
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled || menuOpen ? "site-nav-scrolled" : ""
      }`}
    >
      <nav
        className="container-page flex items-center justify-between gap-3 py-3.5"
        style={{ paddingTop: "max(0.875rem, env(safe-area-inset-top))" }}
        aria-label="Primary"
      >
        <button
          type="button"
          onClick={() => go("hero")}
          className="group relative z-[60] flex shrink-0 items-center gap-2.5 text-left"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[11px] font-bold tracking-wide text-white shadow-[0_0_0_1px_rgb(var(--gold)/0.28)] transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            AV
          </span>
          <span className="text-sm font-semibold tracking-wide text-text transition-colors group-hover:text-gold">
            {profile.fullName}
          </span>
        </button>

        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.filter((l) => l.id !== "share").map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => go(link.id)}
              className={`nav-link ${activeId === link.id ? "nav-link-active" : ""}`}
              aria-current={activeId === link.id ? "true" : undefined}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="relative z-[60] flex items-center gap-2">
          <ThemeToggle />
          <a
            href={profile.phoneHref}
            className="btn-primary hidden !px-5 !py-2.5 text-xs lg:inline-flex"
            aria-label={`Call ${profile.phone}`}
          >
            Contact Me
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((v) => !v)}
            className="icon-btn relative flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
            <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
              <span
                className={`block h-0.5 w-full origin-center rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "scale-x-0 opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full origin-center rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeMenu}
          className={`absolute inset-0 bg-[rgb(var(--overlay)/0.6)] backdrop-blur-md transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col border-b border-[rgb(var(--hairline)/var(--hairline-a))] bg-background/96 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.75rem))] shadow-[0_24px_64px_-28px_rgb(var(--primary)/0.4)] backdrop-blur-xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{
            paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-5 pb-6">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              Navigate
            </p>
            {LINKS.map((link, i) => (
              <button
                key={link.id}
                type="button"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => go(link.id)}
                className={`flex min-h-12 items-center justify-between rounded-2xl px-4 py-3 text-left text-base font-medium transition-colors ${
                  activeId === link.id
                    ? "bg-[rgb(var(--gold)/0.12)] text-gold"
                    : "text-text hover:bg-[rgb(var(--hover-fill)/var(--hover-fill-a))] hover:text-gold"
                } ${menuOpen ? "opacity-100" : "opacity-0"}`}
                style={{
                  transitionDelay: menuOpen ? `${80 + i * 28}ms` : "0ms",
                  transitionProperty: "opacity, color, background-color",
                  transitionDuration: "280ms",
                }}
              >
                <span>{link.label}</span>
                <span className="font-mono text-[10px] text-muted" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}

            <a
              href={profile.phoneHref}
              tabIndex={menuOpen ? 0 : -1}
              onClick={closeMenu}
              className="btn-primary mt-4 w-full !py-3.5 text-sm"
              aria-label={`Call ${profile.phone}`}
            >
              Contact Me
            </a>

            <div className="mt-6 flex items-center justify-center gap-4 border-t border-[rgb(var(--hairline)/var(--hairline-a))] pt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={menuOpen ? 0 : -1}
                  className="text-sm font-medium text-muted transition-colors hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
