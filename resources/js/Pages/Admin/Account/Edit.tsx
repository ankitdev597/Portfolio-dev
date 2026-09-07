import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useAuth } from '@/Hooks/useAuth';
import { InputLabel } from '@/Components/UI/InputLabel';
import { TextInput } from '@/Components/UI/TextInput';
import { InputError } from '@/Components/UI/InputError';
import { Button } from '@/Components/UI/Button';

export default function Edit() {
    const { user } = useAuth();

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.account.update'));
    };

    return (
        <AdminLayout title="Account">
            <Head title="Account" />

            <div className="glass-panel max-w-xl p-6">
                <h2 className="text-lg font-semibold text-text">Account details</h2>
                <p className="mt-1 text-sm text-muted">Update your name and email address.</p>

                <form onSubmit={submit} className="mt-6 space-y-5">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                        {recentlySuccessful && <span className="text-sm text-emerald-400">Saved.</span>}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
