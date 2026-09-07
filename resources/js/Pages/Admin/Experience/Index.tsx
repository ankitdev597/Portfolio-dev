import { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/Admin/Modal';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Select } from '@/Components/UI/Select';
import { Textarea } from '@/Components/UI/Textarea';
import { Checkbox } from '@/Components/UI/Checkbox';
import type { EmploymentType, Experience, TechnologyCategory } from '@/Types';

interface EmploymentTypeOption {
    value: EmploymentType;
    name: string;
}

interface TechnologyOption {
    id: number;
    name: string;
    category: TechnologyCategory;
}

interface ExperienceIndexProps {
    experiences: Experience[];
    technologies: TechnologyOption[];
    employmentTypes: EmploymentTypeOption[];
}

interface ExperienceForm {
    company_name: string;
    role_title: string;
    employment_type: EmploymentType | '';
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    description: string;
    display_order: number;
    technology_ids: number[];
    [key: string]: string | number | boolean | number[];
}

const emptyForm: ExperienceForm = {
    company_name: '',
    role_title: '',
    employment_type: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    display_order: 0,
    technology_ids: [],
};

const TECHNOLOGY_CATEGORY_LABELS: Record<TechnologyCategory, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    cloud_devops: 'Cloud & DevOps',
    ai_llm: 'AI & LLM',
    tools: 'Tools',
};

function formatMonthYear(dateString: string | null): string {
    if (!dateString) {
        return '—';
    }
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Modal-based CRUD (small, bounded list - same convention as batch 1's
 * taxonomies), the one added wrinkle being the technologies multi-select
 * grouped by category (mirrors ProjectForm's pattern) and the is_current
 * checkbox that clears/disables end_date client-side - the backend
 * (ExperienceData::fromValidated) also forces end_date to null server-side
 * when is_current is true, so this is a UX convenience, not the only guard.
 */
export default function Index({ experiences, technologies, employmentTypes }: ExperienceIndexProps) {
    const [editing, setEditing] = useState<Experience | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<ExperienceForm>(emptyForm);

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

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEdit = (experience: Experience) => {
        setEditing(experience);
        clearErrors();
        setData({
            company_name: experience.company_name,
            role_title: experience.role_title,
            employment_type: experience.employment_type,
            location: experience.location ?? '',
            start_date: experience.start_date,
            end_date: experience.end_date ?? '',
            is_current: experience.is_current,
            description: experience.description ?? '',
            display_order: 0,
            technology_ids: experience.technologies.map((technology) => technology.id),
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
            put(route('admin.experience.update', editing.id), { onSuccess: close, preserveScroll: true });
        } else {
            post(route('admin.experience.store'), { onSuccess: close, preserveScroll: true });
        }
    };

    const destroy = (experience: Experience) => {
        if (confirm(`Delete the "${experience.role_title}" entry at "${experience.company_name}"?`)) {
            router.delete(route('admin.experience.destroy', experience.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Experience">
            <Head title="Experience" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Experience</h2>
                        <p className="mt-1 text-sm text-muted">The work-history timeline shown on the public site.</p>
                    </div>
                    <Button onClick={openCreate}>Add experience</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Role</th>
                                <th className="py-2 pr-4 font-medium">Company</th>
                                <th className="py-2 pr-4 font-medium">Type</th>
                                <th className="py-2 pr-4 font-medium">Dates</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experiences.map((experience) => (
                                <tr key={experience.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4 text-text">{experience.role_title}</td>
                                    <td className="py-3 pr-4 text-muted">{experience.company_name}</td>
                                    <td className="py-3 pr-4 text-muted">
                                        {employmentTypes.find((t) => t.value === experience.employment_type)?.name ??
                                            experience.employment_type}
                                    </td>
                                    <td className="py-3 pr-4 text-muted">
                                        {formatMonthYear(experience.start_date)} –{' '}
                                        {experience.is_current ? 'Present' : formatMonthYear(experience.end_date)}
                                    </td>
                                    <td className="py-3 pr-0 text-right space-x-4">
                                        <button
                                            onClick={() => openEdit(experience)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => destroy(experience)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {experiences.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-muted">
                                        No experience entries yet - add the first one above.
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
                title={editing ? `Edit "${editing.role_title}"` : 'Add experience'}
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
                            <InputLabel htmlFor="company_name" value="Company name" />
                            <TextInput
                                id="company_name"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                autoFocus
                            />
                            <InputError message={errors.company_name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="role_title" value="Role title" />
                            <TextInput
                                id="role_title"
                                value={data.role_title}
                                onChange={(e) => setData('role_title', e.target.value)}
                            />
                            <InputError message={errors.role_title} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="employment_type" value="Employment type" />
                            <Select
                                id="employment_type"
                                value={data.employment_type}
                                onChange={(e) => setData('employment_type', e.target.value as EmploymentType)}
                            >
                                <option value="" disabled>
                                    Select a type
                                </option>
                                {employmentTypes.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.name}
                                    </option>
                                ))}
                            </Select>
                            <InputError message={errors.employment_type} />
                        </div>
                        <div>
                            <InputLabel htmlFor="location" value="Location (optional)" />
                            <TextInput
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                            />
                            <InputError message={errors.location} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="start_date" value="Start date" />
                            <TextInput
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                            <InputError message={errors.start_date} />
                        </div>
                        <div>
                            <InputLabel htmlFor="end_date" value="End date" />
                            <TextInput
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                disabled={data.is_current}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
                            <InputError message={errors.end_date} />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-text">
                        <Checkbox
                            checked={data.is_current}
                            onChange={(e) => {
                                const isCurrent = e.target.checked;
                                setData('is_current', isCurrent);
                                if (isCurrent) {
                                    setData('end_date', '');
                                }
                            }}
                        />
                        Currently working here
                    </label>

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

                    <div>
                        <InputLabel value="Technologies used" />
                        <div className="mt-2 space-y-3">
                            {[...technologiesByCategory.entries()].map(([category, options]) => (
                                <div key={category}>
                                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted/70">
                                        {TECHNOLOGY_CATEGORY_LABELS[category]}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {options.map((technology) => (
                                            <label
                                                key={technology.id}
                                                className="flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-3 py-1 text-sm text-muted"
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
                </div>
            </Modal>
        </AdminLayout>
    );
}
