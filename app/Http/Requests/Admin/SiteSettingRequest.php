<?php

namespace App\Http\Requests\Admin;

use App\Models\SiteSetting;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Every admin-configurable key from SiteSettingSeeder gets an explicit rule
 * here (deliberately not a generic "everything is nullable string" catch-
 * all) so a typo'd key name fails validation instead of silently never
 * being read anywhere.
 */
class SiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', SiteSetting::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'site_name' => ['required', 'string', 'max:255'],
            'site_title' => ['nullable', 'string', 'max:255'],
            'headline' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'whatsapp_number' => ['nullable', 'string', 'max:20'],
            'whatsapp_default_message' => ['nullable', 'string', 'max:1000'],
            'github_url' => ['nullable', 'url', 'max:2048'],
            'linkedin_url' => ['nullable', 'url', 'max:2048'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'google_analytics_id' => ['nullable', 'string', 'max:50'],
            'maintenance_mode' => ['nullable', 'boolean'],
            // 2MB max images, stored via SiteSettingService::setImage(),
            // never touched directly here.
            'favicon' => ['nullable', 'image', 'max:2048'],
            'remove_favicon' => ['nullable', 'boolean'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'remove_logo' => ['nullable', 'boolean'],
            'profile_image' => ['nullable', 'image', 'max:2048'],
            'remove_profile_image' => ['nullable', 'boolean'],
        ];
    }
}
