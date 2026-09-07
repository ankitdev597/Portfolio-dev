import type { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ProjectForm } from '@/Components/Admin/ProjectForm';
import type { ProjectFormShape } from '@/Components/Admin/ProjectForm';
import type { ProjectClassification, TechnologyCategory } from '@/Types';

interface CreateProjectProps {
    categories: { id: number; name: string }[];
    technologies: { id: number; name: string; category: TechnologyCategory }[];
    classifications: { value: ProjectClassification; name: string }[];
}

const emptyForm: ProjectFormShape = {
    project_category_id: '',
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    problem: '',
    solution: '',
    architecture: '',
    my_contribution: '',
    challenges: '',
    results: '',
    video_url: '',
    github_url: '',
    live_url: '',
    classification: 'personal',
    is_featured: false,
    is_published: false,
    display_order: 0,
    seo_title: '',
    seo_description: '',
    thumbnail: null,
    remove_thumbnail: false,
    technology_ids: [],
};

export default function Create({ categories, technologies, classifications }: CreateProjectProps) {
    const form = useForm<ProjectFormShape>(emptyForm);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(route('admin.projects.store'), { forceFormData: true });
    };

    return (
        <AdminLayout title="New project">
            <Head title="New project" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-text">New project</h1>
                    <p className="mt-1 text-sm text-muted">
                        Not published until you check "Published" below - safe to save a draft first.
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
                submitLabel="Create project"
                onSubmit={submit}
            />
        </AdminLayout>
    );
}
