import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/Admin/Modal';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Textarea } from '@/Components/UI/Textarea';
import type { ProjectCategory } from '@/Types';

interface ProjectCategoriesIndexProps {
    categories: ProjectCategory[];
}

interface CategoryForm {
    name: string;
    slug: string;
    description: string;
    display_order: number;
    [key: string]: string | number;
}

const emptyForm: CategoryForm = { name: '', slug: '', description: '', display_order: 0 };

export default function Index({ categories }: ProjectCategoriesIndexProps) {
    const [editing, setEditing] = useState<ProjectCategory | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<CategoryForm>(emptyForm);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEdit = (category: ProjectCategory) => {
        setEditing(category);
        clearErrors();
        setData({
            name: category.name,
            slug: category.slug,
            description: category.description ?? '',
            display_order: category.display_order,
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
            put(route('admin.project-categories.update', editing.id), { onSuccess: close, preserveScroll: true });
        } else {
            post(route('admin.project-categories.store'), { onSuccess: close, preserveScroll: true });
        }
    };

    const destroy = (category: ProjectCategory) => {
        const warning =
            category.projects_count && category.projects_count > 0
                ? ` ${category.projects_count} project(s) using it will become uncategorized.`
                : '';
        if (confirm(`Delete "${category.name}"?${warning}`)) {
            router.delete(route('admin.project-categories.destroy', category.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Project Categories">
            <Head title="Project Categories" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Project categories</h2>
                        <p className="mt-1 text-sm text-muted">
                            Used to group and filter projects in the public gallery.
                        </p>
                    </div>
                    <Button onClick={openCreate}>Add category</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Name</th>
                                <th className="py-2 pr-4 font-medium">Projects</th>
                                <th className="py-2 pr-4 font-medium">Order</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4">
                                        <div className="text-text">{category.name}</div>
                                        {category.description && (
                                            <div className="mt-0.5 max-w-md truncate text-xs text-muted">
                                                {category.description}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 pr-4 text-muted">{category.projects_count ?? 0}</td>
                                    <td className="py-3 pr-4 text-muted">{category.display_order}</td>
                                    <td className="py-3 pr-0 text-right space-x-4">
                                        <button
                                            onClick={() => openEdit(category)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => destroy(category)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-muted">
                                        No project categories yet - add the first one above.
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
                title={editing ? `Edit "${editing.name}"` : 'Add project category'}
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
                        <TextInput id="name" autoFocus value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <InputLabel htmlFor="slug" value="Slug (optional)" />
                        <TextInput id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                        <InputError message={errors.slug} />
                    </div>
                    <div>
                        <InputLabel htmlFor="description" value="Description (optional)" />
                        <Textarea
                            id="description"
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
