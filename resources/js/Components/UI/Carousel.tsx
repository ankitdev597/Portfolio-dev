import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/Utils/cn';

interface CarouselProps {
    children: ReactNode[];
    /** Tailwind width classes applied to each slide wrapper - lets the
     * caller control how many slides are visible per breakpoint (e.g.
     * "w-full sm:w-[calc(50%-0.75rem)]" for a two-up desktop layout that
     * still shows one at a time on mobile). */
    slideClassName?: string;
    className?: string;
    ariaLabel: string;
}

/**
 * Presentation-only horizontal slider built on native CSS scroll-snap -
 * deliberately not backed by a carousel npm package (embla/swiper/...):
 * the project already has GSAP/Framer Motion installed and no carousel
 * dependency, and adding one means a package.json/package-lock change
 * that has to survive this project's git-push workflow. Touch swipe and
 * trackpad scroll work for free from the browser; the arrow buttons and
 * dots below are a thin convenience layer that just scrolls the same
 * container - no extra JS animation runtime needed.
 */
export function Carousel({ children, slideClassName, className, ariaLabel }: CarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const slideCount = children.length;

    const scrollToIndex = useCallback((index: number) => {
        const track = trackRef.current;
        const slide = track?.children[index] as HTMLElement | undefined;
        slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }, []);

    const goPrev = () => scrollToIndex(Math.max(activeIndex - 1, 0));
    const goNext = () => scrollToIndex(Math.min(activeIndex + 1, slideCount - 1));

    // Tracks which slide is closest to the scroll container's left edge so
    // the dot indicator and arrow disabled-state stay in sync with manual
    // swipe/scroll, not just button-driven navigation.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) {
            return;
        }

        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const { scrollLeft, children: slides } = track;
                let closest = 0;
                let closestDistance = Infinity;
                Array.from(slides).forEach((slide, index) => {
                    const distance = Math.abs((slide as HTMLElement).offsetLeft - scrollLeft);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closest = index;
                    }
                });
                setActiveIndex(closest);
            });
        };

        track.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            track.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frame);
        };
    }, []);

    if (slideCount === 0) {
        return null;
    }

    return (
        <div className={cn('relative', className)}>
            <div
                ref={trackRef}
                role="region"
                aria-label={ariaLabel}
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {children.map((child, index) => (
                    <div key={index} className={cn('shrink-0 snap-start', slideClassName ?? 'w-full')}>
                        {child}
                    </div>
                ))}
            </div>

            {slideCount > 1 && (
                <>
                    <div className="mt-6 flex items-center justify-center gap-2">
                        {children.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => scrollToIndex(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={index === activeIndex}
                                className={cn(
                                    'h-1.5 rounded-full transition-all',
                                    index === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/35'
                                )}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={goPrev}
                        disabled={activeIndex === 0}
                        aria-label="Previous slide"
                        className="absolute -left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-surface/80 p-2.5 text-text backdrop-blur transition-colors hover:border-primary/40 disabled:opacity-30 sm:flex lg:-left-14"
                    >
                        <ArrowIcon direction="left" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        disabled={activeIndex === slideCount - 1}
                        aria-label="Next slide"
                        className="absolute -right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-surface/80 p-2.5 text-text backdrop-blur transition-colors hover:border-primary/40 disabled:opacity-30 sm:flex lg:-right-14"
                    >
                        <ArrowIcon direction="right" />
                    </button>
                </>
            )}
        </div>
    );
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
            />
        </svg>
    );
}
