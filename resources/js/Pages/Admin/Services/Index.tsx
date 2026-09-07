import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/Admin/Modal';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Textarea } from '@/Components/UI/Textarea';
import { Checkbox } from '@/Components/UI/Checkbox';
import type { Service } from '@/Types';

interface ServicesIndexProps {
    services: Service[];
}

interface ServiceForm {
    title: string;
    slug: string;
    short_description: string;
    description: string;
    icon: string;
    is_active: boolean;
    display_order: number;
    [key: string]: string | number | boolean;
}

const emptyForm: ServiceForm = {
    title: '',
    slug: '',
    short_description: '',
    description: '',
    icon: '',
    is_active: true,
    display_order: 0,
};

/**
 * Modal-based CRUD, same convention as batch 1's taxonomies - small,
 * bounded list of the services offered, shown on the public site's
 * Services grid (FlipCard-rendered).
 */
export default function Index({ services }: ServicesIndexProps) {
    const [editing, setEditing] = useState<Service | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<ServiceForm>(emptyForm);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEdit = (service: Service) => {
        setEditing(service);
        clearErrors();
        setData({
            title: service.title,
            slug: service.slug,
            short_description: service.short_description ?? '',
            description: service.description ?? '',
            icon: service.icon ?? '',
            is_active: service.is_active,
            display_order: service.display_order,
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
            put(route('admin.services.update', editing.id), { onSuccess: close, preserveScroll: true });
        } else {
            post(route('admin.services.store'), { onSuccess: close, preserveScroll: true });
        }
    };

    const destroy = (service: Service) => {
        if (confirm(`Delete "${service.title}"?`)) {
            router.delete(route('admin.services.destroy', service.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Services">
            <Head title="Services" />

            <div className="glass-panel p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Services</h2>
                        <p className="mt-1 text-sm text-muted">What's offered, shown on the public Services grid.</p>
                    </div>
                    <Button onClick={openCreate}>Add service</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-muted">
                                <th className="py-2 pr-4 font-medium">Title</th>
                                <th className="py-2 pr-4 font-medium">Status</th>
                                <th className="py-2 pr-4 font-medium">Order</th>
                                <th className="py-2 pr-0 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className="border-b border-white/5">
                                    <td className="py-3 pr-4 text-text">{service.title}</td>
                                    <td className="py-3 pr-4 text-muted">{service.is_active ? 'Active' : 'Hidden'}</td>
                                    <td className="py-3 pr-4 text-muted">{service.display_order}</td>
                                    <td className="py-3 pr-0 text-right space-x-4">
                                        <button
                                            onClick={() => openEdit(service)}
                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => destroy(service)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-muted">
                                        No services yet - add the first one above.
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
                title={editing ? `Edit "${editing.title}"` : 'Add service'}
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
                        <InputLabel htmlFor="slug" value="Slug (optional - auto-generated from title if left blank)" />
                        <TextInput id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                        <InputError message={errors.slug} />
                    </div>

                    <div>
                        <InputLabel htmlFor="short_description" value="Short description" />
                        <Textarea
                            id="short_description"
                            rows={2}
                            value={data.short_description}
                            onChange={(e) => setData('short_description', e.target.value)}
                        />
                        <InputError message={errors.short_description} />
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
