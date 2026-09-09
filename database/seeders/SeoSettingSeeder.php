<?php

namespace Database\Seeders;

use App\Models\SeoSetting;
use Illuminate\Database\Seeder;

/**
 * Seeds a default 'home' SeoSetting row so the public homepage always has
 * meta title/description/keywords to render, without requiring the admin
 * to configure SEO before the site is presentable. og_image_path is
 * deliberately left null here - the admin uploads it from
 * Admin -> SEO Settings, same "seed the text, editor uploads the image"
 * pattern used by RealProjectSeeder for project thumbnails.
 */
class SeoSettingSeeder extends Seeder
{
    public function run(): void
    {
        SeoSetting::query()->updateOrCreate(
            ['page_key' => 'home'],
            [
                'title' => 'Ankit Vishwakarma - Full Stack Developer',
                'description' => 'Full stack developer specializing in Laravel, React, and modern web platforms - e-commerce, CRM, real-time video/audio, and AI-integrated applications built for real clients.',
                'canonical_url' => null,
                'keywords' => 'full stack developer, laravel developer, react developer, web application developer, portfolio',
            ]
        );
    }
}
