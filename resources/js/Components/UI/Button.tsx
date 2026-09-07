import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/Utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

/**
 * The single button primitive every admin/public form should use, so
 * hover/focus/disabled states and the premium dark styling stay consistent
 * everywhere instead of being re-implemented per page.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { className, variant = 'primary', type = 'button', ...props },
    ref
) {
    return (
        <button
            {...props}
            ref={ref}
            type={type}
            className={cn(
                variant === 'primary' && 'btn-primary',
                variant === 'secondary' && 'btn-secondary',
                variant === 'ghost' &&
                    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-muted transition-colors hover:text-text',
                className
            )}
        />
    );
});
