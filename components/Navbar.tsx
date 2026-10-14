"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { getLenisInstance, scrollToSection } from "@/lib/lenis-singleton";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "devops", label: "DevOps" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const LENIS_ATTACH_MAX_ATTEMPTS = 40;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function readScrollY() {
      const lenis = getLenisInstance();
      return lenis ? lenis.scroll : window.scrollY;
    }

    function onScroll() {
      setScrolled(readScrollY() > 24);
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
    if (!menuOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    const lenis = getLenisInstance();
    // Prefer Lenis stop/start so we don't fight its scroll ownership with
    // a raw overflow:hidden that can leave scroll stuck after close.
    if (lenis) {
      lenis.stop();
    } else {
      document.documentElement.style.overflow = "hidden";
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (lenis) {
        lenis.start();
      } else {
        document.documentElement.style.overflow = "";
      }
    };
  }, [menuOpen]);

  function go(id: string) {
    setMenuOpen(false);
    // Defer scroll until after menu close restores Lenis/overflow.
    window.requestAnimationFrame(() => scrollToSection(id));
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled ? "site-nav-scrolled" : ""
      }`}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <button
          type="button"
          onClick={() => go("hero")}
          className="shrink-0 text-sm font-semibold tracking-wide text-text transition-colors hover:text-gold"
        >
          {profile.fullName}
        </button>

        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => go(link.id)}
              className="nav-link"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => go("contact")}
            className="btn-primary hidden !px-5 !py-2.5 text-xs lg:inline-flex"
          >
            Contact Me
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            className="icon-btn lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5 text-text" aria-hidden="true">
              <span
                className={`h-px w-5 bg-current transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span className={`h-px w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-5 bg-current transition-transform ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="glass-panel mx-4 mb-4 flex max-h-[min(70vh,28rem)] flex-col gap-1 overflow-y-auto p-3 lg:hidden"
        >
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => go(link.id)}
              className="nav-link w-full rounded-xl px-4 py-3 text-left"
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => go("contact")}
            className="btn-primary mt-2 w-full !py-2.5 text-xs"
          >
            Contact Me
          </button>
        </div>
      )}
    </header>
  );
}
