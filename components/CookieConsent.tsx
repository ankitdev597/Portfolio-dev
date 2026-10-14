"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      // Private-browsing / storage-blocked: skip the banner.
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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
      <div className="pointer-events-auto glass-panel mx-auto mb-2 flex max-w-2xl flex-col items-start gap-3 p-4 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
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
