import type { LabelHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/Utils/cn';

type InputLabelProps = PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement> & { value?: string }>;

export function InputLabel({ value, className, children, ...props }: InputLabelProps) {
    return (
        <label {...props} className={cn('mb-1.5 block text-sm font-medium text-muted', className)}>
            {value ?? children}
        </label>
    );
}
