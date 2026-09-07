import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/Admin/Modal';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Select } from '@/Components/UI/Select';
import type { Technology, TechnologyCategory } from '@/Types';

interface TechnologyCategoryOption {
    name: string;
    value: TechnologyCategory;
}

interface TechnologiesIndexProps {
    technologies: Technology[];
    categories: TechnologyCategoryOption[];
}

interface TechnologyForm {
    name: string;
    slug: string;
    icon: string;
    color: string;
    category: TechnologyCategory | '';
    display_order: number;
    [key: string]: string | number;
}

const emptyForm: TechnologyForm = {
    name: '',
    slug: '',
    icon: '',
    color: '',
    category: '',
    display_order: 0,
};

export default function Index({ technologies, categories }: TechnologiesIndexProps) {
    const [editing, setEditing] = useState<Technology | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<TechnologyForm>(emptyForm);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEdit = (technology: Technology) => {
        setEditing(technology);
        clearErrors();
        setData({
            name: technology.name,
            slug: technology.slug,
            icon: technology.icon ?? '',
            color: technology.color ?? '',
            category: technology.category,
            display_order: technology.display_order,
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
            put(route('admin.technologies.update', editing.id), { onSuccess: close, preserveScroll: true });
        } else {
            post(route('admin.technologies.store'), { onSuccess: close, preserveScroll: true });
        }
    };

    const destroy = (technology: Technology) => {
        if (confirm(`Delete "${technology.name}"? This removes it from any project/experience it's tagged on.`)) {
            router.delete(route('admin.technologies.destroy', technology.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Technologies">
            <Head title="Technologies" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Technologies</h2>
                        <p className="mt-1 text-sm text-muted">
                            The shared tag list used on Experience entries and Project tech stacks.
                        </p>
                    </div>
                    <Button onClick={openCreate}>Add technology</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Name</th>
                                <th className="py-2 pr-4 font-medium">Category</th>
                                <th className="py-2 pr-4 font-medium">Order</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {technologies.map((technology) => (
                                <tr key={technology.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4 text-text">
                                        <span className="flex items-center gap-2">
                                            {technology.color && (
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{ backgroundColor: technology.color }}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            {technology.name}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4 text-muted">
                                        {categories.find((c) => c.value === technology.category)?.name ?? technology.category}
                                    </td>
                                    <td className="py-3 pr-4 text-muted">{technology.display_order}</td>
                                    <td className="py-3 pr-0 text-right space-x-4">
                                        <button
                                            onClick={() => openEdit(technology)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => destroy(technology)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {technologies.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-muted">
                                        No technologies yet - add the first one above.
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
                title={editing ? `Edit "${editing.name}"` : 'Add technology'}
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
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoFocus
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="slug" value="Slug (optional - auto-generated from name if left blank)" />
                        <TextInput id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="category" value="Category" />
                            <Select
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value as TechnologyCategory)}
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {categories.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.name}
                                    </option>
                                ))}
                            </Select>
                            <InputError message={errors.category} />
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="icon" value="Icon (identifier or URL)" />
                            <TextInput id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                            <InputError message={errors.icon} />
                        </div>

                        <div>
                            <InputLabel htmlFor="color" value="Color (hex)" />
                            <TextInput
                                id="color"
                                placeholder="#8b5cf6"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                            />
                            <InputError message={errors.color} />
                        </div>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
