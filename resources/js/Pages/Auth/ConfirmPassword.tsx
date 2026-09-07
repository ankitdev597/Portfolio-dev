import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { InputLabel } from '@/Components/UI/InputLabel';
import { TextInput } from '@/Components/UI/TextInput';
import { InputError } from '@/Components/UI/InputError';
import { Button } from '@/Components/UI/Button';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <h2 className="mb-2 text-xl font-semibold text-text">Confirm your password</h2>
            <p className="mb-6 text-sm text-muted">
                This is a secure area. Please confirm your password before continuing.
            </p>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    Confirm
                </Button>
            </form>
        </GuestLayout>
    );
}
