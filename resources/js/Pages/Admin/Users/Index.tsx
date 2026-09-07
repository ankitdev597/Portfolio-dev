import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';

interface AdminUserRow {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    last_login_at: string | null;
    roles: { id: number; name: string }[];
}

interface UsersIndexProps {
    users: AdminUserRow[];
}

export default function Index({ users }: UsersIndexProps) {
    const toggleActive = (user: AdminUserRow) => {
        router.patch(route('admin.users.update', user.id), { is_active: !user.is_active }, { preserveScroll: true });
    };

    const destroy = (user: AdminUserRow) => {
        if (confirm(`Remove ${user.name}? This cannot be undone.`)) {
            router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Users">
            <Head title="Users" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text">Admin users</h2>
                    <Link href={route('admin.users.create')}>
                        <Button>Invite user</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Name</th>
                                <th className="py-2 pr-4 font-medium">Email</th>
                                <th className="py-2 pr-4 font-medium">Role</th>
                                <th className="py-2 pr-4 font-medium">Status</th>
                                <th className="py-2 pr-4 font-medium">Last login</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4 text-text">{user.name}</td>
                                    <td className="py-3 pr-4 text-muted">{user.email}</td>
                                    <td className="py-3 pr-4 text-muted">
                                        {user.roles.map((r) => r.name).join(', ') || '—'}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <button
                                            onClick={() => toggleActive(user)}
                                            className={
                                                user.is_active
                                                    ? 'rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400'
                                                    : 'rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-muted'
                                            }
                                        >
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="py-3 pr-4 text-muted">
                                        {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
                                    </td>
                                    <td className="py-3 pr-0 text-right">
                                        <button
                                            onClick={() => destroy(user)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
