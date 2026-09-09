import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const PREFERS_REDUCED_MOTION =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Shown once ever per browser - localStorage (not sessionStorage), so a
 * fresh tab, a new window, or closing and reopening the browser will NOT
 * replay it; only clearing site data or visiting from a different browser
 * will. It never replays on Inertia's client-side navigations either way,
 * since this component only mounts once per full page load.
 */
const STORAGE_KEY = 'portfolio:preloader-shown';

/** Character pool for the scramble/decode reveal - a mix of caps and a few
 * symbols reads as a "decoding" effect without being illegible. */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*+=?';

function randomScrambleChar(): string {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

interface PreloaderProps {
    name: string;
}

/**
 * Full-screen "please wait" splash shown the first time the site ever loads
 * in a browser: an animated percentage counter + progress bar, then the
 * site name scrambles/decodes into place letter-by-letter (left to right),
 * then the whole overlay fades out to reveal the hero underneath. Pure
 * GSAP/CSS (no WebGL) so it's cheap and paints before the three.js chunk
 * has to load. Respects `prefers-reduced-motion` by skipping straight past
 * the splash entirely.
 */
export function Preloader({ name }: PreloaderProps) {
    const [visible, setVisible] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.localStorage.getItem(STORAGE_KEY) !== '1';
    });
    const rootRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!visible) {
            return;
        }

        window.localStorage.setItem(STORAGE_KEY, '1');

        if (PREFERS_REDUCED_MOTION) {
            setVisible(false);
            return;
        }

        const root = rootRef.current;
        const counter = counterRef.current;
        const bar = barRef.current;
        const nameEl = nameRef.current;
        if (!root || !counter || !bar || !nameEl) {
            return;
        }

        const progress = { value: 0 };
        const scramble = { reveal: 0 };

        /** Renders `name` with every character past the current reveal
         * count replaced by a random scramble character; characters before
         * it are locked in as the real letter. Spaces are never scrambled
         * so multi-word names keep their word breaks throughout. */
        const renderScramble = () => {
            const revealedCount = Math.floor(scramble.reveal);
            nameEl.textContent = name
                .split('')
                .map((char, index) => (char === ' ' || index < revealedCount ? char : randomScrambleChar()))
                .join('');
        };

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
            duration: 1.6,
            onUpdate: () => {
                counter.textContent = `${Math.round(progress.value)}%`;
            },
        })
            .to(bar, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, '<')
            .to('[data-preloader="wait"]', { opacity: 0, duration: 0.3 })
            .fromTo(
                '[data-preloader="welcome"]',
                { opacity: 0 },
                { opacity: 1, duration: 0.35, ease: 'power3.out' },
                '-=0.05'
            )
            .to(
                scramble,
                {
                    reveal: name.length,
                    duration: 1.0,
                    ease: 'none',
                    onStart: renderScramble,
                    onUpdate: renderScramble,
                },
                '-=0.2'
            )
            .fromTo(
                '[data-preloader="tagline"]',
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
                '-=0.1'
            )
            .to({}, { duration: 0.4 });

        return () => {
            tl.kill();
        };
    }, [visible, name]);

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
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center opacity-0"
            >
                <p className="text-xs uppercase tracking-[0.35em] text-accent">Welcome to</p>
                <p
                    ref={nameRef}
                    aria-hidden="true"
                    className="font-mono text-3xl font-semibold tracking-wide text-text sm:text-5xl"
                >
                    {name}
                </p>
                <p data-preloader="tagline" className="mt-1 text-sm text-muted opacity-0">
                    Loading a premium 3D experience…
                </p>
            </div>
        </div>
    );
}
