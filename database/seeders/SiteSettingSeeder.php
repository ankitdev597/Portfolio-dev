<?php

namespace Database\Seeders;

use App\Services\SiteSettingService;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Defaults for every admin-configurable setting (spec #31). Nothing
     * here is hard-coded into the frontend afterwards - it all flows
     * through App\Services\SiteSettingService and is editable from
     * /admin/settings once that screen is built in the CMS phase.
     */
    public function run(): void
    {
        $service = app(SiteSettingService::class);

        $defaults = [
            // key => [value, type, group, is_public]
            'site_name' => ['Ankit Vishwakarma', 'string', 'general', true],
            'site_title' => ['Ankit Vishwakarma | Senior Software Engineer', 'string', 'seo', true],
            'headline' => ['Senior Software Engineer | Full Stack Developer | AI | DevOps', 'string', 'general', true],
            'email' => ['av841344@gmail.com', 'string', 'contact', true],
            'phone' => ['+91 81126 56226', 'string', 'contact', false],
            'location' => ['', 'string', 'contact', true],

            // WhatsApp is never hard-coded in the frontend (spec #18) - the
            // button reads these two keys and builds the wa.me link itself.
            // Stored WITH the country code (91) since wa.me deep links
            // require the full international number with no leading zero
            // or "+" - a bare 10-digit number produces an invalid link.
            'whatsapp_number' => ['918112656226', 'string', 'contact', false],
            'whatsapp_default_message' => [
                'Hi Ankit, I found your portfolio and would like to discuss a project.',
                'text', 'contact', true,
            ],

            'github_url' => ['https://github.com/ankitdev597', 'string', 'social', true],
            'linkedin_url' => ['https://www.linkedin.com/in/ankit-vishwakarma-15b6b1233', 'string', 'social', true],

            'resume_path' => ['', 'string', 'general', false],
            'favicon_path' => ['', 'string', 'theme', true],
            'logo_path' => ['', 'string', 'theme', true],
            'profile_image_path' => ['', 'string', 'theme', true],

            'meta_title' => ['Ankit Vishwakarma | Senior Software Engineer & Full Stack Developer', 'string', 'seo', true],
            'meta_description' => [
                'Senior Software Engineer specializing in full-stack development, AI/LLM integration, real-time applications, and cloud/DevOps.',
                'text', 'seo', true,
            ],
            'google_analytics_id' => ['', 'string', 'integrations', false],
            'maintenance_mode' => ['0', 'boolean', 'general', false],

            // Kept in sync with resources/css/app.css's :root tokens (the
            // actual source of truth for the live site's colors today) so
            // this doesn't drift into stale values before a "theme editor"
            // admin screen ever reads it.
            'theme_settings' => [json_encode([
                'background' => '#0a0912',
                'surface' => '#151228',
                'surface_elevated' => '#1e1a38',
                'primary' => '#8b5cf6',
                'secondary' => '#3b82f6',
                'accent' => '#22d3ee',
                'text' => '#f8f7fc',
                'muted' => '#a3a1c2',
            ]), 'json', 'theme', true],
        ];

        foreach ($defaults as $key => [$value, $type, $group, $isPublic]) {
            $service->set($key, $value, $type, $group, $isPublic);
        }
    }
}
