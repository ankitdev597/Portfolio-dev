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
            // Laravel Reverb and Spatie Laravel-Permission are project-catalogue
            // additions (spec: real project stack), same "from what's actually
            // used" rule as the resume-sourced entries above.
            'backend' => ['Laravel', 'PHP', 'Node.js', 'Express.js', 'WebSockets', 'Laravel Reverb', 'Spatie Laravel-Permission'],
            'database' => ['MySQL', 'MongoDB', 'Oracle', 'Redis'],
            'cloud_devops' => ['AWS', 'EC2', 'SES', 'SNS', 'CI/CD', 'Linux', 'Nginx', 'Apache', 'SSL', 'Firebase', 'Google Cloud'],
            'ai_llm' => ['OpenAI API', 'LLM Integration', 'Ollama'],
            // Third-party APIs/SDKs (calling, messaging, payments, financial
            // data) - grouped here alongside Git/GitHub/Postman since none of
            // the other categories fit an integration vendor cleanly.
            'tools' => ['Git', 'GitHub', 'Postman', 'Agora', 'Twilio', 'Stripe', 'PayPal', 'CinetPay', 'PawaPay', 'Plaid'],
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
