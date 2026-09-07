import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/Admin/Modal';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Textarea } from '@/Components/UI/Textarea';
import { Checkbox } from '@/Components/UI/Checkbox';
import type { SeoSetting } from '@/Types';

interface SeoSettingsIndexProps {
    seoSettings: SeoSetting[];
}

interface SeoSettingForm {
    page_key: string;
    title: string;
    description: string;
    canonical_url: string;
    keywords: string;
    og_image: File | null;
    remove_og_image: boolean;
    [key: string]: string | boolean | File | null;
}

const emptyForm: SeoSettingForm = {
    page_key: '',
    title: '',
    description: '',
    canonical_url: '',
    keywords: '',
    og_image: null,
    remove_og_image: false,
};

/**
 * Per-page SEO override CRUD (Super-Admin-only, see SiteSettingPolicy) -
 * same modal + file-upload shape as Certifications/Index.tsx. `page_key` is
 * a free-form slug (home, projects_index, project_detail, ...) matched
 * against it at render time by the public-facing pages/meta tags.
 */
export default function Index({ seoSettings }: SeoSettingsIndexProps) {
    const [editing, setEditing] = useState<SeoSetting | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<SeoSettingForm>(emptyForm);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setImagePreview(null);
        setShowModal(true);
    };

    const openEdit = (seoSetting: SeoSetting) => {
        setEditing(seoSetting);
        clearErrors();
        setImagePreview(null);
        setData({
            page_key: seoSetting.page_key,
            title: seoSetting.title ?? '',
            description: seoSetting.description ?? '',
            canonical_url: seoSetting.canonical_url ?? '',
            keywords: seoSetting.keywords ?? '',
            og_image: null,
            remove_og_image: false,
        });
        setShowModal(true);
    };

    const close = () => {
        setShowModal(false);
        reset();
        clearErrors();
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
    };

    const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('og_image', file);
        setData('remove_og_image', false);

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const submit = () => {
        if (editing) {
            put(route('admin.seo-settings.update', editing.id), {
                onSuccess: close,
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            post(route('admin.seo-settings.store'), {
                onSuccess: close,
                preserveScroll: true,
                forceFormData: true,
            });
        }
    };

    const destroy = (seoSetting: SeoSetting) => {
        if (confirm(`Delete SEO settings for "${seoSetting.page_key}"?`)) {
            router.delete(route('admin.seo-settings.destroy', seoSetting.id), { preserveScroll: true });
        }
    };

    const displayedImage = imagePreview ?? (data.remove_og_image ? null : editing?.og_image_url ?? null);

    return (
        <AdminLayout title="SEO">
            <Head title="SEO settings" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">SEO settings</h2>
                        <p className="mt-1 text-sm text-muted">
                            Per-page title/description/og:image overrides, keyed by page.
                        </p>
                    </div>
                    <Button onClick={openCreate}>Add page override</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Page key</th>
                                <th className="py-2 pr-4 font-medium">Title</th>
                                <th className="py-2 pr-4 font-medium">Canonical URL</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seoSettings.map((seoSetting) => (
                                <tr key={seoSetting.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4 text-text">
                                        <span className="flex items-center gap-2">
                                            {seoSetting.og_image_url && (
                                                <img
                                                    src={seoSetting.og_image_url}
                                                    alt=""
                                                    className="h-6 w-10 rounded object-cover"
                                                />
                                            )}
                                            <code className="text-xs">{seoSetting.page_key}</code>
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4 text-muted">{seoSetting.title ?? '—'}</td>
                                    <td className="py-3 pr-4 max-w-xs truncate text-muted">
                                        {seoSetting.canonical_url ?? '—'}
                                    </td>
                                    <td className="py-3 pr-0 text-right space-x-4">
                                        <button
                                            onClick={() => openEdit(seoSetting)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => destroy(seoSetting)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {seoSettings.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-muted">
                                        No per-page SEO overrides yet - add the first one above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                show={showModal}
                onClose={close}
                title={editing ? `Edit "${editing.page_key}"` : 'Add page override'}
                footer={
                    <>
                        <Button variant="secondary" onClick={close}>
                            Cancel
                        </Button>
                        <Button onClick={submit} disabled={processing}>
                            {editing ? 'Save changes' : 'Create'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="page_key" value="Page key" />
                        <TextInput
                            id="page_key"
                            placeholder="home, projects_index, project_detail…"
                            value={data.page_key}
                            onChange={(e) => setData('page_key', e.target.value)}
                            autoFocus
                            disabled={Boolean(editing)}
                        />
                        <InputError message={errors.page_key} />
                    </div>

                    <div>
                        <InputLabel htmlFor="title" value="Title (optional)" />
                        <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        <InputError message={errors.title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Description (optional)" />
                        <Textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <InputLabel htmlFor="canonical_url" value="Canonical URL (optional)" />
                        <TextInput
                            id="canonical_url"
                            value={data.canonical_url}
                            onChange={(e) => setData('canonical_url', e.target.value)}
                        />
                        <InputError message={errors.canonical_url} />
                    </div>

                    <div>
                        <InputLabel htmlFor="keywords" value="Keywords (optional, comma separated)" />
                        <TextInput
                            id="keywords"
                            value={data.keywords}
                            onChange={(e) => setData('keywords', e.target.value)}
                        />
                        <InputError message={errors.keywords} />
                    </div>

                    <div>
                        <InputLabel value="Open Graph image (optional)" />
                        <div className="mt-2 flex flex-wrap items-start gap-4">
                            <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-surface-elevated">
                                {displayedImage ? (
                                    <img src={displayedImage} alt="OG image preview" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                                        No image
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    id="og_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={onImageChange}
                                    className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-primary/25"
                                />
                                <InputError message={errors.og_image} />

                                {editing?.og_image_url && !imagePreview && (
                                    <label className="mt-3 flex items-center gap-2 text-sm text-muted">
                                        <Checkbox
                                            checked={data.remove_og_image}
                                            onChange={(e) => setData('remove_og_image', e.target.checked)}
                                        />
                                        Remove current image
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
