import { lazy, Suspense } from 'react';
import type { PropsWithChildren } from 'react';
import { useLenis } from '@/Hooks/useLenis';

// Lazy-loaded so the three.js/R3F bundle (see vite.config.ts's `three`
// manualChunks group) is only ever fetched on pages that use this layout -
// auth and admin pages (which use their own layouts) never pay for it.
const SiteScene = lazy(() => import('@/Components/Three/HeroScene'));

/**
 * Shell for every public marketing page. Mounts the site-wide smooth
 * scroll (useLenis) and the persistent 3D background scene once here, so
 * every section rendered inside (hero, about, skills, experience,
 * projects, services, contact) shares the same scroll-reactive backdrop
 * instead of each section spinning up its own WebGL canvas.
 */
export default function PublicLayout({ children }: PropsWithChildren) {
    useLenis();

    return (
        <>
            <Suspense fallback={null}>
                <SiteScene />
            </Suspense>
            {children}
        </>
    );
}
