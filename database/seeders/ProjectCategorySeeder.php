<?php

namespace Database\Seeders;

use App\Models\ProjectCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProjectCategorySeeder extends Seeder
{
    /**
     * Organisational taxonomy only (not resume content) so the 20+ project
     * gallery (spec #11-#13) has somewhere to file projects as they're
     * added from admin.
     */
    public function run(): void
    {
        $categories = [
            'Full-Stack Applications',
            'AI & LLM Projects',
            'Real-Time & WebSocket Apps',
            'Cloud & DevOps Tooling',
            'Experiments & Case Studies',
        ];

        foreach ($categories as $index => $name) {
            ProjectCategory::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'display_order' => $index]
            );
        }
    }
}
