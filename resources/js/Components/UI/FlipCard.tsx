import type { ReactNode } from 'react';
import { cn } from '@/Utils/cn';

interface FlipCardProps {
    front: ReactNode;
    back: ReactNode;
    /** Fixed height utility class (e.g. "h-56") - required so the
     * absolutely-positioned back face lines up exactly with the front. */
    heightClassName: string;
    className?: string;
}

/**
 * A hover-triggered 3D flip card built from pure CSS 3D transforms (no
 * WebGL): `[transform-style:preserve-3d]` on the inner layer plus
 * `[backface-visibility:hidden]` on each face, rotated 180deg on
 * `group-hover`/`group-focus-within`. Both faces are pinned to the same
 * fixed height (`heightClassName`) so the flip never jumps.
 *
 * The back face still carries real DOM content (not canvas/WebGL text), so
 * screen readers and crawlers see everything on both faces regardless of
 * hover state - nothing meaningful is hidden behind the flip, it's a
 * progressive-enhancement reveal, not the only place info lives.
 */
export function FlipCard({ front, back, heightClassName, className }: FlipCardProps) {
    return (
        <div
            tabIndex={0}
            className={cn('group [perspective:1500px] focus:outline-none', heightClassName, className)}
        >
            <div className="relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
                <div className={cn('absolute inset-0 [backface-visibility:hidden]', heightClassName)}>{front}</div>
                <div
                    className={cn('absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]', heightClassName)}
                >
                    {back}
                </div>
            </div>
        </div>
    );
}
