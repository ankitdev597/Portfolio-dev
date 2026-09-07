import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/Admin/Modal';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Checkbox } from '@/Components/UI/Checkbox';
import type { Certification } from '@/Types';

interface CertificationsIndexProps {
    certifications: Certification[];
}

interface CertificationForm {
    title: string;
    issuing_organization: string;
    issue_date: string;
    expiry_date: string;
    credential_id: string;
    credential_url: string;
    image: File | null;
    remove_image: boolean;
    display_order: number;
    [key: string]: string | number | boolean | File | null;
}

const emptyForm: CertificationForm = {
    title: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    image: null,
    remove_image: false,
    display_order: 0,
};

function formatMonthYear(dateString: string | null): string {
    if (!dateString) {
        return '—';
    }
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Modal-based CRUD like batches 1/3/4's other small lists, plus a
 * badge/logo image upload - handled the same way as ProjectForm's
 * thumbnail (preview via object URL, remove-existing checkbox, `useForm`'s
 * automatic multipart switch when a File is present in `data`).
 */
export default function Index({ certifications }: CertificationsIndexProps) {
    const [editing, setEditing] = useState<Certification | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<CertificationForm>(emptyForm);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setImagePreview(null);
        setShowModal(true);
    };

    const openEdit = (certification: Certification) => {
        setEditing(certification);
        clearErrors();
        setImagePreview(null);
        setData({
            title: certification.title,
            issuing_organization: certification.issuing_organization,
            issue_date: certification.issue_date ?? '',
            expiry_date: certification.expiry_date ?? '',
            credential_id: certification.credential_id ?? '',
            credential_url: certification.credential_url ?? '',
            image: null,
            remove_image: false,
            display_order: certification.display_order,
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
        setData('image', file);
        setData('remove_image', false);

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const submit = () => {
        if (editing) {
            put(route('admin.certifications.update', editing.id), {
                onSuccess: close,
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            post(route('admin.certifications.store'), {
                onSuccess: close,
                preserveScroll: true,
                forceFormData: true,
            });
        }
    };

    const destroy = (certification: Certification) => {
        if (confirm(`Delete "${certification.title}"?`)) {
            router.delete(route('admin.certifications.destroy', certification.id), { preserveScroll: true });
        }
    };

    const displayedImage = imagePreview ?? (data.remove_image ? null : editing?.image_url ?? null);

    return (
        <AdminLayout title="Certifications">
            <Head title="Certifications" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Certifications</h2>
                        <p className="mt-1 text-sm text-muted">Credentials shown on the public site.</p>
                    </div>
                    <Button onClick={openCreate}>Add certification</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Title</th>
                                <th className="py-2 pr-4 font-medium">Issuer</th>
                                <th className="py-2 pr-4 font-medium">Issued</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certifications.map((certification) => (
                                <tr key={certification.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4 text-text">
                                        <span className="flex items-center gap-2">
                                            {certification.image_url && (
                                                <img
                                                    src={certification.image_url}
                                                    alt=""
                                                    className="h-6 w-6 rounded object-cover"
                                                />
                                            )}
                                            {certification.title}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4 text-muted">{certification.issuing_organization}</td>
                                    <td className="py-3 pr-4 text-muted">{formatMonthYear(certification.issue_date)}</td>
                                    <td className="py-3 pr-0 text-right space-x-4">
                                        <button
                                            onClick={() => openEdit(certification)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => destroy(certification)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {certifications.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-muted">
                                        No certifications yet - add the first one above.
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
                title={editing ? `Edit "${editing.title}"` : 'Add certification'}
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
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} autoFocus />
                        <InputError message={errors.title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="issuing_organization" value="Issuing organization" />
                        <TextInput
                            id="issuing_organization"
                            value={data.issuing_organization}
                            onChange={(e) => setData('issuing_organization', e.target.value)}
                        />
                        <InputError message={errors.issuing_organization} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="issue_date" value="Issue date (optional)" />
                            <TextInput
                                id="issue_date"
                                type="date"
                                value={data.issue_date}
                                onChange={(e) => setData('issue_date', e.target.value)}
                            />
                            <InputError message={errors.issue_date} />
                        </div>
                        <div>
                            <InputLabel htmlFor="expiry_date" value="Expiry date (optional)" />
                            <TextInput
                                id="expiry_date"
                                type="date"
                                value={data.expiry_date}
                                onChange={(e) => setData('expiry_date', e.target.value)}
                            />
                            <InputError message={errors.expiry_date} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="credential_id" value="Credential ID (optional)" />
                            <TextInput
                                id="credential_id"
                                value={data.credential_id}
                                onChange={(e) => setData('credential_id', e.target.value)}
                            />
                            <InputError message={errors.credential_id} />
                        </div>
                        <div>
                            <InputLabel htmlFor="credential_url" value="Credential URL (optional)" />
                            <TextInput
                                id="credential_url"
                                value={data.credential_url}
                                onChange={(e) => setData('credential_url', e.target.value)}
                            />
                            <InputError message={errors.credential_url} />
                        </div>
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

                    <div>
                        <InputLabel value="Badge / logo image (optional)" />
                        <div className="mt-2 flex flex-wrap items-start gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-surface-elevated">
                                {displayedImage ? (
                                    <img src={displayedImage} alt="Badge preview" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                                        No image
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={onImageChange}
                                    className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-primary/25"
                                />
                                <InputError message={errors.image} />

                                {editing?.image_url && !imagePreview && (
                                    <label className="mt-3 flex items-center gap-2 text-sm text-muted">
                                        <Checkbox
                                            checked={data.remove_image}
                                            onChange={(e) => setData('remove_image', e.target.checked)}
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
