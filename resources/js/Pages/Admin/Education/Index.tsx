import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/Admin/Modal';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Textarea } from '@/Components/UI/Textarea';
import type { Education } from '@/Types';

interface EducationIndexProps {
    educations: Education[];
}

interface EducationForm {
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
    description: string;
    display_order: number;
    [key: string]: string | number;
}

const emptyForm: EducationForm = {
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    description: '',
    display_order: 0,
};

function formatMonthYear(dateString: string | null): string {
    if (!dateString) {
        return '—';
    }
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Simpler sibling of Experience/Index.tsx - same modal-based CRUD
 * convention, but Education has no enum and no technologies pivot, so the
 * form is a plain field set.
 */
export default function Index({ educations }: EducationIndexProps) {
    const [editing, setEditing] = useState<Education | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<EducationForm>(emptyForm);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEdit = (education: Education) => {
        setEditing(education);
        clearErrors();
        setData({
            institution: education.institution,
            degree: education.degree,
            field_of_study: education.field_of_study ?? '',
            start_date: education.start_date ?? '',
            end_date: education.end_date ?? '',
            description: education.description ?? '',
            display_order: education.display_order,
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
            put(route('admin.education.update', editing.id), { onSuccess: close, preserveScroll: true });
        } else {
            post(route('admin.education.store'), { onSuccess: close, preserveScroll: true });
        }
    };

    const destroy = (education: Education) => {
        if (confirm(`Delete "${education.degree}" at "${education.institution}"?`)) {
            router.delete(route('admin.education.destroy', education.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Education">
            <Head title="Education" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Education</h2>
                        <p className="mt-1 text-sm text-muted">The academic history shown on the public site.</p>
                    </div>
                    <Button onClick={openCreate}>Add education</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Degree</th>
                                <th className="py-2 pr-4 font-medium">Institution</th>
                                <th className="py-2 pr-4 font-medium">Dates</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {educations.map((education) => (
                                <tr key={education.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4 text-text">
                                        {education.degree}
                                        {education.field_of_study && (
                                            <span className="text-muted"> · {education.field_of_study}</span>
                                        )}
                                    </td>
                                    <td className="py-3 pr-4 text-muted">{education.institution}</td>
                                    <td className="py-3 pr-4 text-muted">
                                        {formatMonthYear(education.start_date)} – {formatMonthYear(education.end_date)}
                                    </td>
                                    <td className="py-3 pr-0 text-right space-x-4">
                                        <button
                                            onClick={() => openEdit(education)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => destroy(education)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {educations.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-muted">
                                        No education entries yet - add the first one above.
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
                title={editing ? `Edit "${editing.degree}"` : 'Add education'}
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
                        <InputLabel htmlFor="institution" value="Institution" />
                        <TextInput
                            id="institution"
                            value={data.institution}
                            onChange={(e) => setData('institution', e.target.value)}
                            autoFocus
                        />
                        <InputError message={errors.institution} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="degree" value="Degree" />
                            <TextInput id="degree" value={data.degree} onChange={(e) => setData('degree', e.target.value)} />
                            <InputError message={errors.degree} />
                        </div>
                        <div>
                            <InputLabel htmlFor="field_of_study" value="Field of study (optional)" />
                            <TextInput
                                id="field_of_study"
                                value={data.field_of_study}
                                onChange={(e) => setData('field_of_study', e.target.value)}
                            />
                            <InputError message={errors.field_of_study} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="start_date" value="Start date (optional)" />
                            <TextInput
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                            <InputError message={errors.start_date} />
                        </div>
                        <div>
                            <InputLabel htmlFor="end_date" value="End date (optional)" />
                            <TextInput
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
                            <InputError message={errors.end_date} />
                        </div>
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
            </Modal>
        </AdminLayout>
    );
}
