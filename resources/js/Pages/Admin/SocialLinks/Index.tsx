import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/Admin/Modal';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Checkbox } from '@/Components/UI/Checkbox';
import type { SocialLink } from '@/Types';

interface SocialLinksIndexProps {
    socialLinks: SocialLink[];
}

interface SocialLinkForm {
    platform: string;
    label: string;
    url: string;
    icon: string;
    is_active: boolean;
    display_order: number;
    [key: string]: string | number | boolean;
}

const emptyForm: SocialLinkForm = {
    platform: '',
    label: '',
    url: '',
    icon: '',
    is_active: true,
    display_order: 0,
};

/**
 * Modal-based CRUD, same convention as batch 1's taxonomies. `platform` is
 * free text (not a DB enum - see the migration's own comment), so this is a
 * plain text field rather than a <select>.
 */
export default function Index({ socialLinks }: SocialLinksIndexProps) {
    const [editing, setEditing] = useState<SocialLink | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<SocialLinkForm>(emptyForm);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEdit = (socialLink: SocialLink) => {
        setEditing(socialLink);
        clearErrors();
        setData({
            platform: socialLink.platform,
            label: socialLink.label ?? '',
            url: socialLink.url,
            icon: socialLink.icon ?? '',
            is_active: socialLink.is_active,
            display_order: socialLink.display_order,
        });
        setShowModal(true);
    };

    const close = () => {
        setShowModal(false);
        reset();
        clearErrors();
    };

    const submit = () => {
        if (editing) {
            put(route('admin.social-links.update', editing.id), { onSuccess: close, preserveScroll: true });
        } else {
            post(route('admin.social-links.store'), { onSuccess: close, preserveScroll: true });
        }
    };

    const destroy = (socialLink: SocialLink) => {
        if (confirm(`Delete the "${socialLink.platform}" link?`)) {
            router.delete(route('admin.social-links.destroy', socialLink.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Social links">
            <Head title="Social links" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Social links</h2>
                        <p className="mt-1 text-sm text-muted">Shown in the footer/contact section of the public site.</p>
                    </div>
                    <Button onClick={openCreate}>Add link</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Platform</th>
                                <th className="py-2 pr-4 font-medium">URL</th>
                                <th className="py-2 pr-4 font-medium">Status</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {socialLinks.map((socialLink) => (
                                <tr key={socialLink.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4 text-text">
                                        {socialLink.label || socialLink.platform}
                                    </td>
                                    <td className="max-w-xs truncate py-3 pr-4 text-muted">{socialLink.url}</td>
                                    <td className="py-3 pr-4 text-muted">{socialLink.is_active ? 'Active' : 'Hidden'}</td>
                                    <td className="py-3 pr-0 text-right space-x-4">
                                        <button
                                            onClick={() => openEdit(socialLink)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => destroy(socialLink)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {socialLinks.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-muted">
                                        No social links yet - add the first one above.
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
                title={editing ? `Edit "${editing.platform}"` : 'Add social link'}
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="platform" value="Platform" />
                            <TextInput
                                id="platform"
                                placeholder="github, linkedin, email…"
                                value={data.platform}
                                onChange={(e) => setData('platform', e.target.value)}
                                autoFocus
                            />
                            <InputError message={errors.platform} />
                        </div>
                        <div>
                            <InputLabel htmlFor="label" value="Label (optional)" />
                            <TextInput id="label" value={data.label} onChange={(e) => setData('label', e.target.value)} />
                            <InputError message={errors.label} />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="url" value="URL" />
                        <TextInput
                            id="url"
                            placeholder="https://… or mailto:you@example.com"
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                        />
                        <InputError message={errors.url} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="icon" value="Icon (identifier)" />
                            <TextInput id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                            <InputError message={errors.icon} />
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

                    <label className="flex items-center gap-2 text-sm text-text">
                        <Checkbox checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                        Active (visible on the public site)
                    </label>
                </div>
            </Modal>
        </AdminLayout>
    );
}
