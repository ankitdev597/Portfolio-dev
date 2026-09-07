<?php

namespace Database\Seeders;

use App\Models\SocialLink;
use Illuminate\Database\Seeder;

class SocialLinkSeeder extends Seeder
{
    public function run(): void
    {
        $links = [
            ['platform' => 'github', 'label' => 'GitHub', 'url' => 'https://github.com/ankitdev597', 'icon' => 'github', 'display_order' => 1],
            ['platform' => 'linkedin', 'label' => 'LinkedIn', 'url' => 'https://www.linkedin.com/in/ankit-vishwakarma-15b6b1233', 'icon' => 'linkedin', 'display_order' => 2],
        ];

        foreach ($links as $link) {
            SocialLink::query()->updateOrCreate(
                ['platform' => $link['platform']],
                [...$link, 'is_active' => true]
            );
        }
    }
}
