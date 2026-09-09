import { useEffect, useRef, useState } from 'react';

/**
 * requestAnimationFrame-driven count-up from 0 to `target` - no charting/
 * animation library, matching this project's habit of hand-rolling small
 * animation primitives (see useLenis, Preloader's scramble tween) instead
 * of adding dependencies. Respects prefers-reduced-motion by snapping
 * straight to the target with no animation.
 */
export function useCountUp(target: number, durationMs = 1200): number {
    const [value, setValue] = useState(0);
    const targetRef = useRef(target);
    targetRef.current = target;

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setValue(targetRef.current);
            return;
        }

        let frame = 0;
        const start = performance.now();
        const from = 0;
        const to = targetRef.current;

        const tick = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(from + (to - from) * eased));

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, durationMs]);

    return value;
}
