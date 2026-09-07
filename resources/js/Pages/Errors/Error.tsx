import { Head } from '@inertiajs/react';

const MESSAGES: Record<number, string> = {
    403: 'You don’t have access to this page.',
    404: 'This page could not be found.',
    500: 'Something went wrong on our end.',
    503: 'The site is temporarily unavailable.',
};

export default function Error({ status }: { status: number }) {
    const message = MESSAGES[status] ?? 'An unexpected error occurred.';

    return (
        <>
            <Head title={`${status}`} />

            <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
                <p className="text-sm font-medium text-accent">Error {status}</p>
                <h1 className="mt-3 text-3xl font-semibold text-text">{message}</h1>
                <a href="/" className="mt-8 text-sm font-medium text-accent hover:underline">
                    Back to home
                </a>
            </main>
        </>
    );
}
