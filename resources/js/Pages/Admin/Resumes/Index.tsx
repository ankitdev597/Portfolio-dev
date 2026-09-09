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
import type { Resume } from '@/Types';

interface ResumesIndexProps {
    resumes: Resume[];
}

interface ResumeForm {
    role_title: string;
    label: string;
    file: File | null;
    is_active: boolean;
    display_order: number;
    [key: string]: string | number | boolean | File | null;
}

const emptyForm: ResumeForm = {
    role_title: '',
    label: '',
    file: null,
    is_active: true,
    display_order: 0,
};

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Modal-based CRUD like Certifications/SocialLinks - one wrinkle being the
 * PDF upload (required on create, optional replace on update), handled the
 * same way as CertificationForm's image: file passed through `useForm`,
 * never touched directly here.
 */
export default function Index({ resumes }: ResumesIndexProps) {
    const [editing, setEditing] = useState<Resume | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<ResumeForm>(emptyForm);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setSelectedFileName(null);
        setShowModal(true);
    };

    const openEdit = (resume: Resume) => {
        setEditing(resume);
        clearErrors();
        setSelectedFileName(null);
        setData({
            role_title: resume.role_title,
            label: resume.label ?? '',
            file: null,
            is_active: resume.is_active,
            display_order: resume.display_order,
        });
        setShowModal(true);
    };

    const close = () => {
        setShowModal(false);
        reset();
        clearErrors();
        setSelectedFileName(null);
    };

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('file', file);
        setSelectedFileName(file ? `${file.name} (${formatBytes(file.size)})` : null);
    };

    const submit = () => {
        if (editing) {
            put(route('admin.resumes.update', editing.id), {
                onSuccess: close,
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            post(route('admin.resumes.store'), {
                onSuccess: close,
                preserveScroll: true,
                forceFormData: true,
            });
        }
    };

    const destroy = (resume: Resume) => {
        if (confirm(`Delete the "${resume.role_title}" resume?`)) {
            router.delete(route('admin.resumes.destroy', resume.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Resumes">
            <Head title="Resumes" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Resumes</h2>
                        <p className="mt-1 text-sm text-muted">
                            Role-tagged resume PDFs shown in the Resume section on the public site.
                        </p>
                    </div>
                    <Button onClick={openCreate}>Add resume</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Role</th>
                                <th className="py-2 pr-4 font-medium">File</th>
                                <th className="py-2 pr-4 font-medium">Status</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumes.map((resume) => (
                                <tr key={resume.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4 text-text">
                                        <span className="font-medium">{resume.role_title}</span>
                                        {resume.label && <span className="block text-xs text-muted">{resume.label}</span>}
                                    </td>
                                    <td className="py-3 pr-4 text-muted">
                                        {resume.file_url ? (
                                            <a
                                                href={resume.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent hover:text-accent/80"
                                            >
                                                {resume.file_original_name ?? 'View PDF'}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span
                                            className={
                                                resume.is_active
                                                    ? 'rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400'
                                                    : 'rounded-full bg-white/10 px-2.5 py-1 text-xs text-muted'
                                            }
                                        >
                                            {resume.is_active ? 'Published' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-0 text-right space-x-4">
                                        <button
                                            onClick={() => openEdit(resume)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => destroy(resume)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {resumes.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-muted">
                                        No resumes yet - add the first one above.
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
                title={editing ? `Edit "${editing.role_title}"` : 'Add resume'}
                footer={
                    <>
                        <Button variant="secondary" onClick={close}>
                            Cancel
                        </Button>
                        <Button onClick={submit} disabled={processing}>
                            {editing ? 'Save changes' : 'Upload'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="role_title" value="Role title" />
                        <TextInput
                            id="role_title"
                            value={data.role_title}
                            onChange={(e) => setData('role_title', e.target.value)}
                            placeholder="e.g. Full Stack Developer"
                            autoFocus
                        />
                        <InputError message={errors.role_title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="label" value="Note (optional)" />
                        <TextInput
                            id="label"
                            value={data.label}
                            onChange={(e) => setData('label', e.target.value)}
                            placeholder="e.g. Updated September 2026"
                        />
                        <InputError message={errors.label} />
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

                    <label className="flex items-center gap-2 text-sm text-muted">
                        <Checkbox checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                        Published on the public site
                    </label>

                    <div>
                        <InputLabel value={editing ? 'Replace PDF (optional)' : 'Resume PDF'} />
                        <div className="mt-2">
                            <input
                                id="file"
                                type="file"
                                accept="application/pdf"
                                onChange={onFileChange}
                                className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-primary/25"
                            />
                            <InputError message={errors.file} />

                            {selectedFileName ? (
                                <p className="mt-2 text-xs text-muted">{selectedFileName}</p>
                            ) : (
                                editing?.file_original_name && (
                                    <p className="mt-2 text-xs text-muted">Current file: {editing.file_original_name}</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
