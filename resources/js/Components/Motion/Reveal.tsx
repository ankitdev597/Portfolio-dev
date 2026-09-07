import { useEffect, useRef } from 'react';
import type { PropsWithChildren } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PREFERS_REDUCED_MOTION =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface RevealProps {
    className?: string;
    /** Pixels the content slides up from as it fades in. */
    y?: number;
    /** Seconds to delay the start of this element's animation. */
    delay?: number;
}

/**
 * The one scroll-reveal primitive every landing-page section wraps its
 * content in, so "fade + slide up as it scrolls into view" is implemented
 * once instead of copy-pasted into every section (About, Skills,
 * Experience, Services, Projects, Contact all use this). Synced with
 * Lenis via useLenis - see that hook's docblock.
 */
export function Reveal({ className, y = 32, delay = 0, children }: PropsWithChildren<RevealProps>) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || PREFERS_REDUCED_MOTION) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { opacity: 0, y },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    },
                }
            );
        });

        return () => ctx.revert();
    }, [y, delay]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
