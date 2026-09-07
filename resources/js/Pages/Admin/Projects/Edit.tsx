import type { FormEvent } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ProjectForm } from '@/Components/Admin/ProjectForm';
import type { ProjectFormShape } from '@/Components/Admin/ProjectForm';
import type { AdminProject, ProjectClassification, TechnologyCategory } from '@/Types';

interface EditProjectProps {
    project: AdminProject;
    categories: { id: number; name: string }[];
    technologies: { id: number; name: string; category: TechnologyCategory }[];
    classifications: { value: ProjectClassification; name: string }[];
}

export default function Edit({ project, categories, technologies, classifications }: EditProjectProps) {
    const form = useForm<ProjectFormShape>({
        project_category_id: project.project_category_id ?? '',
        title: project.title,
        slug: project.slug,
        short_description: project.short_description,
        full_description: project.full_description ?? '',
        problem: project.problem ?? '',
        solution: project.solution ?? '',
        architecture: project.architecture ?? '',
        my_contribution: project.my_contribution ?? '',
        challenges: project.challenges ?? '',
        results: project.results ?? '',
        video_url: project.video_url ?? '',
        github_url: project.github_url ?? '',
        live_url: project.live_url ?? '',
        classification: project.classification,
        is_featured: project.is_featured,
        is_published: project.is_published,
        display_order: project.display_order,
        seo_title: project.seo_title ?? '',
        seo_description: project.seo_description ?? '',
        thumbnail: null,
        remove_thumbnail: false,
        technology_ids: project.technologies.map((technology) => technology.id),
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.put(route('admin.projects.update', project.slug), { forceFormData: true });
    };

    const destroy = () => {
        if (confirm(`Delete "${project.title}"? This can't be undone from here.`)) {
            router.delete(route('admin.projects.destroy', project.slug));
        }
    };

    return (
        <AdminLayout title={`Edit: ${project.title}`}>
            <Head title={`Edit: ${project.title}`} />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-text">Edit project</h1>
                    <p className="mt-1 text-sm text-muted">
                        {project.is_published ? 'Live on the public site.' : 'Not published yet - only visible here.'}
                    </p>
                </div>
                <Link href={route('admin.projects.index')} className="text-sm font-medium text-muted hover:text-text">
                    Back to projects
                </Link>
            </div>

            <ProjectForm
                form={form}
                categories={categories}
                technologies={technologies}
                classifications={classifications}
                existingThumbnailUrl={project.thumbnail_url}
                submitLabel="Save changes"
                onSubmit={submit}
                footerExtra={
                    <button type="button" onClick={destroy} className="text-sm font-medium text-red-400 hover:text-red-300">
                        Delete project
                    </button>
                }
            />
        </AdminLayout>
    );
}
