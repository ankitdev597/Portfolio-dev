import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { StatCard } from '@/Components/Admin/StatCard';
import type { ActivityLogEntry, DashboardStats, RoleName } from '@/Types';

interface DashboardProps {
    roles: RoleName[];
    userName: string;
    stats: DashboardStats;
    recentActivity: ActivityLogEntry[];
}

export default function Dashboard({ roles, userName, stats, recentActivity }: DashboardProps) {
    const now = useClock();
    const greeting = timeGreeting(now);

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="glass-panel relative overflow-hidden p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-text">
                            {greeting}, {userName.split(' ')[0]}.
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            Signed in as <span className="text-text">{roles.join(', ') || 'no role assigned'}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-semibold tabular-nums text-text">{formatTime(now)}</p>
                        <p className="text-xs text-muted">{formatDate(now)}</p>
                    </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <StatCard label="Total projects" value={stats.projects.total} icon={<ProjectIcon />} accent="primary" />
                <StatCard label="Published" value={stats.projects.published} icon={<CheckIcon />} accent="accent" />
                <StatCard label="Featured" value={stats.projects.featured} icon={<StarIcon />} accent="muted" />
                <StatCard label="Skills" value={stats.skills} icon={<SkillIcon />} accent="primary" />
                <StatCard label="Technologies" value={stats.technologies} icon={<TechIcon />} accent="muted" />
                <StatCard label="Services" value={stats.services} icon={<ServiceIcon />} accent="primary" />
                <StatCard label="Experience" value={stats.experience} icon={<ExperienceIcon />} accent="muted" />
                <StatCard label="Certifications" value={stats.certifications} icon={<CertIcon />} accent="accent" />
                <StatCard label="Resumes" value={stats.resumes} icon={<ResumeIcon />} accent="muted" />
                <StatCard
                    label="Online now"
                    value={stats.visitors.online_now}
                    icon={<PulseIcon />}
                    accent="accent"
                    hint="Active in the last 5 minutes"
                />
                <StatCard label="Visitors today" value={stats.visitors.today} icon={<VisitorIcon />} accent="primary" />
                <StatCard
                    label="Total visitors"
                    value={stats.visitors.total}
                    icon={<VisitorIcon />}
                    accent="muted"
                    hint={`${stats.visitors.returning.toLocaleString()} returning`}
                />
                <StatCard label="Page views today" value={stats.page_views.today} icon={<EyeIcon />} accent="primary" />
                <StatCard label="Total page views" value={stats.page_views.total} icon={<EyeIcon />} accent="muted" />
                <StatCard
                    label="New messages"
                    value={stats.messages.new}
                    icon={<MailIcon />}
                    accent="accent"
                    hint={`${stats.messages.total.toLocaleString()} total`}
                />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="glass-panel p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-text">Recent activity</h3>
                    {recentActivity.length === 0 ? (
                        <p className="mt-4 text-sm text-muted">Nothing logged yet - changes across the CMS show up here.</p>
                    ) : (
                        <ul className="mt-4 space-y-4">
                            {recentActivity.map((entry) => (
                                <li key={entry.id} className="flex items-start gap-3 border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-text">{entry.description ?? entry.action}</p>
                                        <p className="mt-0.5 text-xs text-muted">
                                            {entry.user_name ?? 'System'}
                                            {entry.created_at && <> &middot; {relativeTime(entry.created_at, now)}</>}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="glass-panel p-6">
                    <h3 className="text-lg font-semibold text-text">Quick links</h3>
                    <div className="mt-4 space-y-2">
                        <QuickLink href={route('admin.projects.index')} label="Manage projects" />
                        <QuickLink href={route('admin.skill-categories.index')} label="Manage skills" />
                        <QuickLink href={route('admin.resumes.index')} label="Manage resumes" />
                        <QuickLink href={route('admin.profile.edit')} label="Edit profile" />
                        {roles.includes('super_admin') && (
                            <>
                                <QuickLink href={route('admin.seo-settings.index')} label="SEO settings" />
                                <QuickLink href={route('admin.settings.edit')} label="Site settings" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function QuickLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-text"
        >
            {label}
            <span aria-hidden="true">&rarr;</span>
        </Link>
    );
}

function useClock(): Date {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return now;
}

function timeGreeting(date: Date): string {
    const hour = date.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(date: Date): string {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

function relativeTime(iso: string, now: Date): string {
    const then = new Date(iso).getTime();
    const diffSeconds = Math.max(0, Math.round((now.getTime() - then) / 1000));

    if (diffSeconds < 60) return 'just now';
    const minutes = Math.floor(diffSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function ProjectIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path strokeLinecap="round" d="M3 9h18" />
        </svg>
    );
}
function CheckIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
        </svg>
    );
}
function StarIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
        </svg>
    );
}
function SkillIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
    );
}
function TechIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
    );
}
function ServiceIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 7v5l3 3" />
        </svg>
    );
}
function ExperienceIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path strokeLinecap="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
    );
}
function CertIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5" />
        </svg>
    );
}
function ResumeIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
        </svg>
    );
}
function PulseIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l2 8 4-16 2 8h6" />
        </svg>
    );
}
function VisitorIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path strokeLinecap="round" d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
    );
}
function EyeIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
function MailIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l10 6 10-6" />
        </svg>
    );
}
