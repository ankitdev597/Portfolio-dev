import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import type { RoleName } from '@/Types';

interface DashboardProps {
    roles: RoleName[];
}

export default function Dashboard({ roles }: DashboardProps) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text">Welcome back.</h2>
                <p className="mt-1 text-sm text-muted">
                    Signed in as: <span className="text-text">{roles.join(', ') || 'no role assigned'}</span>
                </p>
                <p className="mt-4 max-w-2xl text-sm text-muted">
                    This is the Phase 1 admin shell - authentication, roles, and layout are wired up end to
                    end. Visitor analytics, live-visitor tracking, leads, and content management widgets are
                    built out in the following phases against real data.
                </p>
            </div>
        </AdminLayout>
    );
}
