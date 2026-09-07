import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { cn } from '@/Utils/cn';
import type { AdminProject, PaginatedData } from '@/Types';

interface ProjectsIndexProps {
    projects: PaginatedData<AdminProject>;
}

export default function Index({ projects }: ProjectsIndexProps) {
    const togglePublished = (project: AdminProject) => {
        router.patch(route('admin.projects.toggle-published', project.slug), {}, { preserveScroll: true });
    };

    const toggleFeatured = (project: AdminProject) => {
        router.patch(route('admin.projects.toggle-featured', project.slug), {}, { preserveScroll: true });
    };

    const destroy = (project: AdminProject) => {
        if (confirm(`Delete "${project.title}"? This can't be undone from here.`)) {
            router.delete(route('admin.projects.destroy', project.slug), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Projects">
            <Head title="Projects" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Projects</h2>
                        <p className="mt-1 text-sm text-muted">{projects.meta.total} total.</p>
                    </div>
                    <Link href={route('admin.projects.create')}>
                        <Button>Add project</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Project</th>
                                <th className="py-2 pr-4 font-medium">Category</th>
                                <th className="py-2 pr-4 font-medium">Classification</th>
                                <th className="py-2 pr-4 font-medium">Featured</th>
                                <th className="py-2 pr-4 font-medium">Published</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.data.map((project) => (
                                <tr key={project.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-elevated">
                                                {project.thumbnail_url && (
                                                    <img
                                                        src={project.thumbnail_url}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-text">{project.title}</p>
                                                <p className="max-w-xs truncate text-xs text-muted">{project.short_description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4 text-muted">{project.category?.name ?? '—'}</td>
                                    <td className="py-3 pr-4 capitalize text-muted">{project.classification}</td>
                                    <td className="py-3 pr-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleFeatured(project)}
                                            className={cn(
                                                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                                                project.is_featured ? 'bg-primary/15 text-primary' : 'bg-white/5 text-muted hover:text-text'
                                            )}
                                        >
                                            {project.is_featured ? 'Featured' : 'Not featured'}
                                        </button>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <button
                                            type="button"
                                            onClick={() => togglePublished(project)}
                                            className={cn(
                                                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                                                project.is_published
                                                    ? 'bg-emerald-500/15 text-emerald-400'
                                                    : 'bg-white/5 text-muted hover:text-text'
                                            )}
                                        >
                                            {project.is_published ? 'Published' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="py-3 pr-0 space-x-4 text-right">
                                        <Link
                                            href={route('admin.projects.edit', project.slug)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => destroy(project)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {projects.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-muted">
                                        No projects yet - add your first one, or the 5 seeded placeholders are already
                                        live and ready to edit.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {projects.meta.last_page > 1 && (
                    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
                        {projects.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={cn(
                                    'rounded-lg px-3 py-1.5 text-sm',
                                    link.active ? 'bg-primary/15 text-text' : 'text-muted hover:bg-white/5 hover:text-text',
                                    !link.url && 'pointer-events-none opacity-40'
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                )}
            </div>
        </AdminLayout>
    );
}
