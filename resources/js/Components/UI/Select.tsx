import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/Utils/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { className, children, ...props },
    ref
) {
    return (
        <select
            {...props}
            ref={ref}
            className={cn(
                'block w-full rounded-xl border border-white/10 bg-surface/80 px-4 py-2.5 text-sm text-text',
                'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
        >
            {children}
        </select>
    );
});
