<?php

namespace Database\Seeders;

use App\Models\Experience;
use Illuminate\Database\Seeder;

class ExperienceSeeder extends Seeder
{
    /**
     * Company names, titles, and dates come directly from the resume/spec.
     * Descriptions and technology tags are intentionally left blank/null
     * here rather than invented (spec #9: "Do not invent responsibilities.
     * Use resume information.") - fill them in from the admin CMS once the
     * detailed resume text/technology-per-role breakdown is available.
     */
    public function run(): void
    {
        $rows = [
            [
                'company_name' => 'Jamtech Technology Pvt. Ltd.',
                'role_title' => 'Senior Software Engineer',
                'employment_type' => 'full_time',
                'start_date' => '2022-06-01',
                'end_date' => null,
                'is_current' => true,
                'display_order' => 1,
            ],
            [
                'company_name' => 'Softpro India Computer Technologies',
                'role_title' => 'Apprentice',
                'employment_type' => 'apprentice',
                'start_date' => '2022-04-01',
                'end_date' => '2022-06-01',
                'is_current' => false,
                'display_order' => 2,
            ],
        ];

        foreach ($rows as $row) {
            Experience::query()->updateOrCreate(
                ['company_name' => $row['company_name'], 'role_title' => $row['role_title']],
                $row
            );
        }
    }
}
