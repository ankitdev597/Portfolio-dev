import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/UI/Button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <h2 className="mb-2 text-xl font-semibold text-text">Verify your email</h2>
            <p className="mb-6 text-sm text-muted">
                Thanks for signing up! Please verify your email address by clicking the link we just emailed you.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-emerald-400">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit}>
                <Button type="submit" className="w-full" disabled={processing}>
                    Resend verification email
                </Button>
            </form>
        </GuestLayout>
    );
}
