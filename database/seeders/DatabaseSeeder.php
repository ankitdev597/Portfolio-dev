<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Order matters: roles before the admin user, taxonomies/technologies
     * before anything that references them (skills, experience, projects).
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            AdminUserSeeder::class,
            SiteSettingSeeder::class,
            SocialLinkSeeder::class,
            TechnologySeeder::class,
            SkillCategorySeeder::class,
            ProjectCategorySeeder::class,
            ServiceSeeder::class,
            ExperienceSeeder::class,
            ProjectSeeder::class,
            RealProjectSeeder::class,
            SeoSettingSeeder::class,
        ]);
    }
}
