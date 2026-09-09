import type { ReactNode } from 'react';
import { useCountUp } from '@/Hooks/useCountUp';
import { cn } from '@/Utils/cn';

interface StatCardProps {
    label: string;
    value: number;
    icon: ReactNode;
    accent?: 'primary' | 'accent' | 'muted';
    suffix?: string;
    hint?: string;
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps['accent']>, string> = {
    primary: 'bg-primary/15 text-primary',
    accent: 'bg-accent/15 text-accent',
    muted: 'bg-white/[0.06] text-muted',
};

/**
 * Reusable dashboard stat tile - animated count-up (useCountUp), icon
 * chip, optional hint line. Presentation-only: every number it renders is
 * passed in from DashboardService via the page's props, never fetched
 * here.
 */
export function StatCard({ label, value, icon, accent = 'primary', suffix, hint }: StatCardProps) {
    const animated = useCountUp(value);

    return (
        <div className="glass-panel group relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted">{label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-text tabular-nums">
                        {animated.toLocaleString()}
                        {suffix}
                    </p>
                    {hint && <p className="mt-1 text-xs text-muted/80">{hint}</p>}
                </div>
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', ACCENT_CLASSES[accent])}>
                    {icon}
                </div>
            </div>
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
}
