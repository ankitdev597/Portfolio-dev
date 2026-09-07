import { usePage as useInertiaPage } from '@inertiajs/react';
import type { SharedPageProps } from '@/Types';

/**
 * Typed wrapper around Inertia's usePage(), so every component gets
 * SharedPageProps (auth/site/flash/ziggy) without re-typing the generic
 * at every call site.
 */
export function usePage<T extends Record<string, unknown> = Record<string, unknown>>() {
    return useInertiaPage<SharedPageProps & T>();
}
