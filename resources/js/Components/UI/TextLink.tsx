import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/Utils/cn';

type TextLinkProps = ComponentProps<typeof Link>;

export function TextLink({ className, ...props }: TextLinkProps) {
    return (
        <Link
            {...props}
            className={cn('text-sm font-medium text-accent underline-offset-4 hover:underline', className)}
        />
    );
}
