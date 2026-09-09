import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { Link, router } from '@inertiajs/react';
import { useAuth } from '@/Hooks/useAuth';
import { cn } from '@/Utils/cn';

interface NavItem {
    label: string;
    href: string;
    active: boolean;
    superAdminOnly?: boolean;
}

interface NavSection {
    label: string | null;
    items: NavItem[];
}

/**
 * Premium dark CRM shell (spec #28): fixed sidebar + topbar + content area.
 * Full widget set (charts, live visitors, recent leads) lands in the
 * CRM/Analytics phase - this establishes the chrome every admin page
 * mounts inside of.
 */
export default function AdminLayout({ title, children }: PropsWithChildren<{ title: string }>) {
    const { user, isSuperAdmin } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navSections: NavSection[] = [
        {
            label: null,
            items: [
                { label: 'Dashboard', href: route('admin.dashboard'), active: route().current('admin.dashboard') },
            ],
        },
        {
            // Taxonomies feeding Experience/Projects/Skills - grows with
            // each Phase 2 batch (Projects, Experience, Services, ... land
            // here next).
            label: 'Content',
            items: [
                {
                    label: 'Projects',
                    href: route('admin.projects.index'),
                    active: route().current('admin.projects.*'),
                },
                {
                    label: 'Project categories',
                    href: route('admin.project-categories.index'),
                    active: route().current('admin.project-categories.*'),
                },
                {
                    label: 'Technologies',
                    href: route('admin.technologies.index'),
                    active: route().current('admin.technologies.*'),
                },
                {
                    label: 'Skills',
                    href: route('admin.skill-categories.index'),
                    active: route().current('admin.skill-categories.*'),
                },
                {
                    label: 'Experience',
                    href: route('admin.experience.index'),
                    active: route().current('admin.experience.*'),
                },
                {
                    label: 'Education',
                    href: route('admin.education.index'),
                    active: route().current('admin.education.*'),
                },
                {
                    label: 'Services',
                    href: route('admin.services.index'),
                    active: route().current('admin.services.*'),
                },
                {
                    label: 'Certifications',
                    href: route('admin.certifications.index'),
                    active: route().current('admin.certifications.*'),
                },
                {
                    label: 'Social links',
                    href: route('admin.social-links.index'),
                    active: route().current('admin.social-links.*'),
                },
                {
                    label: 'Resumes',
                    href: route('admin.resumes.index'),
                    active: route().current('admin.resumes.*'),
                },
                {
                    label: 'Profile',
                    href: route('admin.profile.edit'),
                    active: route().current('admin.profile.*'),
                },
            ],
        },
        {
            label: 'Site',
            items: [
                {
                    label: 'Settings',
                    href: route('admin.settings.edit'),
                    active: route().current('admin.settings.*'),
                    superAdminOnly: true,
                },
                {
                    label: 'SEO',
                    href: route('admin.seo-settings.index'),
                    active: route().current('admin.seo-settings.*'),
                    superAdminOnly: true,
                },
            ],
        },
        {
            label: 'Account',
            items: [
                { label: 'Account', href: route('admin.account.edit'), active: route().current('admin.account.edit') },
                {
                    label: 'Users',
                    href: route('admin.users.index'),
                    active: route().current('admin.users.*'),
                    superAdminOnly: true,
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-background text-text">
            <div className="flex">
                <aside
                    className={cn(
                        'fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-white/[0.08] bg-surface/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0',
                        sidebarOpen && 'translate-x-0'
                    )}
                >
                    <div className="flex h-16 items-center px-6 text-lg font-semibold tracking-tight">
                        Portfolio CMS
                    </div>

                    <nav className="space-y-5 px-3">
                        {navSections.map((section, index) => {
                            const items = section.items.filter((item) => !item.superAdminOnly || isSuperAdmin);

                            if (items.length === 0) {
                                return null;
                            }

                            return (
                                <div key={section.label ?? `section-${index}`} className="space-y-1">
                                    {section.label && (
                                        <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted/60">
                                            {section.label}
                                        </p>
                                    )}
                                    {items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                                                item.active
                                                    ? 'bg-primary/15 text-text'
                                                    : 'text-muted hover:bg-white/5 hover:text-text'
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.08] bg-background/80 px-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen((open) => !open)}
                                className="rounded-lg p-2 text-muted hover:bg-white/5 lg:hidden"
                                aria-label="Toggle navigation"
                            >
                                <MenuIcon />
                            </button>
                            <h1 className="text-base font-semibold">{title}</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="hidden text-sm text-muted sm:inline">{user?.name}</span>
                            <button
                                type="button"
                                onClick={() => router.post(route('logout'))}
                                className="text-sm font-medium text-muted transition-colors hover:text-text"
                            >
                                Log out
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}

function MenuIcon(): ReactNode {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}
