import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/Utils/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Same visual language as TextInput - kept as a separate primitive (rather
 * than TextInput rendering a <textarea> conditionally) since the two accept
 * different native HTML attribute sets.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    { className, rows = 4, ...props },
    ref
) {
    return (
        <textarea
            {...props}
            ref={ref}
            rows={rows}
            className={cn(
                'block w-full rounded-xl border border-white/10 bg-surface/80 px-4 py-2.5 text-sm text-text',
                'placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
        />
    );
});
