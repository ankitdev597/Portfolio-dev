"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/lib/lenis-singleton";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "resume", label: "Resume" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function go(id: string) {
    setMenuOpen(false);
    scrollToSection(id);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled ? "bg-background/80 shadow-[0_1px_0_0_rgb(255_255_255/0.08)] backdrop-blur-xl" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => go("hero")}
          className="text-sm font-semibold tracking-wide text-text transition-colors hover:text-primary"
        >
          {profile.fullName}
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => go(link.id)}
              className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-text"
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go("contact")}
          className="btn-primary hidden !px-5 !py-2.5 text-xs md:inline-flex"
        >
          Contact Me
        </button>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text md:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span
              className={`h-px w-5 bg-current transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span className={`h-px w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`h-px w-5 bg-current transition-transform ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </nav>

      {menuOpen && (
        <div className="glass-panel mx-4 mb-4 flex flex-col gap-1 p-3 md:hidden">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => go(link.id)}
              className="rounded-xl px-4 py-3 text-left text-sm text-muted transition-colors hover:bg-white/5 hover:text-text"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
