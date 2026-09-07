import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEventHandler, ReactNode } from 'react';
import type { InertiaFormProps } from '@inertiajs/react';
import { InputLabel } from '@/Components/UI/InputLabel';
import { TextInput } from '@/Components/UI/TextInput';
import { Textarea } from '@/Components/UI/Textarea';
import { InputError } from '@/Components/UI/InputError';
import { Select } from '@/Components/UI/Select';
import { Checkbox } from '@/Components/UI/Checkbox';
import { Button } from '@/Components/UI/Button';
import type { ProjectClassification, TechnologyCategory } from '@/Types';

export interface ProjectFormShape {
    project_category_id: number | '';
    title: string;
    slug: string;
    short_description: string;
    full_description: string;
    problem: string;
    solution: string;
    architecture: string;
    my_contribution: string;
    challenges: string;
    results: string;
    video_url: string;
    github_url: string;
    live_url: string;
    classification: ProjectClassification | '';
    is_featured: boolean;
    is_published: boolean;
    display_order: number;
    seo_title: string;
    seo_description: string;
    thumbnail: File | null;
    remove_thumbnail: boolean;
    technology_ids: number[];
}

interface CategoryOption {
    id: number;
    name: string;
}

interface TechnologyOption {
    id: number;
    name: string;
    category: TechnologyCategory;
}

interface ClassificationOption {
    value: ProjectClassification;
    name: string;
}

const TECHNOLOGY_CATEGORY_LABELS: Record<TechnologyCategory, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    cloud_devops: 'Cloud & DevOps',
    ai_llm: 'AI & LLM',
    tools: 'Tools',
};

interface ProjectFormProps {
    form: InertiaFormProps<ProjectFormShape>;
    categories: CategoryOption[];
    technologies: TechnologyOption[];
    classifications: ClassificationOption[];
    existingThumbnailUrl?: string | null;
    submitLabel: string;
    onSubmit: FormEventHandler;
    footerExtra?: ReactNode;
}

/**
 * Shared by Create.tsx and Edit.tsx (DRY - one form definition, not a
 * near-duplicate pair) since the two pages differ only in submit target,
 * initial values, and whether a delete/thumbnail-removal affordance makes
 * sense yet. Presentation-only: all state lives in the `form` object the
 * page owns via `useForm`.
 */
