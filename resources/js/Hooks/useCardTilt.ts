import { useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import gsap from 'gsap';

const PREFERS_REDUCED_MOTION =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Localized 3D tilt for a single card/image: rotation tracks the pointer's
 * position *within the element's own bounds* (unlike `usePointerTilt`,
 * which tracks the pointer anywhere on the window for ambient hero-text
 * parallax), and resets to flat on mouse leave. Meant for a hover-only
 * "tilt toward the cursor" effect on a photo/avatar frame.
 */
export function useCardTilt<T extends HTMLElement>(maxDegrees = 12) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || PREFERS_REDUCED_MOTION) {
            return;
        }
        gsap.set(el, { transformPerspective: 1000, transformStyle: 'preserve-3d' });
    }, []);

    if (PREFERS_REDUCED_MOTION) {
        return { ref, handlers: {} };
    }

    const handlers = {
        onMouseMove: (event: ReactMouseEvent<T>) => {
            const el = ref.current;
            if (!el) {
                return;
            }
            const rect = el.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;

            gsap.to(el, {
                rotateY: (px - 0.5) * maxDegrees * 2,
                rotateX: -(py - 0.5) * maxDegrees * 2,
                duration: 0.5,
                ease: 'power3.out',
                overwrite: true,
            });
        },
        onMouseLeave: () => {
            const el = ref.current;
            if (!el) {
                return;
            }
            gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
        },
    };

    return { ref, handlers };
}
