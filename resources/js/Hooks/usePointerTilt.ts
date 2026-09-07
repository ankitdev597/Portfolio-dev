import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PREFERS_REDUCED_MOTION =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Gives an element a subtle CSS 3D tilt that tracks the pointer's position
 * anywhere on the window (not just while hovering the element itself), for
 * an ambient parallax feel on hero copy. Pure CSS 3D transform under the
 * hood (`rotationX`/`rotationY` via GSAP's quickTo, which writes directly
 * to the DOM without triggering React re-renders on every pointer move) -
 * no WebGL involved, so it's cheap and works everywhere. Skips entirely
 * under prefers-reduced-motion.
 */
export function usePointerTilt<T extends HTMLElement>(maxDegrees = 8) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || PREFERS_REDUCED_MOTION) {
            return;
        }

        gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });

        const setRotateX = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' });
        const setRotateY = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' });

        const onPointerMove = (event: PointerEvent) => {
            const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
            const normalizedY = (event.clientY / window.innerHeight) * 2 - 1;

            setRotateY(normalizedX * maxDegrees);
            setRotateX(-normalizedY * maxDegrees);
        };

        window.addEventListener('pointermove', onPointerMove);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
        };
    }, [maxDegrees]);

    return ref;
}
