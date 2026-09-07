<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SiteSettingRequest;
use App\Models\SiteSetting;
use App\Services\SiteSettingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Single grouped edit screen over the site_settings key-value store (see
 * SiteSettingSeeder for the canonical key list this mirrors) plus the three
 * image-backed keys (favicon/logo/profile_image), which route through
 * SiteSettingService's file-lifecycle helpers instead of plain set().
 * Super-Admin-only per SiteSettingPolicy (already bound in
 * AppServiceProvider - system-critical config, not Editor-manageable
 * content).
 */
class SiteSettingController extends Controller
{
    /**
     * key => [type, group] - identical to SiteSettingSeeder's defaults, so
     * saving here never silently drifts a setting into the wrong group or
     * casts it back to the wrong type.
     *
     * @var array<string, array{0: string, 1: string}>
     */
    private const TEXT_FIELDS = [
        'site_name' => ['string', 'general'],
        'site_title' => ['string', 'seo'],
        'headline' => ['string', 'general'],
        'email' => ['string', 'contact'],
        'phone' => ['string', 'contact'],
        'location' => ['string', 'contact'],
        'whatsapp_number' => ['string', 'contact'],
        'whatsapp_default_message' => ['text', 'contact'],
        'github_url' => ['string', 'social'],
        'linkedin_url' => ['string', 'social'],
        'meta_title' => ['string', 'seo'],
        'meta_description' => ['text', 'seo'],
        'google_analytics_id' => ['string', 'integrations'],
    ];

    public function __construct(private readonly SiteSettingService $settings) {}

    public function edit(): Response
    {
        $this->authorize('viewAny', SiteSetting::class);

        return Inertia::render('Admin/Settings/Edit', [
            'settings' => $this->settings->all(),
            'faviconUrl' => $this->settings->imageUrl('favicon_path'),
            'logoUrl' => $this->settings->imageUrl('logo_path'),
            'profileImageUrl' => $this->settings->imageUrl('profile_image_path'),
        ]);
    }

    public function update(SiteSettingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        foreach (self::TEXT_FIELDS as $key => [$type, $group]) {
            $this->settings->set($key, $validated[$key] ?? '', $type, $group, true);
        }

        $this->settings->set(
            'maintenance_mode',
            (bool) ($validated['maintenance_mode'] ?? false),
            'boolean',
            'general',
            false,
        );

        $this->syncImage($request, 'favicon', 'remove_favicon', 'favicon_path', 'theme');
        $this->syncImage($request, 'logo', 'remove_logo', 'logo_path', 'theme');
        $this->syncImage($request, 'profile_image', 'remove_profile_image', 'profile_image_path', 'theme');

        return back()->with('success', 'Settings updated.');
    }

    private function syncImage(SiteSettingRequest $request, string $fileField, string $removeField, string $settingKey, string $group): void
    {
        $file = $request->file($fileField);

        if ($file) {
            $this->settings->setImage($settingKey, $file, $group);

            return;
        }

        if ($request->boolean($removeField)) {
            $this->settings->removeImage($settingKey, $group);
        }
    }
}
