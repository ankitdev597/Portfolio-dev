import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/Utils/cn';

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    { className, type = 'text', ...props },
    ref
) {
    return (
        <input
            {...props}
            ref={ref}
            type={type}
            className={cn(
                'block w-full rounded-xl border border-white/10 bg-surface/80 px-4 py-2.5 text-sm text-text',
                'placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
        />
    );
});
