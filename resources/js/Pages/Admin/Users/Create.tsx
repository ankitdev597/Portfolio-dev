import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { InputLabel } from '@/Components/UI/InputLabel';
import { TextInput } from '@/Components/UI/TextInput';
import { InputError } from '@/Components/UI/InputError';
import { Button } from '@/Components/UI/Button';

interface RoleOption {
    value: string;
    label: string;
}

interface CreateUserProps {
    roles: RoleOption[];
}

export default function Create({ roles }: CreateUserProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: roles[roles.length - 1]?.value ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout title="Invite user">
            <Head title="Invite user" />

            <div className="glass-panel max-w-xl p-6">
                <h2 className="text-lg font-semibold text-text">Invite an admin user</h2>
                <p className="mt-1 text-sm text-muted">
                    There is no public sign-up - accounts are provisioned here by a Super Admin.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-5">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
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

                    <div>
                        <InputLabel htmlFor="role" value="Role" />
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="block w-full rounded-xl border border-white/10 bg-surface/80 px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Temporary password" />
                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        Create user
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
