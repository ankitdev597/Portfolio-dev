import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { InputLabel } from '@/Components/UI/InputLabel';
import { TextInput } from '@/Components/UI/TextInput';
import { InputError } from '@/Components/UI/InputError';
import { Button } from '@/Components/UI/Button';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <h2 className="mb-2 text-xl font-semibold text-text">Reset your password</h2>
            <p className="mb-6 text-sm text-muted">
                Enter your email and we&apos;ll send you a password reset link.
            </p>

            {status && <div className="mb-4 text-sm font-medium text-emerald-400">{status}</div>}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    Email reset link
                </Button>
            </form>
        </GuestLayout>
    );
}
