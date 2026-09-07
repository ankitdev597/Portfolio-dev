import { useEffect } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    show: boolean;
    title: string;
    onClose: () => void;
    footer?: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg';
}

const MAX_WIDTH: Record<NonNullable<ModalProps['maxWidth']>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

/**
 * The one dialog primitive every Admin CMS create/edit form renders inside
 * of, so every resource (technologies, skills, categories, and everything
 * Phase 2 adds after this) gets identical overlay/close/escape behavior
 * instead of re-implementing it per page.
 */
export function Modal({ show, title, onClose, footer, maxWidth = 'md', children }: PropsWithChildren<ModalProps>) {
    useEffect(() => {
        if (!show) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [show, onClose]);

    if (!show) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16 sm:pt-24">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={`glass-panel relative w-full ${MAX_WIDTH[maxWidth]} bg-surface p-6 shadow-2xl`}
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-text"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {children}

                {footer && <div className="mt-6 flex items-center justify-end gap-3">{footer}</div>}
            </div>
        </div>,
        document.body
    );
}

function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}
