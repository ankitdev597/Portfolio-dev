"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { profile, socialLinks } from "@/data/profile";
import { MapPin, X } from "@/components/icons";

const GITHUB_ICON_PATH =
  "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.6 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z";

/**
 * The About-section headshot, clickable to open a centered modal with a
 * larger view plus a direct link out to the GitHub profile. Kept as one
 * component (rather than a photo + a separately-wired modal) so the
 * trigger and its dialog can't drift out of sync.
 */
export default function ProfilePhotoModal() {
  const [open, setOpen] = useState(false);
  // The dialog is portaled to document.body (see the render below) so it
  // isn't affected by any ancestor's CSS transform - Reveal leaves an
  // inline `transform` on its wrapper after animating in, and any
  // transformed ancestor turns `position: fixed` into positioning
  // relative to *that ancestor* instead of the viewport, which is not
  // what a centered modal wants. Portals need `document`, so this only
  // renders once mounted client-side.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    // Lock background scroll while the dialog is open, restored on close/unmount.
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const github = socialLinks.find((link) => link.platform === "github");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`View larger photo of ${profile.fullName}`}
        className="glass-panel group relative mx-auto flex aspect-square w-56 flex-col items-center justify-end overflow-hidden sm:w-64"
      >
        <Image
          src="/images/profile-photo.jpg"
          alt={profile.fullName}
          fill
          sizes="(min-width: 640px) 256px, 224px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        {profile.location && (
          <span className="relative z-10 mb-3 flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted backdrop-blur-sm">
            <MapPin className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            {profile.location}
          </span>
        )}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label={`${profile.fullName} - photo`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-panel relative w-full max-w-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-text backdrop-blur-sm transition-colors hover:bg-background/90"
                  >
                    <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </button>

                  <div className="relative aspect-square w-full">
                    <Image
                      src="/images/profile-photo.jpg"
                      alt={profile.fullName}
                      fill
                      sizes="384px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-3 p-6 text-center">
                    <h3 className="text-lg font-semibold text-text">{profile.fullName}</h3>
                    <p className="text-sm text-muted">{profile.headline}</p>

                    {github && (
                      <a
                        href={github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary mt-1 inline-flex items-center gap-2"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                          <path d={GITHUB_ICON_PATH} />
                        </svg>
                        View GitHub Profile
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
