"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Reading localStorage only works client-side, so this can't be a
        // useState initializer without a server/client render mismatch -
        // the effect-based reveal is the correct pattern here, not a case
        // the rule's "you might not need an effect" guidance covers.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      // Private-browsing / storage-blocked: just skip the banner rather
      // than throwing, no functional loss for a static site with no
      // actual cookie-dependent tracking.
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="glass-panel mx-auto flex max-w-2xl flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-sm text-muted">
          This site uses only functional, no-tracking local storage to remember your
          preferences. No analytics cookies, no third-party trackers.
        </p>
        <button type="button" onClick={accept} className="btn-secondary shrink-0 !px-5 !py-2 text-xs">
          Got it
        </button>
      </div>
    </div>
  );
}
