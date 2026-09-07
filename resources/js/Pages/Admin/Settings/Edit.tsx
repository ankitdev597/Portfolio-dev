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
import type { AdminSiteSettings } from '@/Types';

interface SettingsEditProps {
    settings: AdminSiteSettings;
    faviconUrl: string | null;
    logoUrl: string | null;
    profileImageUrl: string | null;
}

interface SettingsForm {
    site_name: string;
    site_title: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    whatsapp_number: string;
    whatsapp_default_message: string;
    github_url: string;
    linkedin_url: string;
    meta_title: string;
    meta_description: string;
    google_analytics_id: string;
    maintenance_mode: boolean;
    favicon: File | null;
    remove_favicon: boolean;
    logo: File | null;
    remove_logo: boolean;
    profile_image: File | null;
    remove_profile_image: boolean;
    [key: string]: string | number | boolean | File | null;
}

/**
 * A single grouped edit screen over the site_settings key-value store
 * (SiteSettingService) - one PATCH updates every text/boolean key at once,
 * plus the three image-backed keys (favicon/logo/profile_image) via their
 * own file inputs. Super-Admin-only (see routes/web.php + SiteSettingPolicy)
 * since this is system-critical config, not Editor-manageable content.
 */
export default function Edit({ settings, faviconUrl, logoUrl, profileImageUrl }: SettingsEditProps) {
    const [previews, setPreviews] = useState<{ favicon: string | null; logo: string | null; profile_image: string | null }>({
        favicon: null,
        logo: null,
        profile_image: null,
    });

    const { data, setData, patch, processing, errors } = useForm<SettingsForm>({
        site_name: (settings.site_name as string) ?? '',
        site_title: (settings.site_title as string) ?? '',
        headline: (settings.headline as string) ?? '',
        email: (settings.email as string) ?? '',
        phone: (settings.phone as string) ?? '',
        location: (settings.location as string) ?? '',
        whatsapp_number: (settings.whatsapp_number as string) ?? '',
        whatsapp_default_message: (settings.whatsapp_default_message as string) ?? '',
        github_url: (settings.github_url as string) ?? '',
        linkedin_url: (settings.linkedin_url as string) ?? '',
        meta_title: (settings.meta_title as string) ?? '',
        meta_description: (settings.meta_description as string) ?? '',
        google_analytics_id: (settings.google_analytics_id as string) ?? '',
        maintenance_mode: Boolean(settings.maintenance_mode),
        favicon: null,
        remove_favicon: false,
        logo: null,
        remove_logo: false,
        profile_image: null,
        remove_profile_image: false,
    });

    const onFileChange = (
        field: 'favicon' | 'logo' | 'profile_image',
        removeField: 'remove_favicon' | 'remove_logo' | 'remove_profile_image'
    ) => (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData(field, file);
        setData(removeField, false);
        setPreviews((prev) => {
            if (prev[field]) {
                URL.revokeObjectURL(prev[field] as string);
            }
            return { ...prev, [field]: file ? URL.createObjectURL(file) : null };
        });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        patch(route('admin.settings.update'), { forceFormData: true, preserveScroll: true });
    };

    const imageRow = (
        label: string,
        field: 'favicon' | 'logo' | 'profile_image',
        removeField: 'remove_favicon' | 'remove_logo' | 'remove_profile_image',
        currentUrl: string | null
    ) => {
        const displayed = previews[field] ?? (data[removeField] ? null : currentUrl);

        return (
            <div className="flex flex-wrap items-start gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-surface-elevated">
                    {displayed ? (
                        <img src={displayed} alt={`${label} preview`} className="h-full w-full object-contain" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">None</div>
                    )}
                </div>
                <div className="flex-1">
                    <InputLabel value={label} />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange(field, removeField)}
                        className="mt-1 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-primary/25"
                    />
                    <InputError message={errors[field]} />
                    {currentUrl && !previews[field] && (
                        <label className="mt-2 flex items-center gap-2 text-sm text-muted">
                            <Checkbox checked={data[removeField] as boolean} onChange={(e) => setData(removeField, e.target.checked)} />
                            Remove current {label.toLowerCase()}
                        </label>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AdminLayout title="Settings">
            <Head title="Settings" />

            <form onSubmit={submit} className="space-y-6">
                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold text-text">General</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="site_name" value="Site name" />
                            <TextInput id="site_name" value={data.site_name} onChange={(e) => setData('site_name', e.target.value)} />
                            <InputError message={errors.site_name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="headline" value="Headline" />
                            <TextInput id="headline" value={data.headline} onChange={(e) => setData('headline', e.target.value)} />
                            <InputError message={errors.headline} />
                        </div>
                    </div>

                    <label className="mt-5 flex items-center gap-2 text-sm text-text">
                        <Checkbox
                            checked={data.maintenance_mode}
                            onChange={(e) => setData('maintenance_mode', e.target.checked)}
                        />
                        Maintenance mode
                    </label>
                </div>

                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold text-text">Contact</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone" value="Phone (optional)" />
                            <TextInput id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                        <div>
                            <InputLabel htmlFor="location" value="Location (optional)" />
                            <TextInput id="location" value={data.location} onChange={(e) => setData('location', e.target.value)} />
                            <InputError message={errors.location} />
                        </div>
                        <div>
                            <InputLabel htmlFor="whatsapp_number" value="WhatsApp number (with country code, digits only)" />
                            <TextInput
                                id="whatsapp_number"
                                placeholder="918112656226"
                                value={data.whatsapp_number}
                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                            />
                            <InputError message={errors.whatsapp_number} />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="whatsapp_default_message" value="WhatsApp default message" />
                            <Textarea
                                id="whatsapp_default_message"
                                rows={2}
                                value={data.whatsapp_default_message}
                                onChange={(e) => setData('whatsapp_default_message', e.target.value)}
                            />
                            <InputError message={errors.whatsapp_default_message} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold text-text">Social</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="github_url" value="GitHub URL" />
                            <TextInput id="github_url" value={data.github_url} onChange={(e) => setData('github_url', e.target.value)} />
                            <InputError message={errors.github_url} />
                        </div>
                        <div>
                            <InputLabel htmlFor="linkedin_url" value="LinkedIn URL" />
                            <TextInput
                                id="linkedin_url"
                                value={data.linkedin_url}
                                onChange={(e) => setData('linkedin_url', e.target.value)}
                            />
                            <InputError message={errors.linkedin_url} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold text-text">SEO</h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="site_title" value="Browser tab title" />
                            <TextInput id="site_title" value={data.site_title} onChange={(e) => setData('site_title', e.target.value)} />
                            <InputError message={errors.site_title} />
                        </div>
                        <div>
                            <InputLabel htmlFor="meta_title" value="Meta title" />
                            <TextInput id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                            <InputError message={errors.meta_title} />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="meta_description" value="Meta description" />
                            <Textarea
                                id="meta_description"
                                rows={2}
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                            />
                            <InputError message={errors.meta_description} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold text-text">Integrations</h2>

                    <div className="mt-5">
                        <InputLabel htmlFor="google_analytics_id" value="Google Analytics ID (optional)" />
                        <TextInput
                            id="google_analytics_id"
                            placeholder="G-XXXXXXXXXX"
                            value={data.google_analytics_id}
                            onChange={(e) => setData('google_analytics_id', e.target.value)}
                        />
                        <InputError message={errors.google_analytics_id} />
                    </div>
                </div>

                <div className="glass-panel space-y-5 p-6">
                    <h2 className="text-lg font-semibold text-text">Theme images</h2>

                    {imageRow('Favicon', 'favicon', 'remove_favicon', faviconUrl)}
                    {imageRow('Logo', 'logo', 'remove_logo', logoUrl)}
                    {imageRow('Profile image', 'profile_image', 'remove_profile_image', profileImageUrl)}
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
