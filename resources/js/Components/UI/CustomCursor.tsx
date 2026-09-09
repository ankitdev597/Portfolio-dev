import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HOVER_SELECTOR = 'a, button, [data-cursor-hover], input, textarea, select';

/**
 * GSAP quickTo-driven trailing dot + ring cursor. Desktop-only (gated on
 * `(pointer: fine)` so touch devices never get a phantom cursor) and
 * skipped under prefers-reduced-motion. Toggles `.cursor-none` on <html>
 * for its lifetime only - unmounting (e.g. this layout going away) always
 * restores the native cursor via the cleanup function, never leaves the
 * page stuck with `cursor: none`.
 */
export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canHover = window.matchMedia('(pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!canHover || reduceMotion || !dotRef.current || !ringRef.current) {
            return;
        }

        document.documentElement.classList.add('cursor-none');

        const dot = dotRef.current;
        const ring = ringRef.current;

        const moveDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
        const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
        const moveRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
        const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

        const onMove = (event: MouseEvent) => {
            moveDot(event.clientX);
            moveDotY(event.clientY);
            moveRing(event.clientX);
            moveRingY(event.clientY);
        };

        const onOver = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest(HOVER_SELECTOR)) {
                ring.classList.add('scale-150', 'border-primary', 'bg-primary/10');
            }
        };

        const onOut = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest(HOVER_SELECTOR)) {
                ring.classList.remove('scale-150', 'border-primary', 'bg-primary/10');
            }
        };

        window.addEventListener('mousemove', onMove);
        document.addEventListener('mouseover', onOver);
        document.addEventListener('mouseout', onOut);

        return () => {
            document.documentElement.classList.remove('cursor-none');
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onOver);
            document.removeEventListener('mouseout', onOut);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] hidden sm:block" aria-hidden="true">
            <div
                ref={ringRef}
                className="fixed left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 transition-[transform,background-color,border-color] duration-200 ease-out"
            />
            <div ref={dotRef} className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        </div>
    );
}
