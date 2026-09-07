<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Technology;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DummyProjectSeeder extends Seeder
{
    /**
     * PLACEHOLDER seed data only - unlike ProjectSeeder (the one real,
     * resume-sourced project, deliberately left unpublished until Ankit
     * confirms case-study detail), these are generic, clearly-labelled
     * placeholders published purely so the public "Projects" grid has
     * something to render instead of the empty state while the real
     * project catalogue is built out in the admin CMS.
     *
     * Every field here is safe to edit/replace from Admin -> Projects at
     * any time - nothing here claims a specific real outcome, client, or
     * metric (spec: never fabricate project claims), and the short
     * description says outright that it's a placeholder.
     */
    public function run(): void
    {
        $categorySlugs = [
            'fullstack' => 'full-stack-applications',
            'ai' => 'ai-llm-projects',
            'realtime' => 'real-time-websocket-apps',
            'cloud' => 'cloud-devops-tooling',
        ];

        $categories = ProjectCategory::query()
            ->whereIn('slug', array_values($categorySlugs))
            ->get()
            ->keyBy('slug');

        $placeholders = [
            [
                'title' => 'E-Commerce Platform',
                'category' => $categorySlugs['fullstack'],
                'short_description' => 'Placeholder project - replace with a real case study from the admin CMS. A full-stack storefront with catalog, cart, and checkout.',
                'classification' => 'personal',
                'is_featured' => true,
                'technologies' => ['Laravel', 'MySQL', 'React.js', 'TypeScript'],
            ],
            [
                'title' => 'Real-Time Chat & Notifications',
                'category' => $categorySlugs['realtime'],
                'short_description' => 'Placeholder project - replace with a real case study from the admin CMS. Live messaging and notifications over WebSockets.',
                'classification' => 'experiment',
                'is_featured' => false,
                'technologies' => ['WebSockets', 'Laravel', 'Node.js'],
            ],
            [
                'title' => 'AI Content Assistant',
                'category' => $categorySlugs['ai'],
                'short_description' => 'Placeholder project - replace with a real case study from the admin CMS. An LLM-backed writing/summarization assistant.',
                'classification' => 'experiment',
                'is_featured' => true,
                'technologies' => ['OpenAI API', 'LLM Integration', 'Laravel'],
            ],
            [
                'title' => 'Cloud Deployment Pipeline',
                'category' => $categorySlugs['cloud'],
                'short_description' => 'Placeholder project - replace with a real case study from the admin CMS. Automated build, test, and deploy pipeline on AWS.',
                'classification' => 'personal',
                'is_featured' => false,
                'technologies' => ['AWS', 'EC2', 'CI/CD', 'Linux'],
            ],
            [
                'title' => 'Task Management Dashboard',
                'category' => $categorySlugs['fullstack'],
                'short_description' => 'Placeholder project - replace with a real case study from the admin CMS. A team dashboard for tracking tasks and progress.',
                'classification' => 'personal',
                'is_featured' => false,
                'technologies' => ['Vue.js', 'Laravel', 'MySQL'],
            ],
        ];

        foreach ($placeholders as $order => $placeholder) {
            $project = Project::query()->updateOrCreate(
                ['slug' => Str::slug($placeholder['title'])],
                [
                    'project_category_id' => $categories->get($placeholder['category'])?->id,
                    'title' => $placeholder['title'],
                    'short_description' => $placeholder['short_description'],
                    'full_description' => $placeholder['short_description'],
                    'classification' => $placeholder['classification'],
                    'is_featured' => $placeholder['is_featured'],
                    'is_published' => true,
                    // scopePublished() requires BOTH is_published=true AND a
                    // non-null published_at - without this these would
                    // silently never appear on the public site.
                    'published_at' => Carbon::now()->subDays($order),
                    'display_order' => $order,
                ]
            );

            $technologyIds = Technology::query()->whereIn('name', $placeholder['technologies'])->pluck('id');

            $project->technologies()->syncWithoutDetaching($technologyIds);
        }
    }
}
