import type { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Shell for every unauthenticated screen (login, password reset, etc).
 * Deliberately no 3D/heavy animation here - spec #6 says never make the
 * visitor wait, and an auth screen is the last place that budget should go.
 */
export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
            </div>

            <Link href={route('home')} className="relative z-10 mb-8 text-lg font-semibold tracking-tight text-text">
                Ankit Vishwakarma
            </Link>

            <div className="glass-panel relative z-10 w-full max-w-md px-8 py-10 shadow-2xl shadow-black/40">
                {children}
            </div>
        </div>
    );
}
