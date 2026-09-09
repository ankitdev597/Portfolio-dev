import { useEffect, useState } from 'react';

const STORAGE_KEY = 'portfolio:cookie-consent';

/**
 * Dismissible bottom banner disclosing the first-party analytics cookie
 * set by VisitorTrackingService (see that Service's docblock - no
 * third-party trackers, IP is sha256-hashed, never stored raw). Dismissal
 * is remembered in localStorage so it only shows once per browser;
 * wrapped in try/catch since private-mode/blocked-storage can throw on
 * either read or write.
 */
export function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (!localStorage.getItem(STORAGE_KEY)) {
                setVisible(true);
            }
        } catch {
            // Storage blocked - fail open by just not showing the banner
            // rather than risking a render loop trying to re-check it.
        }
    }, []);

    function dismiss() {
        setVisible(false);
        try {
            localStorage.setItem(STORAGE_KEY, '1');
        } catch {
            // Nothing to do - it'll just show again next visit.
        }
    }

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-surface/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted">
                    This site uses first-party cookies for anonymous visit analytics only - no third-party trackers, no
                    advertising, no raw IP ever stored.
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                    Got it
                </button>
            </div>
        </div>
    );
}
