import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mounts Lenis smooth-scroll for the lifetime of the calling component and
 * tears it down on unmount. Kept as one hook (rather than re-instantiating
 * Lenis per page) so every public page that wants the premium smooth-scroll
 * feel shares one implementation instead of copy-pasting the wiring.
 *
 * Also wires Lenis into GSAP's ticker/ScrollTrigger - the official
 * integration recipe (https://gsap.com/resources/Lenis) - so every
 * ScrollTrigger-based reveal used across the page's sections (see
 * Components/Motion/Reveal.tsx) stays in sync with Lenis's smoothed scroll
 * position instead of firing against the raw native scroll.
 *
 * Respects prefers-reduced-motion: Lenis is skipped entirely so the browser
 * falls back to native (instant) scrolling for anyone who's asked for less
 * motion; ScrollTrigger-based reveals independently check the same media
 * query before animating anything (see Reveal.tsx).
 */
export function useLenis(): void {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
        });

        lenis.on('scroll', ScrollTrigger.update);

        const tick = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
        };
    }, []);
}
