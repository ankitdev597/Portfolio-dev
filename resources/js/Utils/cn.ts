import { clsx, type ClassValue } from 'clsx';

/**
 * Tiny classnames helper so components can compose conditional Tailwind
 * classes without string-concatenation bugs. Kept dependency-light on
 * purpose (no tailwind-merge) - reusable UI components should not need
 * class-conflict resolution beyond what clsx already gives them.
 */
export function cn(...inputs: ClassValue[]): string {
    return clsx(inputs);
}