export function ProjectForm({
    form,
    categories,
    technologies,
    classifications,
    existingThumbnailUrl,
    submitLabel,
    onSubmit,
    footerExtra,
}: ProjectFormProps) {
    const { data, setData, errors, processing } = form;
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const technologiesByCategory = useMemo(() => {
        const grouped = new Map<TechnologyCategory, TechnologyOption[]>();
        for (const technology of technologies) {
            const bucket = grouped.get(technology.category) ?? [];
            bucket.push(technology);
            grouped.set(technology.category, bucket);
        }
        return grouped;
    }, [technologies]);

    const toggleTechnology = (id: number) => {
        setData(
            'technology_ids',
            data.technology_ids.includes(id)
                ? data.technology_ids.filter((existingId) => existingId !== id)
                : [...data.technology_ids, id]
        );
    };

    const onThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('thumbnail', file);
        setData('remove_thumbnail', false);

        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
        }
        setThumbnailPreview(file ? URL.createObjectURL(file) : null);
    };

    const displayedThumbnail = thumbnailPreview ?? (data.remove_thumbnail ? null : existingThumbnailUrl ?? null);

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic info */}
            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text">Basic info</h2>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            autoFocus
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="slug" value="Slug (optional - auto-generated from title if left blank)" />
                        <TextInput id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                        <InputError message={errors.slug} />
                    </div>

                    <div>
                        <InputLabel htmlFor="project_category_id" value="Category" />
                        <Select
                            id="project_category_id"
                            value={data.project_category_id}
                            onChange={(e) =>
                                setData('project_category_id', e.target.value ? Number(e.target.value) : '')
                            }
                        >
                            <option value="">No category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                        <InputError message={errors.project_category_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="classification" value="Classification" />
                        <Select
                            id="classification"
                            value={data.classification}
                            onChange={(e) => setData('classification', e.target.value as ProjectClassification)}
                        >
                            <option value="" disabled>
                                Select a classification
                            </option>
                            {classifications.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.name}
                                </option>
                            ))}
                        </Select>
                        <InputError message={errors.classification} />
                    </div>

                    <div>
                        <InputLabel htmlFor="display_order" value="Display order" />
                        <TextInput
                            id="display_order"
                            type="number"
                            min={0}
                            value={data.display_order}
                            onChange={(e) => setData('display_order', Number(e.target.value))}
                        />
                        <InputError message={errors.display_order} />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text">Description</h2>

                <div className="mt-5 space-y-5">
                    <div>
                        <InputLabel htmlFor="short_description" value="Short description (shown on the public project grid)" />
                        <Textarea
                            id="short_description"
                            rows={2}
                            value={data.short_description}
                            onChange={(e) => setData('short_description', e.target.value)}
                        />
                        <InputError message={errors.short_description} />
                    </div>

                    <div>
                        <InputLabel htmlFor="full_description" value="Full description (optional)" />
                        <Textarea
                            id="full_description"
                            rows={4}
                            value={data.full_description}
                            onChange={(e) => setData('full_description', e.target.value)}
                        />
                        <InputError message={errors.full_description} />
                    </div>
                </div>
            </div>

            {/* Case study details */}
            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text">Case study details</h2>
                <p className="mt-1 text-sm text-muted">
                    All optional - fill in whichever sections apply once a public project detail page exists to
                    show them.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {(
                        [
                            ['problem', 'Problem'],
                            ['solution', 'Solution'],
                            ['architecture', 'Architecture'],
                            ['my_contribution', 'My contribution'],
                            ['challenges', 'Challenges'],
                            ['results', 'Results'],
                        ] as const
                    ).map(([field, label]) => (
                        <div key={field}>
                            <InputLabel htmlFor={field} value={label} />
                            <Textarea id={field} rows={3} value={data[field]} onChange={(e) => setData(field, e.target.value)} />
                            <InputError message={errors[field]} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Media */}
            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text">Thumbnail</h2>

                <div className="mt-5 flex flex-wrap items-start gap-5">
                    <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface-elevated">
                        {displayedThumbnail ? (
                            <img src={displayedThumbnail} alt="Thumbnail preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                                No image
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={onThumbnailChange}
                            className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-primary/25"
                        />
                        <InputError message={errors.thumbnail} />

                        {existingThumbnailUrl && !thumbnailPreview && (
                            <label className="mt-3 flex items-center gap-2 text-sm text-muted">
                                <Checkbox
                                    checked={data.remove_thumbnail}
                                    onChange={(e) => setData('remove_thumbnail', e.target.checked)}
                                />
                                Remove current thumbnail
                            </label>
                        )}
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text">Links</h2>

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                    <div>
                        <InputLabel htmlFor="github_url" value="GitHub URL" />
                        <TextInput id="github_url" value={data.github_url} onChange={(e) => setData('github_url', e.target.value)} />
                        <InputError message={errors.github_url} />
                    </div>
                    <div>
                        <InputLabel htmlFor="live_url" value="Live URL" />
                        <TextInput id="live_url" value={data.live_url} onChange={(e) => setData('live_url', e.target.value)} />
                        <InputError message={errors.live_url} />
                    </div>
                    <div>
                        <InputLabel htmlFor="video_url" value="Video URL" />
                        <TextInput id="video_url" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} />
                        <InputError message={errors.video_url} />
                    </div>
                </div>
            </div>

            {/* Technologies */}
            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text">Technologies</h2>
                <p className="mt-1 text-sm text-muted">Tag the stack used - shown as chips on the public project card.</p>

                <div className="mt-5 space-y-4">
                    {[...technologiesByCategory.entries()].map(([category, options]) => (
                        <div key={category}>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted/70">
                                {TECHNOLOGY_CATEGORY_LABELS[category]}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {options.map((technology) => (
                                    <label
                                        key={technology.id}
                                        className="flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-3 py-1.5 text-sm text-muted"
                                    >
                                        <Checkbox
                                            checked={data.technology_ids.includes(technology.id)}
                                            onChange={() => toggleTechnology(technology.id)}
                                        />
                                        {technology.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <InputError message={errors.technology_ids} />
                </div>
            </div>

            {/* Visibility + SEO */}
            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text">Visibility &amp; SEO</h2>

                <div className="mt-5 flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm text-text">
                        <Checkbox checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} />
                        Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm text-text">
                        <Checkbox checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
                        Published (visible on the public site)
                    </label>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="seo_title" value="SEO title (optional)" />
                        <TextInput id="seo_title" value={data.seo_title} onChange={(e) => setData('seo_title', e.target.value)} />
                        <InputError message={errors.seo_title} />
                    </div>
                    <div>
                        <InputLabel htmlFor="seo_description" value="SEO description (optional)" />
                        <TextInput
                            id="seo_description"
                            value={data.seo_description}
                            onChange={(e) => setData('seo_description', e.target.value)}
                        />
                        <InputError message={errors.seo_description} />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
                {footerExtra}
            </div>
        </form>
    );
}
