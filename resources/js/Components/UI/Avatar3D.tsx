import { useCardTilt } from '@/Hooks/useCardTilt';
import { cn } from '@/Utils/cn';

interface Avatar3DProps {
    src: string | null;
    name: string;
    className?: string;
}

function initialsFor(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
        return '?';
    }
    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

/**
 * A photo frame that tilts toward the cursor in real 3D (CSS transforms,
 * layered via translateZ so the photo visibly "pops" above its border
 * even at rest) - ready for whenever a real avatar is uploaded from the
 * admin CMS. Falls back to a gradient + initials placeholder so the
 * layout never looks broken before that upload happens.
 */
export function Avatar3D({ src, name, className }: Avatar3DProps) {
    const { ref, handlers } = useCardTilt<HTMLDivElement>(9);

    return (
        <div className={cn('[perspective:1200px]', className)}>
            <div
                ref={ref}
                {...handlers}
                className="glass-panel relative aspect-square w-full overflow-hidden rounded-[2rem] border-2 border-white/10 p-2 [transform-style:preserve-3d] [will-change:transform]"
            >
                <div className="absolute inset-2 rounded-[1.5rem] bg-gradient-to-br from-primary/40 via-secondary/25 to-accent/25 [transform:translateZ(-24px)]" />

                {src ? (
                    <img
                        src={src}
                        alt={name}
                        className="relative h-full w-full rounded-[1.5rem] object-cover [transform:translateZ(36px)]"
                    />
                ) : (
                    <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-[1.5rem] bg-surface-elevated [transform:translateZ(36px)]">
                        <span className="text-5xl font-semibold text-text sm:text-6xl">{initialsFor(name)}</span>
                        <span className="text-xs uppercase tracking-widest text-muted">Photo coming soon</span>
                    </div>
                )}

                <div className="pointer-events-none absolute inset-2 rounded-[1.5rem] ring-1 ring-white/10 [transform:translateZ(48px)]" />
            </div>
        </div>
    );
}
