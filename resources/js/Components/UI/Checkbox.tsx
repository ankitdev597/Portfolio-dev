import type { InputHTMLAttributes } from 'react';
import { cn } from '@/Utils/cn';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className, ...props }: CheckboxProps) {
    return (
        <input
            {...props}
            type="checkbox"
            className={cn(
                'h-4 w-4 rounded border-white/20 bg-surface text-primary focus:ring-2 focus:ring-primary/40 focus:ring-offset-0',
                className
            )}
        />
    );
}
