<?php

namespace Database\Seeders;

use App\Models\Technology;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TechnologySeeder extends Seeder
{
    /**
     * Every technology here comes directly from the "Core technologies"
     * list in Ankit's resume/spec - nothing invented (spec: "Use actual
     * technologies from my resume").
     */
    public function run(): void
    {
        $technologies = [
            'frontend' => ['React.js', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript'],
            'backend' => ['Laravel', 'PHP', 'Node.js', 'Express.js', 'WebSockets'],
            'database' => ['MySQL', 'MongoDB', 'Oracle'],
            'cloud_devops' => ['AWS', 'EC2', 'SES', 'SNS', 'CI/CD', 'Linux', 'Nginx', 'Apache', 'SSL'],
            'ai_llm' => ['OpenAI API', 'LLM Integration'],
            'tools' => ['Git', 'GitHub', 'Postman'],
        ];

        $order = 0;

        foreach ($technologies as $category => $names) {
            foreach ($names as $name) {
                Technology::query()->updateOrCreate(
                    ['slug' => Str::slug($name)],
                    [
                        'name' => $name,
                        'category' => $category,
                        'display_order' => $order++,
                    ]
                );
            }
        }
    }
}
