<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SkillCategorySeeder extends Seeder
{
    /**
     * Mirrors the same resume-sourced technology list as TechnologySeeder,
     * but as Skill/SkillCategory rows for the public "skills constellation"
     * section (spec #10), which is a distinct table from `technologies`
     * (used to tag projects/experience, spec #11/#9).
     */
    public function run(): void
    {
        $categories = [
            'Frontend' => ['React.js', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Inertia.js'],
            'Backend' => ['Laravel', 'PHP', 'Node.js', 'Express.js', 'WebSockets', 'Redis', 'Laravel Reverb'],
            'Database' => ['MySQL', 'MongoDB', 'Oracle'],
            'Cloud & DevOps' => ['AWS', 'EC2', 'SES', 'SNS', 'CI/CD', 'Linux', 'Nginx', 'Apache', 'SSL'],
            'AI & LLM' => ['OpenAI API', 'LLM Integration'],
            // This portfolio's own frontend stack - genuinely in active use
            // here (not aspirational), so it earns its own category rather
            // than being buried in "Frontend".
            '3D & Animation' => ['Three.js', 'React Three Fiber', 'GSAP', 'Motion', 'Lenis'],
            'Tools' => ['Git', 'GitHub', 'Postman'],
        ];

        $categoryOrder = 0;

        foreach ($categories as $categoryName => $skillNames) {
            $category = SkillCategory::query()->updateOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => $categoryName, 'display_order' => $categoryOrder++]
            );

            $skillOrder = 0;

            foreach ($skillNames as $skillName) {
                Skill::query()->updateOrCreate(
                    ['skill_category_id' => $category->id, 'name' => $skillName],
                    ['display_order' => $skillOrder++]
                );
            }
        }
    }
}
