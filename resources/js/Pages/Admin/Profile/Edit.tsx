import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { TextInput } from '@/Components/UI/TextInput';
import { InputLabel } from '@/Components/UI/InputLabel';
import { InputError } from '@/Components/UI/InputError';
import { Textarea } from '@/Components/UI/Textarea';
import { Checkbox } from '@/Components/UI/Checkbox';
import type { Profile } from '@/Types';

interface ProfileEditProps {
    profile: Profile | null;
}

interface ProfileForm {
    full_name: string;
    headline: string;
    tagline: string;
    years_experience: number;
    bio: string;
    short_bio: string;
    philosophy: string;
    location: string;
    availability_status: string;
    avatar: File | null;
    remove_avatar: boolean;
    resume: File | null;
    remove_resume: boolean;
    [key: string]: string | number | boolean | File | null;
}

/**
 * The single public-facing Profile row - a dedicated page (not a modal,
 * per the "too many fields / file uploads" rule that also routed Projects
 * to Create/Edit pages rather than batch 1's modal pattern), with two
 * independent file uploads (avatar image, resume PDF) each following the
 * same preview + remove-existing-checkbox shape as ProjectForm's thumbnail
 * and Certifications' badge image.
 */
export default function Edit({ profile }: ProfileEditProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const { data, setData, patch, processing, errors } = useForm<ProfileForm>({
        full_name: profile?.full_name ?? '',
        headline: profile?.headline ?? '',
        tagline: profile?.tagline ?? '',
        years_experience: profile?.years_experience ?? 0,
        bio: profile?.bio ?? '',
        short_bio: profile?.short_bio ?? '',
        philosophy: profile?.philosophy ?? '',
        location: profile?.location ?? '',
        availability_status: profile?.availability_status ?? '',
        avatar: null,
        remove_avatar: false,
        resume: null,
        remove_resume: false,
    });

    const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('avatar', file);
        setData('remove_avatar', false);

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarPreview(file ? URL.createObjectURL(file) : null);
    };

    const onResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('resume', file);
        setData('remove_resume', false);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        patch(route('admin.profile.update'), { forceFormData: true, preserveScroll: true });
    };

    const displayedAvatar = avatarPreview ?? (data.remove_avatar ? null : profile?.avatar_url ?? null);

    return (
        <AdminLayout title="Profile">
            <Head title="Profile" />

            <form onSubmit={submit} className="space-y-6">
                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold text-text">Basic info</h2>
                    <p className="mt-1 text-sm text-muted">
                        Shown across the public site's hero, about section, and page metadata.
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="full_name" value="Full name" />
                            <TextInput
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                autoFocus
                            />
                            <InputError message={errors.full_name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="headline" value="Headline" />
                            <TextInput id="headline" value={data.headline} onChange={(e) => setData('headline', e.target.value)} />
                            <InputError message={errors.headline} />
                        </div>
                        <div>
                            <InputLabel htmlFor="tagline" value="Tagline (optional)" />
                            <TextInput id="tagline" value={data.tagline} onChange={(e) => setData('tagline', e.target.value)} />
                            <InputError message={errors.tagline} />
                        </div>
                        <div>
                            <InputLabel htmlFor="years_experience" value="Years of experience" />
                            <TextInput
                                id="years_experience"
                                type="number"
                                min={0}
                                value={data.years_experience}
                                onChange={(e) => setData('years_experience', Number(e.target.value))}
                            />
                            <InputError message={errors.years_experience} />
                        </div>
                        <div>
                            <InputLabel htmlFor="location" value="Location (optional)" />
                            <TextInput id="location" value={data.location} onChange={(e) => setData('location', e.target.value)} />
                            <InputError message={errors.location} />
                        </div>
                        <div>
                            <InputLabel htmlFor="availability_status" value="Availability status (optional)" />
                            <TextInput
                                id="availability_status"
                                placeholder="Open to work, Available for freelance…"
                                value={data.availability_status}
                                onChange={(e) => setData('availability_status', e.target.value)}
                            />
                            <InputError message={errors.availability_status} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold text-text">Bio</h2>

                    <div className="mt-5 space-y-5">
                        <div>
                            <InputLabel htmlFor="short_bio" value="Short bio (used in cards/previews)" />
                            <Textarea id="short_bio" rows={2} value={data.short_bio} onChange={(e) => setData('short_bio', e.target.value)} />
                            <InputError message={errors.short_bio} />
                        </div>
                        <div>
                            <InputLabel htmlFor="bio" value="Full bio" />
                            <Textarea id="bio" rows={6} value={data.bio} onChange={(e) => setData('bio', e.target.value)} />
                            <InputError message={errors.bio} />
                        </div>
                        <div>
                            <InputLabel htmlFor="philosophy" value="Philosophy / approach (optional)" />
                            <Textarea
                                id="philosophy"
                                rows={4}
                                value={data.philosophy}
                                onChange={(e) => setData('philosophy', e.target.value)}
                            />
                            <InputError message={errors.philosophy} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold text-text">Avatar</h2>
                    <p className="mt-1 text-sm text-muted">Shown in the 3D tilt frame in the About section.</p>

                    <div className="mt-5 flex flex-wrap items-start gap-5">
                        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface-elevated">
                            {displayedAvatar ? (
                                <img src={displayedAvatar} alt="Avatar preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                                    No image
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={onAvatarChange}
                                className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-primary/25"
                            />
                            <InputError message={errors.avatar} />

                            {profile?.avatar_url && !avatarPreview && (
                                <label className="mt-3 flex items-center gap-2 text-sm text-muted">
                                    <Checkbox
                                        checked={data.remove_avatar}
                                        onChange={(e) => setData('remove_avatar', e.target.checked)}
                                    />
                                    Remove current avatar
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold text-text">Resume</h2>

                    <div className="mt-5">
                        {profile?.resume_url && (
                            <p className="mb-3 text-sm text-muted">
                                Current:{' '}
                                <a
                                    href={profile.resume_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-accent hover:text-accent/80"
                                >
                                    {profile.resume_original_name ?? 'View resume'}
                                </a>
                            </p>
                        )}

                        <input
                            id="resume"
                            type="file"
                            accept="application/pdf"
                            onChange={onResumeChange}
                            className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-primary/25"
                        />
                        <InputError message={errors.resume} />

                        {profile?.resume_url && !data.resume && (
                            <label className="mt-3 flex items-center gap-2 text-sm text-muted">
                                <Checkbox
                                    checked={data.remove_resume}
                                    onChange={(e) => setData('remove_resume', e.target.checked)}
                                />
                                Remove current resume
                            </label>
                        )}
                    </div>
                </div>

                <div>
                    <Button type="submit" disabled={processing}>
                        Save changes
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
