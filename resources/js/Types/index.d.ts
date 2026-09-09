export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export type RoleName = 'super_admin' | 'editor';

export interface SiteSettings {
    site_name?: string;
    headline?: string;
    email?: string;
    whatsapp_default_message?: string;
    github_url?: string;
    linkedin_url?: string;
    theme_settings?: Record<string, string>;

    [key: string]: unknown;
}

export interface FlashMessages {
    success?: string | null;
    error?: string | null;
}

/**
 * Props shared into every Inertia page by App\Http\Middleware\HandleInertiaRequests.
 * Extend this - never re-declare `auth`/`site`/`flash` ad hoc in a page prop type.
 */
export interface SharedPageProps {
    auth: {
        user: AuthUser | null;
        roles: RoleName[];
    };
    site: SiteSettings;
    flash: FlashMessages;
    ziggy: {
        location: string;
        [key: string]: unknown;
    };
    appVersion: string;
}

export interface Profile {
    id: number;
    full_name: string;
    headline: string;
    tagline: string | null;
    years_experience: number;
    bio: string | null;
    short_bio: string | null;
    philosophy: string | null;
    avatar_path: string | null;
    /** Computed on the model (Profile::avatarUrl()) - a ready-to-use public
     * URL, or null when no avatar has been uploaded yet. */
    avatar_url: string | null;
    resume_path: string | null;
    resume_original_name: string | null;
    /** Computed on the model (Profile::resumeUrl()) - a ready-to-use public
     * URL, or null when no resume has been uploaded yet. */
    resume_url: string | null;
    location: string | null;
    availability_status: string | null;
}

export type EmploymentType = 'full_time' | 'apprentice' | 'contract' | 'freelance' | 'internship';

export interface Experience {
    id: number;
    company_name: string;
    role_title: string;
    employment_type: EmploymentType;
    location: string | null;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
    technologies: { id: number; name: string }[];
}

export interface Education {
    id: number;
    institution: string;
    degree: string;
    field_of_study: string | null;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
    display_order: number;
}

export interface Service {
    id: number;
    title: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    display_order: number;
}

export interface Certification {
    id: number;
    title: string;
    issuing_organization: string;
    issue_date: string | null;
    expiry_date: string | null;
    credential_id: string | null;
    credential_url: string | null;
    image_path: string | null;
    /** Computed on the model (Certification::imageUrl()) - ready-to-use, or
     * null when no badge/logo image has been uploaded. */
    image_url: string | null;
    display_order: number;
}

export type ProjectClassification = 'real' | 'personal' | 'experiment';

export interface PublicProject {
    id: number;
    title: string;
    slug: string;
    short_description: string | null;
    thumbnail_path: string | null;
    /** Computed on the model (Project::thumbnailUrl()) - ready-to-use, or
     * null when no thumbnail has been uploaded yet. */
    thumbnail_url: string | null;
    classification: ProjectClassification;
    is_featured: boolean;
    github_url: string | null;
    live_url: string | null;
    technologies: { id: number; name: string }[];
}

export interface Resume {
    id: number;
    role_title: string;
    label: string | null;
    file_path: string;
    file_original_name: string | null;
    /** Computed on the model (Resume::fileUrl()) - ready-to-use public URL. */
    file_url: string | null;
    is_active: boolean;
    display_order: number;
}

export interface SocialLink {
    id: number;
    platform: string;
    label: string | null;
    url: string;
    icon: string | null;
    is_active: boolean;
    display_order: number;
}

export type TechnologyCategory = 'frontend' | 'backend' | 'database' | 'cloud_devops' | 'ai_llm' | 'tools';

export interface Technology {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    category: TechnologyCategory;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: number;
    skill_category_id: number;
    name: string;
    icon: string | null;
    proficiency: number | null;
    is_featured: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface SkillCategory {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    display_order: number;
    skills: Skill[];
    created_at: string;
    updated_at: string;
}

export interface ProjectCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    display_order: number;
    projects_count?: number;
    created_at: string;
    updated_at: string;
}

/**
 * The full Admin-facing project shape (every case-study field, unlike
 * `PublicProject`'s trimmed public subset) - used by the Admin CMS
 * Projects Index/Create/Edit pages.
 */
export interface AdminProject {
    id: number;
    project_category_id: number | null;
    title: string;
    slug: string;
    short_description: string;
    full_description: string | null;
    problem: string | null;
    solution: string | null;
    architecture: string | null;
    my_contribution: string | null;
    challenges: string | null;
    results: string | null;
    thumbnail_path: string | null;
    thumbnail_url: string | null;
    video_url: string | null;
    github_url: string | null;
    live_url: string | null;
    classification: ProjectClassification;
    is_featured: boolean;
    display_order: number;
    is_published: boolean;
    published_at: string | null;
    seo_title: string | null;
    seo_description: string | null;
    category: Pick<ProjectCategory, 'id' | 'name'> | null;
    technologies: { id: number; name: string }[];
    created_at: string;
    updated_at: string;
}

export interface SeoSetting {
    id: number;
    page_key: string;
    title: string | null;
    description: string | null;
    canonical_url: string | null;
    keywords: string | null;
    og_image_path: string | null;
    /** Computed on the model (SeoSetting::ogImageUrl()) - ready-to-use, or
     * null when no og:image has been uploaded for this page. */
    og_image_url: string | null;
}

/**
 * Every admin-configurable text/boolean key from SiteSettingSeeder, as
 * returned (already cast) by SiteSettingService::all() and rendered by the
 * Admin/Settings/Edit page. The three image-backed keys
 * (favicon/logo/profile_image_path) are deliberately excluded here - the
 * controller resolves those to ready-to-use URLs and passes them as
 * separate top-level props (faviconUrl/logoUrl/profileImageUrl) rather than
 * through this map, matching the file-upload-accessor pattern used
 * everywhere else.
 */
export interface AdminSiteSettings {
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

    [key: string]: unknown;
}

export interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

import type { route as routeFn } from 'ziggy-js';

/**
 * The `route()` helper is a real global at runtime: tightenco/ziggy's
 * `@routes` Blade directive embeds the route list and a `route` function
 * (built from the ziggy-js package) into every page. Typing it against
 * ziggy-js's own `route` export - rather than a hand-rolled signature -
 * keeps `route().current(...)`, param binding, etc. accurate.
 */
declare global {
    // eslint-disable-next-line no-var
    var route: typeof routeFn;
}
