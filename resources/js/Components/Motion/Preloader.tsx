import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const PREFERS_REDUCED_MOTION =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Only splash once per browser session/tab - a hard reload of the site
 * shows it again, but it never replays on Inertia's client-side
 * navigations within the same tab. */
const SESSION_KEY = 'portfolio:preloader-shown';

interface PreloaderProps {
    name: string;
}

/**
 * Full-screen "please wait" splash shown the first time the site loads in
 * a browser session: an animated percentage counter + progress bar, then a
 * cross-fade to a "Welcome to <name>" beat, then the whole overlay fades
 * out to reveal the hero underneath. Pure GSAP/CSS (no WebGL) so it's
 * cheap and paints before the three.js chunk has to load. Respects
 * `prefers-reduced-motion` by skipping straight past the splash.
 */
export function Preloader({ name }: PreloaderProps) {
    const [visible, setVisible] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.sessionStorage.getItem(SESSION_KEY) !== '1';
    });
    const rootRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!visible) {
            return;
        }

        window.sessionStorage.setItem(SESSION_KEY, '1');

        if (PREFERS_REDUCED_MOTION) {
            setVisible(false);
            return;
        }

        const root = rootRef.current;
        const counter = counterRef.current;
        const bar = barRef.current;
        if (!root || !counter || !bar) {
            return;
        }

        const progress = { value: 0 };

        const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            onComplete: () => {
                gsap.to(root, {
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power2.inOut',
                    onComplete: () => setVisible(false),
                });
            },
        });

        tl.to(progress, {
            value: 100,
            duration: 1.8,
            onUpdate: () => {
                counter.textContent = `${Math.round(progress.value)}%`;
            },
        })
            .to(bar, { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, '<')
            .to('[data-preloader="wait"]', { opacity: 0, duration: 0.35 })
            .fromTo(
                '[data-preloader="welcome"]',
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
                '-=0.05'
            )
            .to({}, { duration: 0.65 });

        return () => {
            tl.kill();
        };
    }, [visible]);

    if (!visible) {
        return null;
    }

    return (
        <div
            ref={rootRef}
            className="fixed inset-0 z-[100] bg-background"
            role="status"
            aria-live="polite"
            aria-label={`Loading ${name}'s portfolio`}
        >
            <div data-preloader="wait" className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <p className="text-xs uppercase tracking-[0.35em] text-muted">Please wait a moment</p>
                <span ref={counterRef} className="text-4xl font-semibold tabular-nums text-text sm:text-5xl">
                    0%
                </span>
                <div className="h-px w-52 overflow-hidden rounded-full bg-white/10">
                    <div
                        ref={barRef}
                        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-secondary to-accent"
                    />
                </div>
            </div>

            <div
                data-preloader="welcome"
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0"
            >
                <p className="text-xs uppercase tracking-[0.35em] text-accent">Welcome to</p>
                <p className="text-2xl font-semibold text-text sm:text-4xl">{name}</p>
                <p className="mt-1 text-sm text-muted">Loading a premium 3D experience…</p>
            </div>
        </div>
    );
}
