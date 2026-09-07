import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/Admin/Modal';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Checkbox } from '@/Components/UI/Checkbox';
import type { Skill, SkillCategory } from '@/Types';

interface SkillCategoriesIndexProps {
    categories: SkillCategory[];
}

interface CategoryForm {
    name: string;
    slug: string;
    icon: string;
    display_order: number;
    [key: string]: string | number;
}

interface SkillForm {
    skill_category_id: number;
    name: string;
    icon: string;
    proficiency: number | '';
    is_featured: boolean;
    display_order: number;
    [key: string]: string | number | boolean;
}

const emptyCategoryForm: CategoryForm = { name: '', slug: '', icon: '', display_order: 0 };

function emptySkillForm(categoryId: number): SkillForm {
    return {
        skill_category_id: categoryId,
        name: '',
        icon: '',
        proficiency: '',
        is_featured: false,
        display_order: 0,
    };
}

export default function Index({ categories }: SkillCategoriesIndexProps) {
    // --- Category (create/edit) modal state ---
    const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const categoryForm = useForm<CategoryForm>(emptyCategoryForm);

    // --- Skill (create/edit) modal state ---
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [skillModalCategoryId, setSkillModalCategoryId] = useState<number | null>(null);
    const skillForm = useForm<SkillForm>(emptySkillForm(0));

    const openCreateCategory = () => {
        setEditingCategory(null);
        categoryForm.reset();
        categoryForm.clearErrors();
        setShowCategoryModal(true);
    };

    const openEditCategory = (category: SkillCategory) => {
        setEditingCategory(category);
        categoryForm.clearErrors();
        categoryForm.setData({
            name: category.name,
            slug: category.slug,
            icon: category.icon ?? '',
            display_order: category.display_order,
        });
        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        categoryForm.reset();
        categoryForm.clearErrors();
    };

    const submitCategory = () => {
        if (editingCategory) {
            categoryForm.put(route('admin.skill-categories.update', editingCategory.id), {
                onSuccess: closeCategoryModal,
                preserveScroll: true,
            });
        } else {
            categoryForm.post(route('admin.skill-categories.store'), {
                onSuccess: closeCategoryModal,
                preserveScroll: true,
            });
        }
    };

    const destroyCategory = (category: SkillCategory) => {
        if (
            confirm(
                `Delete "${category.name}"? This also deletes all ${category.skills.length} skill(s) in it. This cannot be undone.`
            )
        ) {
            router.delete(route('admin.skill-categories.destroy', category.id), { preserveScroll: true });
        }
    };

    const openCreateSkill = (categoryId: number) => {
        setEditingSkill(null);
        setSkillModalCategoryId(categoryId);
        skillForm.setData(emptySkillForm(categoryId));
        skillForm.clearErrors();
    };

    const openEditSkill = (skill: Skill) => {
        setEditingSkill(skill);
        setSkillModalCategoryId(skill.skill_category_id);
        skillForm.clearErrors();
        skillForm.setData({
            skill_category_id: skill.skill_category_id,
            name: skill.name,
            icon: skill.icon ?? '',
            proficiency: skill.proficiency ?? '',
            is_featured: skill.is_featured,
            display_order: skill.display_order,
        });
    };

    const closeSkillModal = () => {
        setSkillModalCategoryId(null);
        setEditingSkill(null);
        skillForm.reset();
        skillForm.clearErrors();
    };

    const submitSkill = () => {
        if (editingSkill) {
            skillForm.put(route('admin.skills.update', editingSkill.id), {
                onSuccess: closeSkillModal,
                preserveScroll: true,
            });
        } else {
            skillForm.post(route('admin.skills.store'), { onSuccess: closeSkillModal, preserveScroll: true });
        }
    };

    const destroySkill = (skill: Skill) => {
        if (confirm(`Delete skill "${skill.name}"?`)) {
            router.delete(route('admin.skills.destroy', skill.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Skills">
            <Head title="Skills" />

            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-text">Skill categories</h2>
                    <p className="mt-1 text-sm text-muted">
                        Groups shown on the public Skills section (e.g. "Backend", "AI &amp; DevOps"). Add skills
                        inside each category below.
                    </p>
                </div>
                <Button onClick={openCreateCategory}>Add category</Button>
            </div>

            <div className="space-y-6">
                {categories.map((category) => (
                    <div key={category.id} className="glass-panel p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-text">{category.name}</h3>
                                <p className="text-xs text-muted">
                                    {category.skills.length} skill{category.skills.length === 1 ? '' : 's'} &middot;
                                    order {category.display_order}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => openCreateSkill(category.id)}
                                    className="text-sm font-medium text-accent hover:text-accent/80"
                                >
                                    Add skill
                                </button>
                                <button
                                    onClick={() => openEditCategory(category)}
                                    className="text-sm font-medium text-muted hover:text-text"
                                >
                                    Edit category
                                </button>
                                <button
                                    onClick={() => destroyCategory(category)}
                                    className="text-sm font-medium text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {category.skills.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 text-muted">
                                        <th className="py-2 pr-4 font-medium">Name</th>
                                        <th className="py-2 pr-4 font-medium">Proficiency</th>
                                        <th className="py-2 pr-4 font-medium">Featured</th>
                                        <th className="py-2 pr-4 font-medium">Order</th>
                                        <th className="py-2 pr-0 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {category.skills.map((skill) => (
                                        <tr key={skill.id} className="border-b border-white/5">
                                            <td className="py-3 pr-4 text-text">{skill.name}</td>
                                            <td className="py-3 pr-4 text-muted">
                                                {skill.proficiency !== null ? `${skill.proficiency}%` : '—'}
                                            </td>
                                            <td className="py-3 pr-4 text-muted">{skill.is_featured ? 'Yes' : 'No'}</td>
                                            <td className="py-3 pr-4 text-muted">{skill.display_order}</td>
                                            <td className="py-3 pr-0 text-right space-x-4">
                                                <button
                                                    onClick={() => openEditSkill(skill)}
                                                    className="text-sm font-medium text-accent hover:text-accent/80"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => destroySkill(skill)}
                                                    className="text-sm font-medium text-red-400 hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-muted">No skills in this category yet.</p>
                        )}
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="glass-panel p-6 text-center text-muted">
                        No skill categories yet - add the first one above.
                    </div>
                )}
            </div>

            {/* Category create/edit modal */}
            <Modal
                show={showCategoryModal}
                onClose={closeCategoryModal}
                title={editingCategory ? `Edit "${editingCategory.name}"` : 'Add skill category'}
                footer={
                    <>
                        <Button variant="secondary" onClick={closeCategoryModal}>
                            Cancel
                        </Button>
                        <Button onClick={submitCategory} disabled={categoryForm.processing}>
                            {editingCategory ? 'Save changes' : 'Create'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="category_name" value="Name" />
                        <TextInput
                            id="category_name"
                            autoFocus
                            value={categoryForm.data.name}
                            onChange={(e) => categoryForm.setData('name', e.target.value)}
                        />
                        <InputError message={categoryForm.errors.name} />
                    </div>
                    <div>
                        <InputLabel htmlFor="category_slug" value="Slug (optional)" />
                        <TextInput
                            id="category_slug"
                            value={categoryForm.data.slug}
                            onChange={(e) => categoryForm.setData('slug', e.target.value)}
                        />
                        <InputError message={categoryForm.errors.slug} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="category_icon" value="Icon" />
                            <TextInput
                                id="category_icon"
                                value={categoryForm.data.icon}
                                onChange={(e) => categoryForm.setData('icon', e.target.value)}
                            />
                            <InputError message={categoryForm.errors.icon} />
                        </div>
                        <div>
                            <InputLabel htmlFor="category_order" value="Display order" />
                            <TextInput
                                id="category_order"
                                type="number"
                                min={0}
                                value={categoryForm.data.display_order}
                                onChange={(e) => categoryForm.setData('display_order', Number(e.target.value))}
                            />
                            <InputError message={categoryForm.errors.display_order} />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Skill create/edit modal */}
            <Modal
                show={skillModalCategoryId !== null}
                onClose={closeSkillModal}
                title={editingSkill ? `Edit skill "${editingSkill.name}"` : 'Add skill'}
                footer={
                    <>
                        <Button variant="secondary" onClick={closeSkillModal}>
                            Cancel
                        </Button>
                        <Button onClick={submitSkill} disabled={skillForm.processing}>
                            {editingSkill ? 'Save changes' : 'Create'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="skill_name" value="Name" />
                        <TextInput
                            id="skill_name"
                            autoFocus
                            value={skillForm.data.name}
                            onChange={(e) => skillForm.setData('name', e.target.value)}
                        />
                        <InputError message={skillForm.errors.name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="skill_icon" value="Icon" />
                            <TextInput
                                id="skill_icon"
                                value={skillForm.data.icon}
                                onChange={(e) => skillForm.setData('icon', e.target.value)}
                            />
                            <InputError message={skillForm.errors.icon} />
                        </div>
                        <div>
                            <InputLabel htmlFor="skill_proficiency" value="Proficiency (0-100)" />
                            <TextInput
                                id="skill_proficiency"
                                type="number"
                                min={0}
                                max={100}
                                value={skillForm.data.proficiency}
                                onChange={(e) =>
                                    skillForm.setData(
                                        'proficiency',
                                        e.target.value === '' ? '' : Number(e.target.value)
                                    )
                                }
                            />
                            <InputError message={skillForm.errors.proficiency} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="skill_order" value="Display order" />
                            <TextInput
                                id="skill_order"
                                type="number"
                                min={0}
                                value={skillForm.data.display_order}
                                onChange={(e) => skillForm.setData('display_order', Number(e.target.value))}
                            />
                            <InputError message={skillForm.errors.display_order} />
                        </div>
                        <div className="flex items-end pb-2.5">
                            <label className="flex items-center gap-2 text-sm text-muted">
                                <Checkbox
                                    checked={skillForm.data.is_featured}
                                    onChange={(e) => skillForm.setData('is_featured', e.target.checked)}
                                />
                                Featured skill
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
