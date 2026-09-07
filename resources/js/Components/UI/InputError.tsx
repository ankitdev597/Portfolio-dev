import type { HTMLAttributes } from 'react';
import { cn } from '@/Utils/cn';

interface InputErrorProps extends HTMLAttributes<HTMLParagraphElement> {
    message?: string;
}

export function InputError({ message, className, ...props }: InputErrorProps) {
    if (!message) {
        return null;
    }

    return (
        <p {...props} className={cn('mt-1.5 text-sm text-red-400', className)} role="alert">
            {message}
        </p>
    );
}
